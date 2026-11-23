import { useState, useEffect, useCallback, useMemo } from 'react';
import { pipelineService } from './pipeline.service';
import {
  PipelineItem,
  PipelineStage,
  GetPipelineQuery,
  CreatePipelineItemDto,
} from './pipeline.types';

export function usePipeline(initialStage: PipelineStage | 'all' = 'all') {
  const [items, setItems] = useState<PipelineItem[]>([]);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'all'>(initialStage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (params?: GetPipelineQuery): Promise<PipelineItem[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pipelineService.getAll(params);
      setItems(res.data);
      return res.data;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch pipeline from gateway';
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<PipelineItem | null> => {
    setIsLoading(true);
    try {
      const res = await pipelineService.getById(id);
      return res.data;
    } catch (err: any) {
      setError(err.message || `Failed to fetch pipeline item ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: CreatePipelineItemDto): Promise<PipelineItem> => {
    setIsLoading(true);
    try {
      const res = await pipelineService.create(dto);
      setItems(prev => {
        const idx = prev.findIndex(i => i.id === res.data.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = res.data;
          return updated;
        }
        return [res.data, ...prev];
      });
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to add item to pipeline');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStage = useCallback(async (id: string, stage: PipelineStage): Promise<PipelineItem> => {
    // Optimistic UI update
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, stage, updatedAt: Date.now() } : item))
    );

    try {
      const res = await pipelineService.updateStage(id, stage);
      setItems(prev => prev.map(item => (item.id === id ? res.data : item)));
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update stage');
      await getAll({ stage: selectedStage }); // rollback
      throw err;
    }
  }, [getAll, selectedStage]);

  const addNote = useCallback(async (id: string, note: string): Promise<PipelineItem> => {
    try {
      const res = await pipelineService.addNote(id, note);
      setItems(prev => prev.map(item => (item.id === id ? res.data : item)));
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to add note');
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    // Optimistic UI update
    setItems(prev => prev.filter(item => item.id !== id));
    try {
      await pipelineService.delete(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete pipeline item');
      await getAll({ stage: selectedStage });
      throw err;
    }
  }, [getAll, selectedStage]);

  // Initial fetch
  useEffect(() => {
    getAll();
  }, [getAll]);

  // Filtered views
  const filteredItems = useMemo(() => {
    if (selectedStage === 'all') return items;
    return items.filter(item => item.stage === selectedStage);
  }, [items, selectedStage]);

  const countsByStage = useMemo(() => {
    const counts: Record<string, number> = {
      all: items.length,
      scouted: 0,
      shortlisted: 0,
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
    };
    for (const item of items) {
      if (counts[item.stage] !== undefined) {
        counts[item.stage] += 1;
      }
    }
    return counts;
  }, [items]);

  return {
    items: filteredItems,
    allItems: items,
    selectedStage,
    isLoading,
    error,
    countsByStage,
    getAll,
    getById,
    create,
    updateStage,
    addNote,
    remove,
    setSelectedStage,
    refresh: () => getAll({ stage: selectedStage }),
  };
}
