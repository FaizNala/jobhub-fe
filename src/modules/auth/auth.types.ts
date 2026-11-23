export type OAuthProvider = 'google' | 'linkedin' | 'github';

export interface ApiKeysConfig {
  openai?: string;
  anthropic?: string;
  openrouter?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  linkedProviders: OAuthProvider[];
  apiKeys: ApiKeysConfig;
}

export interface LoginOAuthDto {
  provider: OAuthProvider;
  code?: string;
}

export interface SaveApiKeyDto {
  provider: keyof ApiKeysConfig;
  apiKey: string;
}
