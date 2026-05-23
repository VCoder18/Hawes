import { useState, useEffect } from 'react';
import { X, LayoutDashboard, Compass, User, Users, Settings, Plus, Search, SlidersHorizontal } from 'lucide-react'; 
import { Link, useParams, useNavigate } from "react-router-dom";
import { TripCard } from "@/components/BrowseTrips/TripCard";
import FinanceOverview from '../components/Finances/FinanceOverview';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashbord = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const { tab } = useParams();
    const navigate = useNavigate();
    const activeTab = tab?.toLowerCase() === 'finances' ? 'finances' : 'trips';

    const [trips, setTrips] = useState<any[]>([]);
    const [tripsLoading, setTripsLoading] = useState(true);

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

    const role = profile?.role;
    const isService = role === 'services';

    const handleTabChange = (newTab: string) => {
        if (newTab === 'trips') {
            navigate('/dashboard');
        } else {
            navigate(`/dashboard/${newTab}`);
        }
    };

    return (
    <div className='flex flex-col md:flex-row gap-6 w-full'>
        <div className='w-full md:w-64 shrink-0'>
            <nav className='flex flex-col gap-2'>
                <Link to="/" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                    <LayoutDashboard className="w-5 h-5" />   
                    <span className='pl-3'>Home</span>
                </Link>

                {isService ? (
                  <>
                    <button onClick={() => handleTabChange('overview')} className={`px-4 py-3 font-medium flex items-center rounded-xl transition-colors w-full ${activeTab === 'overview' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
                        <Compass className="w-5 h-5" />   
                        <span className='pl-3'>Overview</span>
                    </button>
                    <button onClick={() => handleTabChange('trips')} className={`px-4 py-3 font-medium flex items-center rounded-xl transition-colors w-full ${activeTab === 'trips' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
                        <Compass className="w-5 h-5" />   
                        <span className='pl-3'>Associated Trips</span>
                    </button>
                    <Link to="/browse" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                        <Compass className="w-5 h-5" />   
                        <span className='pl-3'>Explore</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleTabChange('trips')} className={`px-4 py-3 font-medium flex items-center rounded-xl transition-colors w-full ${activeTab === 'trips' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
                        <Compass className="w-5 h-5" />   
                        <span className='pl-3'>My Trips</span>
                    </button>
                    <Link to="/browse" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                        <Compass className="w-5 h-5" />   
                        <span className='pl-3'>Explore</span>
                    </Link>
                  </>
                )}

                {!isService && (
                  <>
                    <div className='border-t border-gray-200 my-2'></div>
                    <div className="px-2">
                        <Link to="/create-trip" className='w-full flex items-center justify-center gap-2 border-2 border-[#FF5900] rounded-xl py-3 px-4 hover:bg-[#FF5900] hover:text-white group transition-colors'>
                            <Plus className="w-5 h-5 text-[#FF5900] group-hover:text-white" />
                            <span className='text-[#FF5900] group-hover:text-white font-semibold'>Create New Trip</span>
                        </Link>
                    </div>
                  </>
                )}
                  
                <div className='border-t border-gray-200 my-2'></div>

                {isService && (
                  <button onClick={() => handleTabChange('finances')} className={`px-4 py-3 font-medium flex items-center rounded-xl transition-colors w-full ${activeTab === 'finances' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
                      <SlidersHorizontal className="w-5 h-5" />   
                      <span className='pl-3'>Finances</span>
                  </button>
                )}

                <div className='border-t border-gray-200 my-2'></div>
                <Link to="/profile" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                    <User className="w-5 h-5" />   
                    <span className='pl-3'>Profile</span>
                </Link>
                <Link to="/community" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                    <Users className="w-5 h-5" />   
                    <span className='pl-3'>Community</span>
                </Link>
                <Link to="/settings/profile" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                    <Settings className="w-5 h-5" />   
                    <span className='pl-3'>Settings</span>
                </Link>
            </nav>
        </div>

        <div className='flex-1 flex flex-col min-w-0'>
            {activeTab === 'finances' && isService ? (
                <div className='w-full pb-8'>
                    <FinanceOverview />
                </div>
            ) : activeTab === 'overview' && isService ? (
              <div className='w-full pb-8'>
                <BusinessOverviewEmbed />
              </div>
            ) : (
            <main className='w-full pb-8'>
                <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805] mb-8">
                  {isService ? 'Associated Trips' : 'Trip History'}
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search trips..."
                                className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
                            />
                        </div>
                    </div>
                </div>

                {tripsLoading ? (
                  <div className="text-center py-12 text-gray-500">Loading trips...</div>
                ) : trips.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {isService ? 'No associated trips found.' : 'No trip history found.'}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {trips.map(trip => (
                          <TripCard key={trip.id} trip={trip} isMine={!isService} />
                      ))}
                  </div>
                )}
              </main>
            )}
          </div>
        </div>
    );
};

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
