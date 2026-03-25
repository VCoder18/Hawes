import { socialLinks, privacySettings } from "@/imports/constants";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService, type UserProfile } from "@/services/profileService";
import { DeleteProfileModal } from "./DeleteProfileModal";

export function EditProfileForm() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    bio: '',
    location: '',
    email: user?.email || '',
    avatar_url: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await profileService.getCurrentUserProfile();
        if (userProfile) {
          setFormData({
            display_name: userProfile.display_name || '',
            username: userProfile.username || '',
            bio: userProfile.bio || '',
            location: userProfile.location || '',
            email: user.email || '',
            avatar_url: userProfile.avatar_url || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { display_name, username, bio, location } = formData;
      
      await profileService.updateUserProfile(user.id, {
        display_name,
        username,
        bio,
        location,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation('');
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation === formData.username) {
      if (!user) return;
      
      setIsSaving(true);
      try {
        // Delete profile from database
        await profileService.deleteProfile(user.id);
        
        // Sign out user
        await signOut();
        
        setShowDeleteModal(false);
        setDeleteConfirmation('');
        
        // Redirect to signup after a brief delay
        setTimeout(() => {
          navigate('/register');
        }, 500);
      } catch (err: any) {
        alert('Failed to delete profile: ' + (err.message || 'Unknown error'));
        setIsSaving(false);
      }
    } else {
      alert('Username does not match. Deletion cancelled.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-8 text-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm">
      {/* Form */}
      <div className="px-4 sm:px-6 pt-16 sm:pt-20 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Display Name
            </label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
              required
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
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b70d] focus:border-transparent"
                required
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
              name="bio"
              value={formData.bio}
              onChange={handleChange}
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
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Contact support to update.</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-text-[#00b70d] mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
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
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e2e8f0] sm:justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 sm:flex-none px-6 py-3 border border-[#e2e8f0] rounded-lg font-medium text-text-[#00b70d] hover:bg-bg-[#ff5900] transition-colors disabled:opacity-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none bg-[#00b70d] px-6 py-3 rounded-lg font-medium text-white hover:bg-[#00b70d]-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="flex-1 sm:flex-none px-6 py-3 border border-red-300 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete Profile
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <DeleteProfileModal
          isOpen={showDeleteModal}
          username={formData.username}
          confirmationValue={deleteConfirmation}
          onConfirmationChange={setDeleteConfirmation}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteConfirmation('');
          }}
          onConfirm={handleConfirmDelete}
        />
      
      </div>
    </div>
  );
}


