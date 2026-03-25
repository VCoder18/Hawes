import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { SettingsMenu } from "@/components/EditProfile/SettingsMenu";
import { ProfileHeaderEdit } from "@/components/EditProfile/ProfileHeaderEdit";
import { EditProfileForm } from "@/components/EditProfile/EditProfileForm";

export default function EditProfilePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 text-text-[#ff5900] hover:text-[#00b70d] mb-6 transition-colors"
      >
        <ArrowLeft className="size-5" />
        <span className="font-medium">Back to Profile</span>
      </button>

      {/* Page Title */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-[#00b70d] mb-2">Settings</h1>
        <p className="text-text-[#ff5900]">Manage your account settings and preferences</p>
      </div>

      {/* Settings Container */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Settings Menu */}
        <SettingsMenu />

        {/* Edit Profile Section */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
            {/* Profile Header */}
            <ProfileHeaderEdit />

            {/* Edit Form */}
            <EditProfileForm />
          </div>
        </div>
      </div>
    </>
  );
}


