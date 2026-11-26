import { describe, expect, it } from 'bun:test';
import {
  buildCvProfileUpdateFromOnboarding,
  mapOnboardingWorkMode,
} from './onboarding-sync';
import type { CandidateProfile as OnboardingProfile } from './onboarding.store';
import type { CandidateProfile as CvProfile } from '../cv-studio/cv.types';

describe('mapOnboardingWorkMode', () => {
  it('maps onboarding lowercase work modes to CV WorkModelType', () => {
    expect(mapOnboardingWorkMode('remote')).toBe('Remote');
    expect(mapOnboardingWorkMode('hybrid')).toBe('Hybrid');
    expect(mapOnboardingWorkMode('onsite')).toBe('On-Site');
  });
});

describe('buildCvProfileUpdateFromOnboarding', () => {
  const sampleOnboarding: OnboardingProfile = {
    role: 'UI/UX & Creative Design',
    seniority: 'Lead / Staff (8+ yrs)',
    techStack: ['UI/UX Design', 'Product Strategy', 'UI/UX Design'],
    workMode: 'hybrid',
    targetSalary: '$175k - $220k+ / yr',
  };

  it('merges onboarding preferences without discarding existing locations or untouched roles', () => {
    const existing = {
      preferences: {
        targetRoles: ['Mobile Solutions Architect', 'UI/UX & Creative Design'],
        minCompensation: '$120k / yr',
        workModels: ['Remote'],
        targetLocations: ['Jakarta', 'Remote (APAC)'],
      },
    } as unknown as CvProfile;

    const dto = buildCvProfileUpdateFromOnboarding(sampleOnboarding, existing);

    expect(dto.preferences).toEqual({
      targetRoles: ['UI/UX & Creative Design', 'Mobile Solutions Architect'],
      minCompensation: '$175k - $220k+ / yr',
      workModels: ['Hybrid'],
      targetLocations: ['Jakarta', 'Remote (APAC)'],
    });
    expect(dto.hardSkills).toEqual(['UI/UX Design', 'Product Strategy']);
    expect(dto.skills).toEqual(['UI/UX Design', 'Product Strategy']);
  });

  it('provides clean defaults when existingProfile is missing or targetSalary is omitted', () => {
    const sparse: OnboardingProfile = {
      role: 'Software & Technology',
      seniority: 'Senior (5-8 yrs)',
      techStack: ['React / Mobile Tech'],
      workMode: 'onsite',
    };

    const dto = buildCvProfileUpdateFromOnboarding(sparse, null);

    expect(dto.preferences).toEqual({
      targetRoles: ['Software & Technology'],
      minCompensation: '$145k - $175k / yr',
      workModels: ['On-Site'],
      targetLocations: ['Remote / Flexible'],
    });
    expect(dto.hardSkills).toEqual(['React / Mobile Tech']);
  });
});
