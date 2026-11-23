import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import { HunterMessage, SendPromptDto } from './hunter.types';
import { MOCK_JOBS } from '@/constants/mock-jobs';

const INITIAL_HUNTER_MESSAGES: HunterMessage[] = [
  {
    id: 'msg-welcome',
    role: 'agent',
    content:
      'I am your Autonomous Career Hunter. Tell me your target role, salary benchmark, or desired companies. I can scan public ATS connectors and curated job boards to scout matching opportunities.',
    timestamp: Date.now() - 3600000,
    suggestedPrompts: [
      'Find Remote Senior React Native roles paying >$150k',
      'Search Staff Mobile Architect positions at Tier-1 companies',
      'Look for Hybrid UX/UI Design lead jobs in SF',
    ],
  },
];

let MOCK_CHAT_HISTORY: HunterMessage[] = [...INITIAL_HUNTER_MESSAGES];

export const hunterService = {
  /**
   * Fetch conversation history from hunter agent gateway
   */
  getHistory: async (): Promise<ApiResponse<HunterMessage[]>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      return { success: true, status: 200, data: [...MOCK_CHAT_HISTORY] };
    }

    return apiClient.get<HunterMessage[]>('/api/v1/hunter/history');
  },

  /**
   * Send prompt to the Hunter Agent backend to execute discovery
   */
  sendPrompt: async (dto: SendPromptDto): Promise<ApiResponse<HunterMessage>> => {
    if (apiClient.getMockMode()) {
      // Simulate multi-source scraper delay and agent orchestration
      await new Promise(r => setTimeout(r, 800));

      const matchedJobs = MOCK_JOBS.slice(0, 2);

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
            timestamp: Date.now() - 600,
          },
          {
            id: 'step-2',
            label: 'Extracted listings matching keyword specifications',
            status: 'completed',
            timestamp: Date.now() - 300,
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

      MOCK_CHAT_HISTORY.push(agentReply);
      return { success: true, status: 200, data: agentReply };
    }

    return apiClient.post<HunterMessage, SendPromptDto>('/api/v1/hunter/prompt', dto);
  },

  /**
   * Clear chat history
   */
  clearHistory: async (): Promise<ApiResponse<void>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 30));
      MOCK_CHAT_HISTORY = [...INITIAL_HUNTER_MESSAGES];
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.delete<void>('/api/v1/hunter/history');
  },
};
