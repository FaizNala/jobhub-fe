export const HYDRATION_FAILSAFE_MS = 2500;

export interface SplashDurationInput {
  minDurationMs?: number;
  isWeb: boolean;
  prefersReducedMotion: boolean;
  isHeld: boolean;
}

/**
 * Resolves the effective minimum splash hold duration across Web QA hold, reduced-motion mode,
 * explicit overrides, and Web vs native platform defaults.
 */
export function resolveSplashDurationMs({
  minDurationMs,
  isWeb,
  prefersReducedMotion,
  isHeld,
}: SplashDurationInput): number {
  if (isHeld) return 999999;
  if (prefersReducedMotion) return 0;
  if (typeof minDurationMs === 'number') return Math.max(0, minDurationMs);
  return isWeb ? 280 : 650;
}
