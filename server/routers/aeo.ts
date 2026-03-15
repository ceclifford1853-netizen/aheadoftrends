import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createLead, createAeoScore, getAeoScoreById } from "../db";
import { notifyOwner } from "../_core/notification";

/**
 * 4-Factor AEO Scoring Algorithm
 * Quality (40%) + SEO (25%) + Authority (20%) + Visibility (15%) = Overall Score (0-10)
 */
function calculateOverallScore(
  quality: number,
  seo: number,
  authority: number,
  visibility: number
): number {
  const weighted =
    quality * 0.4 + seo * 0.25 + authority * 0.2 + visibility * 0.15;
  return Math.round(weighted * 10) / 10;
}

/**
 * Simulate web scraping to extract metadata and calculate factor scores.
 * In production, this would call a real web scraping service.
 */
async function analyzeWebsite(url: string) {
  // Simulate API call to scraping service
  // In production: call external service like ScraperAPI, Bright Data, etc.
  
  // Mock analysis based on URL characteristics
  const urlLength = url.length;
  const hasHttps = url.includes("https");
  const domainAge = Math.floor(Math.random() * 20) + 1; // Years
  
  // Quality Score (40%): EEAT signals, content depth, structure
  // Factors: word count, heading structure, schema markup, readability
  const qualityScore = Math.min(
    10,
    Math.floor((hasHttps ? 6 : 4) + Math.random() * 4)
  );

  // SEO Score (25%): Technical SEO, performance, indexability
  // Factors: Core Web Vitals, mobile-friendly, XML sitemap, robots.txt
  const seoScore = Math.min(
    10,
    Math.floor((hasHttps ? 7 : 5) + Math.random() * 3)
  );

  // Authority Score (20%): Domain authority, backlinks, citations
  // Factors: Domain age, backlink profile, brand mentions, trust signals
  const authorityScore = Math.min(
    10,
    Math.floor(Math.min(domainAge, 10) + Math.random() * 2)
  );

  // Visibility Score (15%): AI/LLM presence, featured snippets, knowledge graph
  // Factors: ChatGPT indexing, Perplexity presence, featured snippet eligibility
  const visibilityScore = Math.min(
    10,
    Math.floor((hasHttps ? 6 : 4) + Math.random() * 4)
  );

  return {
    qualityScore,
    seoScore,
    authorityScore,
    visibilityScore,
  };
}

export const aeoRouter = router({
  /**
   * Submit a website for AEO analysis and lead capture.
   * Stores lead info, calculates 4-factor score, and triggers owner notification.
   */
  submitWebsite: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        websiteUrl: z.string().url("Invalid URL"),
        industry: z.string().optional(),
        companyName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Create lead record
        const leadResult = await createLead({
          email: input.email,
          websiteUrl: input.websiteUrl,
          industry: input.industry,
          companyName: input.companyName,
        });

        // Get the inserted lead ID
        const leadId = (leadResult as any).insertId || 1;

        // Analyze website using 4-factor algorithm
        const scores = await analyzeWebsite(input.websiteUrl);
        const overallScore = calculateOverallScore(
          scores.qualityScore,
          scores.seoScore,
          scores.authorityScore,
          scores.visibilityScore
        );

        // Store AEO score
        await createAeoScore({
          leadId,
          websiteUrl: input.websiteUrl,
          qualityScore: scores.qualityScore,
          seoScore: scores.seoScore,
          authorityScore: scores.authorityScore,
          visibilityScore: scores.visibilityScore,
          overallScore,
          recommendations: JSON.stringify({
            quality: `Focus on EEAT signals and content depth. Current score: ${scores.qualityScore}/10`,
            seo: `Optimize Core Web Vitals and technical SEO. Current score: ${scores.seoScore}/10`,
            authority: `Build backlinks and domain authority. Current score: ${scores.authorityScore}/10`,
            visibility: `Improve AI/LLM indexing presence. Current score: ${scores.visibilityScore}/10`,
          }),
        });

        // Notify owner of new lead
        await notifyOwner({
          title: "New AEO Lead Submission",
          content: `Email: ${input.email}\nCompany: ${input.companyName || "N/A"}\nWebsite: ${input.websiteUrl}\nAEO Score: ${overallScore}/10`,
        });

        return {
          success: true,
          leadId,
          score: overallScore,
          factors: {
            quality: scores.qualityScore,
            seo: scores.seoScore,
            authority: scores.authorityScore,
            visibility: scores.visibilityScore,
          },
        };
      } catch (error) {
        console.error("[AEO] Error submitting website:", error);
        throw new Error("Failed to process website submission");
      }
    }),

  /**
   * Get AEO score details by ID.
   */
  getScore: publicProcedure
    .input(z.object({ scoreId: z.number() }))
    .query(async ({ input }) => {
      const score = await getAeoScoreById(input.scoreId);
      if (!score) {
        throw new Error("Score not found");
      }
      return score;
    }),
});
