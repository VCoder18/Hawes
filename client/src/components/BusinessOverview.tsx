import { useState } from 'react';

const BusinessOverview = () => {
    const [capacity, setCapacity] = useState(15);
    return (
        <div className="w-full pb-8">
            <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805] mb-2">
                Business Overview
            </h1>
            <p className="text-sm text-[#6a7282] mb-8">Manage your travel business, clients, and revenues.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Capacity Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                    <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-widest mb-4">Capacity</p>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[#1B1C19] font-semibold text-sm">Client Limit</span>
                        <div className="flex items-center bg-white border border-gray-100 shadow-sm h-10 rounded-md px-3 py-2 gap-3">
                            <span className="text-base font-bold text-gray-800 min-w-[40px]">{capacity}</span>
                            <div className="flex flex-col leading-[0.5]">
                                <button onClick={() => setCapacity(prev => prev + 1)} className="text-gray-400 hover:text-gray-600 text-[10px] p-0.5">▲</button>
                                <button onClick={() => setCapacity(prev => Math.max(1, prev - 1))} className="text-gray-400 hover:text-gray-600 text-[10px] p-0.5">▼</button>
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 w-full bg-[#FF4F32] text-white px-5 py-2 rounded-2xl text-xs font-bold shadow-lg shadow-red-50 hover:bg-[#e0442a] transition-colors">
                        Update Limit
                    </button>
                </div>

                {/* Monthly Revenue Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-8 rounded-lg bg-[#00b70d]/10 flex items-center justify-center">
                            <svg className="size-4 text-[#00b70d]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-widest">Monthly Revenue</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-2xl md:text-[32px] font-bold text-gray-800">42,500</h2>
                        <span className="text-xs text-gray-400 font-medium uppercase">DZD</span>
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Target: 50k DZD</span>
                        <span className="text-[10px] font-semibold text-[#23501E] bg-[#22C55E] px-2 py-0.5 rounded-md">+14.2%</span>
                    </div>
                </div>

                {/* Total Active Clients Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                    <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-widest mb-4">Total Active Clients</p>
                    <h2 className="text-2xl md:text-[38px] font-bold text-gray-800">148</h2>
                    <div className="border-t border-gray-100 mt-6 pt-3 flex items-center gap-2">
                        <svg className="size-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeWidth="1.5"/></svg>
                        <span className="text-xs text-gray-400">3 awaiting approval</span>
                    </div>
                </div>

                {/* Avg Rating Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                    <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-widest mb-4">Avg Rating</p>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-2xl md:text-[38px] font-bold text-gray-800">4.9</h2>
                        <span className="text-sm">⭐</span>
                        <span className="text-xs text-gray-400">/5.0</span>
                    </div>
                    <div className="border-t border-gray-100 mt-6 pt-3">
                        <span className="text-xs text-[#42493E]">112 verified reviews</span>
                    </div>
                </div>
            </div>

            {/* Services Price Average Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#00b70d] shadow-sm">
                <h3 className="font-semibold text-[#1B1C19] mb-1">Services Price Average</h3>
                <p className="text-xs text-[#42493E] mb-4">Aggregated value across all service tiers.</p>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl md:text-[48px] font-bold text-gray-800">8,250</h2>
                    <span className="text-sm md:text-lg font-bold text-gray-400">DZD</span>
                    <span className="text-xs text-[#42493E] ml-1">/ per booking</span>
                    <span className="bg-[#22C55E] text-[#23501E] text-xs font-bold px-2 py-0.5 rounded-md ml-2">+14.2%</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">+14.2% from last quarter</p>
                <div className="border-t border-gray-100 mt-4 pt-4 flex gap-8">
                    <div>
                        <p className="text-[10px] text-[#42493E]">Lowest</p>
                        <span className="text-sm font-bold text-gray-800">1.2k <span className="text-[10px] text-[#A6A6A6] font-normal">DZD</span></span>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#42493E]">Highest</p>
                        <span className="text-sm font-bold text-gray-800">25k+ <span className="text-[10px] text-[#A6A6A6] font-normal">DZD</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessOverview;
