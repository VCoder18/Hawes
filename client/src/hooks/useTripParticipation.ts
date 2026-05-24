import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type ParticipationMap = Record<string, { id: string; joined_at: string } | null>;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

export function useTripParticipation(tripIds: string[]) {
  const [participations, setParticipations] = useState<ParticipationMap>({});
  const [loading, setLoading] = useState(true);
  const prevTripIdsRef = useRef('');

  const fetchParticipations = useCallback(async () => {
    if (tripIds.length === 0) {
      setParticipations({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const results: ParticipationMap = {};
    for (const tripId of tripIds) {
      try {
        const res = await fetch(`${API_BASE_URL}/trips/participation/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          results[tripId] = data;
        } else {
          results[tripId] = null;
        }
      } catch {
        results[tripId] = null;
      }
    }

    setParticipations(results);
    setLoading(false);
  }, [tripIds]);

  useEffect(() => {
    const key = tripIds.join(',');
    if (key !== prevTripIdsRef.current) {
      prevTripIdsRef.current = key;
      fetchParticipations();
    }
  }, [tripIds, fetchParticipations]);

  const joinTrip = useCallback(async (tripId: string, inviteCode?: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/trips/join/${tripId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ invite_code: inviteCode }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to join trip' }));
      throw new Error(err.message || 'Failed to join trip');
    }

    const data = await res.json();
    setParticipations((prev) => ({ ...prev, [tripId]: data }));
    return data;
  }, []);

  const leaveTrip = useCallback(async (tripId: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/trips/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ trip_id: tripId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to leave trip' }));
      throw new Error(err.message || 'Failed to leave trip');
    }

    setParticipations((prev) => ({ ...prev, [tripId]: null }));
  }, []);

  const isParticipant = useCallback(
    (tripId: string) => !!participations[tripId],
    [participations]
  );

  const refresh = useCallback(() => {
    fetchParticipations();
  }, [fetchParticipations]);

  return {
    participations,
    loading,
    isParticipant,
    joinTrip,
    leaveTrip,
    refresh,
  };
}
