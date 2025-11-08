import { useState, useEffect } from "react";

export default function QuestionCard({
  question,
  isEditing,
  setIsEditing,
  onSave,
  onDelete,
}) {
  const [edit, setEdit] = useState({
    text: question.text,
    module: question.module || "",
    options: [...question.options],
    correctAnswers: [...question.correctAnswers],
    multiCorrect: question.multiCorrect ?? false,
  });

  useEffect(() => {
    if (isEditing) {
      setEdit({
        text: question.text,
        module: question.module || "",
        options: [...question.options],
        correctAnswers: [...question.correctAnswers],
        multiCorrect: question.multiCorrect ?? false,
      });
    }
  }, [isEditing, question]);

  const toggleCorrect = (index) => {
    if (edit.multiCorrect) {
      setEdit((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers.includes(index)
          ? prev.correctAnswers.filter((i) => i !== index)
          : [...prev.correctAnswers, index],
      }));
    } else {
      setEdit((prev) => ({ ...prev, correctAnswers: [index] }));
    }
  };

  const handleSave = () => {
    if (
      !edit.text.trim() ||
      edit.options.length < 2 ||
      edit.correctAnswers.length === 0
    ) {
      alert(
        "Please complete the question with at least 2 options and 1 correct answer."
      );
      return;
    }
    onSave(question.id, edit);
    setIsEditing(false);
  };

  return (
    <div className="p-4 mb-2 bg-white shadow rounded">
      {isEditing ? (
        <div>
          <input
            className="border p-2 w-full mb-2"
            value={edit.text}
            onChange={(e) => setEdit({ ...edit, text: e.target.value })}
            placeholder="Question text"
          />
          <input
            className="border p-2 w-full mb-2"
            value={edit.module}
            onChange={(e) => setEdit({ ...edit, module: e.target.value })}
            placeholder="Module"
          />
          <label className="text-sm font-semibold">Options:</label>
          {edit.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                className="border p-1 flex-grow"
                value={opt}
                onChange={(e) => {
                  const newOpts = [...edit.options];
                  newOpts[i] = e.target.value;
                  setEdit({ ...edit, options: newOpts });
                }}
              />
              <input
                type={edit.multiCorrect ? "checkbox" : "radio"}
                checked={edit.correctAnswers.includes(i)}
                onChange={() => toggleCorrect(i)}
              />
              <span className="text-sm">Correct</span>
              {edit.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    const newOptions = edit.options.filter(
                      (_, idx) => idx !== i
                    );
                    const updatedCorrect = edit.correctAnswers
                      .filter((idx) => idx !== i)
                      .map((idx) => (idx > i ? idx - 1 : idx));
                    setEdit({
                      ...edit,
                      options: newOptions,
                      correctAnswers: updatedCorrect,
                    });
                  }}
                  className="text-red-500 text-xs"
                  title="Remove Option"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          {edit.options.length < 4 && (
            <button
              className="text-sm text-blue-600 mb-2"
              onClick={() =>
                setEdit((prev) => ({
                  ...prev,
                  options: [...prev.options, ""],
                }))
              }
            >
              ➕ Add Option
            </button>
          )}
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm">Multiple correct answers?</label>
            <input
              type="checkbox"
              checked={edit.multiCorrect}
              onChange={() =>
                setEdit({
                  ...edit,
                  multiCorrect: !edit.multiCorrect,
                  correctAnswers: [],
                })
              }
            />
          </div>
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="font-semibold">{question.text}</p>
          <ul className="list-disc pl-4 text-sm">
            {question.options.map((opt, i) => (
              <li
                key={i}
                className={
                  question.correctAnswers.includes(i) ? "text-green-600" : ""
                }
              >
                {opt}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-1">
            Module: {question.module || "Uncategorized"}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-sm"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="text-red-600 text-sm"
            >
              🗑 Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
