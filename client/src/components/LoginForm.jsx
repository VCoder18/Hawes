import React from 'react';
import avatar from "../Shape.svg";
import fb from "../facebook.png";
import A from "../apple.png";
import G from "../google.png";
import image from "../télécharger (6).jpg";
import { Link } from 'react-router-dom';

const LoginForm = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 sm:bg-gray-100 sm:p-4 overflow-hidden">
      {/* Conteneur*/}
      <div className="flex flex-col flex-row w-full h-full sm:h-auto max-w-4xl bg-white md:rounded-2xl overflow-hidden shadow-2xl">
        
        {/*Form*/}
        <div className="w-full md:w-1/2 bg-[#FEFCE8] p-8 md:p-12 flex flex-col justify-center">
         
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-green-600 rounded-sm rotate-45 flex items-center justify-center shadow">
              <span className="text-white text-xs -rotate-45">★</span>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">HAWES</span>
          </div>

          {/* Titres */}
          <h2 className="text-3xl font-serif font-bold text-gray-950 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Please enter your details to log in to your account
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-800 mb-1.5 tracking-widest">Username / Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="w-full px-5 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm shadow-sm" 
              />
            </div>

            <div className="relative">
              <label className="block text-[11px] uppercase font-bold text-gray-800 mb-1.5 tracking-widest">Password</label>
              <input 
                type="password" 
                placeholder="********" 
                className="w-full px-5 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm shadow-sm" 
              />
              {/* eye icone*/}
              <div className="absolute right-4 top-10 text-gray-400 cursor-pointer hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
            </div>

            <button className="w-full bg-black hover:!bg-[#E64A19] text-white font-bold py-3.5 rounded-lg shadow-lg transition active:scale-95 mt-4 text-sm tracking-wide focus:!outline-none ">
              Log In
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-green-700 tracking-widest px-4">
              <span className="bg-[#FEFCE8] px-2">Or log in with</span>
            </div>
          </div>

          {/* reseau socieaux*/}
          <div className="grid grid-cols-3 gap-4">
            <button className="flex justify-center items-center py-2.5  bg-white  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm">
                <img src={G} alt="google"className='h-[25px] w-[25px]' />
            </button>
            <button className="flex justify-center items-center py-2.5  bg-white  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm">
                <img src={fb} alt="facebook"className='h-[25px] w-[25px]' />
            </button>
            <button className="flex justify-center items-center py-2.5  bg-white  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm">
                <img src={A} alt="apple"className='h-[25px] w-[25px]' />
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-12">
            Don't have an account? <Link to="/signup" className="text-green-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>

        {/*Image & Témoignage*/}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src={image}
            alt="Traveler" 
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-green-900/40 mix-blend-multiply"></div>
          
          {/*témoignage*/}
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <div className="flex text-yellow-400 mb-4 text-xl ">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <p className="text-2xl font-medium leading-tight mb-6">
              "I Like HAWES, that's it, i'm not putting that Lorem Ipsum stuff on my stuff"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                <img src={avatar} alt="Meow" />
               </div>
              <div>
                <p className="font-bold text-sm tracking-wide">Meow</p>
                <p className="text-xs opacity-80">Traveler</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;