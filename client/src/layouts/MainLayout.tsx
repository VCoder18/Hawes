import { useState } from 'react'
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout({ displayNavbar = true, displayFooter = true }: { displayNavbar?: boolean; displayFooter?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#ffffe8] min-h-screen w-full">
        {displayNavbar && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        {displayNavbar && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        <main className={displayNavbar ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8" : "w-full h-screen flex items-center justify-center"}>
            <Outlet />
        </main>
        {displayFooter && <Footer />}
    </div>
  )
}

