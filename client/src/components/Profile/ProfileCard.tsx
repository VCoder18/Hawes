import { useNavigate } from "react-router";
import { Instagram, Globe, Twitter, Youtube, Facebook, Linkedin, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import svgPaths from "@/imports/svg_paths";
import imgImage from "@/assets/images/banner.jpg";
import catPfp from "@/assets/images/pfp.svg";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface UserProfile {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  location: string | null;
  social_links: string[] | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ProfileCardProps {
  viewingUsername?: string;
}

export function ProfileCard({ viewingUsername }: ProfileCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        let userProfile: UserProfile | null = null;

        if (viewingUsername) {
          const normalized = viewingUsername.toLowerCase();
          const response = await fetch(
            `${API_BASE_URL}/profiles/by-username/${encodeURIComponent(normalized)}?username=${encodeURIComponent(normalized)}&offset=0&limit=1`
          );

          if (!response.ok) {
            throw new Error(`Failed to load profile by username: ${response.status}`);
          }

          const payload = await response.json();
          userProfile = Array.isArray(payload)
            ? ((payload[0] as UserProfile | undefined) ?? null)
            : ((payload as UserProfile | null) ?? null);
        } else if (user) {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.access_token) {
            if (isMounted) setProfile(null);
            return;
          }

          const response = await fetch(`${API_BASE_URL}/profiles`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to load current profile: ${response.status}`);
          }

          userProfile = (await response.json()) as UserProfile;
        }

        if (isMounted) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user, viewingUsername]);

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile/${profile?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied!",
      description: "Profile URL copied to clipboard",
      variant: "success",
    });
  };

  const isOwnProfile = profile && user && profile.id === user.id;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-8 p-8 flex justify-center items-center min-h-[300px]">
        <Loader className="animate-spin size-6" />
      </div>
    );
  }

  const avatarUrl = profile?.avatar_url || catPfp;
  const bannerUrl = profile?.banner_url || imgImage;
  const displayName = profile?.display_name || 'User';
  const username = profile?.username || 'unknown';
  const bio = profile?.bio || '';
  const location = profile?.location || '';
  const role = profile?.role || 'traveler';
  
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-8">
      {/* Hero Banner */}
      <div className="w-full aspect-[16/5] overflow-hidden relative">
        <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover object-center" />
      </div>

      {/* Profile Info Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          {/* Profile Picture */}
          <div className="relative -mt-16 sm:-mt-20">
            <div className="bg-white p-1 rounded-full shadow-lg">
              <div className="size-28 sm:size-36 md:size-40 rounded-full overflow-hidden border-4 border-white">
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover object-center" />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 w-full sm:w-auto pb-4 sm:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-[#00b70d]">{displayName}</h2>
               {role !== 'traveler' && (
                  <div title={`Verified ${role}`} className="flex items-center">
                    <svg className="size-5 sm:size-6 shrink-0 fill-none" viewBox="0 0 22 21">
                    {/* color changes depending on roles : Blue for Agency, green for others */}
                    <path 
                    d={svgPaths.p13774060} 
                    fill={role === 'agency' ? "#3b82f6" : "#00b70d"} 
                    />
                    </svg>
                  </div>
                )}
            </div>

            <p className="text-base sm:text-lg mb-1">@{username}</p>
            <p className="text-base sm:text-lg text-[#475569] mb-2">{bio}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-3">
              {location && location !== 'Unknown' && (
                <>
                  <div className={`flex items-center gap-1 ${location === 'Foreign' ? 'text-[#ff5900]' : 'text-text-[#ff5900]'}`}>
                    <svg className="size-3" fill="none" viewBox="0 0 12 15">
                      <path d={svgPaths.p1a900f00} fill={location === 'Foreign' ? '#ff5900' : '#64748B'} />
                    </svg>
                    <span>{location}</span>
                  </div>
                  <div className="size-1 rounded-full bg-[#cbd5e1]" />
                </>
              )}
              <span className="text-text-[#00b70d] font-medium capitalize">
                {role === 'traveler' ? 'Traveler' : `Verified ${role}`}
              </span>
            </div>

            {/* Website & Social Links */}
            {profile?.social_links && profile.social_links.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {/* Website */}
                {profile.social_links[0] && (
                  <a
                    href={profile.social_links[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#ff5900] hover:text-[#00b70d] transition-colors"
                  >
                    <Globe className="size-4" />
                    <span>website</span>
                  </a>
                )}

                {/* Twitter */}
                {profile.social_links[1] && (
                  <a
                    href={profile.social_links[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#ff5900] hover:text-[#1DA1F2] transition-colors"
                  >
                    <Twitter className="size-4" />
                    <span className="hidden sm:inline">Twitter</span>
                  </a>
                )}

                {/* YouTube */}
                {profile.social_links[2] && (
                  <a
                    href={profile.social_links[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#ff5900] hover:text-[#FF0000] transition-colors"
                  >
                    <Youtube className="size-4" />
                    <span className="hidden sm:inline">YouTube</span>
                  </a>
                )}

                {/* Facebook */}
                {profile.social_links[3] && (
                  <a
                    href={profile.social_links[3]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#ff5900] hover:text-[#1877F2] transition-colors"
                  >
                    <Facebook className="size-4" />
                    <span className="hidden sm:inline">Facebook</span>
                  </a>
                )}

                {/* Instagram */}
                {profile.social_links[4] && (
                  <a
                    href={profile.social_links[4]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#ff5900] hover:text-[#E4405F] transition-colors"
                  >
                    <Instagram className="size-4" />
                    <span className="hidden sm:inline">Instagram</span>
                  </a>
                )}

                {/* LinkedIn */}
                {profile.social_links[5] && (
                  <a
                    href={profile.social_links[5]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#ff5900] hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin className="size-4" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto justify-start sm:justify-end">
            {isOwnProfile ? (
              <>
                {isOwnProfile && role === 'traveler' && (
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="flex-1 sm:flex-none bg-blue-50 text-blue-600 border border-blue-200 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors"
                    >
                    Become a Pro
                  </button>
                )}
                <button 
                  onClick={() => navigate("/settings/profile")}
                  className="flex-1 sm:flex-none bg-bg-[#ff5900] border border-[#e2e8f0] px-6 py-2 rounded-lg font-bold text-text-[#00b70d] text-sm hover:bg-[#e2e8f0] transition-colors"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 sm:flex-none bg-[#00b70d] px-6 py-2 rounded-lg font-bold text-white text-sm hover:bg-[#00b70d]-hover transition-colors"
                >
                  Share
                </button>
              </>
            ) : (
              <button 
                onClick={handleShare}
                className="flex-1 sm:flex-none bg-[#00b70d] px-6 py-2 rounded-lg font-bold text-white text-sm hover:bg-[#00b70d]-hover transition-colors"
              >
                Share
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#e2e8f0] divide-x divide-[#e2e8f0]">
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">12</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Trips Created</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">45</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Trips Joined</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">8</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Destinations</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">1.2k</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Followers</div>
        </div>
      </div>
        {/* --- INSERTION DE LA MODAL ICI --- */}
        {isVerificationModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 text-left">
                  <h3 className="text-xl font-bold text-gray-800">Professional Verification</h3>
                  <button 
                    onClick={() => setIsVerificationModalOpen(false)} 
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Requested Role</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00b70d]">
                      <option value="agency">Agency</option>
                      <option value="organization">Organization</option>
                      <option value="services">Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Professional Email</label>
                    <input type="email" placeholder="pro@company.com" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00b70d]" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                    <input type="tel" placeholder="+213 -- -- --" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-[#00b70d]" />
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      toast({
                        title: "Request sent",
                        description: "Verification request sent! Our team will review it.",
                        variant: "success",
                      });
                      setIsVerificationModalOpen(false);
                    }}
                    className="w-full py-4 bg-[#00b70d] text-white rounded-xl font-bold hover:bg-[#009a0b] transition-all mt-4 shadow-lg"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}


