import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  getProjects,
  getQuestionsByProject,
  getCandidatesByProject,
} from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import {
  Users,
  Trash2,
  FileText,
  Pencil,
  Upload,
  Download,
  Copy,
} from "lucide-react";

export default function Projects() {
  const user = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects();
        // Only show projects for this admin
        const adminProjects = allProjects.filter(
          (p) => p.adminId === (user?.id || user?.token)
        );
        // For each project, fetch questions and candidates count
        const projectStats = await Promise.all(
          adminProjects.map(async (project) => {
            const questions = await getQuestionsByProject(project._id);
            const candidates = await getCandidatesByProject(project._id);
            const highestScore = candidates.reduce(
              (max, c) => (c.score > max ? c.score : max),
              0
            );
            const quizLink = `https://quizlead.netlify.app/quiz/${project._id}`;
            return {
              id: project._id,
              ...project,
              totalQuestions: questions.length,
              totalCandidates: candidates.length,
              highestScore,
              quizLink,
            };
          })
        );
        setProjects(projectStats);
      } catch (error) {
        console.error("Error fetching projects with stats:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const togglePublished = async (project) => {
    // This function will need to be updated to use an API call
    // For now, it will just update the state locally
    const ref = doc(db, "projects", project.id);
    await updateDoc(ref, { published: !project.published });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id ? { ...p, published: !p.published } : p
      )
    );
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Access code copied: " + code);
  };

  const deleteProject = async (projectId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project? This cannot be undone."
    );
    if (!confirm) return;

    const projectRef = doc(db, "projects", projectId);

    // Optional: delete subcollections
    const deleteSubcollection = async (subPath) => {
      const snap = await getDocs(
        collection(db, "projects", projectId, subPath)
      );
      const deletions = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletions);
    };

    try {
      await deleteSubcollection("questions");
      await deleteSubcollection("candidates");

      await deleteDoc(projectRef);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      alert("Project deleted.");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  if (!user || loading) {
    return <p className="p-6 text-gray-500">Loading your projects...</p>;
  }

  return (
    <main className="flex-1 p-6 ">
      <div className="main-head flex items-center justify-between p-4">
        <h4 className="text-xl font-bold">Your Quiz(s)</h4>
        <NavLink
          to="/admin/create-project"
          className="text-sm !text-white px-4 py-2 rounded transition bg-[#5735e3] hover:brightness-110"
        >
          Create Quiz
        </NavLink>
      </div>

      <div className=" main-body pt-7">
        {projects.length === 0 ? (
          <p className="text-gray-600">
            No projects found. Create one to begin.
          </p>
        ) : (
          <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <li
                key={p.id}
                className="p-4 bg-white rounded shadow flex flex-col"
              >
                {/* Top section: Image and Info */}
                <div className="grid grid-cols-1 gap-4">
                  {/* QR Code */}
                  <div className="w-full flex justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=5735e2&data=${encodeURIComponent(
                        p.quizLink
                      )}`}
                      alt="QR Code"
                      className="w-100 h-70 object-contain rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between py-5">
                    <div className="relative">
                      {/* Top-right icons for Delete and Edit */}
                      <span
                        onClick={() => deleteProject(p.id)}
                        className="absolute top-2 right-2 cursor-pointer text-red-600"
                        title="Delete Project"
                      >
                        <Trash2 size={24} />
                      </span>
                      <span
                        onClick={() => navigate(`/admin/projects/${p.id}/edit`)}
                        className="absolute top-2 right-10 cursor-pointer text-gray-600"
                        title="Edit Project"
                      >
                        <Pencil size={24} />
                      </span>

                      {/* Project Name & Access Code */}
                      <h4 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                        {p.name || "Untitled Project"} -{" "}
                        {p.accessCode ? (
                          <span
                            className="flex items-center gap-1 text-blue-600 cursor-pointer"
                            onClick={() => handleCopy(p.accessCode)}
                          >
                            <strong>{p.accessCode}</strong>
                            <span
                              className="text-blue-500 hover:text-blue-700"
                              title="Copy Access Code"
                            >
                              <Copy size={30} />
                            </span>
                          </span>
                        ) : (
                          <strong className="text-blue-600">N/A</strong>
                        )}
                      </h4>

                      {/* Description and Other Details */}
                      <p className="text-lg text-gray-600">
                        {p.description || "No description provided."}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Created: {new Date(p.createdAt).toLocaleString()}
                      </p>

                      {/* Published Status */}
                      <p className="text-xl mt-2 text-green-600 uppercase">
                        {p.published ? "Published" : "Unpublished"}
                      </p>

                      {/* Additional Info */}
                      <p className="text-md text-gray-700 mt-2">
                        Questions:{" "}
                        <strong className="mr-5">{p.totalQuestions}</strong>
                        Candidates:{" "}
                        <strong className="mr-5">{p.totalCandidates}</strong>
                        Highest Score: <strong>{p.highestScore}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Buttons */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/projects/${p.id}/candidates`)
                    }
                    className="flex items-center gap-1 text-purple-600 !text-xs"
                  >
                    <Users size={16} /> Candidates
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/projects/${p.id}/questions`)
                    }
                    className="flex items-center gap-1 text-blue-600 !text-xs"
                  >
                    <FileText size={16} /> Questions
                  </button>

                  <button
                    onClick={() => togglePublished(p)}
                    className={`flex items-center gap-1 !text-xs px-2 py-1 rounded ${
                      p.published
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {p.published ? (
                      <Download size={16} />
                    ) : (
                      <Upload size={16} />
                    )}
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
