import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import { Job, GetJobsQuery, CreateJobDto, UpdateJobDto } from './jobs.types';
import { MOCK_JOBS } from '@/constants/mock-jobs';

export const jobsService = {
  /**
   * Fetch all jobs from backend gateway with optional category/search filters
   */
  getAll: async (params?: GetJobsQuery): Promise<ApiResponse<Job[]>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 60));
      let result = [...MOCK_JOBS];

      if (params?.category && params.category !== 'all') {
        if (params.category === 'remote') {
          result = result.filter(j => j.workplaceType === 'Remote');
        } else {
          result = result.filter(j => j.category === params.category);
        }
      }

      if (params?.search) {
        const query = params.search.toLowerCase().trim();
        result = result.filter(
          j =>
            j.title.toLowerCase().includes(query) ||
            j.company.toLowerCase().includes(query) ||
            j.tags.some(t => t.toLowerCase().includes(query))
        );
      }

      return {
        success: true,
        status: 200,
        data: result,
      };
    }

    return apiClient.get<Job[]>('/api/v1/jobs', {
      params: {
        category: params?.category,
        search: params?.search,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
  },

  /**
   * Fetch single job detail by ID
   */
  getById: async (id: string): Promise<ApiResponse<Job>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      const found = MOCK_JOBS.find(j => j.id === id);
      if (!found) {
        throw { status: 404, message: `Job with ID '${id}' not found` };
      }
      return { success: true, status: 200, data: found };
    }

    return apiClient.get<Job>(`/api/v1/jobs/${id}`);
  },

  /**
   * Create a new job vacancy (e.g. from custom scraper connector)
   */
  create: async (dto: CreateJobDto): Promise<ApiResponse<Job>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 80));
      const newJob: Job = { ...dto, id: `job-${Date.now()}` };
      MOCK_JOBS.unshift(newJob);
      return { success: true, status: 201, data: newJob };
    }

    return apiClient.post<Job, CreateJobDto>('/api/v1/jobs', dto);
  },

  /**
   * Update existing job details
   */
  update: async (id: string, dto: UpdateJobDto): Promise<ApiResponse<Job>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 60));
      const index = MOCK_JOBS.findIndex(j => j.id === id);
      if (index === -1) throw { status: 404, message: `Job with ID '${id}' not found` };
      MOCK_JOBS[index] = { ...MOCK_JOBS[index], ...dto };
      return { success: true, status: 200, data: MOCK_JOBS[index] };
    }

    return apiClient.put<Job, UpdateJobDto>(`/api/v1/jobs/${id}`, dto);
  },

  /**
   * Delete a job vacancy
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      const index = MOCK_JOBS.findIndex(j => j.id === id);
      if (index !== -1) MOCK_JOBS.splice(index, 1);
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.delete<void>(`/api/v1/jobs/${id}`);
  },
};
