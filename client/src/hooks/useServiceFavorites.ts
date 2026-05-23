import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ServiceFavoritesState {
  [serviceId: number]: boolean;
}

export function useServiceFavorites() {
  const [favorites, setFavorites] = useState<ServiceFavoritesState>({});
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setIsInitialized(true);
          return;
        }

        const { data, error } = await supabase
          .from('favorite_services')
          .select('service_id')
          .eq('profile_id', session.user.id);

        if (error) throw error;

        const favMap = (data || []).reduce(
          (acc: ServiceFavoritesState, fav: { service_id: number }) => ({ ...acc, [fav.service_id]: true }),
          {}
        );
        setFavorites(favMap);
      } catch (error) {
        console.error('Failed to load service favorites:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = useCallback(
    async (serviceId: number) => {
      const isFavorited = favorites[serviceId];

      setFavorites((prev) => ({
        ...prev,
        [serviceId]: !prev[serviceId],
      }));

      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          // If not authenticated, we keep the optimistic update but cannot persist.
          // In a real app, you might want to redirect to login or show a message.
          // For now, we just keep the state and do not persist.
          return;
        }

        if (isFavorited) {
          // Remove favorite
          await supabase
            .from('favorite_services')
            .delete()
            .match({ service_id: serviceId, profile_id: session.user.id });
        } else {
          // Add favorite
          await supabase
            .from('favorite_services')
            .insert({
              service_id: serviceId,
              profile_id: session.user.id,
            });
        }
      } catch (error) {
        console.error('Failed to toggle service favorite:', error);
        // Revert the optimistic update on error
        setFavorites((prev) => ({
          ...prev,
          [serviceId]: !prev[serviceId],
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
    isFavorited: (serviceId: number) => !!favorites[serviceId],
    isInitialized,
  };
}
