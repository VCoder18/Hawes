import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const FinanceOverview = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-10');
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
        console.error('Failed to fetch finance stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val: number) => {
    if (!val) return '0';
    return val >= 1000000
      ? `${(val / 1000000).toFixed(1)}M`
      : val >= 1000
        ? `${(val / 1000).toFixed(0)},000`
        : val.toLocaleString();
  };

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return 'Oct 2026';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  };

return (
     <div className="p-8 bg-[#FCFDF8] min-h-screen">
       <div className="w-full">
         {/* Top Navigation Tabs */}
         <div className="flex justify-center mb-10 pt-2">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex items-center gap-1">
             <button 
               className="flex items-center gap-2 px-6 py-2.5 text-[15px] font-semibold text-gray-500 hover:text-gray-700 rounded-xl transition-all"
               onClick={() => navigate('/business')}
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
               Business
             </button>
             <button 
               className="flex items-center gap-2 px-6 py-2.5 text-[15px] font-semibold text-gray-500 hover:text-gray-700 rounded-xl transition-all"
               onClick={() => navigate('/clients')}
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               Clients
             </button>
             <button 
               className="flex items-center gap-2 px-6 py-2.5 text-[15px] font-semibold text-gray-500 hover:text-gray-700 rounded-xl transition-all"
               onClick={() => navigate('/feedback')}
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
               Feedback
             </button>
             <button 
               className="flex items-center gap-2 px-6 py-2.5 text-[15px] font-semibold text-green-700 bg-white shadow-sm border border-gray-100 rounded-xl transition-all"
               onClick={() => navigate('/dashboard/finances')}
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
               Finances
             </button>
           </div>
         </div>
         
         <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#1a2e1e] tracking-tight">The Income</h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">Track your revenue and financial growth</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="month" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm transition-all pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {formatMonthYear(selectedDate)}
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 shadow-sm transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading financial data...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 [&>div]:h-full [&>div]:flex [&>div]:flex-col [&>div]:justify-center">
                <StatCard theme="green" title="Today's Revenue" value={formatCurrency(stats?.monthlyRevenue ?? 0)} currency="DZD" change="+15% vs yesterday" />
              </div>
              <div className="flex flex-col gap-6">
                <StatCard title="Current Month Revenue" value={formatCurrency(stats?.monthlyRevenue ?? 0)} currency="DZD" change="→ On track" />
                <StatCard title="Current Annual Revenue" value={formatCurrency(stats?.yearlyRevenue ?? 0)} currency="DZD" change="↗ +22%" />
              </div>
            </div>
            <RevenueChart />
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceOverview;
