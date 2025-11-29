import { useState, useCallback } from 'react';
import interviewService from '../services/interviewService';

export const useInterview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState('idle');
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [history, setHistory] = useState([]);

  const generatePrep = useCallback(async (interviewData) => {
    setLoading(true);
    setError(null);
    setGenerationStatus('generating');

    try {
      // Start generation
      const response = await interviewService.generateInterviewPrep(interviewData);
      
      // Wait for completion
      const prepResult = await interviewService.waitForPrep(response.prepId);
      
      setInterviewPrep(prepResult);
      setGenerationStatus('completed');
      setLoading(false);

      return { success: true, data: prepResult };
    } catch (err) {
      setError(err.message || 'Failed to generate interview prep');
      setGenerationStatus('failed');
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
    generatePrep,
    getPrep,
    getHistory,
    savePractice,
    getCompanyInsights,
    deletePrep,
    resetGeneration,
  };
};