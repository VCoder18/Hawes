import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const InviteRedirect = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    const resolveInvite = async () => {
      try {
        // Find trip by invite_code
        const { data, error } = await supabase
          .from('trips')
          .select('id')
          .eq('invite_code', code)
          .single();

        if (error || !data) {
          navigate('/trips', { state: { error: 'Invalid or expired invite link' } });
          return;
        }

        // Redirect to trip detail with invite code in query params and state
        navigate(`/trips/${data.id}?invite=${code}`, { 
          state: { inviteCode: code } 
        });
      } catch (err) {
        console.error('Failed to process invite:', err);
        navigate('/trips', { state: { error: 'Failed to process invite link' } });
      }
    };

    resolveInvite();
  }, [code, navigate]);

  return null; // Loading state handled by navigation
};

export default InviteRedirect;