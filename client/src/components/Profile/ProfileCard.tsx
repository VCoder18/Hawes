import { useNavigate } from "react-router";
import { Instagram, Globe, Twitter, Youtube, Facebook, Linkedin } from "lucide-react";
import svgPaths from "@/imports/svg_paths";
import imgImage from "@/assets/images/banner.jpg";
import imgImageBorder from "@/assets/images/pfp.svg";

export function ProfileCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-8">
      {/* Hero Banner */}
      <div className="h-40 sm:h-60 md:h-80 overflow-hidden relative">
        <img src={imgImage} alt="Banner" className="w-full h-full object-cover" />
      </div>

      {/* Profile Info Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          {/* Profile Picture */}
          <div className="relative -mt-16 sm:-mt-20">
            <div className="bg-white p-1 rounded-full shadow-lg">
              <div className="size-28 sm:size-36 md:size-40 rounded-full overflow-hidden border-4 border-white">
                <img src={imgImageBorder} alt="Shadow" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 w-full sm:w-auto pb-4 sm:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-[#00b70d]">Shadow</h2>
              <svg className="size-5 sm:size-6 shrink-0" fill="none" viewBox="0 0 22 21">
                <path d={svgPaths.p13774060} fill="#00B70D" />
              </svg>
            </div>
            <p className="text-base sm:text-lg mb-1">@shadow_the_ultimate</p>
            <p className="text-base sm:text-lg text-[#475569] mb-2">Where's that 4th CHAOS EMERALD ?!</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-3">
              <div className="flex items-center gap-1 text-text-[#ff5900]">
                <svg className="size-3" fill="none" viewBox="0 0 12 15">
                  <path d={svgPaths.p1a900f00} fill="#64748B" />
                </svg>
                <span>Algiers</span>
              </div>
              <div className="size-1 rounded-full bg-[#cbd5e1]" />
              <span className="text-[#00b70d] font-medium">Verified Organizer</span>
            </div>

            {/* Website & Social Links */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Website */}
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-[#ff5900] hover:text-[#00b70d] transition-colors"
              >
                <Globe className="size-4" />
                <span>website</span>
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com/shadow_ultimate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-[#ff5900] hover:text-[#1DA1F2] transition-colors"
              >
                <Twitter className="size-4" />
                <span className="hidden sm:inline">Twitter</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@shadow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-[#ff5900] hover:text-[#FF0000] transition-colors"
              >
                <Youtube className="size-4" />
                <span className="hidden sm:inline">YouTube</span>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/shadow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-[#ff5900] hover:text-[#1877F2] transition-colors"
              >
                <Facebook className="size-4" />
                <span className="hidden sm:inline">Facebook</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/shadow_ultimate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-[#ff5900] hover:text-[#E4405F] transition-colors"
              >
                <Instagram className="size-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/shadow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-[#ff5900] hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="size-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <button 
              onClick={() => navigate("/settings/profile")}
              className="flex-1 sm:flex-none bg-bg-[#ff5900] border border-[#e2e8f0] px-6 py-2 rounded-lg font-bold text-text-[#00b70d] text-sm hover:bg-[#e2e8f0] transition-colors"
            >
              Edit Profile
            </button>
            <button className="flex-1 sm:flex-none bg-[#00b70d] px-6 py-2 rounded-lg font-bold text-white text-sm hover:bg-[#00b70d]-hover transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#e2e8f0] divide-x divide-[#e2e8f0]">
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">12</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Trips Created</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">45</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Trips Joined</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">8</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Destinations</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-xl font-bold text-text-[#00b70d]">1.2k</div>
          <div className="text-xs font-semibold text-text-[#ff5900] uppercase tracking-wider mt-0.5">Followers</div>
        </div>
      </div>
    </div>
  );
}


