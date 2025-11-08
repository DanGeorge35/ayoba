import { useEffect, useState } from "react";
import { getProjects, getCandidatesByProject } from "../../services/api";
import Sidebar from "../../components/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Projects from "./Projects";
import CreateProject from "./CreateProject";
import Questions from "./Questions";
import EditProject from "./EditProject";
import CandidatesPage from "./CandidatesPage";
import AuthGuard from "../../components/AuthGuard";
import { useAuth } from "../../hooks/useAuth";

function DashboardMetrics({ metrics }) {
  return (
    <main className="flex-1 p-6">
      <div className="main-head"></div>
      <div className="main-body">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Projects</h2>
            <p className="text-3xl">{metrics.projects}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Candidates</h2>
            <p className="text-3xl">{metrics.totalCandidates}</p>
          </div>
        </div>
        {Array.isArray(metrics.projectCandidateChart) &&
          metrics.projectCandidateChart.length > 0 && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">
                Candidate Participation
              </h2>
              {/* You can use recharts or another chart library here if needed */}
              <pre>
                {JSON.stringify(metrics.projectCandidateChart, null, 2)}
              </pre>
            </div>
          )}
      </div>
    </main>
  );
}

export default function Dashboard() {
  const user = useAuth();
  const location = useLocation();

  const [metrics, setMetrics] = useState({
    projects: 0,
    totalCandidates: 0,
    projectCandidateChart: [],
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const allProjects = await getProjects();
      const adminProjects = allProjects.filter(
        (p) => p.adminId === (user.id || user.token)
      );
      const projectIds = adminProjects.map((p) => p._id);
      let totalCandidates = 0;
      const projectCandidateChart = [];
      for (const project of adminProjects) {
        const candidates = await getCandidatesByProject(project._id);
        totalCandidates += candidates.length;
        projectCandidateChart.push({
          name:
            project.name.length > 12
              ? project.name.slice(0, 12) + "…"
              : project.name,
          candidates: candidates.length,
        });
      }
      setMetrics({
        projects: projectIds.length,
        totalCandidates,
        projectCandidateChart,
      });
    };
    fetchData();
  }, [user]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AuthGuard>
                <DashboardMetrics metrics={metrics} />
              </AuthGuard>
            }
          />
          <Route
            path="dashboard"
            element={
              <AuthGuard>
                <DashboardMetrics metrics={metrics} />
              </AuthGuard>
            }
          />
          <Route
            path="projects"
            element={
              <AuthGuard>
                <Projects />
              </AuthGuard>
            }
          />
          <Route
            path="create-project"
            element={
              <AuthGuard>
                <CreateProject />
              </AuthGuard>
            }
          />
          <Route
            path="projects/:projectId/questions"
            element={
              <AuthGuard>
                <Questions />
              </AuthGuard>
            }
          />
          <Route
            path="projects/:projectId/edit"
            element={
              <AuthGuard>
                <EditProject />
              </AuthGuard>
            }
          />
          <Route
            path="projects/:projectId/candidates"
            element={
              <AuthGuard>
                <CandidatesPage />
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
