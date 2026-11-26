import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import {
  HunterMessage,
  HunterSession,
  SendPromptDto,
  CreateSessionDto,
} from './hunter.types';
import { MOCK_JOBS } from '@/constants/mock-jobs';

function createWelcomeMessage(): HunterMessage {
  return {
    id: 'msg-welcome',
    role: 'agent',
    content:
      'Specify your target role, compensation benchmark, or target companies to scout verified opportunities across curated boards and ATS feeds.',
    timestamp: Date.now() - 3600000,
    suggestedPrompts: [
      'Find Remote Senior Engineer roles paying >$150k',
      'Look for Hybrid UX/UI Design Lead jobs',
      'Search Finance & Strategy Manager openings',
    ],
  };
}

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
    title: 'Solutions Architect (Tier-1)',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 86400000,
    lastSnippet: 'Scouted 1 leadership opening at Amazon.',
    jobsFoundCount: 1,
  },
];

let MOCK_SESSION_MESSAGES: Record<string, HunterMessage[]> = {
  'sess-1': [
    createWelcomeMessage(),
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
        'I scanned curated ATS boards and verified employer feeds. Found 2 matching roles for your criteria.',
      timestamp: Date.now() - 3400000,
      steps: [
        {
          id: 'step-1',
          label: 'Connected to Greenhouse and Lever ATS feeds',
          status: 'completed',
          timestamp: Date.now() - 3480000,
        },
        {
          id: 'step-2',
          label: 'Extracted listings matching role & keyword criteria',
          status: 'completed',
          timestamp: Date.now() - 3450000,
        },
        {
          id: 'step-3',
          label: 'Verified compensation and workplace arrangement',
          status: 'completed',
          timestamp: Date.now() - 3400000,
        },
      ],
      jobs: MOCK_JOBS.slice(0, 2),
      suggestedPrompts: [
        'Compare Uber compensation with market benchmarks',
        'Search more Hybrid roles like Senior React Native Engineer',
      ],
    },
  ],
  'sess-2': [
    createWelcomeMessage(),
    {
      id: 'msg-s2-1',
      role: 'user',
      content: 'Search Staff Solutions Architect positions at Tier-1 companies',
      timestamp: Date.now() - 86000000,
    },
    {
      id: 'msg-s2-2',
      role: 'agent',
      content: 'Found 1 verified Solutions Architect role at Amazon.',
      timestamp: Date.now() - 85900000,
      steps: [
        {
          id: 's2-step-1',
          label: 'Scanned tier-1 employer boards and ATS feeds',
          status: 'completed',
          timestamp: Date.now() - 85950000,
        },
        {
          id: 's2-step-2',
          label: 'Validated leadership & scope criteria',
          status: 'completed',
          timestamp: Date.now() - 85900000,
        },
      ],
      jobs: MOCK_JOBS[1] ? [MOCK_JOBS[1]] : MOCK_JOBS.slice(0, 1),
      suggestedPrompts: ['Compare salary against Bay Area market average'],
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
      return { success: true, status: 200, data: MOCK_SESSIONS.map(s => ({ ...s })) };
    }

    return apiClient.get<HunterSession[]>('/api/v1/hunter/sessions');
  },

  /**
   * Fetch messages for a specific hunting session
   */
  getSessionMessages: async (sessionId: string): Promise<ApiResponse<HunterMessage[]>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      const msgs = MOCK_SESSION_MESSAGES[sessionId] || [createWelcomeMessage()];
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
      MOCK_SESSION_MESSAGES[newSession.id] = [createWelcomeMessage()];
      return { success: true, status: 201, data: { ...newSession } };
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
      await new Promise(r => setTimeout(r, 650));

      const targetSessionId = dto.sessionId || MOCK_SESSIONS[0]?.id || 'sess-1';
      const trimmedPrompt = (dto.prompt || '').trim();
      const promptLower = trimmedPrompt.toLowerCase();

      let matchedJobs = MOCK_JOBS.slice(0, 2);
      if (
        (promptLower.includes('design') ||
          promptLower.includes('product') ||
          promptLower.includes('ux') ||
          promptLower.includes('ui')) &&
        MOCK_JOBS[2]
      ) {
        matchedJobs = [MOCK_JOBS[2]];
      } else if (
        (promptLower.includes('finance') ||
          promptLower.includes('strategy') ||
          promptLower.includes('operations')) &&
        MOCK_JOBS[3]
      ) {
        matchedJobs = [MOCK_JOBS[3]];
      } else if (
        (promptLower.includes('architect') || promptLower.includes('staff')) &&
        MOCK_JOBS[1]
      ) {
        matchedJobs = [MOCK_JOBS[1]];
      } else if ((promptLower.includes('uber') || promptLower.includes('senior')) && MOCK_JOBS[0]) {
        matchedJobs = [MOCK_JOBS[0]];
      }

      const now = Date.now();
      const primaryJob = matchedJobs[0];
      const followUpPrompts = primaryJob
        ? [
            `Compare ${primaryJob.company} offer package with market data`,
            `Search more ${primaryJob.workplaceType} roles like ${primaryJob.title}`,
          ]
        : ['Scout Remote Product Lead openings', 'Audit CV for leadership roles'];

      const userEntry: HunterMessage = {
        id: `msg-user-${now}`,
        role: 'user',
        content: trimmedPrompt,
        timestamp: now - 1,
      };

      const agentReply: HunterMessage = {
        id: `msg-${now}`,
        role: 'agent',
        content: `I scanned curated ATS boards and employer feeds. Found ${matchedJobs.length} ${matchedJobs.length === 1 ? 'role' : 'roles'} matching your criteria.`,
        timestamp: now,
        steps: [
          {
            id: `step-1-${now}`,
            label: 'Connected to curated ATS boards and public feeds',
            status: 'completed',
            timestamp: now - 450,
          },
          {
            id: `step-2-${now}`,
            label: 'Extracted listings matching role & keyword specifications',
            status: 'completed',
            timestamp: now - 220,
          },
          {
            id: `step-3-${now}`,
            label: 'Verified compensation range and workplace arrangement',
            status: 'completed',
            timestamp: now,
          },
        ],
        jobs: matchedJobs,
        suggestedPrompts: followUpPrompts,
      };

      if (!MOCK_SESSION_MESSAGES[targetSessionId]) {
        MOCK_SESSION_MESSAGES[targetSessionId] = [createWelcomeMessage()];
      }
      if (trimmedPrompt) {
        MOCK_SESSION_MESSAGES[targetSessionId].push(userEntry);
      }
      MOCK_SESSION_MESSAGES[targetSessionId].push(agentReply);

      const targetSession = MOCK_SESSIONS.find(s => s.id === targetSessionId);
      if (targetSession) {
        targetSession.updatedAt = now;
        targetSession.lastSnippet = `Found ${matchedJobs.length} verified ${matchedJobs.length === 1 ? 'role' : 'roles'}.`;
        targetSession.jobsFoundCount = (targetSession.jobsFoundCount || 0) + matchedJobs.length;
        if (targetSession.title === 'New Hunt Session' && trimmedPrompt) {
          targetSession.title = trimmedPrompt.slice(0, 32);
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
      MOCK_SESSION_MESSAGES[target] = [createWelcomeMessage()];
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.delete<void>('/api/v1/hunter/history');
  },
};
