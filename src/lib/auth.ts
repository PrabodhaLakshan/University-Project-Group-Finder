import jwt from "jsonwebtoken";

type AuthTokenPayload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export function verifyToken(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
  } catch {
    return null;
  }
}
// src/lib/auth.ts
export const TOKEN_KEY = "pgf_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
