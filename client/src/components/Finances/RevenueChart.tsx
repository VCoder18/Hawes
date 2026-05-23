import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const RevenueChart = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const response = await fetch(`${API_BASE_URL}/dashboard/revenue-chart`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (err) {
        console.error('Failed to fetch revenue chart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, []);

  if (loading) {
    return <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-400">
      <div className="text-center py-12 text-gray-500">Loading chart...</div>
    </div>;
  }

  const monthlyData = chartData?.months?.map((m: any) => ({
    name: m.month,
    revenue: Math.round(m.revenue / 1000),
  })) ?? [];

  const yearlyData = chartData?.years?.map((y: any) => ({
    name: y.year,
    revenue: Math.round(y.revenue / 1000),
  })) ?? [];

  const data = viewMode === 'monthly' ? monthlyData : yearlyData;
  const activeColor = viewMode === 'monthly' ? '#f97316' : '#10b981';

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-400">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Revenue Analytics</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Comparing Monthly vs Yearly Growth Context</p>
        </div>
        <div className="flex gap-4 items-center bg-gray-50/50 border border-gray-200 rounded-full px-1 py-1">
          <button 
            onClick={() => setViewMode('monthly')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${viewMode === 'monthly' ? 'text-gray-600 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            MONTHLY
          </button>
          <button 
            onClick={() => setViewMode('yearly')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${viewMode === 'yearly' ? 'text-gray-600 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            YEARLY
          </button>
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dx={-10} tickFormatter={(val: number) => val === 0 ? '0' : `${val}k`} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke={activeColor} fill="url(#colorRev)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
