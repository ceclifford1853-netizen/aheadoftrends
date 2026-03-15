import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const BETA_START_KEY = 'aot_beta_start_date';
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const ADMIN_KEY = 'aot_admin_bypass';

/**
 * BetaGuard — enforces 14-day beta access window.
 * - Admin bypass: localStorage flag 'aot_admin_bypass' === 'true' for perpetual access.
 * - No Clerk dependency.
 */
export function BetaGuard({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Admin bypass via localStorage
    if (localStorage.getItem(ADMIN_KEY) === 'true') {
      setReady(true);
      return;
    }

    const stored = localStorage.getItem(BETA_START_KEY);

    if (!stored) {
      localStorage.setItem(BETA_START_KEY, String(Date.now()));
      setReady(true);
      return;
    }

    const elapsed = Date.now() - parseInt(stored, 10);
    if (elapsed > FOURTEEN_DAYS_MS) {
      navigate('/subscription-required');
      return;
    }

    setReady(true);
  }, [navigate]);

  if (!ready) return null;
  return <>{children}</>;
}
