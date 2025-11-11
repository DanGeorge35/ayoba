import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import logo from "../assets/logo.png";
import {
  PlusSquare,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sectionTitleClass =
    "uppercase text-xs text-gray-400 px-4 mt-2 mb-1 tracking-wide";
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm";
  const activeClass = "border-l-4 border-red-400 bg-gray-300";

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-['#24101057']  bg-opacity-50 z-40 md:hidden"
        />
      )}

      <div
        className={`fixed top-0 left-0 w-72 h-screen bg-white text-black shadow-lg flex flex-col z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
          <button onClick={onClose} className="md:hidden p-4 " style={{position:"absolute", right:"30px",top:"10px"}}>
            <X size={22} />
          </button>
        <div className="  p-5 bg-red-600">
       <img src={logo} alt=" Logo" className="h-8  ml-4" />
          {/* <div className="text-[#bb0101] text-[16px]   font-bold">Ayouba App</div> */}

    
        
        </div>

        <nav className="flex flex-col gap-2 p-4 flex-grow overflow-y-auto">
          {/* Dashboard */}
          <p className={sectionTitleClass}>Dashboard</p>
          <NavLink
            to="/account/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
              to="/account/create-project"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <PlusSquare size={18} />
              Add New Video
            </NavLink>


            <NavLink
              to="/account/create-project"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <PlusSquare size={18} />
              All Videos
            </NavLink>

           


   <hr className="my-3 border-red-100 border-opacity-30" />

          {/* Quiz Section */}
          <div className="relative">
            <p className={sectionTitleClass}>Analytics</p>
            {/* <span className="text-xs absolute right-0 bg-green-500 text-white px-2 py-0.5 rounded-md">
              Active
            </span> */}
          

            <NavLink
              to="/account/create-project"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <PlusSquare size={18} />
              Video Analytics
            </NavLink>

              <NavLink
              to="/account/create-project"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <PlusSquare size={18} />
              Channel Analytics
            </NavLink>

            
            <NavLink
              to="/account/projects"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <ClipboardList size={18} />
            Revenue Analytics
            </NavLink>


            
          </div>


          <hr className="my-3 border-red-100 border-opacity-30" />

          {/* Quiz Section */}
          <div className="relative">
            <p className={sectionTitleClass}>Account</p>
            {/* <span className="text-xs absolute right-0 bg-green-500 text-white px-2 py-0.5 rounded-md">
              Active
            </span> */}
            <NavLink
              to="/account/create-project"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <PlusSquare size={18} />
              New Admin Account
            </NavLink>

          
            
            <NavLink
              to="/account/projects"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <ClipboardList size={18} />
            All Admins Accounts
            </NavLink>


              <NavLink
              to="/account/create-project"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""} mb-3`
              }
              onClick={onClose}
            >
              <PlusSquare size={18} />
              New User Account
            </NavLink>
          </div>


          {/* Settings and Logout */}
          <div className="p-4 border-t border-red-100 border-opacity-30">
            <NavLink
              to="/account/settings"
              className={`${linkClass} mb-2 hover:text-gray-300`}
              onClick={onClose}
            >
              <Settings size={18} />
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 w-full text-left transition text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
