export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export type WorkModelType = 'Remote' | 'Hybrid' | 'On-Site';

export interface JobPreferences {
  targetRoles: string[];
  minCompensation: string;
  workModels: WorkModelType[];
  targetLocations: string[];
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  preferences?: JobPreferences;
  skills: string[];
  experiences: WorkExperience[];
  education: Education[];
  updatedAt: number;
}

export interface ATSMatchResult {
  score: number; // 0 - 100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export type UpdateProfileDto = Partial<Omit<CandidateProfile, 'id' | 'updatedAt'>>;

export interface CalculateATSDto {
  jobId: string;
  targetRequirements?: string[];
}
