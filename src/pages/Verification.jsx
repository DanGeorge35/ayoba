import React from "react";
import backgroundImage from "../assets/BasicBG.png";
import { X } from "lucide-react";

const Verification = () => {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover bg-gray-100 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg font-san relative">
        {/* Cancel button placed inside the card */}
        <button
          className="cancel-btn absolute cursor-pointer rounded-2xl p-2 text-black bg-gray-400 hover:text-gray-700 -top-10 -right-4"
          onClick={() => window.history.back()}
        >
          <X size={15} className="text-black" />
        </button>

        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-0">
            Verification Code
          </h2>
          <img src="/quiz_logo.svg" alt="Quiz Logo" className="h-10 w-auto" />
        </div>

        <p className="text-md text-gray-600 leading-[1.1] mt-[-10px] mb-10">
          Please enter the six-digit code that was sent to your email address.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-3">
          Verification Code
        </label>
        <input
          type="text"
          placeholder="Enter Verification Code"
          className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] bg-white text-gray-900 placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-0 focus:border-[#E5E7EB] mb-10"
        />

        <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition mt-3 mb-4">
          Verify
        </button>

        <p className="text-sm text-left text-gray-700">
          Didn’t receive code?{" "}
          <a href="/resend" className="text-blue-600 hover:underline">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
};

export default Verification;
