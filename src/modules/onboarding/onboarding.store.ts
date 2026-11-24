import { create } from 'zustand';

export interface CandidateProfile {
  role: string;
  seniority: string;
  techStack: string[];
  skills?: string[];
  workMode: 'remote' | 'hybrid' | 'onsite';
  targetSalary?: string;
}

export interface OnboardingState {
  hasCompletedWalkthrough: boolean;
  hasCompletedProfileSetup: boolean;
  candidateProfile: CandidateProfile;

  // Actions
  completeWalkthrough: () => void;
  saveProfileSetup: (profile: Partial<CandidateProfile>) => void;
  resetOnboarding: () => void;
}

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  role: 'Product & Project Management',
  seniority: 'Senior (5-8 yrs)',
  techStack: ['Project Management', 'Product Strategy', 'Data Analysis', 'Leadership'],
  skills: ['Project Management', 'Product Strategy', 'Data Analysis', 'Leadership'],
  workMode: 'remote',
  targetSalary: '$145k - $175k / yr',
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedWalkthrough: false,
  hasCompletedProfileSetup: false,
  candidateProfile: DEFAULT_CANDIDATE_PROFILE,

  completeWalkthrough: () =>
    set({
      hasCompletedWalkthrough: true,
    }),

  saveProfileSetup: (partialProfile) =>
    set((state) => ({
      hasCompletedProfileSetup: true,
      candidateProfile: {
        ...state.candidateProfile,
        ...partialProfile,
      },
    })),

  resetOnboarding: () =>
    set({
      hasCompletedWalkthrough: false,
      hasCompletedProfileSetup: false,
      candidateProfile: DEFAULT_CANDIDATE_PROFILE,
    }),
}));
