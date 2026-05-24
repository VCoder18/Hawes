import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LayoutDashboard, Menu, Search, MessageSquare, Settings, LogOut, User, Languages } from "lucide-react";
import Avatar from "@/assets/images/pfp.svg";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen: _sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>(Avatar);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadAvatar = async () => {
      if (!user) {
        setAvatarUrl(Avatar);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (!isMounted) return;
          setAvatarUrl(Avatar);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          if (!isMounted) return;
          setAvatarUrl(Avatar);
          return;
        }

        const profile = await response.json();
        if (!isMounted) return;
        setAvatarUrl(profile?.avatar_url || Avatar);
      } catch {
        if (!isMounted) return;
        setAvatarUrl(Avatar);
      }
    };

    void loadAvatar();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('i18nextLng', nextLang);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
    }
  };

  const handleAuthNav = (path: string) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-[#ffffe8] border-b border-[#ffffc7] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-3">
        <div className="flex items-center justify-between gap-6 lg:gap-8">
          {/* Left Section: Hamburger + Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Menu - Mobile & Tablet Only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-bg-[#ff5900] rounded-lg transition-colors -ml-2"
            >
              <Menu className="size-6" />
            </button>

            <img 
              src={logo} 
              alt="Hawes Logo" 
              className="h-10 w-auto object-contain cursor-pointer" 
              onClick={() => navigate("/")} 
            />
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:flex flex-1 max-w-xs lg:mx-6">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-lg overflow-hidden border border-[#d6d0c4] shadow-sm">
              <div className="bg-white px-4 py-2 flex items-center">
                <Search className="size-[15px]" />
              </div>
              <input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-white flex-1 px-2 py-2 text-sm text-gray-900 outline-none"
              />
            </form>
          </div>

          {/* Navigation - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 lg:mr-6">
            <button onClick={() => handleAuthNav("/register")} className="text-[#334155] text-sm font-medium hover:text-[#00b70d] transition-colors cursor-pointer">{t('nav.explore')}</button>
            <button onClick={() => handleAuthNav("/trips")} className="text-[#334155] text-sm font-medium hover:text-[#00b70d] transition-colors cursor-pointer">{t('nav.trips')}</button>
            <button onClick={() => handleAuthNav("/browse")} className="text-[#334155] text-sm font-medium hover:text-[#00b70d] transition-colors cursor-pointer">{t('nav.destinations')}</button>
            <button onClick={() => handleAuthNav("/services")} className="text-[#334155] text-sm font-medium hover:text-[#00b70d] transition-colors cursor-pointer">{t('nav.services')}</button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className="bg-white border border-[#e2e8f0] p-2 sm:p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              title={i18n.language === 'en' ? 'Français' : 'English'}
            >
              <Languages className="size-4" stroke="#334155" />
            </button>
            <NotificationDropdown />
            <button className="bg-[#00b70d] p-2 sm:p-2.5 rounded-lg hover:bg-[#00b70d]-hover transition-colors">
              <MessageSquare className="size-4" stroke="white" />
            </button>
            
            {/* Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="size-8 sm:size-10 rounded-full overflow-hidden border-2 border-[rgba(19,127,236,0.2)] hover:border-[#00b70d] transition-colors"
              >
                <img src={avatarUrl} alt={t('header.profile')} className="size-full object-cover object-center" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  
                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e2e8f0] py-2 z-20">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="size-4" strokeWidth={2} />
                        {t('header.dashboard')}
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <User className="size-4" strokeWidth={2} />
                      {t('header.profile')}
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/settings/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <Settings className="size-4" strokeWidth={2} />
                      {t('header.settings')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <LogOut className="size-4" strokeWidth={2} />
                      {t('header.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

