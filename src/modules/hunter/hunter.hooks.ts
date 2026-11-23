import { useState, useEffect, useCallback, useMemo } from 'react';
import { hunterService } from './hunter.service';
import { HunterMessage, HunterSession } from './hunter.types';

export function useHunterChat() {
  const [sessions, setSessions] = useState<HunterSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-1');
  const [messages, setMessages] = useState<HunterMessage[]>([]);
  const [isHunting, setIsHunting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load all sessions
  const refreshSessions = useCallback(async (): Promise<HunterSession[]> => {
    try {
      const res = await hunterService.getSessions();
      setSessions(res.data);
      if (res.data.length > 0 && !res.data.some(s => s.id === activeSessionId)) {
        setActiveSessionId(res.data[0].id);
      }
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions');
      return [];
    }
  }, [activeSessionId]);

  // Load messages for the active session
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await hunterService.getSessionMessages(sessionId);
      setMessages(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load messages');
    }
  }, []);

  // Switch session
  const switchSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    await loadSessionMessages(sessionId);
  }, [loadSessionMessages]);

  // Create new session thread
  const createNewSession = useCallback(async (title?: string): Promise<HunterSession | null> => {
    try {
      const res = await hunterService.createSession({ title });
      await refreshSessions();
      await switchSession(res.data.id);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
      return null;
    }
  }, [refreshSessions, switchSession]);

  // Delete session thread
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await hunterService.deleteSession(sessionId);
      const updated = await refreshSessions();
      if (activeSessionId === sessionId) {
        const nextId = updated[0]?.id || 'sess-1';
        await switchSession(nextId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete session');
    }
  }, [activeSessionId, refreshSessions, switchSession]);

  // Send message in current active session
  const sendMessage = useCallback(async (promptText: string): Promise<HunterMessage | null> => {
    if (!promptText.trim()) return null;

    const userMsg: HunterMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptText.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsHunting(true);
    setError(null);

    try {
      const res = await hunterService.sendPrompt({
        prompt: promptText.trim(),
        sessionId: activeSessionId,
      });
      setMessages(prev => [...prev, res.data]);
      await refreshSessions();
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to communicate with Hunter agent');
      return null;
    } finally {
      setIsHunting(false);
    }
  }, [activeSessionId, refreshSessions]);

  // Clear current chat
  const clearChat = useCallback(async (): Promise<void> => {
    try {
      await hunterService.clearHistory(activeSessionId);
      await loadSessionMessages(activeSessionId);
    } catch (err: any) {
      setError(err.message || 'Failed to reset chat');
    }
  }, [activeSessionId, loadSessionMessages]);

  // Initial load
  useEffect(() => {
    refreshSessions().then(sessionList => {
      const initialId = sessionList[0]?.id || 'sess-1';
      loadSessionMessages(initialId);
    });
  }, [refreshSessions, loadSessionMessages]);

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
    isHunting,
    error,
    suggestedPrompts: latestSuggestedPrompts,
    sendMessage,
    clearChat,
    switchSession,
    createNewSession,
    deleteSession,
    refreshSessions,
  };
}
