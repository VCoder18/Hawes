export function ProfileTabs() {
  return (
    <div className="border-b border-[#e2e8f0] mb-6 sm:mb-8">
      <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 px-1">
        <button className="pb-4 pt-2 border-b-2 border-[#00b70d] text-[#00b70d] font-bold text-sm whitespace-nowrap">
          Posts
        </button>
        <button className="pb-4 pt-2 border-b-2 border-transparent text-text-[#ff5900] font-bold text-sm hover:text-[#00b70d] whitespace-nowrap">
          Trips
        </button>
        <button className="pb-4 pt-2 border-b-2 border-transparent text-text-[#ff5900] font-bold text-sm hover:text-[#00b70d] whitespace-nowrap">
          Destinations
        </button>
        <button className="pb-4 pt-2 border-b-2 border-transparent text-text-[#ff5900] font-bold text-sm hover:text-[#00b70d] whitespace-nowrap">
          Saved
        </button>
        <button className="pb-4 pt-2 border-b-2 border-transparent text-text-[#ff5900] font-bold text-sm hover:text-[#00b70d] whitespace-nowrap">
          Reviews
        </button>
        <button className="pb-4 pt-2 border-b-2 border-transparent text-text-[#ff5900] font-bold text-sm hover:text-[#00b70d] whitespace-nowrap">
          Activity
        </button>
      </div>
    </div>
  );
}


