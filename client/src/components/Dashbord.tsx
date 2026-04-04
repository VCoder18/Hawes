import React, {useState} from 'react' ;
import { X } from 'lucide-react'; 
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";

const Dashbord =() => {
    const [isOpen, setIsOpen] = useState(false);
    return (
    <div className='flex h-screen w-screen '>
        <div className='md:grid md:grid-cols-4 grid grid-cols-2'>
            <div className=' md:col-start-1 md:col-end-2 bg-white col-start-1 col-end-2'>
                <nav className='flex flex-col  gap-1 px-4 '>
                    <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC]  rounded-lg transition-colors "
                       onClick={() => setSidebarOpen(false)} >
                     <img src='src/images/home2.svg'></img>   
                     <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Home</span>
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:bg-[#00B70D1A] rounded-lg md:border  md:border-[#00B70D1A] border-[#00B70DCC] bg-white  transition-colors "
                       onClick={() => setSidebarOpen(false)} >
                     <img src='src/images/My Trips.svg'></img>   
                     <span className='text-[19.05px] pl-3 text-[#0D2805]'>My Trips</span>
                    </Link>


                    <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                       onClick={() => setSidebarOpen(false)} >
                     <img src='src/images/explore.svg'></img>   
                     <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Explore</span>
                    </Link>
                </nav>

                <div className='border border-[#00B70D33] mt-3 mb-1 ml-3 mr-3 px-5'></div>
                 <div >
                    <button className='border-2 border-[#FF5900] rounded-xl m-5 md:pr-18 md:pl-15 pt-2 py-2 pr-2 pl-2'>
                        <span className='text-[#FF5900] text-[19.05px]'>Create New Trip</span>
                    </button>
                 </div>
                 <div className='border border-[#00B70D33] mt-1 mb-3 ml-3 mr-3 px-5'></div>

                  <nav className='flex flex-col  gap-1 px-4 '>
                    <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                       onClick={() => setSidebarOpen(false)} >
                     <img src='src/images/profile.svg'></img>   
                     <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Profile</span>
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                       onClick={() => setSidebarOpen(false)} >
                     <img src='src/images/Community.svg'></img>   
                     <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Community</span>
                    </Link>
                    <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                       onClick={() => setSidebarOpen(false)} >
                     <img src='src/images/Settings.svg'></img>   
                     <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Settings</span>
                    </Link>
                </nav>
            </div>

            <div className='md:col-start-2 md:col-end-5 col-start-2 col-end-3 flex flex-col'>
                <header className=' bg-white border-b border-gray-200 min-h-[60px] flex items-center px-4'>
                    <Sidebar />



                    
                </header>
                
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
            </div>
            
        </div>
    </div>
    );
};

export default Dashbord;