import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  isHydrated: boolean;

  // Actions
  completeWalkthrough: () => void;
  saveProfileSetup: (profile: Partial<CandidateProfile>) => void;
  resetOnboarding: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  role: 'Product & Project Management',
  seniority: 'Senior (5-8 yrs)',
  techStack: ['Project Management', 'Product Strategy', 'Data Analysis', 'Leadership'],
  skills: ['Project Management', 'Product Strategy', 'Data Analysis', 'Leadership'],
  workMode: 'remote',
  targetSalary: '$145k - $175k / yr',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedWalkthrough: false,
      hasCompletedProfileSetup: false,
      candidateProfile: DEFAULT_CANDIDATE_PROFILE,
      isHydrated: false,

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

      setHydrated: (hydrated: boolean) =>
        set({
          isHydrated: hydrated,
        }),
    }),
    {
      name: 'jobhub-onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedWalkthrough: state.hasCompletedWalkthrough,
        hasCompletedProfileSetup: state.hasCompletedProfileSetup,
        candidateProfile: state.candidateProfile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Expose store globally on web for developer inspection & testing
if (typeof window !== 'undefined') {
  (window as any).__JOBHUB_ONBOARDING_STORE__ = useOnboardingStore;
}
