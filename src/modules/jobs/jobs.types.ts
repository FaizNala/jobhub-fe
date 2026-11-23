export type JobCategory = 'all' | 'remote' | 'tech' | 'design' | 'finance';

export type WorkplaceType = 'Remote' | 'Hybrid' | 'On-Site';
export type EmploymentType = 'Full-time' | 'Contract' | 'Part-time';
export type JobCardVariant = 'default' | 'uber' | 'amazon' | 'spotify' | 'google';

export interface InterviewStage {
  stageNumber: number;
  title: string;
  description: string;
  duration?: string;
  colorVariant: 'purple' | 'coral' | 'yellow' | 'lime';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitial: string;
  location: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  salary: string;
  category: JobCategory;
  tags: string[];
  cardVariant: JobCardVariant;
  brandColor?: string;
  isFeatured?: boolean;
  interviewStages: InterviewStage[];
  description?: string;
  requirements?: string[];
  postedAt?: string;
}

// Request & Query DTOs
export interface GetJobsQuery {
  category?: JobCategory;
  search?: string;
  limit?: number;
  offset?: number;
}

export type CreateJobDto = Omit<Job, 'id'>;
export type UpdateJobDto = Partial<CreateJobDto>;
