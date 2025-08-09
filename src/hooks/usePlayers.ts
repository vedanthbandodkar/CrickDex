import { useState, useEffect } from 'react';
import { supabase, Player } from '../lib/supabase';

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('runs', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPlayerById = (id: string) => {
    return players.find(player => player.id === id);
  };

  return {
    players,
    loading,
    error,
    refetch: fetchPlayers,
    getPlayerById,
  };
};