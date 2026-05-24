import avatar from "@/assets/images/pfp.svg";
import fb from "@/assets/images/facebook.png";
import A from "@/assets/images/apple.png";
import G from "@/assets/images/google.png";
import image from "@/assets/images/form_image.jpg";
import logo from "@/assets/images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to log in');
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to sign in with Google');
    }
  };
  return (
    <div className="w-full h-screen max-w-4xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-row bg-white">
        
        <div className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col justify-center overflow-y-auto h-full">
         
          <Link to="/">
            <img 
              src={logo} 
              alt="Hawes Logo" 
              className="w-40 h-auto object-contain mb-6 hover:opacity-80 transition-opacity cursor-pointer" 
            />
          </Link>

          {/* Titres */}
          <h2 className="text-3xl font-serif font-bold text-gray-950 mb-1">{t('auth.welcomeBack')}</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {t('auth.loginSubtitle')}
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {(error || localError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {localError || error?.message}
              </div>
            )}
            
            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-800 mb-1.5 tracking-widest">{t('auth.usernameOrEmail')}</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm shadow-sm" 
                required
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-gray-800 mb-1.5 tracking-widest">{t('auth.password')}</label>
              <input 
                type="password" 
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm shadow-sm" 
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:!bg-[#E64A19] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-lg transition active:scale-95 mt-4 text-sm tracking-wide focus:!outline-none "
            >
              {isLoading ? 'Logging in...' : t('auth.logIn')}
            </button>
          </form>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-green-700 tracking-widest z-10">
              <span className="bg-white px-3">{t('auth.orLogInWith')}</span>
            </div>
          </div>

          {/* reseau socieaux*/}
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex justify-center items-center py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <img src={G} alt="google"className='h-[25px] w-[25px]' />
            </button>
            <button 
              type="button"
              disabled={isLoading}
              className="flex justify-center items-center py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <img src={fb} alt="facebook"className='h-[25px] w-[25px]' />
            </button>
            <button 
              type="button"
              disabled={isLoading}
              className="flex justify-center items-center py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <img src={A} alt="apple"className='h-[25px] w-[25px]' />
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-4">
            {t('auth.noAccount')} <Link to="/register" className="text-green-600 font-bold hover:underline">{t('auth.signUp')}</Link>
          </p>
        </div>

        {/*Image & Témoignage*/}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src={image}
            alt={t('auth.traveler')} 
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
                <p className="text-xs opacity-80">{t('auth.traveler')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;

