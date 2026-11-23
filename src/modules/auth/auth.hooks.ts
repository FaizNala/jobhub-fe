import { useState, useEffect, useCallback } from 'react';
import { authService } from './auth.service';
import { AuthUser, LoginOAuthDto, SaveApiKeyDto } from './auth.types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async (): Promise<AuthUser | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.getSession();
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginOAuth = useCallback(async (dto: LoginOAuthDto): Promise<AuthUser | null> => {
    setIsLoading(true);
    try {
      const res = await authService.loginOAuth(dto);
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate via OAuth');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveApiKey = useCallback(async (dto: SaveApiKeyDto): Promise<AuthUser | null> => {
    setIsLoading(true);
    try {
      const res = await authService.saveApiKey(dto);
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to save API key');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    loginOAuth,
    saveApiKey,
    logout,
    refreshSession,
  };
}
