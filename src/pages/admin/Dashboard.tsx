/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import { Menu } from "lucide-react";
import YouTubeConnect from "../../components/YouTubeConnect";
import Videos from "../../components/Videos";
import VideoAnalytics from "../../components/VideosAnalytics";

interface DashboardSetUpProps {
  user: any;
}

const DashboardSetUp: React.FC<DashboardSetUpProps> = ({ user }) => {
   if (user == "null" || user ==null) {
    return null;

   }


  const fullName = `${user.user.first_name} ${user.user.last_name}`;


  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="  p-8 mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Welcome, <span className="text-red-600">{fullName}</span> 👋
        </h1>
      
      </div>

      <div>
        <YouTubeConnect />
      </div>
    </main>
  );
};

const Dashboard: React.FC = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("user", user);
    if (user === "null" || user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 md:pl-72">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4  bg-red-500  text-white shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Ayouba Dashboard</h1>
        </div>

        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AuthGuard>
                <DashboardSetUp user={user} />
              </AuthGuard>
            }
          />

          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardSetUp user={user} />
              </AuthGuard>
            }
          />
          <Route
            path="/videos"
            element={
              <AuthGuard>
                <Videos />
              </AuthGuard>
            }
          />

           <Route
            path="/videos-analytics"
            element={
              <AuthGuard>
                <VideoAnalytics />
              </AuthGuard>
            }
          />
        </Routes>

        
      </div>
    </div>
  );
};

export default Dashboard;
