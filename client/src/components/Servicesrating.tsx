import React, {useState} from 'react' ;
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";


const Servicesrating = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
     const [servicesOpen, setServicesOpen] = useState(false);
     
    return (
              <div className='flex h-screen w-full '>
                         <div className=' md:grid-cols-4 grid grid-cols-1 w-full'>
                                     <div className={`
                                     fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                                     ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                                     md:relative md:translate-x-0 md:flex md:flex-col`}>
                                     <div className=' md:col-start-1 md:col-end-2 bg-white '>
                                         <nav className='flex flex-col  gap-1 px-4 '>
                                             <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC]  rounded-lg transition-colors "
                                                onClick={() => setIsOpen(false)} >
                                              <img src='src/images/home2.svg'></img>   
                                              <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Home</span>
                                             </Link>
                                             <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] rounded-lg  hover:border-[#00B70DCC] bg-white  transition-colors "
                                                onClick={() => setIsOpen(false)} >
                                              <img src='src/images/Mytrips.svg'></img>   
                                              <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>My Trips</span>
                                             </Link>
                         
                         
                                             <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                                                onClick={() => setIsOpen(false)} >
                                              <img src='src/images/explore.svg'></img>   
                                              <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Explore</span>
                                             </Link>
                                                          <div>
                                                                 <button
                                                                   onClick={() => setServicesOpen(!servicesOpen)}
                                                                   className="w-full flex items-center justify-between px-4 py-2 text-[#334155] font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                                                 >
                                                                   <div className="flex items-center gap-3">
                                                                      <img src='src/images/services.svg'></img>  
                                                                     <span className="text-[19.05px] pl-1 text-[#0D2805B2] hover:border-[#00B70DCC] md:hover:bg-[#00B70D1A]">Services</span>
                                                                   </div>
                                                                   {/* Flèche Chevron */}
                                                                   <svg
                                                                     className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                                                                     fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                                   >
                                                                     <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                   </svg>
                                                                 </button>
                                                         
                                                                 {servicesOpen && (
                                                                   <div className="ml-8 mt-1 flex flex-col gap-2  pl-4">
                                                                     <Link to="/business" className="flex items-center gap-3 py-2  text-[#0D2805B2]" >
                                                                       <img src='src/images/businessn.svg' ></img>  
                                                                       <span className="text-[16px]" >Business</span>
                                                                     </Link>
                                                                     <Link to="/clients" className="flex items-center gap-3 py-2 pl-2 text-[#0D2805B2] ">
                                                                       <img src='src/images/clients.svg'></img> 
                                                                       <span className="text-[16px]">Clients</span>
                                                                     </Link>
                                                                     <Link to="/feedback" className="flex items-center gap-3 py-2 pl-2 text-green-600 bg-[#00B70D14] rounded-xl ">
                                                                       <img src='src/images/feedbackv.svg' ></img> 
                                                                       <span className="text-[16px]">Feedback</span>
                                                                     </Link>
                                                                     <Link to="/finances" className="flex items-center gap-3 py-2 pl-2 text-[#0D2805B2] ">
                                                                       <img src='src/images/finance.svg'></img> 
                                                                       <span className="text-[16px]">Finances</span>
                                                                     </Link>
                                                                   </div>
                                                                 )}
                                                               </div>
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

                                  {/* Bouton pour fermer (X) sur mobile */}
        <button 
            onClick={() => setIsOpen(false)} 
            className='md:hidden mt-10 text-sm text-gray-400'
        >
            ✕ Fermer le menu
        </button>
        </div>


                    <div className=' md:col-start-2 md:col-end-5 '>
                            <div className="flex items-center md:justify-center  ">
  
                            <div className="flex items-center bg-white md:border md:border-gray-200 md:rounded-2xl p-1 md:shadow-sm text-left">
    
                            <button className="flex items-center space-x-2 md:px-6 pl-1 pr-4 md:py-3 py-2 text-gray-500 hover:text-gray-700">
                            <img src='src/images/businessn.svg' className='hidden md:block'></img> 
                            <span className="font-semibold ">Business</span>
                            </button>

                            <button className="flex items-center space-x-2 md:px-6 px-4 md:py-3 py-2  text-gray-500 hover:text-gray-700 transition-colors">
                            <img src='src/images/clients.svg' className='hidden md:block'></img> 
                            <span className="font-semibold">Clients</span>
                            </button>

                           <button className="flex items-center flex-shrink-0  space-x-2 md:px-6 px-3 md:py-3 py-2  md:bg-gray-50 rounded-xl md:border md:border-gray-100 md:shadow-sm ">
                            <img src='src/images/feedbackv.svg' className='hidden md:block'></img> 
                           <span className="font-semibold text-green-600 md:text-base">Feedback</span>
                           </button>

                           <button className="flex items-center space-x-2 md:px-6 px-4 md:py-3 py-2  text-gray-500 hover:text-gray-700 transition-colors">
                            <img src='src/images/finances.svg' className='hidden md:block'></img> 
                           <span className="font-semibold">Finances</span>
                           </button>

                         </div>
                        </div>
                        <div className="mb-12 mt-3 md:ml-13 ml-5">
                        <h1 className="md:text-[48px] text-[41.6px] font-bold text-gray-950 md:mb-3 mb:2">Services Rating</h1>
                        <p className="md:text-[20.16px] text-[18.2px] font-medium text-[#79716B]">Manage your travel business, clients, and revenues across Algeria.</p>
                        </div>
 
                        <div className="flex flex-row md:flex-row items-center p-8 border border-orange-200 rounded-3xl bg-white shadow-sm gap-8 max-w-2xl md:ml-33 md:mb-12 mx-4 mb-9">
  
  <div className="flex flex-col items-center text-center">
    <h2 className="text-[55.3px] font-bold text-[#1C1917]">4.8</h2>
    
    <div className="flex my-2">
      <img src="src/images/stars.svg" alt="stars" className="h-6 w-auto" />
    </div>
    
    <p className="text-[#79716B] md:text-[16.13px] text-[15.6px] font-medium">1,081 total ratings</p>
  </div>

  <div className="hidden md:block w-px h-24 bg-gray-100 "></div>

  <div className="flex-1 w-full space-y-2 ">
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600 w-3">5</span>
      <img src="src/images/start.svg" className="w-3 h-3" />
      
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full" ></div>
      </div>
      
      <span className="text-xs text-gray-400 w-8">78%</span>
    </div>
    <div className="flex items-center gap-4 ">
      <span className="text-sm font-medium text-gray-600 w-3">4</span>
      <img src="src/images/start.svg" className="w-3 h-3" />
      
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full" ></div>
      </div>
      
      <span className="text-xs text-gray-400 w-8">14%</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600 w-3">3</span>
      <img src="src/images/start.svg" className="w-3 h-3" />
      
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <img src="src/images/3.svg" className='h-full' />
      </div>
      
      <span className="text-xs text-gray-400 w-8">5%</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600 w-3">2</span>
      <img src="src/images/start.svg" className="w-3 h-3" />
      
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <img src="src/images/2.svg"  />
      </div>
      
      <span className="text-xs text-gray-400 w-8">2%</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600 w-3">1</span>
      <img src="src/images/start.svg" className="w-3 h-3" />
      
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <img src="src/images/1.svg"  />
      </div>
      
      <span className="text-xs text-gray-400 w-8">1%</span>
    </div>

    </div>
</div>

        
<div className="max-w md:mx-12 mx-5 mb-8 md:bg-white md:rounded-3xl md:pb-   md:shadow-sm md:border md:border-gray-100 ">
  

  <div className="flex justify-between items-center  mb-6 md:bg-[#F5F5F4] md:bg-cover  p-1 py-4 - rounded-t-2xl">
    <div className="flex items-center gap-2 md:ml-3  ">
      <img src="src/images/sms.svg" className="w-5 h-5 " />
      <h3 className="font-semibold text-gray-800">Recent Feedback</h3>
    </div>
    <button className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 mr-5 px-3 py-1 rounded-lg">
      Newest <span>▼</span>
    </button>
  </div>

  <div className=" flex flex-col space-y-4 md:mx-3 mt-6">
    
    <div className="md:py-6 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm ">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img src="src/images/Leila.svg" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Leila M.</h4>
            <p className="text-xs text-gray-400">Oct 21, 2026</p>
          </div>
        </div>
        <img src="src/images/5stars.svg" className="h-4"  />
      </div>
      
      <p className="mt-3 text-gray-600 text-sm leading-relaxed ml-12">
        "The guided tour in Tassili was extraordinary. The logistics provided by Hawes were flawless and the local  guide knew every hidden spot. Highly recommend this for adventurous travelers."
      </p>
      
      <div className="mt-4 flex gap-4 text-xs font-medium text-gray-400">
        <img src="src/images/like.svg" />
        <button className="hover:text-green-600 flex items-center gap-1 font-medium text-[17.28px] text-[#A6A09B]">
           Helpful (14)
        </button>
        <button className="hover:text-green-600 font-medium text-[17.28px] text-[#A6A09B]">Reply</button>
      </div>
    </div>
<div className="md:py-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img src="src/images/samir.svg" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Samir K.</h4>
            <p className="text-xs text-gray-400">Oct 18, 2026</p>
          </div>
        </div>
        <img src="src/images/stars.svg" className="h-4"  />
      </div>
      
      <p className="mt-3 text-gray-600 text-sm leading-relaxed ml-12">
        "Great experience booking our stay in Timimoun. The oasis view was precisely as pictured. Only giving 4 stars because the transport was slightly delayed."
      </p>
      
      <div className="mt-4 flex gap-4 text-xs font-medium text-gray-400">
        <img src="src/images/like.svg" />
        <button className="hover:text-green-600 flex items-center font-medium text-[17.28px] gap-1 text-[#A6A09B]">
           Helpful (5)
        </button>
        <button className="hover:text-green-600 font-medium text-[17.28px] text-[#A6A09B]">Reply</button>
      </div>
    </div>
    <div className="md:py-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img src="src/images/nadia.svg" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Nadia F.</h4>
            <p className="text-xs text-gray-400">Oct 15, 2026</p>
          </div>
        </div>
        <img src="src/images/5stars.svg" className="h-4"  />
      </div>
      
      <p className="mt-3 text-gray-600 text-sm leading-relaxed ml-12">
        "Seamless booking process and exceptional customer support when we needed to change our dates for the   Ghardaïa trip. Will book again."
      </p>
      
      <div className="mt-4 flex gap-4 text-xs font-medium text-gray-400">
        <img src="src/images/like.svg" />
        <button className="hover:text-green-600 flex items-center gap-1 font-medium text-[17.28px] text-[#A6A09B]">
           Helpful (24)
        </button>
        <button className="hover:text-green-600 font-medium text-[17.28px] text-[#A6A09B]">Reply</button>
      </div>
    </div>
    </div>
    

  <div className="mt-4 text-center md:bg-[#F5F5F4] md:bg-cover p-1 py-4  rounded-b-2xl ">
    <button className="text-green-600 font-medium text-[20.16px] ">
      View all reviews
    </button>
  </div>
</div>
</div>
</div>
</div>
    

 );
};
export default Servicesrating;