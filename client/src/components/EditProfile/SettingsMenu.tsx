import { settingsMenuItems } from "@/imports/constants";

export function SettingsMenu() {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Mobile: Horizontal scrollable tabs */}
      <div className="lg:hidden mb-6">
        <div className="flex flex-wrap gap-2 border-b border-[#e2e8f0] pb-2">
          {settingsMenuItems.map((item) => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                item.active
                  ? "bg-[#00b70d] text-white"
                  : "bg-white text-text-[#ff5900] border border-[#e2e8f0] hover:bg-bg-[#ff5900]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Vertical sidebar */}
      <div className="hidden lg:block bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-2">
        <nav className="space-y-1">
          {settingsMenuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-[#00b70d] text-white"
                  : "text-text-[#ff5900] hover:bg-bg-[#ff5900]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}


