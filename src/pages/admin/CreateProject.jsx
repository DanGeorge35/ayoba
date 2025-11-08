import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getProjects } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function generateAccessCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function getUniqueAccessCode() {
  let code;
  let exists = true;
  while (exists) {
    code = generateAccessCode();
    const projects = await getProjects();
    exists = projects.some((p) => p.accessCode === code);
  }
  return code;
}

export default function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enableCountdown, setEnableCountdown] = useState(false);
  const [countdownTime, setCountdownTime] = useState(10);
  const [allowBackNavigation, setAllowBackNavigation] = useState(true);

  const user = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const accessCode = await getUniqueAccessCode();
    await createProject({
      name,
      description,
      enableCountdown,
      countdownTime,
      allowBackNavigation,
      accessCode,
      adminId: user?.id || user?.token,
      createdAt: Date.now(),
    });
    alert("Project created successfully with access code: " + accessCode);
    navigate("/admin/projects");
  };

  return (
    <main className="flex-1 p-6">
      <div className="main-head">
        <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      </div>
      <div className="main-body">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Quiz Name"
            className="border p-2 w-full"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quiz Description"
            className="border p-2 w-full"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableCountdown}
              onChange={() => setEnableCountdown(!enableCountdown)}
            />
            <label>Enable Countdown?</label>
          </div>
          {enableCountdown && (
            <input
              type="number"
              value={countdownTime}
              onChange={(e) => setCountdownTime(Number(e.target.value))}
              placeholder="Countdown Time (mins)"
              className="border p-2 w-full"
              min={1}
            />
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowBackNavigation}
              onChange={() => setAllowBackNavigation(!allowBackNavigation)}
            />
            <label>Allow Back Navigation?</label>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </main>
  );
}
