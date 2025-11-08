/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  registerAdmin as apiRegisterAdmin,
  loginAdmin as apiLoginAdmin,
} from "./api";

// ==== INTERFACES ====
export interface RegisterAdminParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginAdminParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  [key: string]: any; // In case API returns extra fields
}

// ==== FUNCTIONS ====
export const registerAdmin = async (
  params: RegisterAdminParams
): Promise<AuthResponse | any> => {
  return apiRegisterAdmin(params);
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<AuthResponse | any> => {
  return apiLoginAdmin({ email, password });
};

export const logout = (): void => {
  localStorage.removeItem("token");
};

export const getCurrentUser = (): { token: string } | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  // Optionally decode the JWT here if needed
  return { token };
};

// ==== SOCIAL LOGIN ====
export const handleGoogleSignIn = (): void => {
  window.location.href = "http://localhost:3000/admin/google";
};

export const handleFacebookSignIn = (): void => {
  window.location.href = "http://localhost:3000/admin/facebook";
};
