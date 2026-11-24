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
  contact: {
    email: 'alex.vance@example.com',
    phone: '+1 (415) 890-2134',
    location: 'San Francisco, CA',
    portfolio: 'https://alexvance.dev',
    github: 'github.com/alexvance',
    linkedin: 'linkedin.com/in/alexvance',
  },
  preferences: {
    targetRoles: ['Senior React Native Engineer', 'Mobile Solutions Architect'],
    minCompensation: '$150k - $210k / year',
    workModels: ['Remote', 'Hybrid'],
    targetLocations: ['San Francisco, CA', 'Remote (US)'],
  },
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
  hardSkills: [
    'React Native & Expo SDK',
    'TypeScript & JavaScript (ESNext)',
    'Swift & Objective-C',
    'Kotlin & Android NDK',
    'GraphQL & RESTful APIs',
    'Zustand / Redux Toolkit',
    'SQLite / WatermelonDB Offline Sync',
    'Fastlane & GitHub Actions CI/CD',
    'Performance Profiling (Systrace/Flipper)',
  ],
  softSkills: [
    'Technical System Design & Architecture RFCs',
    'Cross-Functional Squad Leadership',
    'Mentorship & Code Quality Advocacy',
    'Sprint Scope Negotiation',
    'Asynchronous Engineering Communication',
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Veloce Labs',
      role: 'Lead Mobile Engineer',
      period: '2023 - Present',
      location: 'San Francisco, CA',
      highlights: [
        'Architected React Native core migration yielding 40% reduction in cold launch time across 1.2M devices',
        'Built cross-platform design token system adopted across iOS and Android apps, reducing ticket churn by 25%',
        'Mentored 5 junior engineers and established zero-regression automated integration test suite',
      ],
    },
    {
      id: 'exp-2',
      company: 'Pulse Digital',
      role: 'Senior React Native Developer',
      period: '2021 - 2023',
      location: 'New York, NY (Remote)',
      highlights: [
        'Maintained 99.9% crash-free session rate across 500k monthly active users',
        'Implemented biometrics and offline SQLite storage layer, cutting network data consumption by 35%',
        'Integrated modular Apple Pay and Google Pay checkout flows boosting conversion by 18%',
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenFlow Mobile Engine',
      role: 'Creator & Maintainer',
      period: '2023 - Present',
      techStack: ['React Native', 'TypeScript', 'C++ TurboModules'],
      overview: 'Open-source high-throughput offline data streaming engine for hybrid client apps.',
      highlights: [
        'Achieved 12,000+ GitHub stars and adoption by 3 YC-backed production apps',
        'Reduced device battery overhead during continuous background sync by 32%',
      ],
      url: 'https://github.com/alexvance/openflow-engine',
    },
    {
      id: 'proj-2',
      name: 'PulseDesign Token Compiler',
      role: 'Lead Architect',
      period: '2022 - 2023',
      techStack: ['Figma Tokens', 'React Native', 'Style Dictionary'],
      overview: 'Enterprise design system token compiler syncing Figma variables to cross-platform codebases.',
      highlights: [
        'Decreased UI implementation cycle time from 14 days to 4 days across engineering squads',
        'Supported WCAG AAA automated contrast validation out of the box',
      ],
      url: 'https://pulsedesign.dev',
    },
  ],
  organizations: [
    {
      id: 'org-1',
      organization: 'Bay Area Mobile Developers Community',
      role: 'Co-Organizer & Technical Speaker',
      period: '2022 - Present',
      description: 'Organize quarterly architecture meetups with 400+ active mobile engineers.',
      highlights: [
        'Hosted 6 technical panel sessions on React Native Architecture and Native Interop',
      ],
    },
    {
      id: 'org-2',
      organization: 'UC Berkeley Open Source Guild',
      role: 'Student Mentor',
      period: '2019 - 2020',
      description: 'Mentored 30+ undergraduates contributing to mainstream open source repositories.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science (B.S.)',
      field: 'Computer Science & Software Systems',
      year: '2016 - 2020',
      gpa: '3.85 / 4.0',
      highlights: [
        'Dean’s Honor List (Top 5% of class) across all 8 academic semesters',
        'Senior Capstone: High-throughput distributed RPC engine in Rust and TypeScript',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2024',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'Meta Certified React Native Specialist',
      issuer: 'Meta / Coursera',
      issueDate: '2022',
    },
  ],
  updatedAt: Date.now(),
};

