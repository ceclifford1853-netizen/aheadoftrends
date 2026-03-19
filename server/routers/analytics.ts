import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { pageVisits, conversions } from '../schema';
import { desc, count } from 'drizzle-orm';
import { db } from '../db';
import { nanoid } from 'nanoid';

export const analyticsRouter = router({
  // Public: Track page visit
  trackVisit: publicProcedure
    .input(z.object({
      pagePath: z.string(),
      referrer: z.string().optional(),
      device: z.string().optional(),
      browser: z.string().optional(),
      country: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.insert(pageVisits).values({
        id: nanoid(),
        userId: (ctx.user as Record<string, string> | null)?.id ?? undefined,
        pagePath: input.pagePath,
        referrer: input.referrer,
        device: input.device,
        browser: input.browser,
        country: input.country,
      });

      return { success: true };
    }),

  // Public: Get dashboard metrics (simplified - no auth required for now)
  getDashboard: publicProcedure
    .query(async () => {
      const totalVisits = await db.select({ count: count() }).from(pageVisits);
      const totalConversions = await db.select({ count: count() }).from(conversions);

      const topPages = await db
        .select({
          pagePath: pageVisits.pagePath,
          count: count(),
        })
        .from(pageVisits)
        .groupBy(pageVisits.pagePath)
        .orderBy(desc(count()))
        .limit(5);

      return {
        totalVisits: totalVisits[0]?.count || 0,
        totalConversions: totalConversions[0]?.count || 0,
        conversionRate: totalVisits[0]?.count
          ? ((totalConversions[0]?.count || 0) / totalVisits[0].count * 100).toFixed(2)
          : '0',
        topPages,
      };
    }),
});
