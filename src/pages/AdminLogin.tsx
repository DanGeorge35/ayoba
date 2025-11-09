/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { registerAdmin, loginAdmin } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";
import SidebarCarousel from "../components/SidebarCarousel";

interface FormState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  access_token: string;
  user?: any;
}

interface TextInputProps {
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const TextInput = ({ value, placeholder, type = "text", onChange, required }: TextInputProps) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    required={required}
    className="w-full px-4 py-3 border rounded-md border-gray-300 outline-none"
  />
);

export default function AdminLogin() {
  const user = useAuth();
  const navigate = useNavigate();

  const [isNew, setIsNew] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) navigate("/admin");
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (forgotPassword) {
        // TODO: call your password reset API
        // await sendPasswordResetEmail(form.email);
        setMessage("If this email exists, a password reset link has been sent.");
      } else {
      
        const result: AuthResponse = isNew
          ? await registerAdmin(form)
          : await loginAdmin(form.email, form.password);

        if (result.access_token) {
          localStorage.setItem("token", result.access_token);
        }

        navigate("/admin");
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof FormState) => {
    setForm({ ...form, [field]: e.target.value });
  };

  if (user === undefined) return <p className="p-8">Checking login...</p>;

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Sidebar Carousel */}
      <div className="hidden lg:block text-white bg-[#e1252f] ">
        <div className="min-h-screen flex items-center justify-center overflow-hidden max-w-7xl" style={{width:"100%"}}>
          <SidebarCarousel />
        </div>
      </div>

      {/* Form Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden max-w-5xl w-[90%] mx-auto">
        <div className="bg-white w-full max-w-md overflow-y-auto space-y-4 py-16 px-3 hide-scrollbar rounded-lg ">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Ayouba Logo" className="h-10" />
          </div>

          <h5 className="text-[25px] font-bold text-[#e1252f] mb-4 text-center">
            {forgotPassword
              ? "Reset Password"
              : isNew
              ? "Create your Ayouba Account"
              : "Welcome to Ayouba"}
          </h5>

          <p className="text-sm text-gray-400 mb-6 text-center">
            {forgotPassword
              ? "Enter your email to reset your password"

              : "Login to your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isNew && !forgotPassword && (
              <div className="flex space-x-2">
                <TextInput
                  value={form.firstName}
                  placeholder="First Name"
                  onChange={(e) => handleInputChange(e, "firstName")}
                  required
                />
                <TextInput
                  value={form.lastName}
                  placeholder="Last Name"
                  onChange={(e) => handleInputChange(e, "lastName")}
                  required
                />
              </div>
            )}

            <TextInput
              type="email"
              value={form.email}
              placeholder="Email"
              onChange={(e) => handleInputChange(e, "email")}
              required
            />

            {!forgotPassword && (
              <div className="relative w-full">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  placeholder="Password"
                  onChange={(e) => handleInputChange(e, "password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {isNew && !forgotPassword && (
              <div className="flex items-center space-x-2">
                <input
                  id="agree"
                  type="checkbox"
                  className="w-6 h-6 text-[#e1252f] border-gray-300 rounded-md mr-3"
                  required
                />
                <label htmlFor="agree" className="text-gray-400 text-sm">
                  I agree with the Terms and Privacy Policy
                </label>
              </div>
            )}

            {!forgotPassword && (
              <div className="flex justify-between items-center text-sm mt-4 py-4">
                <div className="flex items-center space-x-2 ">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-[#e1252f] border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="text-gray-700">
                    Remember Me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-[#e1252f] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {message && <p className="text-center text-green-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e1252f] text-white rounded-md hover:bg-[#e13552] transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : forgotPassword
                ? "Send Reset Link"
                : isNew
                ? "Sign Up"
                : "Login"}
            </button>
          </form>

         

          {forgotPassword && (
            <p className="mt-4 text-sm text-center">
              <button
                type="button"
                className="text-[#e1252f] hover:underline cursor-pointer"
                onClick={() => setForgotPassword(false)}
              >
                Back to Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
