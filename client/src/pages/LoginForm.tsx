import avatar from "@/assets/images/pfp.svg";
import fb from "@/assets/images/facebook.png";
import A from "@/assets/images/apple.png";
import G from "@/assets/images/google.png";
import image from "@/assets/images/form_image.jpg";
import logo from "@/assets/images/logo.png";
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const LoginForm = () => {
  return (
    <div className="w-full sm:h-auto max-w-4xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-row bg-white overflow-hidden">
        
        <div className="w-full md:w-1/2 bg-[#ffffe8]-subtle p-8 md:p-10 flex flex-col justify-center overflow-y-auto">
         
          <Link to="/">
            <img 
              src={logo} 
              alt="Hawes Logo" 
              className="w-40 mb-8 hover:opacity-80 transition-opacity cursor-pointer" 
            />
          </Link>

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
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-800 mb-1.5 tracking-widest">Password</label>
              <input 
                type="password" 
                placeholder="********" 
                className="w-full px-5 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm shadow-sm" 
                required
              />
            </div>

            <button className="w-full bg-black hover:!bg-[#E64A19] text-white font-bold py-3.5 rounded-lg shadow-lg transition active:scale-95 mt-4 text-sm tracking-wide focus:!outline-none ">
              Log In
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-green-700 tracking-widest px-4">
              <span className="bg-[#ffffe8]-subtle px-2">Or log in with</span>
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
            Don't have an account? <Link to="/register" className="text-green-600 font-bold hover:underline">Sign up</Link>
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
            <div className="flex gap-1 mb-4 text-xl">
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
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
  );
};

export default LoginForm;

