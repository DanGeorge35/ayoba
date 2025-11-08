import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import logo from "../assets/quiz_logo.svg";
import {
  PlusSquare,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Gamepad2,
  BarChartBig,
  Settings,
  ListChecks,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/account");
  };

  const sectionTitleClass =
    "uppercase text-xs text-gray-400 px-4 mt-2 mb-1 tracking-wide";
  const linkClass =
    "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm";
  const activeClass = "border-l-4 border-purple-500 bg-gray-800";

  return (
    <div className="absolute top-0 left-0 w-72 h-screen bg-gray-900 text-white shadow-lg flex flex-col z-50">
      {/* Logo Header */}
      <div
        className="flex items-center gap-3 text-xl font-bold p-4"
        style={{ backgroundColor: "#5735e3" }}
      >
        <img src={logo} alt="Quiz Logo" className="h-10" />
        <span>Control</span>
      </div>

      <nav className="flex flex-col gap-2 p-4 flex-grow overflow-y-auto">
        {/* Dashboard */}
        <div>
          <p className={sectionTitleClass}>Dashboard</p>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </div>

        <hr className="my-3 border-gray-800 border-opacity-30" />

        {/* Quiz */}
        <div className="relative">
          <p className={sectionTitleClass}>Quiz</p>
          <span className="text-xs absolute  right-0     bg-green-500 text-white px-2 py-0.5 rounded-md">
            Active
          </span>
          <NavLink
            to="/admin/create-project"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
          >
            <PlusSquare size={18} />
            Create Quiz
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
          >
            <ClipboardList size={18} />
            Manage Quiz
          </NavLink>
        </div>

        <hr className="my-3 border-gray-800 border-opacity-30" />

        {/* Survey */}
        <div className="relative">
          <p className={sectionTitleClass}>Survey</p>
          <span className="text-xs absolute  right-0     bg-yellow-800 text-white px-2 py-0.5 rounded-md">
            Coming Soon
          </span>
          <NavLink
            to="/admin/survey/create"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
          >
            <PlusSquare size={18} />
            <span className="flex items-center gap-2">Create Survey</span>
          </NavLink>

          <NavLink
            to="/admin/survey"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3 relative`
            }
          >
            <ListChecks size={18} />
            <span className="flex items-center gap-2 ">Manage Survey</span>
          </NavLink>
        </div>

        {/* Poll */}
        <div className="relative">
          <p className={sectionTitleClass}>Poll</p>

          <span className="text-xs absolute  right-0   bg-yellow-800 text-white px-2 py-0.5 rounded-md">
            Coming Soon
          </span>
          <NavLink
            to="/admin/polls/create"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
          >
            <PlusSquare size={18} />
            <span className="flex items-center gap-2">Create Poll</span>
          </NavLink>
          <NavLink
            to="/admin/polls"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3 `
            }
          >
            <BarChartBig size={18} />
            <span className="flex items-center gap-2">View Polls</span>
          </NavLink>
        </div>

        {/* Games */}
        <div className="relative">
          <p className={sectionTitleClass}>Games</p>
          <NavLink
            to="/admin/games/create"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3`
            }
          >
            <PlusSquare size={18} />
            <span className="flex items-center gap-2">Create Game</span>
          </NavLink>
          <span className="text-xs absolute  right-0  -top-2   bg-yellow-800 text-white px-2 py-0.5 rounded-md">
            Coming Soon
          </span>
          <NavLink
            to="/admin/games"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""} mb-3 relative`
            }
          >
            <Gamepad2 size={18} />
            <span className="flex items-center gap-2 ">Manage Games</span>
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 border-opacity-30">
        <NavLink
          to="/admin/settings"
          className={`${linkClass} mb-2 hover:text-gray-300`}
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
    </div>
  );
}
