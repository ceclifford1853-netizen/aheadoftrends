import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { isBetaExpired, getBetaUserByEmail, getSafetyNetRedirect } from '@/lib/hardGuard';

/**
 * Hard Guard Check Component
 * 
 * Monitors beta user access and enforces 14-day expiry + Day 15 Safety Net redirect.
 * This component runs on app initialization to check if the current user's beta access has expired.
 */
export function HardGuardCheck() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if there's a beta user session
    const betaUserEmail = localStorage.getItem('beta_user_email');
    
    if (betaUserEmail) {
      const user = getBetaUserByEmail(betaUserEmail);
      
      if (user && isBetaExpired(user.expiresAt)) {
        // Beta access has expired - redirect to Safety Net
        const redirectUrl = getSafetyNetRedirect(user.paymentStatus);
        setLocation(redirectUrl);
      }
    }
  }, [setLocation]);

  return null; // This component doesn't render anything
}
