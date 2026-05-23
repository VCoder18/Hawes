import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BookmarksState {
  [tripId: string]: boolean;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarksState>({});
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user bookmarks on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setIsInitialized(true);
          return;
        }
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE_URL}/bookmarks`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (response.ok) {
          const list = await response.json();
          const map = list.reduce((acc: BookmarksState, item: { trip_id: string }) => {
            acc[item.trip_id] = true;
            return acc;
          }, {});
          setBookmarks(map);
        }
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadBookmarks();
  }, []);

  const toggleBookmark = useCallback(
    async (tripId: string) => {
      const currentlyBookmarked = bookmarks[tripId];
      // Optimistic UI update
      setBookmarks((prev) => ({ ...prev, [tripId]: !prev[tripId] }));

      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.error('Not authenticated');
          // rollback
          setBookmarks((prev) => ({ ...prev, [tripId]: !prev[tripId] }));
          return;
        }
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        if (currentlyBookmarked) {
          await fetch(`${API_BASE_URL}/bookmarks/${tripId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
        } else {
          const response = await fetch(`${API_BASE_URL}/bookmarks/${tripId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error('Failed to add bookmark:', { status: response.status, err });
          }
        }
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        // rollback UI
        setBookmarks((prev) => ({ ...prev, [tripId]: !prev[tripId] }));
      } finally {
        setLoading(false);
      }
    },
    [bookmarks]
  );

  return {
    bookmarks,
    toggleBookmark,
    loading,
    isBookmarked: (tripId: string) => !!bookmarks[tripId],
    isInitialized,
  };
}
