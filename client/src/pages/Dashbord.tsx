import { useState } from 'react';
import { X, LayoutDashboard, Compass, User, Users, Settings, Plus, Search, SlidersHorizontal } from 'lucide-react'; 
import { Link } from "react-router-dom";
import { TripCard } from "@/components/BrowseTrips/TripCard";

const dashboardTrips = [
  {
    id: "1",
    title: "Exploring Timgad Ruins",
    category: "completed",
    difficulty: "moderate",
    images: ["src/images/timgadd.png"],
    start_date: "2026-01-15T00:00:00Z",
    end_date: "2026-01-22T00:00:00Z",
    current_participants: 15,
    max_participants: 20,
    min_participants: 10,
    price: 3500,
    description: "",
    stops: [{ id: "1", label: "Batna, Algeria", stop_type: "meeting_point", location: {}, destination_id: null, trip_id: "1", created_at: null, updated_at: null }]
  },
  {
    id: "2",
    title: "Discover Ghardaïa Culture",
    category: "upcoming",
    difficulty: "easy",
    images: ["src/images/ghardaia.png"],
    start_date: "2026-04-05T00:00:00Z",
    end_date: "2026-04-12T00:00:00Z",
    current_participants: 7,
    max_participants: 15,
    min_participants: 5,
    price: 4500,
    description: "",
    stops: [{ id: "2", label: "Ghardaïa, Algeria", stop_type: "meeting_point", location: {}, destination_id: null, trip_id: "2", created_at: null, updated_at: null }]
  },
  {
    id: "3",
    title: "Casbah Algiers",
    category: "cancelled",
    difficulty: "moderate",
    images: ["src/images/algiers.png"],
    start_date: "2025-10-10T00:00:00Z",
    end_date: "2025-10-15T00:00:00Z",
    current_participants: 15,
    max_participants: 20,
    min_participants: 10,
    price: 2000,
    description: "",
    stops: [{ id: "3", label: "Algiers", stop_type: "meeting_point", location: {}, destination_id: null, trip_id: "3", created_at: null, updated_at: null }]
  },
  {
    id: "4",
    title: "Mediterranean",
    category: "live",
    difficulty: "moderate",
    images: ["src/images/oran.png"],
    start_date: "2026-03-10T00:00:00Z",
    end_date: "2026-03-20T00:00:00Z",
    current_participants: 10,
    max_participants: 15,
    min_participants: 8,
    price: 6000,
    description: "",
    stops: [{ id: "4", label: "Oran, Algeria", stop_type: "meeting_point", location: {}, destination_id: null, trip_id: "4", created_at: null, updated_at: null }]
  },
  {
    id: "5",
    title: "Constantine Bridges",
    category: "draft",
    difficulty: "hard",
    images: ["src/images/constantine.png"],
    start_date: "2026-05-10T00:00:00Z",
    end_date: "2026-05-15T00:00:00Z",
    current_participants: 15,
    max_participants: 25,
    min_participants: 10,
    price: 4000,
    description: "",
    stops: [{ id: "5", label: "Constantine", stop_type: "meeting_point", location: {}, destination_id: null, trip_id: "5", created_at: null, updated_at: null }]
  }
];

