import { useState, useEffect } from 'react';
import { supabase, UserFavorite } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (playerId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          player_id: playerId,
        })
        .select()
        .single();

      if (error) throw error;
      setFavorites(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const removeFavorite = async (playerId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('player_id', playerId);

      if (error) throw error;
      setFavorites(prev => prev.filter(fav => fav.player_id !== playerId));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const isFavorite = (playerId: string) => {
    return favorites.some(fav => fav.player_id === playerId);
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
};