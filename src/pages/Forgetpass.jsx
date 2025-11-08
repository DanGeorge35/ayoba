import React from "react";
import backgroundImage from "../assets/BasicBG.png";
import { X } from "lucide-react";

const ForgetPassword = () => {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover bg-gray-100 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "contain",
      }}
    >
      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md font-san">
        {/* Cancel button placed inside the card */}
        <button
          className="cancel-btn absolute cursor-pointer rounded-2xl p-2 text-black bg-gray-400 hover:text-gray-700 -top-10 -right-4"
          onClick={() => window.history.back()}
        >
          <X size={15} className="text-black" />
        </button>

        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-0">
            Forgot Password?
          </h2>
          <img src="/quiz_logo.svg" alt="Quiz Logo" className="h-10 w-auto" />
        </div>

        <p className="text-md text-gray-600 leading-[1.1] mt-[-10px] mb-10">
          Enter the email address associated with your
          <br />
          account to get a password reset OTP.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-3">
          Email Address
        </label>

        <input
          type="email"
          placeholder="Enter Email Address"
          className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-0 focus:border-gray-200 autofill:bg-white mb-6"
        />

        <button className="w-full py-4 bg-[#5735E1] text-[16px] text-white rounded-md hover:bg-[#354fe1] transition cursor-pointer mt-3 mb-4">
          Send OTP
        </button>

        <div className="flex justify-between mt-6 text-sm">
          <p>
            Don’t have an account?{" "}
            <a href="/account" className="text-blue-600 hover:underline">
              Signup
            </a>
          </p>
          <p>
            Back to{" "}
            <a href="/account" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
