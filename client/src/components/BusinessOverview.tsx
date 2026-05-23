import React, {useState} from 'react' ;
import Sidebar from './Sidebar';
import { Link, useNavigate } from "react-router-dom";

const BusinessOverview = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [capacity, setCapacity] = useState(15);
    return (
        <div className='flex h-screen w-full '>
            <div className='md:grid-cols-4 grid grid-cols-1 w-full'>
                        <div className=' md:col-start-1 md:col-end-2 bg-white hidden md:block '>
                            <nav className='flex flex-col  gap-1 px-4 '>
                                <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC]  rounded-lg transition-colors "
                                   onClick={() => setSidebarOpen(false)} >
                                 <img src='src/images/home2.svg'></img>   
                                 <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Home</span>
                                </Link>
                                 <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] rounded-lg  border-[#00B70DCC] bg-white  transition-colors "
                                  onClick={() => setSidebarOpen(false)} >
                                 <img src='src/images/Mytrips.svg'></img>   
                                 <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>My Trips</span>
                                 </Link>
            
                                <Link to="/register" className="px-4 py-2 text-[#334155] font-medium flex items-center md:hover:bg-[#00B70D1A] hover:bg-white md:hover:border md:hover:border-[#00B70D1A] hover:border-[#00B70DCC] rounded-lg transition-colors "
                                   onClick={() => setSidebarOpen(false)} >
                                 <img src='src/images/explore.svg'></img>   
                                 <span className='text-[19.05px] pl-3 text-[#0D2805B2]'>Explore</span>
                                </Link>

                                       <div>
                              <button onClick={() => setServicesOpen(!servicesOpen)} className="w-full flex items-center justify-between px-4 py-2 text-[#334155] font-medium hover:bg-gray-100 rounded-lg transition-colors">
                               <div className="flex items-center gap-3">
                               <img src='src/images/services.svg'></img>  
                               <span className="text-[19.05px] pl-1 text-[#0D2805B2]">Services</span>
                               </div>
                              {/* Flèche Chevron */}
                               <svg  className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                               <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                               </svg>
                              </button>

{servicesOpen && (
                           <div className="ml-8 mt-1 flex flex-col gap-2  pl-4">
                           <button onClick={() => navigate('/business')} className="flex items-center gap-3 py-2 text-green-600 bg-[#00B70D14] rounded-xl ">
                           <img src='src/images/businesss.svg' className='pl-2'></img>  
                            <span className="text-[16px]">Business</span>
                           </button>
                           <button onClick={() => navigate('/clients')} className="flex items-center gap-3 py-2 pl-2 text-[#0D2805B2] ">
                           <img src='src/images/clients.svg'></img> 
                           <span className="text-[16px]">Clients</span>
                           </button>
                           <button onClick={() => navigate('/feedback')} className="flex items-center gap-3 py-2 pl-2 text-[#0D2805B2] ">
                           <img src='src/images/feedback.svg'></img> 
                           <span className="text-[16px]">Feedback</span>
                          </button>
                           <button onClick={() => navigate('/dashboard/finances')} className="flex items-center gap-3 py-2 pl-2 text-[#0D2805B2] ">
                           <img src='src/images/finance.svg'></img> 
                            <span className="text-[16px]">Finances</span>
                           </button>
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
                         <div className=' md:col-start-2 md:col-end-5 '>
<div className="flex items-center md:justify-center  ">
                         
                             <button className="flex items-center flex-shrink-0  space-x-2 md:px-6 px-3 md:py-3 py-2  md:bg-gray-50 rounded-xl md:border md:border-gray-100 md:shadow-sm "
                             onClick={() => navigate('/business')}>
                             <img src='src/images/businesss.svg' className='hidden md:block'></img> 
                             <span className="font-semibold text-green-600">Business</span>
                             </button>
 
                             <button className="flex items-center space-x-2 px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                             onClick={() => navigate('/clients')}>
                             <img src='src/images/clients.svg' className='hidden md:block'></img> 
                             <span className="font-semibold">Clients</span>
                             </button>
 
                            <button className="flex items-center space-x-2 px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={() => navigate('/feedback')}>
                             <img src='src/images/feedback.svg' className='hidden md:block'></img> 
                             <span className="font-semibold">Feedback</span>
                            </button>
 
                            <button className="flex items-center space-x-2 px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={() => navigate('/dashboard/finances')}>
                             <img src='src/images/finances.svg' className='hidden md:block'></img> 
                             <span className="font-semibold">Finances</span>
                            </button>
 
                          </div>
                        </div>

                        <div className="mb-3 mt-3 md:ml-13 ml-5">
                        <h1 className="md:text-[48px] text-[24px] font-bold text-gray-950 mb-3">Business Overview</h1>
                        <p className="md:text-[20.16px] text-[14px] font-medium text-[#79716B]">Manage your travel business, clients, and revenues.</p>
                        </div>
                                    

                    <div className="flex flex-col gap-6 p-4 md:p-10  w-full min-h-screen">
  
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="col-span-2 md:col-span-1 md:bg-white bg-[#FF59000D] p-5 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between md:flex-col md:items-start md:justify-center">
                        <div className="flex items-center gap-19  mb-4">
                        <img src='src/images/clientcapacity.svg' className='mt-1 hidden md:flex'></img> 
                        <img src='src/images/clientslimit.svg' className='mt-1 md:hidden flex'></img> 
                        <p className="text-[12.96px]  text-[#42493E] uppercase hidden md:block mb-4">Capacity</p>
                     </div>
                     <div className="flex items-center gap-3 md:flex-col md:items-start">
                     
                     <span className="text-[#1B1C19] font-semibold md:text-[19.44px] text-[14px]">Client Limit</span>
                                       {/* Le bloc interactif gris à droite */}
                    <div className='flex items-center bg-white md:border md:border-gray-50 md:shadow h-10 rounded-md px-3 py-2 gap-3'>
                    {/* Le chiffre */}
                    <span className='text-[16px] font-bold text-gray-800 md:min-w-[110px] w-12  '> {capacity} </span>

                    {/* Les flèches empilées */}
                    <div className='flex flex-col leading-[0.5]'>
                      <button 
                     onClick={() => setCapacity(prev => prev + 1)}
                     className='text-gray-400 hover:text-gray-600 text-[12px] p-0.5' >  ▲ </button>
                     <button 
                     onClick={() => setCapacity(prev => Math.max(1, prev - 1))}
                     className='text-gray-400 hover:text-gray-600 text-[12px] p-0.5' > ▼ </button>
                   </div>
                   </div>
                     </div>
                     <button className="md:flex hidden bg-[#FF4F32] text-white px-5 py-2 md:w-full md:mt-4 rounded-full md:rounded-2xl text-xs font-bold shadow-lg shadow-red-50">
                     Update Limit
                    </button>
                    <button className="md:hidden flex bg-[#FF4F32] text-white px-5 py-2 md:w-full md:mt-4 rounded-full md:rounded-2xl text-xs font-bold shadow-lg shadow-red-50">
                     Update
                    </button>
                    </div>

    
                    <div className="col-span-2 md:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
                     <div className="flex flex-row-reverse md:flex-col  justify-between md:justify-start md:items-start items-center md:mb-4">
                        <img src='src/images/revenue.svg' ></img> 
                        <p className="text-[10px] font-bold text-[#42493E] uppercase tracking-widest leading-none md:mt-5">Monthly Revenue</p>
                     </div>
                     
                     <div className="flex items-baseline gap-1 mt-2 md:mt-6">
                     <h2 className="text-2xl md:text-[32.4px] font-bold text-gray-800">42,500</h2>
                    <span className="text-[12px] text-gray-400 font-medium uppercase">DZD</span>
                    </div>
                    <div className='border border-gray-200 md:mt-10 hidden md:flex '> </div>

                    <div className='flex items-center justify-between'>
                      <p className='md:hidden flex font-bold  justify-start text-[12px] text-[#39684C] mt-3'><img src="src/images/flash.svg" className='mr-1'></img>On track</p>
                    <div className='flex  md:items-center items-end justify-end md:justify-start'>
                    <span className="text-[9px] text-[#42493E] mt-2 md:mt-4">Target: 50k </span>
                    <span className='text-[#BABCBEB2] text-[9.6px] mt-3  md:mt-5 ml-1'>DZD</span>
                    </div></div>
                    </div>

                    <div className="col-span-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                        <div className="flex flex-row md:flex-col    md:justify-start md:items-start items-center md:mb-4">
                          <img src='src/images/client.svg' className='mt-1 hidden md:flex'></img>
                          <img src='src/images/client2.svg' className='mt-1 md:hidden flex'></img> 
                        <p className="md:flex hidden text-[#42493E] text-[9px] font-bold uppercase tracking-widest leading-none md:mt-5 ml-1"> TOTAL ACTIVE CLIENTS</p>
                        <p className="md:hidden flex text-[#42493E] text-[9px] font-bold uppercase tracking-widest leading-none md:mt-5 ml-1 ">  CLIENTS</p>
                        </div>
                    
                    <h2 className="text-[20px] md:text-[38.88px] font-bold text-gray-800">148</h2>
                     <div className='border border-gray-200 mt-9  hidden md:flex'> </div>
                    <div className='flex items-center '>
                        <img src='src/images/i.svg' className='mt-5 mr-2'></img>
                    <p className="text-[12.96px] text-gray-400 mt-4">3 awaiting approval</p>
                    </div>
                    </div>

    
                  <div className="col-span-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
                    <div className="flex flex-row md:flex-col    md:justify-start md:items-start items-center md:mb-4">
                     <img src='src/images/rating.svg' className='mt-1 hidden md:flex'></img> 
                     <img src='src/images/ratingg.svg' className='mt-1 md:hidden flex'></img> 
                     <p className="md:flex hidden text-[#42493E] text-[9px] font-bold uppercase tracking-widest leading-none md:mt-5 ml-1 "> AVG RATING</p>
                     <p className="flex md:hidden text-[#42493E] text-[9px] font-bold uppercase tracking-widest leading-none md:mt-5 ml-1 ">  RATING</p>
                     </div>
                  
                   <div className='flex items-center'>
                   <h2 className="text-[20px] md:text-[38.88px] font-bold text-gray-800">4.9 </h2>
                   <h1 className='text-[13px] md:mt-4 mt-2'>⭐</h1>
                   <span className="text-gray-400 text-[14px] font-normal md:mt-4 mt-2">/5.0</span>
                   </div>
                   <div className='border border-gray-200 mt-9  hidden md:flex'> </div>
                 <p className="text-[12.96px] text-[#42493E] mt-4">112 verified reviews</p>
                 </div>
                </div>

                 <div className="bg-white p-6 rounded-3xl border-2 border-[#00B70D] shadow-sm mt-2 md:mx-23">
                  <h3 className="text-[#1B1C19] font-semibold mb-2 md:text-[18px] text-[14px]">Services Price Average</h3>
                  <p className=' text-[#42493E] text-[14px] md:flex hidden'>Aggregated value across all service tiers.</p>
                 <div className="flex items-center text-center md:justify-center md:gap-3 gap-1">
                 <h2 className="md:text-[48px] text-[24px] font-bold text-gray-800">8,250 </h2>
                 <span className="md:text-[23.04px] text-[14px] font-bold text-gray-400 md:mt-5 mt-2">DZD</span>
                 <span className='text-[14px] text-medium text-[#42493E] mt-6 md:flex hidden'>/ per booking</span>
                 <div className='bg-[#22C55E] inline-flex mt-2 pl-1  rounded-md'>
                 <img src='src/images/flash.svg' className='md:hidden flex'></img> 
                 <span className="bg-[#22C55E] md:hidden flex text-[#23501E] rounded-md text-center text-[12px] ml-1 pr-2  font-bold">+14.2% </span>
                 </div>
                 </div>
                 <div className='inline-flex shrink-0 w-fit h-fit items-center text-center bg-[#22C55E] rounded-md  md:ml-50 md:mr-50 pl-3 mt-3'>
                 <img src='src/images/flash.svg' className='md:flex hidden'></img> 
                 <span className="bg-[#22C55E] md:flex hidden text-[#23501E] rounded-md text-center text-[14px] px-3 py-1  font-bold">+14.2% from last quarter</span>
                 </div>
                 <p className='text-[#42493E] text-[12px] flex md:hidden mt-2'>Average price per booking this quarter.</p>
                 <div className='border border-gray-200 mt-5  md:hidden flex'> </div>
                 <div className="flex  md:mt-8 mt-4 text-[10px] justify-between md:items-center gap-2 text-gray-300  ">
                 <div className='flex md:flex-col items-center md:border-r md:border-gray-200 pr-1'>
                 <p className='md:text-[#42493E] text-[#717971] text-[10px] '>Lowest </p>
                 <div className='flex items-baseline'>
                 <span className='md:text-[14px] text-[12px] md:text-black text-[#717971] md:font-bold '>1.2k</span>
                 <span className='text-[7.68px] text-[#A6A6A6] ml-1 '>DZD</span>
                 </div>
                 </div>
                 <div className='flex md:flex-col items-center md:mr-290'>
                 <p className='md:text-[#42493E] text-[#717971] text-[10px] '>Highest </p>
                 <div className='flex items-baseline'>
                 <span className='md:text-[14px] text-[12px] md:text-black text-[#717971] md:font-bold'>25k+</span>
                 <span className='text-[7.68px] text-[#A6A6A6] '>DZD</span>
                 </div>
                 </div>
                 </div>
                 </div>

                  </div>

                </div>
            
            </div>



    );
};
export default BusinessOverview;