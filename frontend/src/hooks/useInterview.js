import { useState, useCallback } from 'react';
import interviewService from '../services/interviewService';

export const useInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('idle');
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState({ percentage: 0, message: '' });

  const generatePrep = useCallback(async (interviewData, onProgress) => {
    setLoading(true);
    setError(null);
    setGenerationStatus('generating');
    setProgress({ percentage: 0, message: 'Starting research...' });

    // Internal progress handler
    const handleProgress = (percentage, message) => {
      setProgress({ percentage, message });
      if (onProgress) onProgress(percentage, message);
    };

    try {
      // Start generation with progress tracking
      const response = await interviewService.generateInterviewPrep(interviewData, handleProgress);
      
      // If already completed (mock mode), use the data directly
      if (response.data && response.status === 'completed') {
        setInterviewPrep(response.data);
        setGenerationStatus('completed');
        setProgress({ percentage: 100, message: 'Complete!' });
        setLoading(false);
        return { success: true, data: response.data };
      }
      
      // Wait for completion with progress
      const prepResult = await interviewService.waitForPrep(response.prepId, handleProgress);
      
      setInterviewPrep(prepResult);
      setGenerationStatus('completed');
      setProgress({ percentage: 100, message: 'Complete!' });
      setLoading(false);

      return { success: true, data: prepResult };
    } catch (err) {
      console.error('❌ Generate prep error:', err);
      setError(err.message || 'Failed to generate interview prep');
      setGenerationStatus('failed');
      setProgress({ percentage: 0, message: 'Failed' });
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const getPrep = useCallback(async (prepId) => {
    setLoading(true);
    setError(null);

    try {
      const prepData = await interviewService.getInterviewPrep(prepId);
      setInterviewPrep(prepData);
      setLoading(false);
      return { success: true, data: prepData };
    } catch (err) {
      setError(err.message || 'Failed to fetch interview prep');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const getHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const historyData = await interviewService.getInterviewHistory();
      setHistory(historyData);
      setLoading(false);
      return { success: true, data: historyData };
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const savePractice = useCallback(async (prepId, sessionData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await interviewService.savePracticeSession(prepId, sessionData);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message || 'Failed to save practice session');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const getCompanyInsights = useCallback(async (companyName) => {
    setLoading(true);
    setError(null);

    try {
      const insights = await interviewService.getCompanyInsights(companyName);
      setLoading(false);
      return { success: true, data: insights };
    } catch (err) {
      setError(err.message || 'Failed to fetch company insights');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const deletePrep = useCallback(async (prepId) => {
    setLoading(true);
    setError(null);

    try {
      await interviewService.deleteInterviewPrep(prepId);
      setHistory(prev => prev.filter(item => item.id !== prepId));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete interview prep');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setGenerationStatus('idle');
    setInterviewPrep(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    generationStatus,
    interviewPrep,
    history,
    progress,
    generatePrep,
    getPrep,
    getHistory,
    savePractice,
    getCompanyInsights,
    deletePrep,
    resetGeneration,
  };
};