import axios from 'axios';
import * as cheerio from 'cheerio';
import { TRPCError } from '@trpc/server';

export interface WebsiteAnalysis {
  url: string;
  title: string;
  metaDescription: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imageCount: number;
  internalLinkCount: number;
  externalLinkCount: number;
  hasSSL: boolean;
  hasStructuredData: boolean;
  hasOpenGraph: boolean;
  responseTime: number;
  contentLength: number;
}

export interface AeoScoreBreakdown {
  contentQuality: number; // 0-100
  technicalSeo: number; // 0-100
  authority: number; // 0-100
  chatVisibility: number; // 0-100
  overall: number; // 0-10 (weighted)
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const startTime = Date.now();

  try {
    new URL(normalizedUrl);
    const response = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'AheadOfTrends-AEO-Scanner/1.0',
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });
    const responseTime = Date.now() - startTime;
    const $ = cheerio.load(response.data);
    const html = $('html').html() || '';

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    const imageCount = $('img').length;
    const internalLinkCount = $(`a[href^="${normalizedUrl}"]`).length;
    const externalLinkCount = $(`a[href^="http"]:not([href^="${normalizedUrl}"])`).length;
    const hasSSL = normalizedUrl.startsWith('https://');
    const hasStructuredData = html.includes('schema.org') || html.includes('application/ld+json');
    const hasOpenGraph = html.includes('og:title') || html.includes('og:description');
    const contentLength = $('body').text().length;

    return {
      url: normalizedUrl,
      title,
      metaDescription,
      h1Count,
      h2Count,
      h3Count,
      imageCount,
      internalLinkCount,
      externalLinkCount,
      hasSSL,
      hasStructuredData,
      hasOpenGraph,
      responseTime,
      contentLength,
    };
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}

export function calculateAeoScore(analysis: WebsiteAnalysis): AeoScoreBreakdown {
  let contentQuality = 0;
  contentQuality += analysis.title ? Math.min(20, analysis.title.length / 3) : 0;
  contentQuality += analysis.metaDescription ? Math.min(20, analysis.metaDescription.length / 10) : 0;
  contentQuality += Math.min(30, analysis.contentLength / 100);
  contentQuality += analysis.h1Count >= 1 ? 10 : 0;
  contentQuality += analysis.h2Count >= 3 ? 10 : 0;
  contentQuality += analysis.imageCount >= 3 ? 10 : 0;
  contentQuality = Math.min(100, contentQuality);

  let technicalSeo = 0;
  technicalSeo += analysis.hasSSL ? 25 : 0;
  technicalSeo += analysis.metaDescription ? 15 : 0;
  technicalSeo += analysis.hasStructuredData ? 25 : 0;
  technicalSeo += analysis.internalLinkCount >= 5 ? 20 : 0;
  technicalSeo += analysis.responseTime < 2000 ? 15 : 0;
  technicalSeo = Math.min(100, technicalSeo);

  let authority = 0;
  authority += Math.min(30, analysis.contentLength / 50);
  authority += analysis.externalLinkCount >= 3 ? 20 : 0;
  authority += analysis.hasStructuredData ? 20 : 0;
  authority += analysis.hasSSL ? 15 : 0;
  authority += analysis.title && analysis.metaDescription ? 15 : 0;
  authority = Math.min(100, authority);

  let chatVisibility = 0;
  chatVisibility += Math.min(25, analysis.contentLength / 80);
  chatVisibility += analysis.hasStructuredData ? 25 : 0;
  chatVisibility += analysis.hasOpenGraph ? 20 : 0;
  chatVisibility += analysis.h1Count >= 1 && analysis.h2Count >= 3 ? 20 : 0;
  chatVisibility += analysis.internalLinkCount >= 5 ? 10 : 0;
  chatVisibility = Math.min(100, chatVisibility);

  const overall = (
    contentQuality * 0.30 +
    technicalSeo * 0.25 +
    authority * 0.25 +
    chatVisibility * 0.20
  ) / 10;

  return {
    contentQuality: Math.round(contentQuality),
    technicalSeo: Math.round(technicalSeo),
    authority: Math.round(authority),
    chatVisibility: Math.round(chatVisibility),
    overall: Math.round(overall * 10) / 10,
  };
}

export function generateRecommendations(analysis: WebsiteAnalysis, scores: AeoScoreBreakdown): string[] {
  const recommendations: string[] = [];
  if (!analysis.hasSSL) recommendations.push('🔒 Install SSL certificate (HTTPS required for AI trust signals)');
  if (!analysis.hasStructuredData) recommendations.push('📊 Implement JSON-LD Schema.org markup for AI entity recognition');
  if (!analysis.hasOpenGraph) recommendations.push('🔗 Add Open Graph tags for Chat Engine preview optimization');
  if (analysis.h1Count === 0) recommendations.push('📝 Add exactly one H1 heading for content hierarchy');
  if (analysis.h2Count < 3) recommendations.push('📑 Expand content structure with H2/H3 subheadings');
  if (analysis.contentLength < 850) recommendations.push('✍️ Increase content depth to 850+ words for AI reasoning engines');
  if (scores.contentQuality < 60) recommendations.push('🎯 Optimize title tags and meta descriptions for EEAT signals');
  if (scores.authority < 60) recommendations.push('🔗 Build high-authority backlinks from .edu/.gov domains');
  if (scores.chatVisibility < 60) recommendations.push('🤖 Structure content as Q&A for ChatGPT/Perplexity citation');
  if (analysis.responseTime > 2000) recommendations.push('⚡ Improve page load speed (target <2s for AI crawl budget)');
  return recommendations.length > 0 ? recommendations : ['✅ Your site shows strong Agentic Dominance signals'];
}

export function getStatusLabel(score: number): string {
  if (score < 3) return 'Invisible to AI Engines';
  if (score < 6) return 'Moderate Presence';
  if (score < 8) return 'Strong Presence';
  return 'Agentic Dominance';
}
