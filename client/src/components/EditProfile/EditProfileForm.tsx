import { socialLinks, privacySettings } from "@/imports/constants";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DeleteProfileModal } from "./DeleteProfileModal";
import { SearchableLocationSelect } from "./SearchableLocationSelect";
import { supabase } from "@/lib/supabase";
import { ProfileHeaderEdit } from "./ProfileHeaderEdit";
import { useToast } from "@/hooks/useToast";

export function EditProfileForm() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [savedMediaUrls, setSavedMediaUrls] = useState({
    avatar_url: '',
    banner_url: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    bio: '',
    location: 'Unknown',
    email: user?.email || '',
    avatar_url: '',
    banner_url: '',
    social_links: ['', '', '', '', '', ''], // [website, twitter, youtube, facebook, instagram, linkedin]
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setIsLoading(false);
          return;
        }

        // Call API endpoint to get profile
        const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userProfile = await response.json();
        const nextAvatarUrl = userProfile.avatar_url || '';
        const nextBannerUrl = userProfile.banner_url || '';

        setFormData({
          display_name: userProfile.display_name || '',
          username: userProfile.username || '',
          bio: userProfile.bio || '',
          location: userProfile.location || 'Unknown',
          email: user.email || '',
          avatar_url: nextAvatarUrl,
          banner_url: nextBannerUrl,
          social_links: userProfile.social_links || ['', '', '', '', '', ''],
        });
        setSavedMediaUrls({
          avatar_url: nextAvatarUrl,
          banner_url: nextBannerUrl,
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    setFormData(prev => {
      const newSocialLinks = [...prev.social_links];
      newSocialLinks[index] = value;
      return { ...prev, social_links: newSocialLinks };
    });
  };

  const validateImageFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PNG, JPG, and WEBP images are supported';
    }

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return 'Image size must be 10MB or less';
    }

    return null;
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    // Show preview immediately, store file for later upload
    try {
      const previewDataUrl = await fileToDataUrl(file);
      setPendingAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatar_url: previewDataUrl }));
    } catch (err: any) {
      setError(err.message || 'Failed to read image file');
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!user) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    // Show preview immediately, store file for later upload
    try {
      const previewDataUrl = await fileToDataUrl(file);
      setPendingBannerFile(file);
      setFormData((prev) => ({ ...prev, banner_url: previewDataUrl }));
    } catch (err: any) {
      setError(err.message || 'Failed to read image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { display_name, username, bio, location, social_links } = formData;
      let avatarUrlForSave = savedMediaUrls.avatar_url || null;
      let bannerUrlForSave = savedMediaUrls.banner_url || null;
      const hasPendingMediaChanges = Boolean(pendingAvatarFile || pendingBannerFile);

      const toHttpUrlOrNull = (value: string | null | undefined): string | null => {
        if (!value) return null;
        const trimmed = value.trim();
        if (!trimmed) return null;

        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

        try {
          const parsed = new URL(withProtocol);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null;
          }
          return parsed.toString();
        } catch {
          return null;
        }
      };

      const normalizedDisplayName = display_name.trim();
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedBio = bio.trim() || null;
      const normalizedLocation = location.trim() || null;

      const normalizedSocialLinks = Array.from({ length: 6 }, (_, index) => {
        const raw = social_links[index] || '';
        const normalized = toHttpUrlOrNull(raw);
        return normalized || '';
      });
      
      // Validate username (not empty)
      if (!normalizedUsername) {
        setError('Username is required');
        setIsSaving(false);
        return;
      }

      if (!/^[a-z0-9_]+$/.test(normalizedUsername)) {
        setError('Username can only contain lowercase letters, numbers, and underscores');
        setIsSaving(false);
        return;
      }

      // Validate display_name (not empty and at least 2 characters)
      if (!normalizedDisplayName) {
        setError('Display name is required');
        setIsSaving(false);
        return;
      }

      if (normalizedDisplayName.length < 2) {
        setError('Display name must be at least 2 characters');
        setIsSaving(false);
        return;
      }

      // Current backend source has no dedicated /profiles/uploads endpoint.
      // Keep existing persisted URLs and save text fields only when files were changed.
      if (pendingAvatarFile) setIsUploadingAvatar(false);
      if (pendingBannerFile) setIsUploadingBanner(false);

      avatarUrlForSave = toHttpUrlOrNull(avatarUrlForSave);
      bannerUrlForSave = toHttpUrlOrNull(bannerUrlForSave);
      
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Not authenticated');
        setIsSaving(false);
        return;
      }

      const sendProfileUpdate = async (payload: Record<string, unknown>) =>
        fetch(`${API_BASE_URL}/profiles`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        });

      const parseApiMessage = (errorData: any): string =>
        Array.isArray(errorData?.message)
          ? errorData.message.join(', ')
          : (errorData?.message || 'Failed to update profile');

      const payloadWithLinks: Record<string, unknown> = {
        display_name: normalizedDisplayName,
        username: normalizedUsername,
        bio: normalizedBio,
        location: normalizedLocation,
        avatar_url: avatarUrlForSave,
        banner_url: bannerUrlForSave,
        social_links: normalizedSocialLinks,
      };

      let response = await sendProfileUpdate(payloadWithLinks);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({} as any));
        const message = parseApiMessage(errorData);

        // Backend currently validates social_links inconsistently; retry without it.
        if (/social_links/i.test(message)) {
          const { social_links: _ignored, ...payloadWithoutLinks } = payloadWithLinks;
          response = await sendProfileUpdate(payloadWithoutLinks);

          if (!response.ok) {
            const retryError = await response.json().catch(() => ({} as any));
            throw new Error(parseApiMessage(retryError));
          }
        } else {
          throw new Error(message);
        }
      }

      setFormData((prev) => ({
        ...prev,
        avatar_url: avatarUrlForSave || '',
        banner_url: bannerUrlForSave || '',
      }));
      setSavedMediaUrls({
        avatar_url: avatarUrlForSave || '',
        banner_url: bannerUrlForSave || '',
      });

      setPendingAvatarFile(null);
      setPendingBannerFile(null);

      if (hasPendingMediaChanges) {
        toast({
          title: 'Images were not uploaded',
          description: 'Profile details were saved, but this backend build does not expose a profile uploads endpoint.',
          variant: 'destructive',
        });
      }

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
        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          toast({
            title: 'Not authenticated',
            description: 'Please sign in again and retry.',
            variant: 'destructive',
          });
          setIsSaving(false);
          return;
        }

        // Call API endpoint to delete profile
        const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete profile');
        }
        
        // Sign out user
        await signOut();
        
        setShowDeleteModal(false);
        setDeleteConfirmation('');
        
        // Redirect to signup after a brief delay
        setTimeout(() => {
          navigate('/register');
        }, 500);
      } catch (err: any) {
        toast({
          title: 'Failed to delete profile',
          description: err.message || 'Unknown error',
          variant: 'destructive',
        });
        setIsSaving(false);
      }
    } else {
      toast({
        title: 'Deletion cancelled',
        description: 'Username does not match.',
        variant: 'destructive',
      });
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
      <ProfileHeaderEdit
        bannerUrl={formData.banner_url}
        avatarUrl={formData.avatar_url}
        onBannerUpload={handleBannerUpload}
        onAvatarUpload={handleAvatarUpload}
        isBannerUploading={isUploadingBanner}
        isAvatarUploading={isUploadingAvatar}
      />

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
            <SearchableLocationSelect
              value={formData.location}
              onChange={(newLocation) => setFormData(prev => ({ ...prev, location: newLocation }))}
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
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <div key={social.id} className="flex items-center gap-3">
                    <div className="shrink-0 size-10 bg-bg-[#ff5900] rounded-lg flex items-center justify-center">
                      <IconComponent className="size-5 text-text-[#ff5900]" />
                    </div>
                    <input
                      type="url"
                      placeholder={social.placeholder}
                      value={formData.social_links[index]}
                      onChange={(e) => handleSocialLinkChange(index, e.target.value)}
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
                disabled={isSaving || isUploadingAvatar || isUploadingBanner}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploadingAvatar || isUploadingBanner}
                className="flex-1 sm:flex-none bg-[#00b70d] px-6 py-3 rounded-lg font-medium text-white hover:bg-[#00b70d]-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isUploadingAvatar || isUploadingBanner) ? 'Uploading media...' : isSaving ? 'Saving...' : 'Save Changes'}
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


