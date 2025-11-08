import React from 'react';

const SuccessModal = ({ onClose }) => {
  const handleBackgroundClick = (e) => {
    // Prevent click from propagating to modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-sm"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-sm text-center shadow-lg relative animate-fadeInScale">
        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full border border-green-500">
          <span className="text-green-600 text-xl font-bold">✔</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Successful</h2>
        <p className="text-gray-600">
          You have successfully reset your password.
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
