import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import {
  CandidateProfile,
  ATSMatchResult,
  UpdateProfileDto,
  CalculateATSDto,
} from './cv.types';
import { MOCK_JOBS } from '@/constants/mock-jobs';

let MOCK_PROFILE: CandidateProfile = {
  id: 'cand-1',
  fullName: 'Alex Vance',
  headline: 'Senior Mobile Engineer & Systems Architect',
  summary:
    'Mobile engineer with 6+ years shipping high-performance React Native & iOS architectures. Experienced in offline sync, native modules, and micro-frontend design systems.',
  location: 'San Francisco, CA',
  skills: [
    'React Native',
    'TypeScript',
    'Expo',
    'iOS / Swift',
    'State Architecture',
    'GraphQL',
    'CI/CD Pipelines',
    'System Design',
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Veloce Labs',
      role: 'Lead Mobile Engineer',
      period: '2023 - Present',
      highlights: [
        'Architected React Native core migration yielding 40% reduction in cold launch time',
        'Built cross-platform design token system adopted across iOS and Android apps',
      ],
    },
    {
      id: 'exp-2',
      company: 'Pulse Digital',
      role: 'Senior React Native Developer',
      period: '2021 - 2023',
      highlights: [
        'Maintained 99.9% crash-free session rate across 500k monthly active users',
        'Implemented biometrics and offline SQLite storage layer',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      year: '2020',
    },
  ],
  updatedAt: Date.now(),
};

export const cvService = {
  /**
   * Fetch candidate master profile from gateway
   */
  getProfile: async (): Promise<ApiResponse<CandidateProfile>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      return { success: true, status: 200, data: { ...MOCK_PROFILE } };
    }

    return apiClient.get<CandidateProfile>('/api/v1/cv/profile');
  },

  /**
   * Update candidate master profile
   */
  updateProfile: async (dto: UpdateProfileDto): Promise<ApiResponse<CandidateProfile>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 60));
      MOCK_PROFILE = {
        ...MOCK_PROFILE,
        ...dto,
        updatedAt: Date.now(),
      };
      return { success: true, status: 200, data: { ...MOCK_PROFILE } };
    }

    return apiClient.put<CandidateProfile, UpdateProfileDto>('/api/v1/cv/profile', dto);
  },

  /**
   * Calculate ATS Keyword Match & Gap analysis against target vacancy
   */
  calculateATS: async (dto: CalculateATSDto): Promise<ApiResponse<ATSMatchResult>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 80));
      const targetJob = MOCK_JOBS.find(j => j.id === dto.jobId);
      const targetTags = targetJob ? targetJob.tags : ['TypeScript', 'Mobile Architecture'];

      const candidateSkills = MOCK_PROFILE.skills.map(s => s.toLowerCase());
      const matched: string[] = [];
      const missing: string[] = [];

      targetTags.forEach(tag => {
        const lower = tag.toLowerCase();
        if (candidateSkills.some(s => s.includes(lower) || lower.includes(s))) {
          matched.push(tag);
        } else {
          missing.push(tag);
        }
      });

      const score = Math.round(
        ((matched.length + 2) / (targetTags.length + 2)) * 100
      );

      return {
        success: true,
        status: 200,
        data: {
          score: Math.min(100, Math.max(65, score)),
          matchedKeywords: matched.length > 0 ? matched : ['React Native', 'TypeScript'],
          missingKeywords: missing.length > 0 ? missing : ['Distributed Systems'],
          suggestions: [
            `Highlight production experience with ${targetJob?.company || 'target company'} core competencies.`,
            'Quantify performance metrics (e.g. bundle size reduction, FPS improvements).',
          ],
        },
      };
    }

    return apiClient.post<ATSMatchResult, CalculateATSDto>('/api/v1/cv/calculate-ats', dto);
  },
};
