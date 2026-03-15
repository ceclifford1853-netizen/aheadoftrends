import { router } from '../trpc';
import { safetyNetRouter } from './safetyNet';
import { aeoRouter } from './aeo';
import { analyticsRouter } from './analytics';

export const appRouter = router({
  safetyNet: safetyNetRouter,
  aeo: aeoRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
