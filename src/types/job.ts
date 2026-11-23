export type JobCategory = 'all' | 'remote' | 'tech' | 'design' | 'finance';

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
  workplaceType: 'Remote' | 'Hybrid' | 'On-Site';
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  salary: string;
  category: JobCategory;
  tags: string[];
  cardVariant: 'default' | 'uber' | 'amazon' | 'spotify' | 'google';
  brandColor?: string;
  interviewStages: InterviewStage[];
}
