import { useEffect, useState } from "react";
import { getCandidatesByProject } from "../services/api";

export default function CandidateLeaderboard({ projectId }) {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    const fetchCandidates = async () => {
      const list = await getCandidatesByProject(projectId);
      list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.submittedAt - b.submittedAt;
      });
      setCandidates(list);
    };
    fetchCandidates();
  }, [projectId]);

  if (candidates.length === 0) {
    return (
      <div className="mt-8 text-gray-500">No candidate submissions yet.</div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, index) => (
              <tr
                key={c._id}
                className={index === 0 ? "bg-yellow-50 font-semibold" : ""}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2 text-gray-600">{c.email}</td>
                <td className="px-4 py-2">
                  {c.score} / {c.total}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(c.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
