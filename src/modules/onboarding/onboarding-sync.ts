import type {
  CandidateProfile as CvCandidateProfile,
  UpdateProfileDto,
  WorkModelType,
} from '@/modules/cv-studio/cv.types';
import type { CandidateProfile as OnboardingProfile } from './onboarding.store';

const WORK_MODE_MAP: Record<OnboardingProfile['workMode'], WorkModelType> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-Site',
};

/**
 * Converts lower-case onboarding workMode identifiers into CV Studio WorkModelType labels.
 */
export function mapOnboardingWorkMode(
  workMode: OnboardingProfile['workMode']
): WorkModelType {
  return WORK_MODE_MAP[workMode];
}

function dedupeTrimmed(values: string[]): string[] {
  return Array.from(
    new Set(values.map((item) => item.trim()).filter(Boolean))
  );
}

/**
 * Builds a partial CV profile update DTO from completed post-register onboarding selections,
 * preserving untouched preference fields such as targetLocations and prior role preferences.
 */
export function buildCvProfileUpdateFromOnboarding(
  onboarding: OnboardingProfile,
  existingProfile?: CvCandidateProfile | null
): UpdateProfileDto {
  const existingPrefs = existingProfile?.preferences;
  const targetRoles = dedupeTrimmed([
    onboarding.role,
    ...(existingPrefs?.targetRoles ?? []),
  ]);
  const targetLocations =
    existingPrefs?.targetLocations && existingPrefs.targetLocations.length > 0
      ? existingPrefs.targetLocations
      : ['Remote / Flexible'];
  const minCompensation =
    onboarding.targetSalary?.trim() ||
    existingPrefs?.minCompensation ||
    '$145k - $175k / yr';
  const workModels: WorkModelType[] = [
    mapOnboardingWorkMode(onboarding.workMode),
  ];
  const dedupedSkills = dedupeTrimmed(onboarding.techStack);

  return {
    preferences: {
      targetRoles,
      minCompensation,
      workModels,
      targetLocations,
    },
    ...(dedupedSkills.length > 0
      ? {
          hardSkills: dedupedSkills,
          skills: dedupedSkills,
        }
      : {}),
  };
}
