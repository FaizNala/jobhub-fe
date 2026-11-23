import { apiClient } from '@/services/api/api-client';
import { ApiResponse } from '@/services/api/api.types';
import { AuthUser, LoginOAuthDto, SaveApiKeyDto } from './auth.types';

let MOCK_USER: AuthUser = {
  id: 'usr-1',
  email: 'alex.vance@example.com',
  name: 'Alex Vance',
  linkedProviders: ['google', 'linkedin'],
  apiKeys: {
    openai: 'sk-proj-••••••••••••••••',
    openrouter: 'sk-or-••••••••••••••••',
  },
};

export const authService = {
  /**
   * Get active authenticated user session from gateway
   */
  getSession: async (): Promise<ApiResponse<AuthUser | null>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 40));
      return { success: true, status: 200, data: { ...MOCK_USER } };
    }

    return apiClient.get<AuthUser | null>('/api/v1/auth/session');
  },

  /**
   * Connect or authenticate via OAuth provider
   */
  loginOAuth: async (dto: LoginOAuthDto): Promise<ApiResponse<AuthUser>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 80));
      if (!MOCK_USER.linkedProviders.includes(dto.provider)) {
        MOCK_USER.linkedProviders.push(dto.provider);
      }
      return { success: true, status: 200, data: { ...MOCK_USER } };
    }

    return apiClient.post<AuthUser, LoginOAuthDto>('/api/v1/auth/oauth', dto);
  },

  /**
   * Save user LLM API Key (OpenAI, Anthropic, OpenRouter)
   */
  saveApiKey: async (dto: SaveApiKeyDto): Promise<ApiResponse<AuthUser>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 50));
      MOCK_USER.apiKeys[dto.provider] = dto.apiKey;
      return { success: true, status: 200, data: { ...MOCK_USER } };
    }

    return apiClient.post<AuthUser, SaveApiKeyDto>('/api/v1/auth/api-keys', dto);
  },

  /**
   * Terminate active session
   */
  logout: async (): Promise<ApiResponse<void>> => {
    if (apiClient.getMockMode()) {
      await new Promise(r => setTimeout(r, 30));
      apiClient.setAuthToken(null);
      return { success: true, status: 200, data: undefined };
    }

    return apiClient.post<void>('/api/v1/auth/logout');
  },
};
