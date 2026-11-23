import { useState, useEffect, useCallback, useMemo } from 'react';
import { hunterService } from './hunter.service';
import { HunterMessage } from './hunter.types';

export function useHunterChat() {
  const [messages, setMessages] = useState<HunterMessage[]>([]);
  const [isHunting, setIsHunting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHistory = useCallback(async (): Promise<HunterMessage[]> => {
    try {
      const res = await hunterService.getHistory();
      setMessages(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to load conversation history');
      return [];
    }
  }, []);

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
      const res = await hunterService.sendPrompt({ prompt: promptText.trim() });
      setMessages(prev => [...prev, res.data]);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to communicate with Hunter agent');
      return null;
    } finally {
      setIsHunting(false);
    }
  }, []);

  const clearChat = useCallback(async (): Promise<void> => {
    try {
      await hunterService.clearHistory();
      await refreshHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to reset chat');
    }
  }, [refreshHistory]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const latestSuggestedPrompts = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].suggestedPrompts && messages[i].suggestedPrompts!.length > 0) {
        return messages[i].suggestedPrompts!;
      }
    }
    return [];
  }, [messages]);

  return {
    messages,
    isHunting,
    error,
    suggestedPrompts: latestSuggestedPrompts,
    sendMessage,
    clearChat,
    refreshHistory,
  };
}
