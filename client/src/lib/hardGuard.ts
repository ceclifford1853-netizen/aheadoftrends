/**
 * Hard Guard & Safety Net Logic
 * 
 * Implements 14-day beta access expiry with Day 15 Safety Net redirect.
 * - Day 1-14: Full access to beta features
 * - Day 13: Automated email warning sent
 * - Day 14: Access cuts off
 * - Day 15+: Redirect to consultation form (if payment API inactive) or pricing page (if active)
 */

export interface BetaUser {
  id: string;
  email: string;
  signupDate: string;
  expiresAt: string;
  paymentStatus: 'active' | 'inactive' | 'pending';
}

export const BETA_DURATION_DAYS = 14;
export const WARNING_DAY = 13;

/**
 * Calculate days remaining in beta access
 */
export function getDaysRemaining(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Check if beta access has expired
 */
export function isBetaExpired(expiresAt: string): boolean {
  return getDaysRemaining(expiresAt) <= 0;
}

/**
 * Check if warning email should be sent (Day 13)
 */
export function shouldSendWarning(expiresAt: string): boolean {
  const daysRemaining = getDaysRemaining(expiresAt);
  return daysRemaining === WARNING_DAY;
}

/**
 * Get Day 15 Safety Net redirect URL
 * - If payment is active: redirect to pricing page
 * - If payment is inactive: redirect to consultation form
 */
export function getSafetyNetRedirect(paymentStatus: 'active' | 'inactive' | 'pending'): string {
  if (paymentStatus === 'active') {
    return '/pricing'; // Redirect to pricing page
  } else {
    return '/consultation'; // Redirect to consultation form
  }
}

/**
 * Create a new beta user with 14-day expiry
 */
export function createBetaUser(email: string): BetaUser {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + BETA_DURATION_DAYS * 24 * 60 * 60 * 1000);
  
  return {
    id: `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    signupDate: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    paymentStatus: 'inactive',
  };
}

/**
 * Store beta user in localStorage (for demo purposes)
 * In production, this would be stored in a database
 */
export function storeBetaUser(user: BetaUser): void {
  const users = getBetaUsers();
  users.push(user);
  localStorage.setItem('beta_users', JSON.stringify(users));
}

/**
 * Retrieve all beta users from localStorage
 */
export function getBetaUsers(): BetaUser[] {
  const stored = localStorage.getItem('beta_users');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get a specific beta user by email
 */
export function getBetaUserByEmail(email: string): BetaUser | null {
  const users = getBetaUsers();
  return users.find(u => u.email === email) || null;
}

/**
 * Check if user should be redirected to Day 15 Safety Net
 */
export function shouldRedirectToSafetyNet(user: BetaUser): boolean {
  return isBetaExpired(user.expiresAt);
}

/**
 * Format days remaining for display
 */
export function formatDaysRemaining(expiresAt: string): string {
  const days = getDaysRemaining(expiresAt);
  if (days === 0) return 'Expired';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
}
