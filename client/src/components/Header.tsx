import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, Search, Bell, MessageSquare, Settings, LogOut, User } from "lucide-react";
import Avatar from "../assets/images/pfp.svg";
import logo from "../assets/images/logo.png";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchValue)}`);
      setSearchValue("");
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
              className="h-10 cursor-pointer" 
              onClick={() => navigate("/")} 
            />
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:flex flex-1 max-w-xs lg:mx-6">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-lg overflow-hidden">
              <div className="bg-white px-4 py-2 flex items-center">
                <Search className="size-[15px]" />
              </div>
              <input
                type="text"
                placeholder="Search destinations, trips..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-white flex-1 px-2 py-2 text-sm text-text-[#ff5900] outline-none"
              />
            </form>
          </div>

          {/* Navigation - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 lg:mr-6">
            <Link to="/register" className="text-[#334155] text-sm font-medium hover:text-[#00b70d]">Explore</Link>
            <Link to="/create-trip" className="text-[#334155] text-sm font-medium hover:text-[#00b70d]">Trips</Link>
            <Link to="/browse" className="text-[#334155] text-sm font-medium hover:text-[#00b70d]">Destinations</Link>
            <Link to="/login" className="text-[#334155] text-sm font-medium hover:text-[#00b70d]">Community</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="bg-[#00b70d] p-2 sm:p-2.5 rounded-lg hover:bg-[#00b70d]-hover transition-colors">
              <Bell className="size-4" stroke="white" />
            </button>
            <button className="bg-[#00b70d] p-2 sm:p-2.5 rounded-lg hover:bg-[#00b70d]-hover transition-colors">
              <MessageSquare className="size-4" stroke="white" />
            </button>
            
            {/* Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="size-8 sm:size-10 rounded-full overflow-hidden border-2 border-[rgba(19,127,236,0.2)] hover:border-[#00b70d] transition-colors"
              >
                <img src={Avatar} alt="Profile" className="size-full object-cover" />
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
                        navigate("/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <User className="size-4" strokeWidth={2} />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/settings/profile");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <Settings className="size-4" strokeWidth={2} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // Handle logout
                        console.log("Logout clicked");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#334155] hover:bg-bg-[#ff5900] transition-colors flex items-center gap-2"
                    >
                      <LogOut className="size-4" strokeWidth={2} />
                      Logout
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

