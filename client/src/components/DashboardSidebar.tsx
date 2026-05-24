import { LayoutDashboard, Map, Building2, Bell, MessageSquareText, User, Users, Settings, Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface DashboardSidebarProps {
  activeTab: string;
}

export function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  const { t } = useTranslation();
  return (
    <div className="hidden md:flex w-auto shrink-0 bg-white border-r border-green-600/20 overflow-y-auto h-screen sticky top-0">
      <nav className="flex flex-col gap-1 p-4">
        <Link to="/" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'home' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
          <LayoutDashboard className="size-6" />
          <span className="text-lg font-medium">{t('sidebar.home')}</span>
        </Link>

        <Link to="/dashboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'trips' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
          <Map className="size-6" />
          <span className="text-lg font-medium">{t('sidebar.myTrips')}</span>
        </Link>

        <div className="flex flex-col gap-1 pl-4 mt-1">
          <Link to="/business" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeTab === 'business' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
            <Building2 className="size-5" />
            <span className="text-base font-medium">{t('dashboard.businessOverview')}</span>
          </Link>
          <Link to="/dashboard/notifications" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeTab === 'notifications' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
            <Bell className="size-5" />
            <span className="text-base font-medium">{t('sidebar.notifications')}</span>
          </Link>
          <Link to="/feedback" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeTab === 'feedback' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
            <MessageSquareText className="size-5" />
            <span className="text-base font-medium">Feedback</span>
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeTab === 'clients' ? 'bg-[#00B70D1A] text-[#00B70D]' : 'text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]'}`}>
            <Users className="size-5" />
            <span className="text-base font-medium">Clients</span>
          </Link>
        </div>

        <div className="border-t border-green-600/20 my-3" />

        <Link to="/create-trip" className="flex items-center justify-center gap-2 border-2 border-[#FF5900] rounded-xl py-3 px-4 hover:bg-[#FF5900] hover:text-white group transition-colors">
          <Plus className="size-5 text-[#FF5900] group-hover:text-white" />
          <span className="text-[#FF5900] group-hover:text-white font-semibold">{t('sidebar.createNewTrip')}</span>
        </Link>

        <div className="border-t border-green-600/20 my-3" />

        <Link to="/profile" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]">
          <User className="size-6" />
          <span className="text-lg font-medium">{t('sidebar.profile')}</span>
        </Link>
        <Link to="/community" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]">
          <Users className="size-6" />
          <span className="text-lg font-medium">{t('sidebar.community')}</span>
        </Link>
        <Link to="/settings/profile" className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-gray-700 hover:bg-[#00B70D1A] hover:text-[#00B70D]">
          <Settings className="size-6" />
          <span className="text-lg font-medium">{t('sidebar.settings')}</span>
        </Link>
      </nav>
    </div>
  );
}
