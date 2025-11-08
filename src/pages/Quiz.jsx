/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjects,
  getQuestionsByProject,
  submitCandidate,
} from "../services/api";
import { AnimatePresence, motion } from "framer-motion";

export default function Quiz() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [user, setUser] = useState({ name: "", email: "" });
  const [answers, setAnswers] = useState({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectAndQuestions = async () => {
      try {
        const projects = await getProjects();
        const proj = projects.find((p) => p._id === projectId);
        if (!proj) {
          alert("Invalid project ID.");
          navigate("/");
          return;
        }
        if (proj.published === false) {
          alert("Quiz project is unpublished.");
          navigate("/");
          return;
        }
        setProject(proj);
        const qs = await getQuestionsByProject(projectId);
        qs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setQuestions(qs);
        if (proj.enableCountdown) {
          const totalTime = (proj.countdownTime || 10) * 60;
          setTimeLeft(totalTime);
        }
      } catch (err) {
        alert("Failed to load quiz: " + err.message);
        navigate("/");
      }
    };
    fetchProjectAndQuestions();
  }, [projectId, navigate]);

  useEffect(() => {
    if (!project?.enableCountdown || timeLeft === null) return;
    if (timeLeft === 0) {
      alert("Time's up! Submitting your quiz...");
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, project]);

  const handleAnswerChange = (qid, index, isMulti) => {
    setAnswers((prev) => {
      const prevAns = prev[qid] || [];
      if (isMulti) {
        return {
          ...prev,
          [qid]: prevAns.includes(index)
            ? prevAns.filter((i) => i !== index)
            : [...prevAns, index],
        };
      } else {
        return { ...prev, [qid]: [index] };
      }
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let score = 0;
    questions.forEach((q) => {
      const correct = (q.correctAnswers || []).sort().join(",");
      const userAns = (answers[q._id] || []).sort().join(",");
      if (correct === userAns) score++;
    });
    const candidateData = {
      projectId,
      name: user.name,
      email: user.email,
      score,
      total: questions.length,
      submittedAt: Date.now(),
      answers,
    };
    try {
      const result = await submitCandidate(candidateData);
      navigate(`/result/${projectId}/${result._id}`);
    } catch (err) {
      alert("Failed to submit quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!user.name || !user.email) return;
    const storageKey = `quiz_${projectId}_taken`;
    const existing = localStorage.getItem(storageKey);
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.email !== user.email) {
        alert("You have already taken this test with another email.");
        return;
      }
      // Optionally: Check if submission is still valid (not implemented)
      setStep(1);
      return;
    }
    localStorage.setItem(
      storageKey,
      JSON.stringify({ email: user.email, startedAt: Date.now() })
    );
    setStep(1);
  };

  if (!project || questions.length === 0)
    return <p className="p-6 text-center">Loading quiz...</p>;

  if (step === 0) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Enter Your Details</h1>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Your Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-4"
          placeholder="Your Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={!user.name || !user.email}
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentQIndex];
  const userAnswer = answers[q._id] || [];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={q._id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="p-8 max-w-xl mx-auto"
      >
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>
            Question {currentQIndex + 1} of {questions.length}
          </span>
          {project.enableCountdown && (
            <span className="font-semibold text-red-500">
              ⏳ {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">{q.text}</h2>

        {q.options.map((opt, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.96 }}
            className={`mb-2 cursor-pointer p-2 border rounded ${
              userAnswer.includes(i)
                ? "bg-green-100 border-green-400"
                : "bg-white"
            }`}
            onClick={() => handleAnswerChange(q._id, i, q.multiCorrect)}
          >
            <label className="flex items-center space-x-2">
              <input
                type={q.multiCorrect ? "checkbox" : "radio"}
                checked={userAnswer.includes(i)}
                onChange={() => handleAnswerChange(q._id, i, q.multiCorrect)}
              />
              <span>{opt}</span>
            </label>
          </motion.div>
        ))}

        <div className="flex justify-between mt-6">
          {project.allowBackNavigation && currentQIndex > 0 && (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setCurrentQIndex((i) => i - 1)}
            >
              Previous
            </button>
          )}
          {currentQIndex < questions.length - 1 ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setCurrentQIndex((i) => i + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
