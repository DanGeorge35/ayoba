import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/api";

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!accessCode.trim()) return;
    setLoading(true);
    try {
      const projects = await getProjects();
      const project = projects.find((p) => p.accessCode === accessCode.trim());
      if (!project) {
        alert("Invalid access code. Please try again.");
        setLoading(false);
        return;
      }
      navigate(`/quiz/${project._id}`);
    } catch (error) {
      console.error("Error fetching project:", error);
      alert("An error occurred while starting the quiz.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="absolute top-0 w-full bottom-0 flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute top-32 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

      {/* Form container with glassmorphism */}
      <div className="bg-white p-8 rounded shadow-lg z-10 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Enter Access Code
        </h1>
        <input
          className="border p-3 w-full rounded mb-4 text-lg"
          placeholder="Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          disabled={loading}
        />
        <button
          className="w-full bg-blue-600 text-white py-3 rounded text-lg font-semibold hover:bg-blue-700 transition"
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? "Loading..." : "Start Quiz"}
        </button>
      </div>
    </div>
  );
}
