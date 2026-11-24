export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  period: string;
  techStack: string[];
  description?: string;
  overview?: string;
  highlights: string[];
  url?: string;
}

export interface OrganizationItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  description: string;
  highlights?: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field?: string;
  year: string;
  gpa?: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
}

export interface CvAuditItem {
  type: 'strength' | 'warning' | 'tip';
  section: string;
  message: string;
  suggestion?: string;
}

export interface CvHealthMetrics {
  score: number; // 0 - 100
  level: 'Needs Polish' | 'Good' | 'Strong' | 'Executive Ready';
  completedSections: number;
  totalSections: number;
  auditItems: CvAuditItem[];
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
  contact?: ContactInfo;
  preferences?: JobPreferences;
  skills: string[]; // aggregate legacy
  hardSkills: string[];
  softSkills: string[];
  experiences: WorkExperience[];
  projects: ProjectItem[];
  organizations: OrganizationItem[];
  education: Education[];
  certifications: CertificationItem[];
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
