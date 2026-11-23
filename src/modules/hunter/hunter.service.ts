import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import {
  HunterMessage,
  HunterSession,
  SendPromptDto,
  CreateSessionDto,
} from './hunter.types';
import { MOCK_JOBS } from '@/constants/mock-jobs';

const DEFAULT_WELCOME_MESSAGE: HunterMessage = {
  id: 'msg-welcome',
  role: 'agent',
  content:
    'Specify your target role, compensation benchmark, or target companies to scout verified opportunities across public ATS connectors and curated feeds.',
  timestamp: Date.now() - 3600000,
  suggestedPrompts: [
    'Find Remote Senior React Native roles paying >$150k',
    'Search Staff Mobile Architect positions at Tier-1 companies',
    'Look for Hybrid UX/UI Design lead jobs in SF',
  ],
};

let MOCK_SESSIONS: HunterSession[] = [
  {
    id: 'sess-1',
    title: 'Senior React Native ($150k+)',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    lastSnippet: 'Found 2 verified roles from Greenhouse & Lever boards.',
    jobsFoundCount: 2,
  },
  {
    id: 'sess-2',
    title: 'Staff Solutions Architect',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 86400000,
    lastSnippet: 'Scouted 1 leadership opening at Amazon.',
    jobsFoundCount: 1,
  },
];

let MOCK_SESSION_MESSAGES: Record<string, HunterMessage[]> = {
  'sess-1': [
    DEFAULT_WELCOME_MESSAGE,
    {
      id: 'msg-s1-1',
      role: 'user',
      content: 'Find Remote Senior React Native roles paying >$150k',
      timestamp: Date.now() - 3500000,
    },
    {
      id: 'msg-s1-2',
      role: 'agent',
      content:
        'I scanned official Greenhouse & Lever boards alongside public feeds. Found 2 verified roles matching your criteria.',
      timestamp: Date.now() - 3400000,
      steps: [
        {
          id: 'step-1',
          label: 'Connected to Greenhouse and Lever public endpoints',
          status: 'completed',
          timestamp: Date.now() - 3480000,
        },
        {
          id: 'step-2',
          label: 'Extracted listings matching keyword specifications',
          status: 'completed',
          timestamp: Date.now() - 3450000,
        },
        {
          id: 'step-3',
          label: 'Verified compensation and remote eligibility',
          status: 'completed',
          timestamp: Date.now() - 3400000,
        },
      ],
      jobs: [MOCK_JOBS[0], MOCK_JOBS[1]],
      suggestedPrompts: [
        'Add Uber role to my Pipeline',
        'Optimize my CV for Amazon Solutions Architect',
      ],
    },
  ],
  'sess-2': [
    DEFAULT_WELCOME_MESSAGE,
    {
      id: 'msg-s2-1',
      role: 'user',
      content: 'Search Staff Mobile Architect positions at Tier-1 companies',
      timestamp: Date.now() - 86000000,
    },
    {
      id: 'msg-s2-2',
      role: 'agent',
      content: 'Found 1 verified Staff Architecture role at Amazon.',
      timestamp: Date.now() - 85900000,
      steps: [
        {
          id: 's2-step-1',
          label: 'Scraped tier-1 job listings via public connectors',
          status: 'completed',
          timestamp: Date.now() - 85950000,
        },
        {
          id: 's2-step-2',
          label: 'Validated staff-level engineering leadership criteria',
          status: 'completed',
          timestamp: Date.now() - 85900000,
        },
      ],
      jobs: [MOCK_JOBS[1]],
      suggestedPrompts: ['Compare salary against Bay Area average'],
    },
  ],
};

