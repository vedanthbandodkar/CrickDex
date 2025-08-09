import { useState, useEffect } from 'react';
import { supabase, CricketFact } from '../lib/supabase';

export const useFacts = () => {
  const [facts, setFacts] = useState<CricketFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cricket_facts')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setFacts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRandomFact = (excludeId?: string) => {
    const availableFacts = excludeId 
      ? facts.filter(fact => fact.id !== excludeId)
      : facts;
    
    if (availableFacts.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableFacts.length);
    return availableFacts[randomIndex];
  };

  return {
    facts,
    loading,
    error,
    getRandomFact,
    refetch: fetchFacts,
  };
};