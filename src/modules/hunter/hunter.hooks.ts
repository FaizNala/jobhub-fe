import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hunterService } from './hunter.service';
import { HunterMessage, HunterSession } from './hunter.types';

export function useHunterChat() {
  const [sessions, setSessions] = useState<HunterSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-1');
  const [messages, setMessages] = useState<HunterMessage[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isHunting, setIsHunting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const activeSessionIdRef = useRef(activeSessionId);
  activeSessionIdRef.current = activeSessionId;

  const latestMessageReqRef = useRef(0);

  const refreshSessions = useCallback(async (preferredId?: string): Promise<HunterSession[]> => {
    try {
      const res = await hunterService.getSessions();
      setSessions(res.data);
      const currentTarget = preferredId || activeSessionIdRef.current;
      if (res.data.length > 0 && !res.data.some(s => s.id === currentTarget)) {
        const fallbackId = res.data[0].id;
        activeSessionIdRef.current = fallbackId;
        setActiveSessionId(fallbackId);
      }
      return res.data;
    } catch (err: any) {
      setError(err?.message || 'Unable to load conversation sessions.');
      return [];
    }
  }, []);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    const reqId = ++latestMessageReqRef.current;
    setIsLoadingMessages(true);
    try {
      const res = await hunterService.getSessionMessages(sessionId);
      if (reqId === latestMessageReqRef.current) {
        setMessages(res.data);
      }
    } catch (err: any) {
      if (reqId === latestMessageReqRef.current) {
        setError(err?.message || 'Unable to load conversation messages.');
      }
    } finally {
      if (reqId === latestMessageReqRef.current) {
        setIsLoadingMessages(false);
      }
    }
  }, []);

  const switchSession = useCallback(
    async (sessionId: string) => {
      activeSessionIdRef.current = sessionId;
      setActiveSessionId(sessionId);
      setError(null);
      setLastFailedPrompt(null);
      await loadSessionMessages(sessionId);
    },
    [loadSessionMessages]
  );

  const createNewSession = useCallback(
    async (title?: string): Promise<HunterSession | null> => {
      setError(null);
      setLastFailedPrompt(null);
      try {
        const res = await hunterService.createSession({ title });
        await refreshSessions(res.data.id);
        await switchSession(res.data.id);
        return res.data;
      } catch (err: any) {
        setError(err?.message || 'Unable to create a new conversation.');
        return null;
      }
    },
    [refreshSessions, switchSession]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      setError(null);
      try {
        await hunterService.deleteSession(sessionId);
        const updated = await refreshSessions();
        if (updated.length === 0) {
          await createNewSession('New Hunt');
          return;
        }
        if (activeSessionIdRef.current === sessionId) {
          await switchSession(updated[0].id);
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to delete conversation.');
      }
    },
    [createNewSession, refreshSessions, switchSession]
  );

  const sendMessage = useCallback(
    async (promptText: string): Promise<boolean> => {
      const trimmed = promptText.trim();
      if (!trimmed || isHunting) return false;

      const userMsg: HunterMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const targetSessionId = activeSessionIdRef.current;
      setMessages(prev => [...prev, userMsg]);
      setIsHunting(true);
      setError(null);
      setLastFailedPrompt(null);

      try {
        const res = await hunterService.sendPrompt({
          prompt: trimmed,
          sessionId: targetSessionId,
        });
        if (activeSessionIdRef.current === targetSessionId) {
          setMessages(prev => [...prev, res.data]);
        }
        await refreshSessions(targetSessionId);
        return true;
      } catch (err: any) {
        if (activeSessionIdRef.current === targetSessionId) {
          setMessages(prev => prev.filter(m => m.id !== userMsg.id));
        }
        setLastFailedPrompt(trimmed);
        setError(err?.message || 'Unable to reach Hunter Agent. Please retry.');
        return false;
      } finally {
        setIsHunting(false);
      }
    },
    [isHunting, refreshSessions]
  );

  const retryLastPrompt = useCallback(async (): Promise<boolean> => {
    if (!lastFailedPrompt) {
      setError(null);
      const list = await refreshSessions();
      const targetId = activeSessionIdRef.current || list[0]?.id;
      if (targetId) {
        await loadSessionMessages(targetId);
      }
      return true;
    }
    return sendMessage(lastFailedPrompt);
  }, [lastFailedPrompt, loadSessionMessages, refreshSessions, sendMessage]);

  const clearError = useCallback(() => {
    setError(null);
    setLastFailedPrompt(null);
  }, []);

  const clearChat = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      const targetId = activeSessionIdRef.current;
      await hunterService.clearHistory(targetId);
      await loadSessionMessages(targetId);
    } catch (err: any) {
      setError(err?.message || 'Unable to reset conversation.');
    }
  }, [loadSessionMessages]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setIsInitialLoading(true);
      try {
        const sessionList = await refreshSessions();
        if (!mounted) return;
        const initialId = sessionList[0]?.id || 'sess-1';
        activeSessionIdRef.current = initialId;
        setActiveSessionId(initialId);
        await loadSessionMessages(initialId);
      } finally {
        if (mounted) {
          setIsInitialLoading(false);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [loadSessionMessages, refreshSessions]);

  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  const latestSuggestedPrompts = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].suggestedPrompts && messages[i].suggestedPrompts!.length > 0) {
        return messages[i].suggestedPrompts!;
      }
    }
    return [];
  }, [messages]);

  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    isInitialLoading,
    isLoadingMessages,
    isHunting,
    error,
    lastFailedPrompt,
    suggestedPrompts: latestSuggestedPrompts,
    sendMessage,
    retryLastPrompt,
    clearError,
    clearChat,
    switchSession,
    createNewSession,
    deleteSession,
    refreshSessions,
  };
}
