"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, updateUserProfile } from "../services/user.service";
import { User } from "../types";
import {
  User as UserIcon,
  Mail,
  Edit2,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCurrentUser();
        setUser(data);
        setFormData({
          name: data.name,
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Failed to load user:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load user profile";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updated = await updateUserProfile(formData);
      setUser(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <UserIcon size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <UserIcon size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600" />

        {/* Profile Content */}
        <div className="px-6 py-8">
          {/* Avatar & Name */}
          <div className="flex items-end gap-6 mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 -mt-24 flex items-center justify-center border-4 border-white shadow-md">
              <UserIcon className="text-white" size={64} />
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl font-bold"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-500">{user.student_id}</p>
                </>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Mail size={16} />
                Email
              </label>
              <p className="text-gray-800 text-lg">{user.email}</p>
            </div>

            {/* Seller Stats */}
            {user.rating && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Seller Rating
                </label>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-yellow-400">★</div>
                  <span className="text-lg text-gray-800">
                    {user.rating} / 5
                  </span>
                  {user.totalSales && (
                    <span className="text-gray-500">
                      ({user.totalSales} sales)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Me
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell other students about yourself..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {user.bio || "No bio added yet"}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, bio: user.bio || "" });
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium transition-colors"
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
