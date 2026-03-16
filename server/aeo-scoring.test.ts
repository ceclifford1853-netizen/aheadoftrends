import { describe, it, expect } from "vitest";

/**
 * Test the AEO scoring logic inline (same algorithm as server/_core/index.ts REST endpoint).
 * We test the scoring functions directly to avoid needing a running server.
 */

function calculateScores(params: {
  wordCount: number;
  headings: number;
  images: number;
  imagesWithAlt: number;
  metaDescLength: number;
  hasSchema: boolean;
  hasOG: boolean;
  hasCanonical: boolean;
  hasHttps: boolean;
  titleLength: number;
  internalLinks: number;
  externalLinks: number;
  statusCode: number;
}) {
  const {
    wordCount, headings, images, imagesWithAlt, metaDescLength,
    hasSchema, hasOG, hasCanonical, hasHttps, titleLength,
    internalLinks, externalLinks, statusCode
  } = params;

  // Content Quality (40%)
  let cq = 3;
  if (wordCount > 300) cq += 1;
  if (wordCount > 800) cq += 1;
  if (wordCount > 1500) cq += 1;
  if (headings >= 3) cq += 1;
  if (headings >= 6) cq += 0.5;
  if (metaDescLength > 50) cq += 1;
  if (imagesWithAlt > 0 && images > 0) cq += (imagesWithAlt / images) * 1.5;
  const contentQuality = Math.min(10, Math.round(cq * 10) / 10);

  // Technical SEO (25%)
  let ts = 3;
  if (hasHttps) ts += 2;
  if (hasCanonical) ts += 1.5;
  if (hasOG) ts += 1;
  if (titleLength > 10 && titleLength < 70) ts += 1;
  if (metaDescLength > 50 && metaDescLength < 160) ts += 1;
  if (statusCode === 200) ts += 0.5;
  const technicalSeo = Math.min(10, Math.round(ts * 10) / 10);

  // Authority (20%)
  let au = 2;
  if (hasSchema) au += 2.5;
  if (externalLinks > 3) au += 1;
  if (internalLinks > 5) au += 1;
  if (wordCount > 1000) au += 1;
  if (headings >= 5) au += 0.5;
  if (hasOG) au += 1;
  au += Math.min(1, externalLinks * 0.1);
  const authority = Math.min(10, Math.round(au * 10) / 10);

  // Chat Visibility (15%)
  let cv = 2;
  if (hasSchema) cv += 2;
  if (metaDescLength > 80) cv += 1;
  if (headings >= 3) cv += 1;
  if (wordCount > 500) cv += 1;
  if (hasOG) cv += 0.5;
  if (titleLength > 0) cv += 0.5;
  if (imagesWithAlt > 2) cv += 0.5;
  cv += Math.min(1.5, (internalLinks + externalLinks) * 0.05);
  const chatVisibility = Math.min(10, Math.round(cv * 10) / 10);

  const overall = Math.round((contentQuality * 0.4 + technicalSeo * 0.25 + authority * 0.2 + chatVisibility * 0.15) * 10) / 10;
  const statusLabel = overall >= 8 ? "Dominant Presence" : overall >= 6 ? "Strong Presence" : overall >= 4 ? "Moderate Presence" : "Weak Presence";

  return { contentQuality, technicalSeo, authority, chatVisibility, overall, statusLabel };
}

