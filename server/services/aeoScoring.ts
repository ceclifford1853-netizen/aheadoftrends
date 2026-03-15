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
  wordCount: number;
  imageCount: number;
  imagesWithAlt: number;
  internalLinkCount: number;
  externalLinkCount: number;
  hasSSL: boolean;
  hasCanonical: boolean;
  hasViewport: boolean;
  isNoIndex: boolean;
  schemas: any[];
  schemaTypes: string[];
  hasFAQSchema: boolean;
  hasHowToSchema: boolean;
  hasOpenGraph: boolean;
  hasSnippetParagraph: boolean;
  questionHeadingCount: number;
  responseTime: number;
  contentLength: number;
}

export interface AeoScoreBreakdown {
  contentQuality: number;
  technicalSeo: number;
  authority: number;
  chatVisibility: number;
  overall: number;
}

// Extract JSON-LD structured data
function extractSchemas($: cheerio.CheerioAPI): any[] {
  const schemas: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) schemas.push(JSON.parse(content));
    } catch (e) {
      // Ignore malformed JSON-LD
    }
  });
  return schemas;
}

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const startTime = Date.now();

  try {
    new URL(normalizedUrl);
    const response = await axios.get(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    const responseTime = Date.now() - startTime;
    const $ = cheerio.load(response.data);

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(' ').filter(w => w.length > 0).length;
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
    schemas.forEach(s => { if (s['@type']) schemaTypesSet.add(String(s['@type'])); });
    const schemaTypes = Array.from(schemaTypesSet);
    const schemaStr = JSON.stringify(schemas);
    const hasFAQSchema = schemaStr.includes('FAQPage');
    const hasHowToSchema = schemaStr.includes('HowTo');

    const hasOpenGraph = !!$('meta[property="og:title"]').attr('content');

    // Check for concise "answer paragraphs" (40-60 words — sweet spot for LLM snippets)
    let hasSnippetParagraph = false;
    $('p').each((_, el) => {
      const words = $(el).text().trim().split(/\s+/).length;
      if (words >= 40 && words <= 60) hasSnippetParagraph = true;
    });

    // Check for question-format headings
    const questionHeadingCount = $('h2, h3').filter((_, el) => {
      const text = $(el).text().toLowerCase();
      return text.startsWith('what') || text.startsWith('how') || text.startsWith('why') || text.includes('?');
    }).length;

    const contentLength = bodyText.length;

    return {
      url: normalizedUrl,
      title,
      metaDescription,
      h1Count,
      h2Count,
      h3Count,
      wordCount,
      imageCount,
      imagesWithAlt,
      internalLinkCount,
      externalLinkCount,
      hasSSL,
      hasCanonical,
      hasViewport,
      isNoIndex,
      schemas,
      schemaTypes,
      hasFAQSchema,
      hasHowToSchema,
      hasOpenGraph,
      hasSnippetParagraph,
      questionHeadingCount,
      responseTime,
      contentLength,
    };
  } catch (error: any) {
    if (error?.response?.status === 403) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Access denied by target website (403). The site blocks automated crawlers.',
      });
    }
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Failed to reach the URL. Please verify the site is live and accessible. ${error instanceof Error ? error.message : ''}`,
    });
  }
}

export function calculateAeoScore(analysis: WebsiteAnalysis): AeoScoreBreakdown {
  // ═══════════════════════════════════════════════
  // CONTENT QUALITY (max 100) — Weight: 40%
  // ═══════════════════════════════════════════════
  let contentQuality = 0;

  // Word count (30 pts)
  if (analysis.wordCount >= 1500) contentQuality += 30;
  else if (analysis.wordCount >= 800) contentQuality += 24;
  else if (analysis.wordCount >= 500) contentQuality += 18;
  else if (analysis.wordCount >= 200) contentQuality += 12;
  else contentQuality += 6;

  // H1 present (20 pts)
  if (analysis.h1Count === 1) contentQuality += 20;
  else if (analysis.h1Count > 1) contentQuality += 10; // Partial credit

  // Heading hierarchy (20 pts)
  if (analysis.h1Count > 0 && analysis.h2Count > 0) contentQuality += 20;
  else if (analysis.h2Count > 0) contentQuality += 10;

  // Image alt coverage (15 pts)
  const altRatio = analysis.imageCount > 0 ? analysis.imagesWithAlt / analysis.imageCount : 1;
  contentQuality += Math.floor(altRatio * 15);

  // Internal links (15 pts)
  if (analysis.internalLinkCount >= 5) contentQuality += 15;
  else if (analysis.internalLinkCount >= 3) contentQuality += 10;
  else if (analysis.internalLinkCount >= 1) contentQuality += 5;

  contentQuality = Math.min(100, contentQuality);

  // ═══════════════════════════════════════════════
  // TECHNICAL SEO (max 100) — Weight: 25%
  // ═══════════════════════════════════════════════
  let technicalSeo = 0;

  // Meta title (25 pts)
  if (analysis.title && analysis.title.length >= 30 && analysis.title.length <= 60) technicalSeo += 25;
  else if (analysis.title && analysis.title.length > 0) technicalSeo += 12;

  // Meta description (25 pts)
  if (analysis.metaDescription.length >= 120 && analysis.metaDescription.length <= 160) technicalSeo += 25;
  else if (analysis.metaDescription.length > 0) technicalSeo += 12;

  // HTTPS (15 pts)
  if (analysis.hasSSL) technicalSeo += 15;

  // Canonical (15 pts)
  if (analysis.hasCanonical) technicalSeo += 15;

  // Viewport (10 pts)
  if (analysis.hasViewport) technicalSeo += 10;

  // Not noindex (10 pts)
  if (!analysis.isNoIndex) technicalSeo += 10;

  technicalSeo = Math.min(100, technicalSeo);

  // ═══════════════════════════════════════════════
  // AUTHORITY (max 100) — Weight: 20%
  // ═══════════════════════════════════════════════
  let authority = 0;

  // JSON-LD present (40 pts)
  if (analysis.schemas.length > 0) authority += 40;

  // Schema type richness (30 pts)
  authority += Math.min(analysis.schemaTypes.length * 10, 30);

  // External links / citations (30 pts)
  if (analysis.externalLinkCount >= 5) authority += 30;
  else if (analysis.externalLinkCount >= 2) authority += 20;
  else if (analysis.externalLinkCount >= 1) authority += 10;

  authority = Math.min(100, authority);

  // ═══════════════════════════════════════════════
  // AI/CHAT VISIBILITY (max 100) — Weight: 15%
  // ═══════════════════════════════════════════════
  let chatVisibility = 0;

  // FAQ schema (30 pts)
  if (analysis.hasFAQSchema) chatVisibility += 30;

  // HowTo schema (20 pts)
  if (analysis.hasHowToSchema) chatVisibility += 20;

  // Concise answer paragraphs (25 pts)
  if (analysis.hasSnippetParagraph) chatVisibility += 25;

  // Question-format headings (25 pts)
  if (analysis.questionHeadingCount > 0) chatVisibility += 25;

  chatVisibility = Math.min(100, chatVisibility);

  // ═══════════════════════════════════════════════
  // FINAL WEIGHTED SCORE (0-10 scale)
  // ═══════════════════════════════════════════════
  const overall = (
    contentQuality * 0.40 +
    technicalSeo * 0.25 +
    authority * 0.20 +
    chatVisibility * 0.15
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
  const findings: string[] = [];

  // Content Quality findings
  if (analysis.wordCount < 200) {
    findings.push(`Low word count (${analysis.wordCount} words). Content under 200 words is rarely cited by AI engines. Target 800+ words.`);
  } else if (analysis.wordCount < 500) {
    findings.push(`Moderate word count (${analysis.wordCount} words). Expand to 800+ words for stronger AI citation potential.`);
  }

  if (analysis.h1Count === 0) {
    findings.push('Missing H1 tag. Every page needs exactly one H1 for content hierarchy.');
  } else if (analysis.h1Count > 1) {
    findings.push(`Multiple H1 tags detected (${analysis.h1Count}). Use only one H1 per page for clarity.`);
  }

  if (analysis.h1Count > 0 && analysis.h2Count === 0) {
    findings.push('No H2 subheadings found. Use H2s to break content into scannable sections.');
  }

  const altRatio = analysis.imageCount > 0 ? analysis.imagesWithAlt / analysis.imageCount : 1;
  if (altRatio < 0.8 && analysis.imageCount > 0) {
    findings.push(`Only ${Math.round(altRatio * 100)}% of images have alt text (${analysis.imagesWithAlt}/${analysis.imageCount}). Add descriptive alt text for accessibility and visual search.`);
  }

  if (analysis.internalLinkCount < 3) {
    findings.push(`Only ${analysis.internalLinkCount} internal links found. Add 3+ internal links to help crawlers understand site context.`);
  }

  // Technical SEO findings
  if (!analysis.title) {
    findings.push('Missing page title tag. This is critical for search and AI engine indexing.');
  } else if (analysis.title.length < 30 || analysis.title.length > 60) {
    findings.push(`Title tag is ${analysis.title.length} characters (optimal: 30-60). Current: "${analysis.title.substring(0, 50)}..."`);
  }

  if (!analysis.metaDescription) {
    findings.push('Missing meta description. Add a 120-160 character description for search snippets.');
  } else if (analysis.metaDescription.length < 120 || analysis.metaDescription.length > 160) {
    findings.push(`Meta description is ${analysis.metaDescription.length} characters (optimal: 120-160).`);
  }

  if (!analysis.hasSSL) findings.push('Site is not using HTTPS. SSL is required for AI engine trust signals.');
  if (!analysis.hasCanonical) findings.push('Missing canonical link tag. Add to prevent duplicate content issues.');
  if (!analysis.hasViewport) findings.push('Missing viewport meta tag. Required for mobile usability.');
  if (analysis.isNoIndex) findings.push('Page has "noindex" directive. AI engines will skip this page entirely.');

  // Authority findings
  if (analysis.schemas.length === 0) {
    findings.push('No JSON-LD schema markup found. Add Organization, Article, or FAQ schema for AI entity recognition.');
  }

  if (analysis.externalLinkCount < 2) {
    findings.push(`Only ${analysis.externalLinkCount} outbound links to external sources. Cite authoritative references to boost credibility.`);
  }

  // AI Visibility findings
  if (!analysis.hasFAQSchema) {
    findings.push('No FAQPage schema detected. FAQ structured data dramatically increases AI citation rates.');
  }

  if (!analysis.hasHowToSchema) {
    findings.push('No HowTo schema detected. Step-by-step structured data helps AI engines extract actionable content.');
  }

  if (!analysis.hasSnippetParagraph) {
    findings.push('No concise "answer paragraphs" found (40-60 words). AI engines prefer extracting self-contained answer blocks.');
  }

  if (analysis.questionHeadingCount === 0) {
    findings.push('No question-based headings (What/How/Why). Structure content as Q&A for ChatGPT/Perplexity citation.');
  }

  if (findings.length === 0) {
    findings.push('Strong AEO profile detected. Continue monitoring for algorithm changes.');
  }

  return findings;
}

export function getStatusLabel(score: number): string {
  if (score < 3) return 'Invisible to AI Engines';
  if (score < 5) return 'Low Visibility';
  if (score < 7) return 'Moderate Presence';
  if (score < 8.5) return 'Strong Presence';
  return 'Agentic Dominance';
}
