import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { analyzeWebsite, calculateAeoScore, generateRecommendations, getStatusLabel } from '../services/aeoScoring';
import { aeoAnalyses, conversions } from '../schema';
import { db } from '../db';

export const aeoRouter = router({
  // Public: Full AEO analysis (called by AlphaRating page via fetch)
  analyze: publicProcedure
    .input(z.object({
      url: z.string().url(),
    }))
    .mutation(async ({ input, ctx }) => {
      const analysis = await analyzeWebsite(input.url);
      const scores = calculateAeoScore(analysis);
      const recommendations = generateRecommendations(analysis, scores);

      // Save analysis if user is authenticated
      if (ctx.userId) {
        try {
          await db.insert(aeoAnalyses).values({
            id: Math.random().toString(36).substring(7),
            userId: ctx.userId,
            url: input.url,
            overallScore: scores.overall.toString(),
            contentQualityScore: scores.contentQuality.toString(),
            technicalSeoScore: scores.technicalSeo.toString(),
            authorityScore: scores.authority.toString(),
            chatVisibilityScore: scores.chatVisibility.toString(),
            recommendations: JSON.stringify(recommendations),
            competitorGap: (10 - scores.overall).toString(),
          });
        } catch (e) {
          console.error('Failed to save analysis:', e);
        }
      }

      return {
        contentQuality: scores.contentQuality,
        technicalSeo: scores.technicalSeo,
        authority: scores.authority,
        chatVisibility: scores.chatVisibility,
        overall: scores.overall,
        status: getStatusLabel(scores.overall),
        recommendations,
        url: input.url,
        wordCount: analysis.wordCount,
        hasSchema: analysis.schemas.length > 0,
        hasFAQ: analysis.hasFAQSchema,
        hasHowTo: analysis.hasHowToSchema,
        h1Count: analysis.h1Count,
        h2Count: analysis.h2Count,
        imageCount: analysis.imageCount,
        imagesWithAlt: analysis.imagesWithAlt,
      };
    }),

  // Public: Calculate score (legacy endpoint)
  calculateScore: publicProcedure
    .input(z.object({
      url: z.string().url(),
      industry: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const analysis = await analyzeWebsite(input.url);
      const scores = calculateAeoScore(analysis);
      const recommendations = generateRecommendations(analysis, scores);

      if (ctx.userId) {
        try {
          await db.insert(aeoAnalyses).values({
            id: Math.random().toString(36).substring(7),
            userId: ctx.userId,
            url: input.url,
            industry: input.industry,
            overallScore: scores.overall.toString(),
            contentQualityScore: scores.contentQuality.toString(),
            technicalSeoScore: scores.technicalSeo.toString(),
            authorityScore: scores.authority.toString(),
            chatVisibilityScore: scores.chatVisibility.toString(),
            recommendations: JSON.stringify(recommendations),
            competitorGap: (10 - scores.overall).toString(),
          });
        } catch (e) {
          console.error('Failed to save analysis:', e);
        }
      }

      return {
        url: input.url,
        score: scores.overall,
        status: getStatusLabel(scores.overall),
        breakdown: {
          contentQuality: scores.contentQuality,
          technicalSeo: scores.technicalSeo,
          authority: scores.authority,
          chatVisibility: scores.chatVisibility,
        },
        recommendations,
        competitorGap: Math.round((10 - scores.overall) * 10) / 10,
      };
    }),

  // Public: Save analysis with email capture (lead magnet)
  saveAnalysis: publicProcedure
    .input(z.object({
      url: z.string().url(),
      email: z.string().email(),
      company: z.string().optional(),
      industry: z.string().optional(),
      score: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(conversions).values({
        id: Math.random().toString(36).substring(7),
        userId: ctx.userId,
        type: 'lead_magnet',
        email: input.email,
        company: input.company,
        aeoScore: input.score.toString(),
      });

      return {
        success: true,
        message: 'Your AEO report has been sent to your email',
      };
    }),

  // Protected: Get user's analysis history
  getHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const analyses = await db.query.aeoAnalyses.findMany({
        where: (aeoAnalyses, { eq }) => eq(aeoAnalyses.userId, ctx.userId),
        orderBy: (aeoAnalyses, { desc }) => desc(aeoAnalyses.createdAt),
        limit: 10,
      });

      return analyses;
    }),
});

  getLeads: publicProcedure.query(async ({ ctx }) => {
    const leads = await ctx.db.query.aeoAnalyses.findMany({
      orderBy: (t) => [desc(t.createdAt)],
      limit: 100,
    });
    return leads;
  }),
