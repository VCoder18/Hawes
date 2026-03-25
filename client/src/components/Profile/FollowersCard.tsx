import { followerImages } from "@/imports/constants";

export function FollowersCard() {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5">
      <h3 className="font-bold text-text-[#00b70d] mb-4">Followers You Know</h3>
      <div className="flex -space-x-2 mb-2">
        {followerImages.map((img, i) => (
          <div key={i} className="size-8 rounded-full border-2 border-white overflow-hidden">
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="size-8 rounded-full border-2 border-white bg-[#e2e8f0] flex items-center justify-center text-xs font-bold text-text-[#ff5900]">
          +72
        </div>
      </div>
      <p className="text-xs text-text-[#ff5900]">Espio, Shadow and 72 others you follow also follow Sonic</p>
    </div>
  );
}


