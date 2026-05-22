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

const SignupForm = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, isLoading, error } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (!displayName.trim()) {
      setLocalError('Display name is required');
      return;
    }

    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setLocalError('Username can only contain lowercase letters, numbers, and underscores');
      return;
    }

    try {
      await signUp(email, password, displayName, username);
      navigate('/profile');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create account');
    }
  };

  const handleGoogleSignup = async () => {
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to sign up with Google');
    }
  };
  return (
    <div className="w-full h-screen max-w-4xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-row bg-white">
        
        <div className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col justify-center overflow-y-auto h-full">
          <Link to="/">
            <img 
              src={logo} 
              alt="Hawes Logo" 
              className="w-40 mb-6 hover:opacity-80 transition-opacity cursor-pointer" 
            />
          </Link>

          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-gray-600 text-sm mb-6">Join over 10,000 teams building the future today.</p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {(error || localError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {localError || error?.message}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Display Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                placeholder="john_doe" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="********" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="********" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:!bg-[#E64A19] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md shadow-lg transition active:scale-95 mt-2 focus:!outline-none "
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase font-semibold text-gray-500 z-10">
              <span className="bg-white px-3">Or sign up with</span>
            </div>
          </div>

          {/* Boutons Reseaux Sociaux check later */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="flex justify-center py-2 px-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={G} alt="google"className='h-[25px] w-[25px]' />
            </button>
            <button 
              type="button"
              disabled={isLoading}
              className="flex justify-center py-2 px-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={fb} alt="facebook"className='h-[25px] w-[25px]' />
            </button>
            <button 
              type="button"
              disabled={isLoading}
              className="flex justify-center py-2 px-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={A} alt="apple"className='h-[25px] w-[25px]' />
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-4">
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
          {/* Overlay */}
          <div className="absolute inset-0 bg-green-900/40 mix-blend-multiply"></div>
          
          {/*témoignage */}
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

export default SignupForm;

