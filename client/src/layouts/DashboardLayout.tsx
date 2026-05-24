import { useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function DashboardLayout() {
  const { tab } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const path = location.pathname;
  let activeTab = 'trips';
  if (path.startsWith('/dashboard')) {
    activeTab = tab?.toLowerCase() || 'trips';
  } else {
    const match = path.match(/^\/(\w+)/);
    if (match) activeTab = match[1];
  }

  return (
    <div className="flex min-h-screen bg-[#ffffe8]">
      <DashboardSidebar activeTab={activeTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
