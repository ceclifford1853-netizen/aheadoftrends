import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { users } from '../schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';

interface UserRecord {
  id: string;
  createdAt: Date | string;
  paymentActive: boolean | null;
  email: string;
}

export const safetyNetRouter = router({
  checkExpiry: publicProcedure
    .query(async ({ ctx }) => {
      const user = ctx.user as UserRecord | null;
      if (!user) {
        return { action: 'redirect_home' as const };
      }

      const daysSinceSignup = Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Day 14: Hard cutoff per Hard Guard Logic
      if (daysSinceSignup >= 14) {
        const paymentActive = user.paymentActive || false;

        return {
          action: paymentActive ? 'redirect_pricing' : 'redirect_consultation' as const,
          message: paymentActive
            ? 'Beta complete — select your Agentic tier to continue'
            : 'Beta complete — let\'s discuss your Agentic strategy',
          daysSinceSignup,
        };
      }

      return {
        action: 'continue_access' as const,
        daysRemaining: 14 - daysSinceSignup,
      };
    }),

  // Update payment status (called after Ko-fi webhook)
  updatePaymentStatus: publicProcedure
    .input(z.object({
      userId: z.string(),
      paymentActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      await db.update(users)
        .set({ paymentActive: input.paymentActive })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),
});
