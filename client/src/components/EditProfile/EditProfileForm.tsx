import { socialLinks, privacySettings } from "@/imports/constants";
import { useNavigate } from "react-router";

export function EditProfileForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
      {/* Form */}
      <div className="px-4 sm:px-6 pt-16 sm:pt-20 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="Shadow"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-text-[#ff5900]">@</span>
              <input
                type="text"
                defaultValue="shadow_the_ultimate"
                className="flex-1 px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              defaultValue="Where's that 4th CHAOS EMERALD ?!"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent resize-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="shadow@ultimate.life"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Location
            </label>
            <input
              type="text"
              defaultValue="Algiers"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Website
            </label>
            <input
              type="url"
              placeholder="https://your-website.com"
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Social Links
            </label>
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <div key={social.id} className="flex items-center gap-3">
                    <div className="shrink-0 size-10 bg-bg-[#ff5900] rounded-lg flex items-center justify-center">
                      <IconComponent className="size-5 text-text-[#ff5900]" />
                    </div>
                    <input
                      type="text"
                      placeholder={social.placeholder}
                      className="flex-1 px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="pt-4 border-t border-[#e2e8f0]">
            <h3 className="text-sm font-medium text-text-[#00b70d] mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              {privacySettings.map((setting) => (
                <label key={setting.id} className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-text-[#00b70d]">{setting.title}</p>
                    <p className="text-xs text-text-[#ff5900] mt-1">{setting.description}</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked={setting.defaultChecked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#e2e8f0] rounded-full peer peer-checked:bg-[#00b70d] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 sm:flex-none px-6 py-3 border border-[#e2e8f0] rounded-lg font-medium text-text-[#00b70d] hover:bg-bg-[#ff5900] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-[#00b70d] px-6 py-3 rounded-lg font-medium text-white hover:bg-[#00b70d]-hover transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


