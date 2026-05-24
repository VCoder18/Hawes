import { useState, useEffect } from 'react';
import { Search, CheckCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { TripCard } from "@/components/BrowseTrips/TripCard";
import { ClientsTab } from '../components/Clients/ClientsTab';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

const tabMap: Record<string, string> = {
  clients: 'clients',
  overview: 'overview',
  notifications: 'notifications',
  feedback: 'feedback',
};

const Dashbord = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const { tab } = useParams();
    const navigate = useNavigate();
    const activeTab = tabMap[tab?.toLowerCase() ?? ''] || 'trips';

    const [trips, setTrips] = useState<any[]>([]);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [leaveLoading, setLeaveLoading] = useState<string | null>(null);

    useEffect(() => {
      if (!user) return;
      const fetchProfile = async () => {
        const { data, error } = await (await import('@/lib/supabase')).supabase
          .from('profiles')
          .select('role, display_name, username')
          .eq('id', user.id)
          .single();
        if (!error && data) setProfile(data);
        setProfileLoading(false);
      };
      fetchProfile();
    }, [user]);

    useEffect(() => {
      if (!user || profileLoading) return;
      const fetchTrips = async () => {
        setTripsLoading(true);
        try {
          const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession();
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

          const role = profile?.role;

          if (role === 'services' && activeTab !== 'trips') {
            setTrips([]);
            setTripsLoading(false);
            return;
          }

          const url = role === 'services'
            ? `${API_BASE_URL}/dashboard/associated-trips`
            : `${API_BASE_URL}/dashboard/history`;

          const response = await fetch(url, { headers });
          if (response.ok) {
            const data = await response.json();
            setTrips(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.error('Failed to fetch trips:', err);
        } finally {
          setTripsLoading(false);
        }
      };
      fetchTrips();
    }, [user, profile, profileLoading, activeTab]);

    const { t } = useTranslation();
    const role = profile?.role;
    const isService = role === 'services';

    const handleLeaveTrip = async (tripId: string) => {
      setLeaveLoading(tripId);
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch(`${API_BASE_URL}/trips/leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ trip_id: tripId }),
        });
        if (res.ok) {
          setTrips((prev) => prev.filter((t) => t.id !== tripId));
        } else {
          const err = await res.json().catch(() => ({}));
          alert(err.message || 'Failed to leave trip');
        }
      } catch {
        alert('Failed to leave trip');
      } finally {
        setLeaveLoading(null);
      }
    };

    const handleTabChange = (newTab: string) => {
        if (newTab === 'trips') {
            navigate('/dashboard');
        } else {
            navigate(`/dashboard/${newTab}`);
        }
    };

    return (
        <div className='flex flex-col min-w-0'>
            {activeTab === 'notifications' ? (
              <NotificationsTab />
            ) : activeTab === 'clients' ? (
              <div className='w-full pb-8'>
                <ClientsTab />
              </div>
            ) : activeTab === 'overview' && isService ? (
              <div className='w-full pb-8'>
                <BusinessOverviewEmbed />
              </div>
            ) : (
            <main className='w-full pb-8'>
                <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805] mb-8">
                  {isService ? t('dashboard.associatedTrips') : t('dashboard.tripHistory')}
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('dashboard.searchTrips')}
                                className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
                            />
                        </div>
                    </div>
                </div>

                 {tripsLoading ? (
                    <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
                 ) : trips.length === 0 ? (
                   <div className="text-center py-12 text-gray-500">
                      {isService ? t('dashboard.noAssociatedTrips') : t('dashboard.noTripsFound')}
                   </div>
                 ) : (
                   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {trips.map(trip => {
                          const isOwnTrip = String(trip.organizer || '') === String(user?.id || '');
                          const participantStatus = isService ? undefined : isOwnTrip ? 'organizer' as const : 'participant' as const;
                          return (
                            <div key={trip.id} className="relative">
                                <TripCard
                                  trip={trip}
                                  isMine={isOwnTrip}
                                  participantStatus={leaveLoading === trip.id ? 'loading' : participantStatus}
                                  onLeave={() => handleLeaveTrip(trip.id)}
                                />
                                {isOwnTrip && trip.visibility === 'private' && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 space-x-3">
                                    <span className="text-xs font-medium text-[#00b70d]">{t('dashboard.privateTrip')}</span>
                                    <button 
                                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        navigator.clipboard.writeText(`${window.location.origin}/invite/${trip.invite_code}`).then(() => {
                                          const originalText = e.currentTarget.innerHTML;
                                          e.currentTarget.innerHTML = `<span className="text-xs font-medium text-[#00b70d]">${t('dashboard.linkCopied')}</span>`;
                                          setTimeout(() => {
                                            e.currentTarget.innerHTML = originalText;
                                          }, 2000);
                                        });
                                      }}
                                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-[#00b70d]/10 text-[#00b70d] rounded hover:bg-[#00b70d]/20 transition-colors"
                                    >
                                      {t('dashboard.copyInviteLink')}
                                    </button>
                                  </div>
                                )}
                            </div>
                          );
                        })}
                    </div>
                 )}
              </main>
              )}
             </div>
     );
 };

function NotificationsTab() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { supabase } = await import('@/lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchAll = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setNotifications(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleClick = async (n: Notification) => {
    if (!n.is_read) {
      const token = await getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/notifications/${n.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
        );
      }
    }
    if (n.type === 'trip_invite' && n.data) {
      const inviteCode = (n.data as Record<string, unknown>).invite_code as string;
      const tripId = (n.data as Record<string, unknown>).trip_id as string;
      if (inviteCode && tripId) {
        window.location.href = `/trips/${tripId}?invite=${inviteCode}`;
      }
    }
  };

  const handleMarkAllRead = async () => {
    const token = await getToken();
    if (!token) return;
    await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })));
  };

  if (loading) return <div className="text-center py-12 text-gray-500">{t('dashboard.loadingNotifications')}</div>;

  return (
    <main className="w-full pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805]">
          {t('dashboard.notifications')}
        </h1>
        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-[#00b70d] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="size-4" />
            {t('dashboard.markAllRead')}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {notifications.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            {t('dashboard.noNotifications')}
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors border-b border-[#e2e8f0] last:border-b-0 flex items-start gap-3"
            >
              {!n.is_read && (
                <span className="mt-1.5 size-2.5 bg-[#00b70d] rounded-full flex-shrink-0" />
              )}
              <div className={`flex-1 min-w-0 ${n.is_read ? "ml-[18px]" : ""}`}>
                <p className="text-sm font-semibold text-[#334155]">{n.title}</p>
                {n.body && (
                  <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </main>
  );
}

function BusinessOverviewEmbed() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const response = await fetch(`${API_BASE_URL}/dashboard/business-stats`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch business stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading overview...</div>;
  if (!stats) return <div className="text-center py-12 text-gray-500">Failed to load business data.</div>;

  const formatCurrency = (val: number) =>
    val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toLocaleString();

  return (
    <div className="w-full pb-8">
      <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805] mb-8">Business Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-[#42493E] text-xs font-bold uppercase mb-2">Services</p>
          <h2 className="text-3xl font-bold text-gray-800">{stats.services?.length ?? 0}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-[#42493E] text-xs font-bold uppercase mb-2">Total Capacity</p>
          <h2 className="text-3xl font-bold text-gray-800">{stats.capacity?.total ?? 0}</h2>
          <p className="text-xs text-gray-400 mt-1">{stats.capacity?.current ?? 0} booked</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-[#42493E] text-xs font-bold uppercase mb-2">Avg Rating</p>
          <h2 className="text-3xl font-bold text-gray-800">{stats.avgRating?.toFixed(1) ?? '0.0'}</h2>
          <p className="text-xs text-gray-400 mt-1">{stats.reviewCount} reviews</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <p className="text-[#42493E] text-xs font-bold uppercase mb-2">Avg Price</p>
          <h2 className="text-3xl font-bold text-gray-800">{formatCurrency(stats.avgPrice)}</h2>
          <p className="text-xs text-gray-400 mt-1">DZD per booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#0A7B20] to-[#0D5514] text-white p-6 rounded-3xl shadow-sm">
          <p className="text-emerald-100 text-sm font-medium mb-2">Monthly Revenue</p>
          <h2 className="text-4xl font-bold">{formatCurrency(stats.monthlyRevenue)}</h2>
          <p className="text-emerald-200 text-xs mt-1">DZD</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-l-[6px] border-l-emerald-500">
          <p className="text-gray-500 text-sm font-medium mb-2">Yearly Revenue</p>
          <h2 className="text-4xl font-bold">{formatCurrency(stats.yearlyRevenue)}</h2>
          <p className="text-gray-400 text-xs mt-1">DZD</p>
        </div>
      </div>

      {stats.services?.length > 0 && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <h3 className="font-bold text-gray-800 mb-4">Your Services</h3>
          <div className="space-y-3">
            {stats.services.map((service: any) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800">{service.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{service.category ?? 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{service.min_cost ?? 0} - {service.max_cost ?? 0} DZD</p>
                  <p className="text-xs text-gray-400">Limit: {service.client_limit ?? 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashbord;