export const hunterService = {
  /**
   * Fetch all hunting conversation sessions
   */
  getSessions: async (): Promise<ApiResponse<HunterSession[]>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      return { success: true, status: 200, data: [...MOCK_SESSIONS] };
    }

    return apiClient.get<HunterSession[]>('/api/v1/hunter/sessions');
  },

  /**
   * Fetch messages for a specific hunting session
   */
  getSessionMessages: async (sessionId: string): Promise<ApiResponse<HunterMessage[]>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      const msgs = MOCK_SESSION_MESSAGES[sessionId] || [DEFAULT_WELCOME_MESSAGE];
      return { success: true, status: 200, data: [...msgs] };
    }

    return apiClient.get<HunterMessage[]>(`/api/v1/hunter/sessions/${sessionId}/messages`);
  },

  /**
   * Create a new hunting session thread
   */
  createSession: async (dto?: CreateSessionDto): Promise<ApiResponse<HunterSession>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      const newSession: HunterSession = {
        id: `sess-${Date.now()}`,
        title: dto?.title || 'New Hunt Session',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastSnippet: 'Session started.',
        jobsFoundCount: 0,
      };

      MOCK_SESSIONS.unshift(newSession);
      MOCK_SESSION_MESSAGES[newSession.id] = [DEFAULT_WELCOME_MESSAGE];
      return { success: true, status: 201, data: newSession };
    }

    return apiClient.post<HunterSession, CreateSessionDto>('/api/v1/hunter/sessions', dto);
  },

  /**
   * Delete a hunting session thread
   */
  deleteSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 30));
      MOCK_SESSIONS = MOCK_SESSIONS.filter(s => s.id !== sessionId);
      delete MOCK_SESSION_MESSAGES[sessionId];
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.delete<void>(`/api/v1/hunter/sessions/${sessionId}`);
  },

  /**
   * Send prompt to the Hunter Agent backend to execute discovery
   */
  sendPrompt: async (dto: SendPromptDto): Promise<ApiResponse<HunterMessage>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 700));

      const targetSessionId = dto.sessionId || MOCK_SESSIONS[0]?.id || 'sess-1';
      const promptLower = (dto.prompt || '').toLowerCase();
      let matchedJobs = MOCK_JOBS.slice(0, 2);

      if (promptLower.includes('design') || promptLower.includes('product') || promptLower.includes('ux') || promptLower.includes('ui')) {
        matchedJobs = [MOCK_JOBS[2]]; // Spotify Product Mobile Designer
      } else if (promptLower.includes('architect') || promptLower.includes('staff')) {
        matchedJobs = [MOCK_JOBS[1]]; // Amazon Solutions Architect
      } else if (promptLower.includes('uber') || promptLower.includes('senior')) {
        matchedJobs = [MOCK_JOBS[0]]; // Uber Senior RN Engineer
      }

      const agentReply: HunterMessage = {
        id: `msg-${Date.now()}`,
        role: 'agent',
        content: `I scanned official Greenhouse & Lever boards alongside public feeds. Found ${matchedJobs.length} verified roles matching your criteria.`,
        timestamp: Date.now(),
        steps: [
          {
            id: 'step-1',
            label: 'Connected to Greenhouse and Lever public endpoints',
            status: 'completed',
            timestamp: Date.now() - 500,
          },
          {
            id: 'step-2',
            label: 'Extracted listings matching keyword specifications',
            status: 'completed',
            timestamp: Date.now() - 250,
          },
          {
            id: 'step-3',
            label: 'Verified compensation and remote eligibility',
            status: 'completed',
            timestamp: Date.now(),
          },
        ],
        jobs: matchedJobs,
        suggestedPrompts: [
          'Add Uber role to my Pipeline',
          'Optimize my CV for Amazon Solutions Architect',
        ],
      };

      if (!MOCK_SESSION_MESSAGES[targetSessionId]) {
        MOCK_SESSION_MESSAGES[targetSessionId] = [DEFAULT_WELCOME_MESSAGE];
      }
      MOCK_SESSION_MESSAGES[targetSessionId].push(agentReply);

      // Update session snippet & counts
      const targetSession = MOCK_SESSIONS.find(s => s.id === targetSessionId);
      if (targetSession) {
        targetSession.updatedAt = Date.now();
        targetSession.lastSnippet = `Found ${matchedJobs.length} verified roles.`;
        targetSession.jobsFoundCount = (targetSession.jobsFoundCount || 0) + matchedJobs.length;
        if (targetSession.title === 'New Hunt Session' && dto.prompt) {
          targetSession.title = dto.prompt.slice(0, 32);
        }
      }

      return { success: true, status: 200, data: agentReply };
    }

    return apiClient.post<HunterMessage, SendPromptDto>('/api/v1/hunter/prompt', dto);
  },

  /**
   * Clear chat history in current session
   */
  clearHistory: async (sessionId?: string): Promise<ApiResponse<void>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 30));
      const target = sessionId || MOCK_SESSIONS[0]?.id || 'sess-1';
      MOCK_SESSION_MESSAGES[target] = [DEFAULT_WELCOME_MESSAGE];
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.delete<void>('/api/v1/hunter/history');
  },
};