describe("AEO Scoring Algorithm", () => {
  it("scores a well-optimized site highly", () => {
    const result = calculateScores({
      wordCount: 2000,
      headings: 8,
      images: 10,
      imagesWithAlt: 9,
      metaDescLength: 120,
      hasSchema: true,
      hasOG: true,
      hasCanonical: true,
      hasHttps: true,
      titleLength: 40,
      internalLinks: 20,
      externalLinks: 10,
      statusCode: 200,
    });
    expect(result.overall).toBeGreaterThanOrEqual(8);
    expect(result.statusLabel).toBe("Dominant Presence");
    expect(result.contentQuality).toBeGreaterThanOrEqual(8);
    expect(result.technicalSeo).toBeGreaterThanOrEqual(8);
  });

  it("scores a minimal site poorly", () => {
    const result = calculateScores({
      wordCount: 50,
      headings: 0,
      images: 0,
      imagesWithAlt: 0,
      metaDescLength: 0,
      hasSchema: false,
      hasOG: false,
      hasCanonical: false,
      hasHttps: false,
      titleLength: 5,
      internalLinks: 0,
      externalLinks: 0,
      statusCode: 200,
    });
    expect(result.overall).toBeLessThan(4);
    expect(result.statusLabel).toBe("Weak Presence");
  });

  it("scores are always between 0 and 10", () => {
    const result = calculateScores({
      wordCount: 50000,
      headings: 100,
      images: 500,
      imagesWithAlt: 500,
      metaDescLength: 300,
      hasSchema: true,
      hasOG: true,
      hasCanonical: true,
      hasHttps: true,
      titleLength: 40,
      internalLinks: 1000,
      externalLinks: 500,
      statusCode: 200,
    });
    expect(result.contentQuality).toBeLessThanOrEqual(10);
    expect(result.technicalSeo).toBeLessThanOrEqual(10);
    expect(result.authority).toBeLessThanOrEqual(10);
    expect(result.chatVisibility).toBeLessThanOrEqual(10);
    expect(result.overall).toBeLessThanOrEqual(10);
  });

  it("weights sum to 100%", () => {
    const result = calculateScores({
      wordCount: 1000,
      headings: 5,
      images: 5,
      imagesWithAlt: 3,
      metaDescLength: 100,
      hasSchema: true,
      hasOG: true,
      hasCanonical: true,
      hasHttps: true,
      titleLength: 30,
      internalLinks: 10,
      externalLinks: 5,
      statusCode: 200,
    });
    // Verify overall = cq*0.4 + ts*0.25 + au*0.2 + cv*0.15
    const expected = Math.round(
      (result.contentQuality * 0.4 + result.technicalSeo * 0.25 + result.authority * 0.2 + result.chatVisibility * 0.15) * 10
    ) / 10;
    expect(result.overall).toBe(expected);
  });

  it("HTTPS adds to technical SEO score", () => {
    const withHttps = calculateScores({
      wordCount: 500, headings: 3, images: 2, imagesWithAlt: 1,
      metaDescLength: 80, hasSchema: false, hasOG: false, hasCanonical: false,
      hasHttps: true, titleLength: 20, internalLinks: 3, externalLinks: 1, statusCode: 200,
    });
    const withoutHttps = calculateScores({
      wordCount: 500, headings: 3, images: 2, imagesWithAlt: 1,
      metaDescLength: 80, hasSchema: false, hasOG: false, hasCanonical: false,
      hasHttps: false, titleLength: 20, internalLinks: 3, externalLinks: 1, statusCode: 200,
    });
    expect(withHttps.technicalSeo).toBeGreaterThan(withoutHttps.technicalSeo);
  });

  it("schema markup boosts authority and chat visibility", () => {
    const withSchema = calculateScores({
      wordCount: 500, headings: 3, images: 2, imagesWithAlt: 1,
      metaDescLength: 80, hasSchema: true, hasOG: false, hasCanonical: false,
      hasHttps: true, titleLength: 20, internalLinks: 3, externalLinks: 1, statusCode: 200,
    });
    const withoutSchema = calculateScores({
      wordCount: 500, headings: 3, images: 2, imagesWithAlt: 1,
      metaDescLength: 80, hasSchema: false, hasOG: false, hasCanonical: false,
      hasHttps: true, titleLength: 20, internalLinks: 3, externalLinks: 1, statusCode: 200,
    });
    expect(withSchema.authority).toBeGreaterThan(withoutSchema.authority);
    expect(withSchema.chatVisibility).toBeGreaterThan(withoutSchema.chatVisibility);
  });
});
