import { useState } from 'react';
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';
export default function Errorpage ()  {
    const [sidebarOpen, setSidebarOpen] = useState(true);

 return (
  <div className='flex h-screen w-screen ' > 
   
    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />  
    
    <div className='flex-1 justify-center items-center text-center relative '>
        <div className='flex justify-center'>
        <div className='pt-38'>
            <img src="src/images/localisation.svg"></img>
        </div>
        <h1 className='text-[230px] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] via-[#FF4B2B] to-[#FF7E5F]'>
            4
        </h1>
        <h1 className='text-[230px] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7E5F] via-[#FF4B2B] to-[#FF7E5F]'>
          0  
        </h1>
        <h1 className='text-[230px] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FF7E5F] via-[#FF4B2B] to-[#4CAF50]'>
            4
        </h1>
        <div className='pt-4'>
            <img src="src/images/bousla.svg"></img>
        </div>
        <div className='pt-43'>
            <img src="src/images/avion.svg"></img>
        </div>
        </div>
        <div>
            <h1 className='text-black font-bold text-5xl pb-2 pt-2'>Page Not Found</h1>
            <p className='text-gray-400 '>Looks like you've wandered off the map! This destination doesn't </p>
            <p className='text-gray-400'> Exist in our travel guide.</p>
            <p className='text-green-500 italic pt-1'>Maybe you took a wrong turn at Albuquerque?</p>
               
        </div>
        <div className='grid md:grid-cols-2 grid-rows-2 justify-center md:items-center pt-6 '>
            <div className='md:col-start-1 md:col-end-2 md:pl-92 '>
              <button className='rounded-md bg-[#00B70D] m-4 p-3 pl-9 pr-15 flex justify-center '>
                <img src='src/images/home.svg'></img>
                <span className='text-white ml-3'> Back to Home</span>
              </button>
            </div>
            <div className='md:col-start-2 md:col-end-3'>
               <button className='rounded-md bg-white m-4 p-3 border border-[#00B70D] pl-9 pr-4 flex justify-center'>
                <img src='src/images/brawse.svg'></img>
                <span className='text-[#00B70D] ml-2'>Browse Destinations</span>
              </button>
            </div>

        </div>
     <div className=' flex justify-center '>
     <img src="src/images/points.svg"></img>
     </div>
    </div>








        
   </div>
    );
}