export function calculateCvHealth(profile: CandidateProfile): import('./cv.types').CvHealthMetrics {
  let score = 0;
  const auditItems: import('./cv.types').CvAuditItem[] = [];

  // 1. Identity & Contact (15 pts)
  if (profile.fullName && profile.headline && profile.contact?.email) {
    score += 15;
    auditItems.push({
      type: 'strength',
      section: 'Contact Info',
      message: 'Verified email and primary contact channels are complete.',
    });
  } else {
    auditItems.push({
      type: 'warning',
      section: 'Contact Info',
      message: 'Missing direct phone or verified contact channels.',
      suggestion: 'Add telephone and GitHub/LinkedIn links for quick recruiter reachout.',
    });
  }

  // 2. Professional Summary (15 pts)
  if (profile.summary && profile.summary.length >= 100) {
    score += 15;
    auditItems.push({
      type: 'strength',
      section: 'Summary',
      message: 'Concise executive pitch meets the 3–4 sentence standard.',
    });
  } else {
    score += 5;
    auditItems.push({
      type: 'warning',
      section: 'Summary',
      message: 'Executive summary is short or lacks technical scope.',
      suggestion: 'Expand to 350–500 characters highlighting core architecture domains.',
    });
  }

  // 3. Work Experience with metrics (25 pts)
  if (profile.experiences && profile.experiences.length >= 2) {
    const hasQuantified = profile.experiences.some(e =>
      e.highlights.some(h => /%|\$|\d+k|\d+M/i.test(h))
    );
    if (hasQuantified) {
      score += 25;
      auditItems.push({
        type: 'strength',
        section: 'Experience',
        message: 'Bullet points use measurable Google XYZ outcomes (% and metrics).',
      });
    } else {
      score += 15;
      auditItems.push({
        type: 'tip',
        section: 'Experience',
        message: 'Bullet points lack numbers or quantified business metrics.',
        suggestion: 'Use Hunter XYZ rewrite to add percentages, speeds, or user counts.',
      });
    }
  } else if (profile.experiences?.length === 1) {
    score += 10;
  }

  // 4. Projects (10 pts)
  if (profile.projects && profile.projects.length >= 1) {
    score += 10;
    auditItems.push({
      type: 'strength',
      section: 'Projects',
      message: `${profile.projects.length} architectural open-source/production projects documented.`,
    });
  } else {
    auditItems.push({
      type: 'tip',
      section: 'Projects',
      message: 'No portfolio or side projects listed.',
      suggestion: 'Add 1–2 technical projects to demonstrate autonomous initiative.',
    });
  }

  // 5. Organizational Experience (5 pts)
  if (profile.organizations && profile.organizations.length >= 1) {
    score += 5;
    auditItems.push({
      type: 'strength',
      section: 'Leadership & Community',
      message: 'Community involvement and mentoring experience documented.',
    });
  }

  // 6. Hard & Soft Skills (15 pts)
  const hardCount = profile.hardSkills?.length || 0;
  const softCount = profile.softSkills?.length || 0;
  if (hardCount >= 5 && softCount >= 2) {
    score += 15;
    auditItems.push({
      type: 'strength',
      section: 'Skills Inventory',
      message: `Balanced inventory: ${hardCount} hard tech competencies + ${softCount} leadership skills.`,
    });
  } else {
    score += 8;
    auditItems.push({
      type: 'tip',
      section: 'Skills Inventory',
      message: 'Skill inventory is heavily one-sided.',
      suggestion: 'Ensure both technical tools and leadership soft skills are represented.',
    });
  }

  // 7. Education (10 pts)
  if (profile.education && profile.education.length >= 1) {
    score += 10;
    auditItems.push({
      type: 'strength',
      section: 'Education',
      message: 'Formal degree credentials verified.',
    });
  }

  // 8. Certifications (5 pts)
  if (profile.certifications && profile.certifications.length >= 1) {
    score += 5;
    auditItems.push({
      type: 'strength',
      section: 'Certifications',
      message: 'Industry certifications add verified third-party credibility.',
    });
  }

  // Determine level
  let level: import('./cv.types').CvHealthMetrics['level'] = 'Needs Polish';
  if (score >= 90) level = 'Executive Ready';
  else if (score >= 75) level = 'Strong';
  else if (score >= 60) level = 'Good';

  // Count completed sections out of 8
  let completed = 0;
  if (profile.contact?.email) completed++;
  if (profile.summary) completed++;
  if (profile.experiences?.length) completed++;
  if (profile.projects?.length) completed++;
  if (profile.organizations?.length) completed++;
  if (profile.hardSkills?.length && profile.softSkills?.length) completed++;
  if (profile.education?.length) completed++;
  if (profile.certifications?.length) completed++;

  return {
    score,
    level,
    completedSections: completed,
    totalSections: 8,
    auditItems,
  };
}

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

