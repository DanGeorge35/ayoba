/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCandidatesByProject } from "../services/api";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export default function Result() {
  const { projectId, userId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidates = await getCandidatesByProject(projectId);
        const candidate = candidates.find((c) => c._id === userId);
        if (!candidate) {
          alert("Result not found.");
          return;
        }
        setCandidate(candidate);
        // Sort leaderboard by score desc, then submittedAt asc
        const sorted = [...candidates].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.submittedAt - b.submittedAt;
        });
        setLeaderboard(sorted.map((doc, idx) => ({ ...doc, rank: idx + 1 })));
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };
    fetchData();
  }, [projectId, userId]);

  if (!candidate) {
    return <p className="p-8 text-center">Loading your results...</p>;
  }

  const userRank =
    leaderboard.find((entry) => entry._id === userId)?.rank ?? null;

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        recycle={false}
      />
      <h1 className="text-3xl font-bold mb-4">🎉 Quiz Complete!</h1>
      <p className="text-xl mb-2">
        You scored <strong>{candidate.score}</strong> out of{" "}
        <strong>{candidate.total}</strong>
      </p>
      {userRank && (
        <p className="mb-2 text-green-700 font-semibold">
          Your rank: #{userRank}
        </p>
      )}
      <p className="mb-6 text-gray-600">
        Thank you, <strong>{candidate.name}</strong>!
      </p>
      {/* <h2 className="text-xl font-semibold mb-2">🏆 Top Performers</h2> */}
      <ul className="bg-white p-4 rounded shadow text-left mb-6">
        {leaderboard.slice(0, 5).map((entry, i) => (
          <li
            key={entry._id}
            className={`py-1 border-b ${
              entry._id === userId ? "bg-green-100 font-bold" : ""
            }`}
          >
            {entry.rank}. {entry.name} – {entry.score} pts
          </li>
        ))}
      </ul>

      <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
        Back to Home
      </Link>
    </div>
  );
}
