import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally fetch admin info from API if needed
    const user = getCurrentUser();
    if (!user) return;
    // If you have admin info in JWT, decode and set name here
    // For now, just show placeholder
    setAdminName("Admin");
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  return (
    <div className="bg-gray-100 px-6 py-3 flex justify-between items-center border-b">
      <div className="font-bold text-lg">Admin Panel</div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">👋 {adminName}</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
