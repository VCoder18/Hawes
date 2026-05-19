import React, { useState } from 'react';
import { X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Link, useParams, useNavigate } from "react-router-dom";
import FinanceOverview from '../components/Finances/FinanceOverview';

const Dashbord = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { tab } = useParams();
    const navigate = useNavigate();
    const activeTab = tab?.toLowerCase() === 'finances' ? 'finances' : 'trips';

    const handleTabChange = (newTab: string) => {
        if (newTab === 'trips') {
            navigate('/dashboard');
        } else {
            navigate(`/dashboard/${newTab}`);
        }
    };
    return (
        <div className='flex h-screen w-screen '>
            <div className='md:grid md:grid-cols-4 grid grid-cols-2 w-full'>
                <div className=' md:col-start-1 md:col-end-2 bg-white col-start-1 col-end-2'>
                    <nav className='flex flex-col  gap-1 px-4 '>
                        <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC]  rounded-lg transition-colors "
                            onClick={() => setSidebarOpen(false)} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Home</span>
                        </Link>
                        <button onClick={() => handleTabChange('trips')} className={`px-4 py-2 font-medium flex items-center rounded-lg transition-colors w-full ${activeTab === 'trips' ? 'bg-[#00B70D1A] border border-[#00B70D1A] text-[#0D2805]' : 'bg-white hover:bg-[#00B70D1A] hover:border hover:border-[#00B70D1A] text-[#334155]'}`}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'trips' ? '#0D2805' : '#0D2805B2'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>
                            <span className={`text-[19.05px] pl-3 ${activeTab === 'trips' ? 'text-[#0D2805]' : 'text-[#0D2805B2]'}`}>My Trips</span>
                        </button>


                        <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                            onClick={() => setSidebarOpen(false)} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                            <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Explore</span>
                        </Link>

                        {/* Services Dropdown */}
                        <div className="flex flex-col w-full">
                            <button className="px-4 py-2 text-[#334155] font-medium flex items-center justify-between rounded-lg transition-colors hover:bg-gray-50 w-full mt-2">
                                <div className="flex items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                    <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Services</span>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div className="flex flex-col gap-1 mt-1 pl-4">
                                <button className="px-4 py-2 font-medium flex items-center rounded-lg transition-colors w-full bg-white hover:bg-gray-50 text-[#334155]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                    <span className="text-[17px] pl-3 text-[#0D2805B2]">Business</span>
                                </button>
                                <button className="px-4 py-2 font-medium flex items-center rounded-lg transition-colors w-full bg-white hover:bg-gray-50 text-[#334155]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    <span className="text-[17px] pl-3 text-[#0D2805B2]">Clients</span>
                                </button>
                                <button className="px-4 py-2 font-medium flex items-center rounded-lg transition-colors w-full bg-white hover:bg-gray-50 text-[#334155]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <span className="text-[17px] pl-3 text-[#0D2805B2]">Feedback</span>
                                </button>
                                <button onClick={() => handleTabChange('finances')} className={`px-4 py-2 font-medium flex items-center rounded-lg transition-colors w-full ${activeTab === 'finances' ? 'bg-[#00B70D1A] text-[#0D2805]' : 'bg-white hover:bg-gray-50 text-[#334155]'}`}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'finances' ? '#0D2805' : '#0D2805B2'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                                    <span className={`text-[17px] pl-3 ${activeTab === 'finances' ? 'text-[#0D2805]' : 'text-[#0D2805B2]'}`}>Finances</span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    <div className='border-t border-gray-200 mt-4 mb-2 mx-4'></div>
                    <div >
                        <button className='border-2 border-[#FF5900] rounded-xl mx-4 my-2 px-8 py-3 w-[calc(100%-32px)] flex justify-center'>
                            <span className='text-[#FF5900] font-semibold text-[17px]'>Create New Trip</span>
                        </button>
                    </div>
                    <div className='border-t border-gray-200 mt-2 mb-4 mx-4'></div>

                    <nav className='flex flex-col  gap-1 px-4 '>
                        <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                            onClick={() => setSidebarOpen(false)} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Profile</span>
                        </Link>
                        <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                            onClick={() => setSidebarOpen(false)} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Community</span>
                        </Link>
                        <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                            onClick={() => typeof setSidebarOpen !== 'undefined' && setSidebarOpen(false)} >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D2805B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Settings</span>
                        </Link>
                    </nav>
                </div>

                <div className='md:col-start-2 md:col-end-5 col-start-2 col-end-3 flex flex-col'>
                    <header className='bg-white border-b border-gray-200 min-h-[60px] flex items-center justify-between px-6 w-full shrink-0'>
                        <div className="flex items-center gap-8">
                            {/* Sidebar Toggle (Mobile) */}
                            <div className="md:hidden">
                                <Sidebar />
                            </div>
                            
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
                                    <path d="M12 2L14.4 7.6L20.5 8.5L16 12.9L17.1 19L12 16.3L6.9 19L8 12.9L3.5 8.5L9.6 7.6L12 2Z" fill="currentColor"/>
                                </svg>
                                <span className="text-xl font-bold text-gray-900">Hawes</span>
                            </div>
                            
                            {/* Search */}
                            <div className="hidden md:block relative w-96 ml-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-green-500 sm:text-sm" placeholder="Search destinations, trips..." />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
                                <a href="#" className="hover:text-gray-900">Explore</a>
                                <a href="#" className="hover:text-gray-900">Trips</a>
                                <a href="#" className="hover:text-gray-900">Destinations</a>
                                <a href="#" className="hover:text-gray-900">Community</a>
                            </nav>
                            
                            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                                <button className="p-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                </button>
                                <button className="p-2 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </button>
                                <button className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden ml-1 border-2 border-transparent hover:border-gray-300 transition-all">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full p-1 text-blue-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </button>
                            </div>
                        </div>
                    </header>

                    {activeTab === 'finances' ? (
                        <div className='flex-1 overflow-y-auto'>
                            <FinanceOverview />
                        </div>
                    ) : (
                        <main className='flex-1 p-8 overflow-y-auto'>
                            <h1 className='font-bold md:pl-8 pl-2 md:text-[48px] text-[35.6px]'>Trip History</h1>

                            <div className=' md:flex relative md:items-center justify-center pl-2 gap-3 w-full md:pr-2 md:ml-7 md:mr-4 py-1 '>

                                <div className='border border-gray-300 bg-white flex items-center rounded-md md:pl- flex relative w-full px-3 py-1 '>
                                    <img src='src/images/search.svg' className='justify-start'></img>
                                    <input type="text" placeholder='Search destinations...' className='justify-start rounded-md flex border border-gray-50 bg-[#FFFFFF] md:pr-70 w-full outline-none'></input>
                                </div>
                                <div className='flex  items-center col-start-2 col-end-3 md:gap-2 gap-1  bg-white md:pl-1'>
                                    <div className='  rounded-md bg-[#0D28050D]  md:pl-1 pl-3 pr-2'>
                                        <select className='flex rounded-full '>
                                            <option className='flex rounded-full hover:bg-gray-100'>User Role</option>
                                            <option className=' rounded-md hover:bg-gray-100'>I Organized</option>
                                            <option className='flex rounded-full hover:bg-gray-100'>I Joined</option>
                                        </select>
                                    </div>
                                    <div className='rounded-md bg-[#0D28050D] md:pl-1 pl-2 pr-1 '>
                                        <select >
                                            <option>All Statuses</option>
                                            <option className='flex rounded-md'>Completed</option>
                                            <option>Upcoming</option>
                                            <option>Live</option>
                                            <option>Cancelled</option>
                                            <option>Draft</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <div className='md:flex md:items-center pt-7 gap-3 md:pl-8 pl-2 grid grid-rows-2'>
                                <div className='row-start-1 row-end-2 flex gap-1'>
                                    <button className='md:rounded-full rounded-2xl border border-gray-300 font-semibold text-[#0D2805CC] bg-[#0D2805CC] md:pt-2 md:pb-2 pt-1 pb-1 md:pl-6 md:pr-6 pl-1 pr-1 text-white '>All</button>
                                    <button className='md:rounded-full rounded-2xl border border-gray-300 font-semibold text-[#0D2805CC] hover:bg-[#0D2805CC] hover:text-white bg-white md:pt-2 md:pb-2 pt-1 pb-1 md:pl-6 md:pr-6 pl-1 pr-1 '>Upcoming</button>
                                    <button className='md:rounded-full rounded-2xl border border-gray-300 font-semibold text-[#0D2805CC] hover:bg-[#0D2805CC] hover:text-white bg-white md:pt-2 md:pb-2 pt-1 pb-1 md:pl-6 md:pr-6 pl-1 pr-1 '>Ongoing</button>
                                    <button className='md:rounded-full rounded-2xl border border-gray-300 font-semibold text-[#0D2805CC] hover:bg-[#0D2805CC] hover:text-white bg-white md:pt-2 md:pb-2 pt-1 pb-1 md:pl-6 md:pr-6 pl-1 pr-1'>Past</button></div>
                                <div className='row-start-2 row-end-3 flex gap-1'>
                                    <button className='md:rounded-full rounded-2xl border border-gray-300 font-semibold text-[#0D2805CC] hover:bg-[#0D2805CC] hover:text-white bg-white md:pt-2 md:pb-2 pt-1 pb-1 md:pl-6 md:pr-6 pl-1 pr-1'>Last Week</button>
                                    <button className='md:rounded-full rounded-2xl border border-gray-300 font-semibold text-[#0D2805CC] hover:bg-[#0D2805CC] hover:text-white bg-white md:pt-2 md:pb-2 pt-1 pb-1 md:pl-6 md:pr-6 pl-1 pr-1'>Last Year</button>
                                    <div className="relative inline-block">
                                        <button
                                            onClick={() => setIsOpen(!isOpen)}
                                            className="md:px-6 px-4 py-2 bg-white text-gray-700 md:rounded-full rounded-2xl hover:bg-[#0D2805CC] transition-colors border border-gray-200"
                                        >
                                            <img src='src/images/filters.svg'></img>
                                        </button>
                                        {isOpen && (
                                            <div className="absolute right-1 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-6">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                                                    <button onClick={() => setIsOpen(false)}>
                                                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                                    </button>
                                                </div>

                                                <div className="mb-8">
                                                    <h3 className="font-semibold mb-4">User Role</h3>
                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <input type="radio" name="role" className="w-4 h-4 accent-green-600" />
                                                            <span>I Organized</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 cursor-pointer">
                                                            <input type="radio" name="role" className="w-4 h-4 accent-green-600" />
                                                            <span>I Joined</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold mb-4">Trip Status</h3>
                                                    <div className="space-y-3">
                                                        {['Completed', 'Upcoming', 'Ongoing', 'Draft'].map((status) => (
                                                            <label key={status} className="flex items-center gap-3 cursor-pointer">
                                                                <input type="radio" name="status" className="w-4 h-4 accent-green-600"
                                                                    defaultChecked={status === 'Completed'}
                                                                />
                                                                <span>{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-4 mt-4">Place</h3>
                                                    <div className='space-y-3 '>
                                                        {['Sahara', 'Mediterranen', 'Beach', 'Mountains', 'City'].map((place) => (
                                                            <label key={place} className='flex items-center gap-3 cursor-pointer'>
                                                                <input type="radio" name="place" className="w-4 h-4 accent-green-600"
                                                                    defaultChecked={place === 'Completed'}
                                                                />
                                                                <span>{place}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-4 mt-4">Period</h3>
                                                    <div className='space-y-3 '>
                                                        {['Any time', 'Last Week', 'Last Month', 'Last Year'].map((period) => (
                                                            <label key={period} className='flex items-center gap-3 cursor-pointer'>
                                                                <input type="radio" name="period" className="w-4 h-4 accent-green-600"
                                                                    defaultChecked={period === 'Completed'}
                                                                />
                                                                <span>{period}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-4 mt-4">Agenda</h3>
                                                    <div className='flex items-center relative'>
                                                        <img src="src/images/date.svg" className='absolute pl-2'></img>
                                                        <input
                                                            placeholder="jj/mm/aaaa" className='  bg-white border-1 pt-1 pb-1 pl-9 border-green-400 rounded-md pr-12 text-gray-550' />

                                                    </div>
                                                </div>
                                                <div className='border border-gray-100 mt-5 mb-10'></div>
                                                <div className='grid grid-cols-2'>
                                                    <div className='col-start-1 col-end-2'>
                                                        <button className='border border-gray-400 rounded-md pl-11 pr-11 pt-2 pb-2 '>
                                                            <span>Reset</span>
                                                        </button>

                                                    </div>
                                                    <div className='col-start-2 col-end-3'>
                                                        <button type='submit' className='text-white bg-green-500 rounded-md pb-2 pt-2 pl-6 pr-5 '>
                                                            Apply Filters
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='md:pl-9 pl-2 pt-6 pb-4 flex  '>
                                <p className=' text-[16px] font-black pr-1'>5 </p>
                                <p className=' text-[16px] font-light'>destinations found</p>
                            </div>
                            <div className='grid grid-cols-1 md:grid md:grid-cols-2 pr-1 gap-5'>
                                <div className='md:col-start-1 md:col-end-2  md:flex flex-col'>
                                    <div className='flex-col  gap-4 md:pl-9 md:py-5 pl-2 w-full'>
                                        <div className='bg-white rounded-2xl shadow-sm mb-11 relative w-full'>
                                            <img src="src/images/timgadd.png" className='flex md:w-[470.4480285644531] md:h-[273.7151794433594]  pl-1 pb-2 object-cover  rounded-t-2xl'></img>
                                            <div className='absolute top-4 left-4 bg-[#0D2805E5] text-white text-[17.11px] rounded-md py-1 px-3'>COMPLETED</div>
                                            <div className='absolute top-4 right-4 bg-white p-2 rounded-full' >
                                                <img src='src/images/couronne.svg'></img>
                                            </div>
                                            <p className='md:text-[25.09px] text-[18.24px] font-bold pl-3'>Exploring Timgad Ruins</p>
                                            <div className='flex items-center pt-1 pl-3'>
                                                <img src="src/images/localis.svg"></img>
                                                <p className='text-[#0D280599] md:text-[18.99px] text-[14.51px]'>Starting point: Batna, Algeria</p>
                                            </div>
                                            <div className='flex items-center pt-1 pl-3 pb-3'>
                                                <p className='text-[14.51px]'>Jan 15-Jan 22 2026 </p>
                                                <p className='text-[#0D280599] pl-1'>(Completed)</p>
                                            </div>
                                            <div className='border border-gray-100 mt-3 mb-3 ml-3 mr-3'></div>
                                            <div className='flex items-center'>
                                                <div className='flex items-center -space-x-5'>
                                                    <img src="src/images/img1.png" className='pl-1'></img>
                                                    <img src="src/images/img2.png" className=''></img>
                                                    <img src="src/images/img3.png"></img>
                                                </div>
                                                <p className='pl-3 text-[12.44px]'>15 participants</p>
                                            </div>
                                            <div className='border border-gray-100 mt-2 mb-10'></div>
                                            <div className='flex items-center justify-between pb-8'>
                                                <button className='flex items-center md:pl-3'>
                                                    <img src="src/images/chathub.svg" className='md:pr-2 pr-0.5'></img>
                                                    <span>Chat Hup</span>
                                                </button>
                                                <button className='border border-gray-400 rounded-md md:pb-2 md:pt-2 md:pr-3 md:pl-3 md:mr-3 p-1 mr-2'>
                                                    <span>View more</span>
                                                </button>

                                            </div>
                                        </div>


                                        <div className='bg-white rounded-2xl shadow-sm mb-10 relative'>
                                            <img src="src/images/ghardaia.png" className='flex w-[470.4480285644531] h-[273.7151794433594] pb-2 rounded-t-2xl'></img>
                                            <div className='absolute top-4 left-4 bg-[#FF5900E5] text-white text-[17.11px] rounded-md py-1 px-3'>UPCOMING</div>
                                            <div className='absolute top-4 right-4 bg-white p-2 rounded-full' >
                                                <img src='src/images/couronne.svg'></img>
                                            </div>
                                            <p className='md:text-[25.09px] text-[18.24px] font-bold pl-3'>Discover Ghardaïa Culture</p>
                                            <div className='flex items-center pt-1 pl-3'>
                                                <img src="src/images/localis.svg"></img>
                                                <p className='text-[#0D280599] md:text-[18.99px] text-[14.51px] '>Starting point: Ghardaïa, Algeria</p>
                                            </div>
                                            <div className='flex items-center pt-1 pl-3 pb-3'>
                                                <p className='text-[14.51px]'>Apr 5-Apr 12 2026  </p>
                                                <p className='text-[#0D280599] pl-1'>(Upcoming)</p>
                                            </div>
                                            <div className='border border-gray-100 mt-3 mb-3 ml-3 mr-3'></div>
                                            <div className='flex items-center'>
                                                <div className='flex items-center -space-x-5'>
                                                    <img src="src/images/img3.png" className='pl-1'></img>
                                                    <img src="src/images/img1.png" className=''></img>
                                                    <img src="src/images/img2.png"></img>
                                                </div>
                                                <p className='pl-3 text-[12.44px]'>7 participants</p>
                                            </div>
                                            <div className='border border-gray-100 mt-2 mb-9'></div>
                                            <div className='flex items-center justify-between pb-8'>
                                                <button className='flex items-center md:pl-3'>
                                                    <img src="src/images/chathub.svg" className='md:pr-2 pr-0.5'></img>
                                                    <span>Chat Hup</span>
                                                </button>
                                                <button className='border border-gray-400 rounded-md md:pb-2 md:pt-2 md:pr-3 md:pl-3 md:mr-3 p-1 mr-2'>
                                                    <span>View more</span>
                                                </button>

                                            </div>
                                        </div>


                                        <div className='bg-white rounded-2xl shadow-sm md:mb-10 mb-2 relative'>
                                            <img src="src/images/algiers.png" className='flex w-[470.4480285644531] h-[273.7151794433594] pb-2 rounded-t-2xl'></img>
                                            <div className='absolute top-4 left-4 bg-[#6A7282E5] text-white text-[17.11px] rounded-md py-1 px-3'>CANCELLED</div>
                                            <div className='absolute top-4 right-4 bg-white p-2 rounded-full' >
                                                <img src='src/images/person.svg'></img>
                                            </div>
                                            <p className='md:text-[25.09px] text-[18.24px] font-bold pl-3'>Casbah Algiers</p>
                                            <div className='flex items-center pt-1 pl-3'>
                                                <img src="src/images/localis.svg"></img>
                                                <p className='text-[#0D280599] md:text-[18.99px] text-[14.51px]'>Starting point: Algiers</p>
                                            </div>
                                            <div className='flex items-center pt-1 pl-3 pb-3'>
                                                <p className='text-[14.51px]'>Oct 10-Oct 15  </p>
                                                <p className='text-[#0D280599] pl-1'>(Cancelled)</p>
                                            </div>
                                            <div className='border border-gray-100 mt-3 mb-3 ml-3 mr-3'></div>
                                            <div className='flex items-center'>
                                                <div className='flex items-center -space-x-5'>
                                                    <img src="src/images/img1.png" className='pl-1'></img>
                                                    <img src="src/images/img2.png" className=''></img>
                                                    <img src="src/images/img3.png"></img>
                                                </div>
                                                <p className='md:pl-3 pl-15 text-[12.44px]'>You (friend 1, 2) + 12 others</p>
                                            </div>
                                            <div className='border border-gray-100 mt-2 mb-9'></div>
                                            <div className='flex items-center justify-between pb-8'>
                                                <button className='flex items-center md:pl-3'>
                                                    <img src="src/images/chathub.svg" className='md:pr-2 pr-0.5'></img>
                                                    <span>Chat Hup</span>
                                                </button>
                                                <button className='border border-gray-400 rounded-md md:pb-2 md:pt-2 md:pr-3 md:pl-3 md:mr-3 p-1 mr-2'>
                                                    <span>View more</span>
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='flex md:col-start-2 md:col-end-3 md:pr-5'>

                                    <div className='flex-col  gap-4 pl-2 py-5'>
                                        <div className='bg-white rounded-2xl shadow-sm mb-10 relative'>
                                            <img src="src/images/oran.png" className='flex w-[470.4480285644531] h-[273.7151794433594] pb-2 rounded-t-2xl'></img>
                                            <div className='absolute top-4 left-4 bg-[#00B70DE5] text-white text-[17.11px] rounded-md py-1 px-3'>LIVE</div>
                                            <div className='absolute top-4 right-4 bg-white p-2 rounded-full' >
                                                <img src='src/images/person.svg'></img>
                                            </div>
                                            <p className='md:text-[25.09px] text-[18.24px] font-bold pl-3'>Mediterranean</p>
                                            <div className='flex items-center pt-1 pl-3'>
                                                <img src="src/images/localis.svg"></img>
                                                <p className='text-[#0D280599] md:text-[18.99px] text-[14.51px] '>Starting point: Oran, Algeria</p>
                                            </div>
                                            <div className='flex items-center pt-1 pl-3 pb-3'>
                                                <p className='text-[14.51px]'>Mar 10-Mar 20 2026  </p>
                                                <p className='text-[#0D280599] text-[14.51px] pl-1 '>(Live)</p>
                                            </div>
                                            <div className='border border-gray-100 mt-3 mb-3 ml-3 mr-3'></div>
                                            <div className='flex items-center'>
                                                <div className='flex items-center -space-x-5'>
                                                    <img src="src/images/img2.png" className='pl-1'></img>
                                                    <img src="src/images/img1.png" className=''></img>
                                                </div>
                                                <p className='md:pl-3 text-[12.44px] pl-11'>You (friend 1, 2) + 7 others</p>
                                            </div>
                                            <div className='border border-gray-100 mt-2 mb-9'></div>
                                            <div className='flex items-center justify-between pb-8'>
                                                <button className='flex items-center md:pl-3'>
                                                    <img src="src/images/chathub.svg" className='md:pr-2 pr-1'></img>
                                                    <span>Chat Hup</span>
                                                </button>
                                                <button className='border border-gray-400 rounded-md md:pb-2 md:pt-2 md:pr-3 md:pl-3 md:mr-3 p-1 mr-1'>
                                                    <span >View more</span>
                                                </button>

                                            </div>
                                        </div>
                                        <div className='bg-white rounded-2xl shadow-sm mb-10 relative'>
                                            <img src="src/images/constantine.png" className='flex w-[470.4480285644531] h-[273.7151794433594] pb-2 rounded-t-2xl'></img>
                                            <div className='absolute top-4 left-4 bg-[#F0B100E5] text-white text-[17.11px] rounded-md py-1 px-3'>DRAFT</div>
                                            <div className='absolute top-4 right-4 bg-white p-2 rounded-full' >
                                                <img src='src/images/couronne.svg'></img>
                                            </div>
                                            <p className='md:text-[25.09px] text-[17.04px] font-bold pl-3'>Constantine Bridges</p>
                                            <div className='flex items-center pt-1 pl-3'>
                                                <img src="src/images/localis.svg"></img>
                                                <p className='text-[#0D280599] md:text-[18.99px] text-[14.51px]'>Starting point: Constantine</p>
                                            </div>
                                            <div className='flex items-center pt-1 pl-3 pb-3'>
                                                <p className='text-[14.51px]'>May 10-May 15 2026 </p>
                                                <p className='text-[#0D280599] pl-1'>(Draft) </p>
                                            </div>
                                            <div className='border border-gray-100 mt-3 mb-3 ml-3 mr-3'></div>
                                            <div className='flex items-center'>
                                                <div className='flex items-center -space-x-5'>
                                                    <img src="src/images/img1.png" className='pl-1'></img>
                                                    <img src="src/images/img2.png" className=''></img>
                                                </div>
                                                <p className='pl-3 text-[12.44px]'>15 participants</p>
                                            </div>
                                            <div className='border border-gray-100 mt-2 mb-9'></div>
                                            <div className='flex items-center justify-between pb-8'>
                                                <button className='flex items-center md:pl-3'>
                                                    <img src="src/images/editdraft.png" className='md:pr-2 pr-0.5'></img>
                                                    <span>Edit draft</span>
                                                </button>
                                                <button className='border border-gray-400 rounded-md md:pb-2 md:pt-2 md:pr-3 md:pl-3 md:mr-3 p-1 mr-2'>
                                                    <span>Post</span>
                                                </button>

                                            </div>
                                        </div>

                                    </div>


                                </div>

                            </div>
                        </main>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashbord;