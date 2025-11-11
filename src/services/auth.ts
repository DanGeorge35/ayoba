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

export interface LoginUser {
  access_token: string;
  user: {
    business_name: string;
    code: string;
    email: string;
    email_verified: boolean;
    enabled_2fa: boolean;
    first_name: string;
    id: string;
    last_login: string | null;
    last_name: string;
    otp_count: number;
    phone_number: string;
    phone_number_verified: boolean;
    role: string;
    status: string;
  };
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
  const resp = await apiLoginAdmin({ email, password });
  return resp;
};

export const logout = (): void => {
  localStorage.setItem("login_user", "");
  localStorage.removeItem("login_user");
};

export const getCurrentUser = () => {
  try {
    const duser = localStorage.getItem("login_user");
    const user = JSON.stringify(duser);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ==== SOCIAL LOGIN ====
export const handleGoogleSignIn = (): void => {
  window.location.href = "http://localhost:3000/admin/google";
};

export const handleFacebookSignIn = (): void => {
  window.location.href = "http://localhost:3000/admin/facebook";
};
