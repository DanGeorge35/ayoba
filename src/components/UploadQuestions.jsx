import { useState } from "react";
import { createQuestion } from "../services/api";

export default function UploadQuestions({ projectId, onComplete }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        alert("Invalid format: JSON must be an array of questions.");
        return;
      }
      const batch = parsed.filter((q) => {
        return (
          typeof q.text === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          Array.isArray(q.correctAnswers) &&
          q.correctAnswers.length >= 1 &&
          typeof q.multiCorrect === "boolean"
        );
      });
      if (batch.length === 0) {
        alert("No valid questions found.");
        return;
      }
      for (const q of batch) {
        await createQuestion({ ...q, projectId, createdAt: Date.now() });
      }
      alert(`${batch.length} question(s) uploaded.`);
      onComplete?.();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to read or parse file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-4">
      <label className="block font-semibold mb-2">
        Upload Questions (JSON):
      </label>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
