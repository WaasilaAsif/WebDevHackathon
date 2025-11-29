import { useState, useCallback } from 'react';
import resumeService from '../services/resumeService';
import { ResumeUploadStatus } from '../types/resumeTypes';

export const useResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(ResumeUploadStatus.IDLE);
  const [analysis, setAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);

  const uploadResume = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setUploadStatus(ResumeUploadStatus.UPLOADING);
    setUploadProgress(0);

    try {
      // Upload file
      const uploadResponse = await resumeService.uploadResume(
        file,
        (progress) => setUploadProgress(progress)
      );

      setUploadStatus(ResumeUploadStatus.PROCESSING);
      
      // Wait for analysis to complete
      const analysisResult = await resumeService.waitForAnalysis(
        uploadResponse.analysisId
      );

      setAnalysis(analysisResult);
      setUploadStatus(ResumeUploadStatus.COMPLETED);
      setLoading(false);

      return { success: true, data: analysisResult };
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
      setUploadStatus(ResumeUploadStatus.ERROR);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = await resumeService.getResumeProfile();
      setProfile(profileData);
      setLoading(false);
      return { success: true, data: profileData };
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const getSkillAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const skillsData = await resumeService.getSkillAnalysis();
      setLoading(false);
      return { success: true, data: skillsData };
    } catch (err) {
      setError(err.message || 'Failed to fetch skill analysis');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await resumeService.updateProfile(profileData);
      setProfile(updatedProfile);
      setLoading(false);
      return { success: true, data: updatedProfile };
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const getHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const history = await resumeService.getResumeHistory();
      setLoading(false);
      return { success: true, data: history };
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setUploadStatus(ResumeUploadStatus.IDLE);
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    uploadProgress,
    uploadStatus,
    analysis,
    profile,
    uploadResume,
    getProfile,
    getSkillAnalysis,
    updateProfile,
    getHistory,
    resetUpload,
  };
};