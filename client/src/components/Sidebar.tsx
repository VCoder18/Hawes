import { Link } from "react-router-dom";
import svgPaths from "../imports/svg_paths";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#ffffe8] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#ffffc7]">
            <div className="flex items-center gap-3">
              <div className="shrink-0 size-8">
                <svg className="size-full" fill="none" viewBox="0 0 32 32">
                  <path clipRule="evenodd" d={svgPaths.p8cde700} fill="#00B70D" fillRule="evenodd" />
                </svg>
              </div>
              <h1 className="font-bold text-text-[#00b70d] text-lg">Hawes</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-bg-[#ff5900] rounded-lg transition-colors"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className="flex w-full rounded-lg overflow-hidden">
              <div className="bg-white px-4 py-2 flex items-center">
                <svg className="size-[15px]" fill="none" viewBox="0 0 15 15">
                  <path d={svgPaths.p2dbaedc0} fill="#64748B" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations, trips..."
                className="bg-white flex-1 px-2 py-2 text-sm text-text-[#ff5900] outline-none"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              to="/register"
              className="px-4 py-3 text-[#334155] font-medium hover:bg-[#00b70d] rounded-lg transition-colors block"
              onClick={() => setSidebarOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/trips"
              className="px-4 py-3 text-[#334155] font-medium hover:bg-bg-[#ff5900] rounded-lg transition-colors block"
              onClick={() => setSidebarOpen(false)}
            >
              Trips
            </Link>
            <Link
              to="/browse"
              className="px-4 py-3 text-[#334155] font-medium hover:bg-bg-[#ff5900] rounded-lg transition-colors block"
              onClick={() => setSidebarOpen(false)}
            >
              Destinations
            </Link>
            <Link
              to="/login"
              className="px-4 py-3 text-[#334155] font-medium hover:bg-bg-[#ff5900] rounded-lg transition-colors block"
              onClick={() => setSidebarOpen(false)}
            >
              Community
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}


