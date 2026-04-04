import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface FavoritesState {
  [destId: string]: boolean;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesState>({});
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setIsInitialized(true);
          return;
        }

        const API_BASE_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (response.ok) {
          const { favorites: favList } = await response.json();
          const favMap = favList.reduce(
            (acc: FavoritesState, id: string) => ({ ...acc, [id]: true }),
            {}
          );
          setFavorites(favMap);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = useCallback(
    async (destinationId: string) => {
      const isFavorited = favorites[destinationId];

      // 1. Optimistic update
      setFavorites((prev) => ({
        ...prev,
        [destinationId]: !prev[destinationId],
      }));

      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.error('Not authenticated');
          // Rollback on error
          setFavorites((prev) => ({
            ...prev,
            [destinationId]: !prev[destinationId],
          }));
          return;
        }

        const API_BASE_URL =
          import.meta.env.VITE_API_URL || 'http://localhost:3000';

        // 2. Send to backend
        if (isFavorited) {
          await fetch(`${API_BASE_URL}/favorites/${destinationId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
        } else {
          const response = await fetch(`${API_BASE_URL}/favorites/${destinationId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Failed to add favorite:', {
              status: response.status,
              statusText: response.statusText,
              destinationId,
              errorResponse: errorData,
            });
          }
        }
      } catch (error) {
        // 3. Rollback on error
        console.error('Failed to toggle favorite:', error);
        setFavorites((prev) => ({
          ...prev,
          [destinationId]: !prev[destinationId],
        }));
      } finally {
        setLoading(false);
      }
    },
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    loading,
    isFavorited: (destId: string) => !!favorites[destId],
    isInitialized,
  };
}
