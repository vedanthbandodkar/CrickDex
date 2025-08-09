import { useState, useEffect } from 'react';
import { supabase, QuizQuestion, QuizScore } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveQuizScore = async (score: number, totalQuestions: number) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .insert({
          user_id: user.id,
          score,
          total_questions: totalQuestions,
        })
        .select()
        .single();

      return { data, error };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const getBestScore = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      console.error('Error fetching best score:', err);
      return null;
    }
  };

  return {
    questions,
    loading,
    error,
    saveQuizScore,
    getBestScore,
    refetch: fetchQuestions,
  };
};