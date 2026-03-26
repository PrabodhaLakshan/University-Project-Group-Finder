import { Product, PaginatedResponse, ApiResponse } from "../types";
import { ProductFormData, SearchParams } from "../validations";
import { getToken } from "@/lib/auth";

const API_BASE = "/api/unimart";

// Get all products with pagination and filters
export const getAllProducts = async (
  filters: SearchParams = {}
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams();
  if (filters.query) params.append("query", filters.query);
  if (filters.category) params.append("category", filters.category);
  if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters.condition) params.append("condition", filters.condition);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  const response = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

// Create new product
export const createProduct = async (data: ProductFormData): Promise<Product> => {
  const token = getToken();
  console.log("Creating product with token:", token ? "Present" : "Missing");
  console.log("Product data:", data);
  
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  
  console.log("Response status:", response.status);
  
  if (!response.ok) {
    const responseText = await response.text();
    console.error("API error response:", responseText);
    
    let errorMessage = `Failed to create product (${response.status})`;
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

// Update product
export const updateProduct = async (
  id: string,
  data: Partial<ProductFormData>
): Promise<Product> => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
};

// Delete product
export const deleteProduct = async (id: string): Promise<ApiResponse<null>> => {
  const token = getToken();
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    ...(token && { headers: { "Authorization": `Bearer ${token}` } }),
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return response.json();
};

// Get user's products with optional status filter
export const getUserProducts = async (status?: string): Promise<Product[]> => {
  const token = getToken();
  const url = status ? `${API_BASE}/my-products?status=${status}` : `${API_BASE}/my-products`;
  const response = await fetch(url, {
    ...(token && { headers: { "Authorization": `Bearer ${token}` } }),
  });
  if (!response.ok) throw new Error("Failed to fetch user products");
  return response.json();
};
