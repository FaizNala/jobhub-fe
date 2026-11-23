import { Job } from '@/modules/jobs/jobs.types';

export type HunterRole = 'user' | 'agent' | 'system';

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface HunterStatusStep {
  id: string;
  label: string;
  status: StepStatus;
  timestamp: number;
}

export interface HunterMessage {
  id: string;
  role: HunterRole;
  content: string;
  timestamp: number;
  steps?: HunterStatusStep[];
  jobs?: Job[];
  suggestedPrompts?: string[];
}

export interface HunterSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastSnippet?: string;
  jobsFoundCount: number;
}

export interface SendPromptDto {
  prompt: string;
  sessionId?: string;
  filters?: {
    location?: string;
    role?: string;
    workplaceType?: string;
  };
}

export interface CreateSessionDto {
  title?: string;
  initialPrompt?: string;
}