const Dashbord = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
    <div className='flex flex-col md:flex-row gap-6 w-full'>
        {/* Local Dashboard Sidebar */}
        <div className='w-full md:w-64 shrink-0'>
            <nav className='flex flex-col gap-2'>
                <Link to="/" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                    <LayoutDashboard className="w-5 h-5" />   
                    <span className='pl-3'>Home</span>
                </Link>
                <Link to="/dashboard" className="px-4 py-3 text-[#00B70D] font-medium flex items-center bg-[#00B70D1A] rounded-xl transition-colors">
                    <Compass className="w-5 h-5" />   
                    <span className='pl-3'>My Trips</span>
                </Link>
                <Link to="/browse" className="px-4 py-3 text-gray-700 font-medium flex items-center hover:bg-[#00B70D1A] hover:text-[#00B70D] rounded-xl transition-colors">
                    <Compass className="w-5 h-5" />   
                    <span className='pl-3'>Explore</span>
                </Link>

                <div className='border-t border-gray-200 my-2'></div>
                 
                <div className="px-2">
                    <Link to="/create-trip" className='w-full flex items-center justify-center gap-2 border-2 border-[#FF5900] rounded-xl py-3 px-4 hover:bg-[#FF5900] hover:text-white group transition-colors'>
                        <Plus className="w-5 h-5 text-[#FF5900] group-hover:text-white" />
                        <span className='text-[#FF5900] group-hover:text-white font-semibold'>Create New Trip</span>
                    </Link>
                </div>
                 
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

        {/* Dashboard Main Content */}
        <div className='flex-1 flex flex-col min-w-0'>
            <main className='w-full pb-8'>
                <h1 className="font-['Merriweather'] font-bold text-3xl md:text-4xl text-[#0d2805] mb-8">Trip History</h1>

                {/* Search & Filters Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                className="w-full pl-12 pr-4 py-3 border border-[#e2e8f0] rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b70d] transition-all"
                            />
                        </div>

                        {/* Selectors */}
                        <div className="flex gap-2">
                            <select className="appearance-none cursor-pointer bg-no-repeat bg-[position:right_1rem_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%230d2805%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] pr-10 pl-5 py-3 bg-[#0D28050D] hover:bg-[#0D28051A] text-[#0d2805] font-semibold rounded-xl border-none outline-none focus:ring-2 focus:ring-[#00b70d] transition-colors shadow-sm">
                                <option>Role: Any</option>
                                <option>I Organized</option>
                                <option>I Joined</option>
                            </select>
                            
                            <select className="appearance-none cursor-pointer bg-no-repeat bg-[position:right_1rem_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%230d2805%22%3E%3Cpath%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%2F%3E%3C%2Fsvg%3E')] pr-10 pl-5 py-3 bg-[#0D28050D] hover:bg-[#0D28051A] text-[#0d2805] font-semibold rounded-xl border-none outline-none focus:ring-2 focus:ring-[#00b70d] transition-colors shadow-sm">
                                <option>All Statuses</option>
                                <option>Completed</option>
                                <option>Upcoming</option>
                                <option>Live</option>
                                <option>Cancelled</option>
                                <option>Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="mb-8 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all bg-[#00b70d] text-white shadow-lg">All</button>
                        <button className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all bg-white text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]">Upcoming</button>
                        <button className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all bg-white text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]">Ongoing</button>
                        <button className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all bg-white text-[#00b70d] border border-[#e2e8f0] hover:border-[#00b70d]">Past</button>

                        <div className="w-px h-6 bg-[#e2e8f0] mx-2 hidden sm:block"></div>

                        <button className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all bg-white text-gray-600 border border-[#e2e8f0] hover:border-gray-400">Last Week</button>
                        <button className="px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all bg-white text-gray-600 border border-[#e2e8f0] hover:border-gray-400">Last Year</button>

                        <div className="ml-auto relative inline-block">
            <button
             onClick={() => setIsOpen(!isOpen)}
             className="md:px-6 px-4 py-2 bg-white text-gray-700 md:rounded-full rounded-2xl hover:bg-[#0D2805CC] transition-colors border border-gray-200"
             >
             <SlidersHorizontal className="w-5 h-5" />
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
                    <input  type="radio" name="status"  className="w-4 h-4 accent-green-600" 
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
                            <input type="radio" name="place"  className="w-4 h-4 accent-green-600" 
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
                            <input type="radio" name="period"  className="w-4 h-4 accent-green-600" 
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
                    <input
                       placeholder="jj/mm/aaaa" className='w-full bg-white border border-green-400 py-2 pl-4 rounded-md text-gray-700' />
                 </div>
            </div> 
            <div className='border border-gray-100 mt-5 mb-5'></div>
            <div className='grid grid-cols-2 gap-4'>
                <button className='border border-gray-400 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors'>
                    <span>Reset</span>
                </button>
                <button type='submit' className='text-white bg-green-500 rounded-md py-2 px-4 hover:bg-green-600 transition-colors'>
                 Apply Filters
                </button>
            </div>
             </div>
              )}
            </div>
          </div>
        </div>
          
          <div className="mb-6">
            <p className="text-gray-500">
               <span className="font-bold text-[#00b70d]">5</span> trips found
            </p>
          </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {dashboardTrips.map(trip => (
                    <TripCard key={trip.id} trip={trip as any} isMine={true} />
                ))}
            </div>
            </main>
            </main>
        </div>
    </div>
    );
};

export default Dashbord;