'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, userPreferences, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userPreferences?.displayName || user?.email?.split('@')[0] || '');
  const [profileImage, setProfileImage] = useState(userPreferences?.profileImage || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile({
        displayName,
        profileImage
      });
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-lg">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="displayName" className="block text-sm font-medium mb-2 text-gray-300">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-field"
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="profileImage" className="block text-sm font-medium mb-2 text-gray-300">
                Profile Image URL
              </label>
              <input
                type="text"
                id="profileImage"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="input-field"
                placeholder="Enter image URL or leave blank for default"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can use a URL to an image or leave blank for default avatar
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}