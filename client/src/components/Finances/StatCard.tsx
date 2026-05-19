import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  currency: string;
  change?: string;
  theme?: 'green' | 'white';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, currency, change, theme = 'white' }) => {
  const isGreen = theme === 'green';
  
  const renderChange = () => {
    if (!change) return null;
    
    if (isGreen) {
      return (
        <span className="inline-flex items-center text-xs font-medium bg-white/20 text-white px-3 py-1.5 rounded-full">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
          {change}
        </span>
      );
    }

    if (change.startsWith('↗')) {
      const text = change.replace('↗', '').trim();
      return (
        <span className="inline-flex items-center text-xs font-medium text-[#4a84f6]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
          {text}
        </span>
      );
    }
    
    if (change.startsWith('→')) {
      const text = change.replace('→', '').trim();
      return (
        <span className="inline-flex items-center text-xs font-medium text-gray-400">
          <span className="mr-1">→</span>
          {text}
        </span>
      );
    }

    return <span className="inline-flex items-center text-xs font-medium text-gray-500">{change}</span>;
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm flex flex-col justify-center ${isGreen ? 'bg-gradient-to-br from-[#0A7B20] to-[#0D5514] text-white' : 'bg-white text-gray-900 border border-gray-100 border-l-[6px] border-l-emerald-500'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${isGreen ? 'bg-emerald-400' : 'hidden'}`}></span>
        <h3 className={`text-sm font-medium ${isGreen ? 'text-emerald-50' : 'text-gray-500'}`}>{title}</h3>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-4xl font-bold">{value}</h2>
        <span className={`text-sm font-semibold ${isGreen ? 'text-emerald-100' : 'text-gray-400'}`}>{currency}</span>
      </div>
      <div>
        {renderChange()}
      </div>
    </div>
  );
};

export default StatCard;