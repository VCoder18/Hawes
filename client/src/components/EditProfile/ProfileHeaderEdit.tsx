import { Camera } from "lucide-react";
import imgImage from "@/assets/images/banner.jpg";
import imgImageBorder from "@/assets/images/pfp.svg";

export function ProfileHeaderEdit() {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-32 sm:h-40 md:h-48 overflow-hidden rounded-t-xl relative group">
        <img src={imgImage} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-text-[#00b70d] flex items-center gap-2 hover:bg-bg-[#ff5900] transition-colors">
            <Camera className="size-4" />
            Change Cover
          </button>
        </div>
      </div>

      {/* Profile Picture */}
      <div className="absolute -bottom-12 sm:-bottom-16 left-6">
        <div className="relative group">
          <div className="bg-white p-1 rounded-full shadow-lg">
            <div className="size-24 sm:size-32 rounded-full overflow-hidden border-4 border-white">
              <img src={imgImageBorder} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 bg-[#00b70d] p-2 rounded-full shadow-lg hover:bg-[#00b70d]-hover transition-colors">
            <Camera className="size-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}


