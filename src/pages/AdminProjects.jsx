import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import { getCurrentUser } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const user = getCurrentUser();
      if (!user) return navigate("/admin-login");
      const allProjects = await getProjects();
      const list = allProjects.filter(
        (p) => p.adminId === (user.id || user.token)
      );
      setProjects(list);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 Your Projects</h1>
      <Link to="/admin" className="text-blue-600 underline mb-4 inline-block">
        ➕ Create New Project
      </Link>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((p) => (
            <li key={p._id} className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
              <Link
                to={`/admin-projects/${p._id}`}
                className="text-blue-600 underline mt-2 inline-block"
              >
                📋 View Questions
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
