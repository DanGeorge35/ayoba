import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";
import { Menu } from "lucide-react";
import YouTubeConnect from "../../components/YouTubeConnect";


const DashboardSetUp: React.FC= () => (
  <main className="flex-1 p-6">
    <div>
      
    </div>

   <YouTubeConnect/>
  </main>
);

const Dashboard: React.FC = () => {
  const user = useAuth();
    const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);




  useEffect(() => {
        console.log("user",user);
    if (user == "null" || user == null ) {
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
        <div className="md:hidden flex items-center p-4 bg-black text-white shadow">
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
                <DashboardSetUp />
              </AuthGuard>
            }
          />
          <Route
            path="dashboard"
            element={
              <AuthGuard>
                <DashboardSetUp />
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
