import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects, getQuestionsByProject } from "../services/api";
import { getCurrentUser } from "../services/auth";

export default function ProjectQuestions() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null); // holds question object or null
  const [editState, setEditState] = useState(null); // holds edited version

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = getCurrentUser();
      if (!user) return navigate("/admin-login");
      const projects = await getProjects();
      const project = projects.find((p) => p._id === projectId);
      if (!project) return navigate("/admin-projects");
      if (project.adminId !== (user.id || user.token)) {
        alert("Unauthorized access.");
        return navigate("/admin-projects");
      }
      setProject(project);
      const qList = await getQuestionsByProject(projectId);
      setQuestions(qList);
    };
    fetchData();
  }, []);

  const handleDelete = async (qid) => {
    const confirm = window.confirm("Delete this question?");
    if (!confirm) return;
    // Implement delete logic with API
    setQuestions(questions.filter((q) => q._id !== qid));
  };

  const handleEdit = (q) => {
    setEditingQuestion(q);
    setEditState({
      text: q.text,
      options: [...q.options],
      correctAnswers: [...q.correctAnswers],
      multiCorrect: q.multiCorrect,
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{project?.name} – Questions</h1>
      <Link
        to="/admin-projects"
        className="text-blue-600 underline mb-4 inline-block"
      >
        ← Back to Projects
      </Link>

      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q, index) => (
            <li key={q._id} className="p-4 bg-white rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {index + 1}. {q.text}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(q)}
                    className="text-blue-600 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-500 text-sm"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
              <ul className="pl-4 list-disc text-sm">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={
                      q.correctAnswers.includes(i) ? "text-green-600" : ""
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {editingQuestion && (
        <div className="p-4 bg-yellow-50 mt-6 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Edit Question</h3>

          <textarea
            className="border p-2 w-full mb-2"
            value={editState.text}
            onChange={(e) =>
              setEditState({ ...editState, text: e.target.value })
            }
          />

          <label className="block mb-1 font-semibold">Options:</label>
          {editState.options.map((opt, i) => (
            <div key={i} className="flex items-center mb-2">
              <input
                className="border p-2 flex-grow"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...editState.options];
                  newOptions[i] = e.target.value;
                  setEditState({ ...editState, options: newOptions });
                }}
              />
              <input
                type={editState.multiCorrect ? "checkbox" : "radio"}
                checked={editState.correctAnswers.includes(i)}
                onChange={() => {
                  let newCorrect = [];
                  if (editState.multiCorrect) {
                    newCorrect = editState.correctAnswers.includes(i)
                      ? editState.correctAnswers.filter((idx) => idx !== i)
                      : [...editState.correctAnswers, i];
                  } else {
                    newCorrect = [i];
                  }
                  setEditState({ ...editState, correctAnswers: newCorrect });
                }}
                className="ml-2"
              />
              <span className="ml-1 text-sm">Correct</span>
            </div>
          ))}

          <div className="mb-4 flex items-center gap-2">
            <label>Multiple correct answers?</label>
            <input
              type="checkbox"
              checked={editState.multiCorrect}
              onChange={(e) =>
                setEditState({
                  ...editState,
                  multiCorrect: e.target.checked,
                  correctAnswers: [],
                })
              }
            />
          </div>

          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                // Implement update logic with API
                setQuestions((prev) =>
                  prev.map((q) =>
                    q._id === editingQuestion._id ? { ...q, ...editState } : q
                  )
                );
                setEditingQuestion(null);
              }}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditingQuestion(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
