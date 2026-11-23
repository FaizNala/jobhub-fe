import { Job } from '@/modules/jobs/jobs.types';

export type PipelineStage =
  | 'scouted'
  | 'shortlisted'
  | 'applied'
  | 'interviewing'
  | 'offered'
  | 'rejected';

export interface PipelineItem {
  id: string;
  job: Job;
  stage: PipelineStage;
  appliedDate?: string;
  nextInterviewDate?: string;
  notes: string[];
  atsScore?: number; // 0 - 100
  updatedAt: number;
}

export interface PipelineStageConfig {
  id: PipelineStage;
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: 'scouted',
    label: 'Scouted by AI',
    shortLabel: 'Scouted',
    badgeBg: '#E8ECDF',
    badgeText: '#121212',
    description: 'Found via autonomous Hunter agent scraping and API feeds.',
  },
  {
    id: 'shortlisted',
    label: 'Bookmarked / Shortlist',
    shortLabel: 'Shortlist',
    badgeBg: '#B8F23E',
    badgeText: '#121212',
    description: 'Saved for ATS resume tailoring and application submission.',
  },
  {
    id: 'applied',
    label: 'Application Submitted',
    shortLabel: 'Applied',
    badgeBg: '#121212',
    badgeText: '#FFFFFF',
    description: 'Application delivered via Greenhouse, Lever, or safe web connector.',
  },
  {
    id: 'interviewing',
    label: 'Interview In Progress',
    shortLabel: 'Interview',
    badgeBg: '#B8F23E',
    badgeText: '#121212',
    description: 'Active screening, technical system design, or behavioral loop.',
  },
  {
    id: 'offered',
    label: 'Formal Offer Received',
    shortLabel: 'Offer',
    badgeBg: '#B8F23E',
    badgeText: '#121212',
    description: 'Compensation negotiation and background check review.',
  },
];

// Pipeline Gateway DTOs
export interface GetPipelineQuery {
  stage?: PipelineStage | 'all';
}

export interface CreatePipelineItemDto {
  job: Job;
  stage?: PipelineStage;
  notes?: string[];
}

export interface UpdatePipelineStageDto {
  stage: PipelineStage;
}

export interface AddPipelineNoteDto {
  note: string;
}
