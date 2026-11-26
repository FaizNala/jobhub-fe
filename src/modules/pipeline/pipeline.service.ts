import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import {
  PipelineItem,
  PipelineStage,
  GetPipelineQuery,
  CreatePipelineItemDto,
  UpdatePipelineStageDto,
  AddPipelineNoteDto,
} from './pipeline.types';
import { MOCK_JOBS } from '@/constants/mock-jobs';

// In-memory mock store for frontend offline mode
let MOCK_PIPELINE_ITEMS: PipelineItem[] = [
  {
    id: 'pipe-1',
    job: MOCK_JOBS[0], // Uber Senior RN Engineer
    stage: 'interviewing',
    appliedDate: 'Nov 18, 2026',
    nextInterviewDate: 'Nov 26 - Architecture Loop',
    notes: ['Prepared distributed cache system design', 'Reviewed Uber mobile app architecture'],
    atsScore: 94,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'pipe-2',
    job: MOCK_JOBS[1], // Amazon Solutions Architect
    stage: 'shortlisted',
    appliedDate: undefined,
    notes: ['Needs Leadership Principles alignment on CV'],
    atsScore: 88,
    updatedAt: Date.now() - 172800000,
  },
  {
    id: 'pipe-3',
    job: MOCK_JOBS[2], // Spotify Product Designer
    stage: 'scouted',
    appliedDate: undefined,
    notes: ['Scouted by AI Hunter based on profile match'],
    atsScore: 81,
    updatedAt: Date.now() - 3600000,
  },
];

export const pipelineService = {
  /**
   * Fetch all pipeline items from backend gateway
   */
  getAll: async (params?: GetPipelineQuery): Promise<ApiResponse<PipelineItem[]>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 60));
      let items = [...MOCK_PIPELINE_ITEMS];
      if (params?.stage && params.stage !== 'all') {
        items = items.filter(i => i.stage === params.stage);
      }
      return { success: true, status: 200, data: items };
    }

    return apiClient.get<PipelineItem[]>('/api/v1/pipeline', {
      params: { stage: params?.stage },
    });
  },

  /**
   * Fetch single pipeline item by ID
   */
  getById: async (id: string): Promise<ApiResponse<PipelineItem>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      const found = MOCK_PIPELINE_ITEMS.find(i => i.id === id);
      if (!found) throw { status: 404, message: `Pipeline item '${id}' not found` };
      return { success: true, status: 200, data: found };
    }

    return apiClient.get<PipelineItem>(`/api/v1/pipeline/${id}`);
  },

  /**
   * Add a job to application tracking pipeline
   */
  create: async (dto: CreatePipelineItemDto): Promise<ApiResponse<PipelineItem>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 60));
      const existing = MOCK_PIPELINE_ITEMS.find(i => i.job.id === dto.job.id);
      if (existing) {
        existing.stage = dto.stage || 'shortlisted';
        existing.updatedAt = Date.now();
        return { success: true, status: 200, data: existing };
      }

      const newItem: PipelineItem = {
        id: `pipe-${Date.now()}`,
        job: dto.job,
        stage: dto.stage || 'shortlisted',
        notes: dto.notes || [],
        atsScore: 85,
        updatedAt: Date.now(),
      };
      MOCK_PIPELINE_ITEMS.unshift(newItem);
      return { success: true, status: 201, data: newItem };
    }

    return apiClient.post<PipelineItem, CreatePipelineItemDto>('/api/v1/pipeline', dto);
  },

  /**
   * Update the stage of an application in Kanban
   */
  updateStage: async (id: string, stage: PipelineStage): Promise<ApiResponse<PipelineItem>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 50));
      const idx = MOCK_PIPELINE_ITEMS.findIndex(i => i.id === id);
      if (idx === -1) throw { status: 404, message: `Pipeline item '${id}' not found` };

      const current = MOCK_PIPELINE_ITEMS[idx];
      const nextAppliedDate =
        stage === 'applied' && !current.appliedDate
          ? new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : current.appliedDate;

      const updated: PipelineItem = {
        ...current,
        stage,
        appliedDate: nextAppliedDate,
        updatedAt: Date.now(),
      };
      MOCK_PIPELINE_ITEMS[idx] = updated;
      return { success: true, status: 200, data: updated };
    }

    return apiClient.put<PipelineItem, UpdatePipelineStageDto>(`/api/v1/pipeline/${id}/stage`, { stage });
  },

  /**
   * Append candidate notes to an active application
   */
  addNote: async (id: string, note: string): Promise<ApiResponse<PipelineItem>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 30));
      const idx = MOCK_PIPELINE_ITEMS.findIndex(i => i.id === id);
      if (idx === -1) throw { status: 404, message: `Pipeline item '${id}' not found` };

      const current = MOCK_PIPELINE_ITEMS[idx];
      const updated: PipelineItem = {
        ...current,
        notes: [...current.notes, note],
        updatedAt: Date.now(),
      };
      MOCK_PIPELINE_ITEMS[idx] = updated;
      return { success: true, status: 200, data: updated };
    }

    return apiClient.post<PipelineItem, AddPipelineNoteDto>(`/api/v1/pipeline/${id}/notes`, { note });
  },

  /**
   * Delete application record from pipeline
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 30));
      MOCK_PIPELINE_ITEMS = MOCK_PIPELINE_ITEMS.filter(i => i.id !== id);
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.delete<void>(`/api/v1/pipeline/${id}`);
  },
};
