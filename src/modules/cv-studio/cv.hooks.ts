import { useState, useEffect, useCallback } from 'react';
import { cvService } from './cv.service';
import { CandidateProfile, ATSMatchResult, UpdateProfileDto } from './cv.types';

export function useCandidateProfile() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async (): Promise<CandidateProfile | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await cvService.getProfile();
      setProfile(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (dto: UpdateProfileDto): Promise<CandidateProfile> => {
    setIsLoading(true);
    try {
      const res = await cvService.updateProfile(dto);
      setProfile(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    refresh: getProfile,
  };
}

export function useATSMatcher() {
  const [atsResult, setAtsResult] = useState<ATSMatchResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateATS = useCallback(async (jobId: string): Promise<ATSMatchResult | null> => {
    setIsCalculating(true);
    setError(null);
    try {
      const res = await cvService.calculateATS({ jobId });
      setAtsResult(res.data);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Failed to calculate ATS score');
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return {
    atsResult,
    isCalculating,
    error,
    calculateATS,
    clearResult: () => setAtsResult(null),
  };
}
