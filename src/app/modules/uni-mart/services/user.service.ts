import { User, ApiResponse } from "../types";
import { getToken } from "@/lib/auth";

const API_BASE = "/api/unimart";

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  const token = getToken();
  console.log("Fetching user profile with token:", token ? "Present" : "Missing");
  
  const response = await fetch(`${API_BASE}/user/profile`, {
    ...(token && { headers: { "Authorization": `Bearer ${token}` } }),
  });
  
  console.log("User profile response status:", response.status);
  
  if (!response.ok) {
    const responseText = await response.text();
    console.error("API error response:", responseText);
    
    let errorMessage = `Failed to fetch user profile (${response.status})`;
    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      if (responseText) errorMessage = responseText;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_BASE}/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

// Update user profile
export const updateUserProfile = async (
  data: Partial<User>
): Promise<User> => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
};

// Get seller rating
export const getSellerRating = async (sellerId: string): Promise<{
  rating: number;
  reviewCount: number;
  totalSales: number;
}> => {
  const response = await fetch(`${API_BASE}/users/${sellerId}/rating`);
  if (!response.ok) throw new Error("Failed to fetch seller rating");
  return response.json();
};

// Upload profile picture
export const uploadProfilePicture = async (
  file: File
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/user/upload-avatar`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload picture");
  return response.json();
};
