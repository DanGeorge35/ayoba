import React, { useState } from 'react';
import backgroundImage from '../assets/BasicBG.png';
import SuccessModal from './SuccessModal';
import { Eye, EyeOff, X } from "lucide-react";


const ResetPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleResetClick = () => {
    setShowModal(true);
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover bg-gray-100 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg font-san relative">
        {/* Cancel button placed inside the card */}
        <button className="cancel-btn absolute cursor-pointer rounded-2xl p-2 text-black bg-gray-400 hover:text-gray-700 -top-10 -right-4" onClick={() => window.history.back()}>
           <X size={15} className="text-black" />
        </button>

        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-0">Reset Password</h2>
          <img src="/quiz_logo.svg" alt="Quiz Logo" className="h-10 w-auto" />
        </div>

        <p className="text-md text-gray-600 leading-[1.1] mt-[-10px] mb-10">
          Please enter your new password
        </p>

        {/* Password Fields */}
        <label className="block text-sm font-medium text-gray-700 mb-3">New Password</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] bg-white text-gray-900 placeholder:text-[#9CA3AF] text-sm focus:outline-none"
          />
          <span
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-3">Confirm New Password</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] bg-white text-gray-900 placeholder:text-[#9CA3AF] text-sm focus:outline-none"
          />
          <span
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* ✅ Reset Button triggers modal */}
        <button
          onClick={handleResetClick}
          className="w-full py-4 bg-[#5735E1] text-[16px] text-white rounded-md hover:bg-[#354fe1]  cursor-pointer transition mt-3 mb-4"
        >
          Reset
        </button>
      </div>

      {/* ✅ Modal render */}
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ResetPass;
