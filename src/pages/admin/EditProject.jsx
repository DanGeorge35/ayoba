import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjects, createProject } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export default function EditProject() {
  const { projectId } = useParams();
  const user = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    enableCountdown: false,
    countdownTime: 5,
    allowBackNavigation: true,
    published: false,
  });

  useEffect(() => {
    if (!user || !projectId) return;
    const fetchProject = async () => {
      const projects = await getProjects();
      const project = projects.find((p) => p._id === projectId);
      if (project && project.adminId === (user?.id || user?.token)) {
        setForm({
          name: project.name || "",
          description: project.description || "",
          enableCountdown: project.enableCountdown || false,
          countdownTime: project.countdownTime || 5,
          allowBackNavigation: project.allowBackNavigation || false,
          published: project.published || false,
        });
      } else {
        alert("Unauthorized");
        return navigate("/admin/projects");
      }
      setLoading(false);
    };
    fetchProject();
  }, [user, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement update logic with API
    // For now, just alert and navigate
    alert("Project updated.");
    navigate("/admin/projects");
  };

  if (!user || loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="flex-1 p-6 max-w-xl mx-auto">
      <div className="main-head">
        <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      </div>
      <div className="main-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Project Name</label>
            <input
              className="border p-2 w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              className="border p-2 w-full"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.enableCountdown}
              onChange={(e) =>
                setForm({ ...form, enableCountdown: e.target.checked })
              }
            />
            <label>Enable Countdown</label>
          </div>
          {form.enableCountdown && (
            <div>
              <label className="block font-semibold mb-1">
                Countdown Time (minutes)
              </label>
              <input
                type="number"
                className="border p-2 w-full"
                value={form.countdownTime}
                onChange={(e) =>
                  setForm({ ...form, countdownTime: Number(e.target.value) })
                }
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.allowBackNavigation}
              onChange={(e) =>
                setForm({ ...form, allowBackNavigation: e.target.checked })
              }
            />
            <label>Allow Back Navigation</label>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
