import AdminNavbar from "../components/AdminNavbar";
import { useAuth } from "../hooks/useAuth";

export default function Admin() {
  const user = useAuth();

  if (user === undefined) return <p className="p-8">Loading auth...</p>;


  return (
    <div className="p-8 max-w-xl mx-auto">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Admin: Create Project</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex items-center justify-between mb-2">
        <label>Enable Timer?</label>
        <input
          type="checkbox"
          checked={enableTimer}
          onChange={() => setEnableTimer(!enableTimer)}
        />
      </div>

      {enableTimer && (
        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Countdown in minutes"
          value={countdown}
          onChange={(e) => setCountdown(Number(e.target.value))}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <label>Allow Back Navigation?</label>
        <input
          type="checkbox"
          checked={allowBack}
          onChange={() => setAllowBack(!allowBack)}
        />
      </div>

      <button
        onClick={createProjectHandler}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Create Project
      </button>

      {projectId && (
        <div className="mt-4 text-green-700">
          ✅ Project created! ID: <strong>{projectId}</strong>
          <br /> Now you can add questions.
        </div>
      )}
      {projectId && <AddQuestionForm projectId={projectId} />}
    </div>
  );
}
