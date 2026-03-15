import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_URL = 'http://api.scraperapi.com';

async function fetchWithScraperAPI(url: string) {
  const response = await axios.get(SCRAPER_API_URL, {
    params: { api_key: SCRAPER_API_KEY, url, render: 'false' },
    timeout: 15000,
  });
  return response.data;
}

function extractSchemas($: cheerio.CheerioAPI): any[] {
  const schemas: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) schemas.push(JSON.parse(content));
    } catch (e) {}
  });
  return schemas;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const startTime = Date.now();

  try {
    new URL(normalizedUrl);
    const html = await fetchWithScraperAPI(normalizedUrl);
    const responseTime = Date.now() - startTime;
    const $ = cheerio.load(html);

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').filter((w: string) => w.length > 0).length;
    const imageCount = $('img').length;
    const imagesWithAlt = $('img[alt]').filter((_, el) => ($(el).attr('alt')?.trim() || '') !== '').length;

    const origin = new URL(normalizedUrl).origin;
    const hostname = new URL(normalizedUrl).hostname;
    const internalLinkCount = $(`a[href^="/"], a[href^="${origin}"]`).length;
    const externalLinkCount = $('a[href^="http"]').not(`[href*="${hostname}"]`).length;

    const hasSSL = normalizedUrl.startsWith('https://');
    const hasCanonical = !!$('link[rel="canonical"]').attr('href');
    const hasViewport = !!$('meta[name="viewport"]').attr('content');
    const robots = $('meta[name="robots"]').attr('content') || '';
    const isNoIndex = robots.includes('noindex');

    const schemas = extractSchemas($);
    const schemaTypesSet = new Set<string>();
    schemas.forEach((s: any) => { if (s['@type']) schemaTypesSet.add(String(s['@type'])); });
    const schemaTypes = Array.from(schemaTypesSet);
    const schemaStr = JSON.stringify(schemas);
    const hasFAQSchema = schemaStr.includes('FAQPage');
    const hasHowToSchema = schemaStr.includes('HowTo');
    const hasOpenGraph = !!$('meta[property="og:title"]').attr('content');

    let hasSnippetParagraph = false;
    $('p').each((_, el) => {
      const words = $(el).text().trim().split(/\s+/).length;
      if (words >= 40 && words <= 60) hasSnippetParagraph = true;
    });

    const questionHeadingCount = $('h2, h3').filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return text.startsWith('what') || text.startsWith('how') || text.startsWith('why') || text.includes('?');
    }).length;

    const analysis = {
      url: normalizedUrl, title, metaDescription, h1Count, h2Count, h3Count,
      wordCount, imageCount, imagesWithAlt, internalLinkCount, externalLinkCount,
      hasSSL, hasCanonical, hasViewport, isNoIndex, schemas, schemaTypes,
      hasFAQSchema, hasHowToSchema, hasOpenGraph, hasSnippetParagraph,
      questionHeadingCount, responseTime, contentLength: bodyText.length,
    };

    // Score calculation
    let contentQuality = 0;
    if (wordCount >= 1500) contentQuality += 30;
    else if (wordCount >= 800) contentQuality += 24;
    else if (wordCount >= 500) contentQuality += 18;
    else if (wordCount >= 200) contentQuality += 12;
    else contentQuality += 6;
    if (h1Count === 1) contentQuality += 20;
    else if (h1Count > 1) contentQuality += 10;
    if (h1Count > 0 && h2Count > 0) contentQuality += 20;
    else if (h2Count > 0) contentQuality += 10;
    const altRatio = imageCount > 0 ? imagesWithAlt / imageCount : 1;
    contentQuality += Math.floor(altRatio * 15);
    if (internalLinkCount >= 5) contentQuality += 15;
    else if (internalLinkCount >= 3) contentQuality += 10;
    else if (internalLinkCount >= 1) contentQuality += 5;
    contentQuality = Math.min(100, contentQuality);

    let technicalSeo = 0;
    if (title && title.length >= 30 && title.length <= 60) technicalSeo += 25;
    else if (title && title.length > 0) technicalSeo += 12;
    if (metaDescription.length >= 120 && metaDescription.length <= 160) technicalSeo += 25;
    else if (metaDescription.length > 0) technicalSeo += 12;
    if (hasSSL) technicalSeo += 15;
    if (hasCanonical) technicalSeo += 15;
    if (hasViewport) technicalSeo += 10;
    if (!isNoIndex) technicalSeo += 10;
    technicalSeo = Math.min(100, technicalSeo);

    let authority = 0;
    if (schemas.length > 0) authority += 40;
    authority += Math.min(schemaTypes.length * 10, 30);
    if (externalLinkCount >= 5) authority += 30;
    else if (externalLinkCount >= 2) authority += 20;
    else if (externalLinkCount >= 1) authority += 10;
    authority = Math.min(100, authority);

    let chatVisibility = 0;
    if (hasFAQSchema) chatVisibility += 30;
    if (hasHowToSchema) chatVisibility += 20;
    if (hasSnippetParagraph) chatVisibility += 25;
    if (questionHeadingCount > 0) chatVisibility += 25;
    chatVisibility = Math.min(100, chatVisibility);

    const overall = (contentQuality * 0.40 + technicalSeo * 0.25 + authority * 0.20 + chatVisibility * 0.15) / 10;

    const scores = {
      contentQuality: Math.round(contentQuality),
      technicalSeo: Math.round(technicalSeo),
      authority: Math.round(authority),
      chatVisibility: Math.round(chatVisibility),
      overall: Math.round(overall * 10) / 10,
    };

    // Recommendations
    const findings: string[] = [];
    if (wordCount < 200) findings.push(`Low word count (${wordCount} words). Target 800+ words.`);
    else if (wordCount < 500) findings.push(`Moderate word count (${wordCount} words). Expand to 800+.`);
    if (h1Count === 0) findings.push('Missing H1 tag. Every page needs exactly one H1.');
    else if (h1Count > 1) findings.push(`Multiple H1 tags (${h1Count}). Use only one H1 per page.`);
    if (h1Count > 0 && h2Count === 0) findings.push('No H2 subheadings. Use H2s for scannable sections.');
    if (altRatio < 0.8 && imageCount > 0) findings.push(`Only ${Math.round(altRatio * 100)}% of images have alt text.`);
    if (internalLinkCount < 3) findings.push(`Only ${internalLinkCount} internal links. Add 3+ for site context.`);
    if (!title) findings.push('Missing page title tag.');
    else if (title.length < 30 || title.length > 60) findings.push(`Title is ${title.length} chars (optimal: 30-60).`);
    if (!metaDescription) findings.push('Missing meta description. Add 120-160 chars.');
    if (!hasSSL) findings.push('Not using HTTPS. SSL required for AI trust.');
    if (!hasCanonical) findings.push('Missing canonical link tag.');
    if (!hasViewport) findings.push('Missing viewport meta tag.');
    if (isNoIndex) findings.push('Page has noindex. AI engines will skip it.');
    if (schemas.length === 0) findings.push('No JSON-LD schema. Add Organization/Article/FAQ schema.');
    if (externalLinkCount < 2) findings.push(`Only ${externalLinkCount} outbound links. Cite authoritative sources.`);
    if (!hasFAQSchema) findings.push('No FAQPage schema. FAQ data increases AI citation rates.');
    if (!hasHowToSchema) findings.push('No HowTo schema. Step-by-step data helps AI extraction.');
    if (!hasSnippetParagraph) findings.push('No answer paragraphs (40-60 words). AI prefers self-contained blocks.');
    if (questionHeadingCount === 0) findings.push('No question headings (What/How/Why). Structure as Q&A.');

    let statusLabel = 'Invisible to AI Engines';
    if (scores.overall >= 8.5) statusLabel = 'Agentic Dominance';
    else if (scores.overall >= 7) statusLabel = 'Strong Presence';
    else if (scores.overall >= 5) statusLabel = 'Moderate Presence';
    else if (scores.overall >= 3) statusLabel = 'Low Visibility';

    return res.status(200).json({
      analysis, scores, recommendations: findings, statusLabel,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to analyze. The site may block crawlers.',
      details: error?.message || 'Unknown error',
    });
  }
}
