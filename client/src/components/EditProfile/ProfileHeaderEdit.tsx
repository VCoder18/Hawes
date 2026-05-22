import { Camera } from "lucide-react";
import imgImage from "@/assets/images/banner.jpg";
import imgImageBorder from "@/assets/images/pfp.svg";

interface ProfileHeaderEditProps {
  bannerUrl?: string | null;
  avatarUrl?: string | null;
  onBannerUpload: (file: File) => void;
  onAvatarUpload: (file: File) => void;
  isBannerUploading?: boolean;
  isAvatarUploading?: boolean;
}

export function ProfileHeaderEdit({
  bannerUrl,
  avatarUrl,
  onBannerUpload,
  onAvatarUpload,
  isBannerUploading = false,
  isAvatarUploading = false,
}: ProfileHeaderEditProps) {
  const handleBannerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onBannerUpload(file);
    }
    event.target.value = "";
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
    event.target.value = "";
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="w-full aspect-[16/5] overflow-hidden rounded-t-xl relative group">
        <img src={bannerUrl || imgImage} alt="Banner" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-text-[#00b70d] flex items-center gap-2 hover:bg-bg-[#ff5900] transition-colors cursor-pointer">
            <Camera className="size-4" />
            {isBannerUploading ? "Uploading..." : "Change Cover"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleBannerFileChange}
              disabled={isBannerUploading}
            />
          </label>
        </div>
        {isBannerUploading && (
          <div className="absolute inset-0 z-10 bg-black/35 flex items-center justify-center text-white text-sm font-semibold tracking-wide pointer-events-none">
            Uploading
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="absolute -bottom-12 sm:-bottom-16 left-6">
        <div className="relative group">
          <div className="bg-white p-1 rounded-full shadow-lg">
            <div className="size-24 sm:size-32 rounded-full overflow-hidden border-4 border-white">
              <img src={avatarUrl || imgImageBorder} alt="Profile" className="w-full h-full object-cover object-center" />
            </div>
          </div>
          <label className="absolute bottom-0 right-0 z-10 bg-[#00b70d] p-2 rounded-full shadow-lg hover:bg-[#00b70d]-hover transition-colors cursor-pointer">
            <Camera className="size-4 text-white" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarFileChange}
              disabled={isAvatarUploading}
            />
          </label>
          {isAvatarUploading && (
            <div className="absolute inset-0 z-0 rounded-full bg-black/30 flex items-center justify-center text-white text-xs font-medium pointer-events-none">
              Uploading
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


