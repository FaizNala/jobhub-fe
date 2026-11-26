import { describe, expect, it } from 'bun:test';
import {
  HYDRATION_FAILSAFE_MS,
  resolveSplashDurationMs,
} from './splash-gate';

describe('resolveSplashDurationMs', () => {
  it('returns long QA hold duration when isHeld is true', () => {
    expect(
      resolveSplashDurationMs({
        isWeb: true,
        prefersReducedMotion: true,
        isHeld: true,
      })
    ).toBe(999999);
  });

  it('returns 0ms when prefersReducedMotion is enabled outside QA hold', () => {
    expect(
      resolveSplashDurationMs({
        minDurationMs: 650,
        isWeb: false,
        prefersReducedMotion: true,
        isHeld: false,
      })
    ).toBe(0);
  });

  it('uses snappier 280ms default on Web and 650ms on native when minDurationMs is omitted', () => {
    expect(
      resolveSplashDurationMs({
        isWeb: true,
        prefersReducedMotion: false,
        isHeld: false,
      })
    ).toBe(280);

    expect(
      resolveSplashDurationMs({
        isWeb: false,
        prefersReducedMotion: false,
        isHeld: false,
      })
    ).toBe(650);
  });

  it('respects explicit minDurationMs override when provided', () => {
    expect(
      resolveSplashDurationMs({
        minDurationMs: 420,
        isWeb: true,
        prefersReducedMotion: false,
        isHeld: false,
      })
    ).toBe(420);
    expect(HYDRATION_FAILSAFE_MS).toBe(2500);
  });
});
