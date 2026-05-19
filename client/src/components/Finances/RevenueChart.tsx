import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { name: '2', revenue: 150 }, { name: '4', revenue: 180 }, 
  { name: '6', revenue: 230 }, { name: '8', revenue: 240 },
  { name: '10', revenue: 235 }, { name: '12', revenue: 220 },
  { name: '14', revenue: 215 }, { name: '16', revenue: 220 },
  { name: '18', revenue: 240 }, { name: '20', revenue: 290 },
  { name: '22', revenue: 320 }, { name: '24', revenue: 350 },
  { name: '26', revenue: 390 }, { name: '28', revenue: 420 },
  { name: '30', revenue: 440 }
];

const yearlyData = [
  { name: 'Jan', revenue: 200 }, { name: 'Feb', revenue: 250 },
  { name: 'Mar', revenue: 280 }, { name: 'Apr', revenue: 260 },
  { name: 'May', revenue: 300 }, { name: 'Jun', revenue: 340 },
  { name: 'Jul', revenue: 380 }, { name: 'Aug', revenue: 400 },
  { name: 'Sep', revenue: 450 }, { name: 'Oct', revenue: 420 },
  { name: 'Nov', revenue: 480 }, { name: 'Dec', revenue: 510 }
];

const RevenueChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  const data = viewMode === 'monthly' ? monthlyData : yearlyData;
  const activeColor = viewMode === 'monthly' ? '#f97316' : '#10b981'; // Orange for monthly, Green for yearly

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
            YEARLY AVG
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
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dx={-10} tickFormatter={(val) => val === 0 ? '0' : `${val}k`} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke={activeColor} fill="url(#colorRev)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;