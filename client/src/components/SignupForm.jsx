import React from 'react';
import avatar from "../Shape.svg";
import fb from "../facebook.png";
import A from "../apple.png";
import G from "../google.png";
import image from "../télécharger (6).jpg";
import { Link } from 'react-router-dom';

const SignupForm = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 sm:bg-gray-100 sm:p-4 overflow-hidden">
      {/*Conteneur*/}
      <div className="flex flex-col flex-row w-full h-full sm:h-auto max-w-4xl bg-white md:rounded-2xl overflow-hidden shadow-2xl">
        
        {/*Formulaire*/}
        <div className="w-full md:w-1/2 bg-[#FEFCE8] p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-green-600 rounded-sm rotate-45 flex items-center justify-center">
              <span className="text-white text-[10px] -rotate-45">★</span>
            </div>
            <span className="font-bold text-gray-800 tracking-tight">HAWES</span>
          </div>

          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600 text-sm mb-8">Join over 10,000 teams building the future today.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="name@company.com" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" placeholder="********" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                <input type="password" placeholder="********" className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
              </div>
            </div>

            <button className="w-full bg-black hover:!bg-[#E64A19] text-white font-bold py-3 rounded-md shadow-lg transition active:scale-95 mt-2 focus:!outline-none ">
              Create Account
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FEFCE8] px-2 text-gray-500 font-semibold">Or sign up with</span></div>
          </div>

          {/* Boutons Reseaux Sociaux check later */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex justify-center py-2 px-4  bg-white  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm"><img src={G} alt="google"className='h-[25px] w-[25px]' /></button>
            <button className="flex justify-center py-2 px-4  bg-white  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm flex justify-center items-center"><img src={fb} alt="facebook"className='h-[25px] w-[25px]' /></button>
            <button className="flex justify-center py-2 px-4  bg-white  rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm"><img src={A} alt="apple"className='h-[25px] w-[25px]' /></button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-8">
            Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>

        {/*Image & Témoignage*/}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src={image} 
            alt="Traveler" 
            className="h-full w-full object-cover"
          />
          {/* Overlay dégradé vert */}
          <div className="absolute inset-0 bg-green-900/40 mix-blend-multiply"></div>
          
          {/*témoignage */}
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <div className="flex text-yellow-400 mb-4 text-xl">★★★★★</div>
            <p className="text-2xl font-medium leading-tight mb-6">
              "I Like HAWES, that's it, i'm not putting that Lorem Ipsum stuff on my stuff"
            </p>
            {/* ce meow la en question */}
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

export default SignupForm;