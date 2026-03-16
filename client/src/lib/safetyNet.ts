/**
 * Hard Guard: 14-Day Trial Expiry Logic
 * Enforces trial window and redirects to consultation form on Day 15
 */

const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const STORAGE_KEY = "aot_trial_start";

/**
 * Initialize trial window on first visit
 */
export function initializeTrial(): Date {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    return new Date(stored);
  }
  
  const now = new Date();
  localStorage.setItem(STORAGE_KEY, now.toISOString());
  return now;
}

/**
 * Get trial start date
 */
export function getTrialStartDate(): Date | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? new Date(stored) : null;
}

/**
 * Calculate remaining trial days
 */
export function getRemainingTrialDays(): number {
  const startDate = getTrialStartDate();
  if (!startDate) return 14;
  
  const now = new Date();
  const elapsedMs = now.getTime() - startDate.getTime();
  const remainingDays = Math.max(0, Math.ceil((TRIAL_DURATION_MS - elapsedMs) / (24 * 60 * 60 * 1000)));
  
  return remainingDays;
}

/**
 * Check if trial has expired
 */
export function isTrialExpired(): boolean {
  return getRemainingTrialDays() <= 0;
}

/**
 * Check if user is on Day 15 (safety net trigger)
 */
export function isSafetyNetTriggered(): boolean {
  const startDate = getTrialStartDate();
  if (!startDate) return false;
  
  const now = new Date();
  const elapsedMs = now.getTime() - startDate.getTime();
  const daysPassed = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
  
  return daysPassed >= 14;
}

/**
 * Reset trial (for testing or new session)
 */
export function resetTrial(): void {
  localStorage.removeItem(STORAGE_KEY);
}
