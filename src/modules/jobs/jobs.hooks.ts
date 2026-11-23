import { useState, useEffect, useCallback } from 'react';
import { jobsService } from './jobs.service';
import { Job, JobCategory, GetJobsQuery, CreateJobDto, UpdateJobDto } from './jobs.types';

export function useJobs(initialCategory: JobCategory = 'all') {
  const [data, setData] = useState<Job[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>(initialCategory);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (params?: GetJobsQuery): Promise<Job[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await jobsService.getAll(params);
      setData(res.data);
      return res.data;
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch jobs from gateway';
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Job | null> => {
    setIsLoading(true);
    try {
      const res = await jobsService.getById(id);
      return res.data;
    } catch (err: any) {
      setError(err.message || `Failed to fetch job ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (dto: CreateJobDto): Promise<Job> => {
    setIsLoading(true);
    try {
      const res = await jobsService.create(dto);
      setData(prev => [res.data, ...prev]);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, dto: UpdateJobDto): Promise<Job> => {
    setIsLoading(true);
    try {
      const res = await jobsService.update(id, dto);
      setData(prev => prev.map(j => (j.id === id ? res.data : j)));
      if (activeJob?.id === id) setActiveJob(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update job');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeJob]);

  const remove = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await jobsService.delete(id);
      setData(prev => prev.filter(j => j.id !== id));
      if (activeJob?.id === id) setActiveJob(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeJob]);

  // Handle category change
  const handleCategoryChange = useCallback((category: JobCategory) => {
    setSelectedCategory(category);
    getAll({ category });
  }, [getAll]);

  // Initial fetch
  useEffect(() => {
    getAll({ category: initialCategory });
  }, [getAll, initialCategory]);

  return {
    data,
    jobs: data, // convenience alias
    selectedCategory,
    activeJob,
    isLoading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
    setSelectedCategory: handleCategoryChange,
    setActiveJob,
    refresh: () => getAll({ category: selectedCategory }),
  };
}
