import { useState } from "react";
import { createQuestion, getQuestionsByProject } from "../services/api";

export default function AddQuestionForm({ projectId }) {
  const [text, setText] = useState("");
  const [module, setModule] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [multiCorrect, setMultiCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const toggleCorrect = (index) => {
    if (multiCorrect) {
      setCorrectAnswers((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setCorrectAnswers([index]);
    }
  };

  const saveQuestion = async () => {
    if (!text.trim() || options.length < 2 || correctAnswers.length === 0) {
      alert("Please fill all fields correctly.");
      return;
    }
    // Get the number of existing questions to determine the next order
    const existingQuestions = await getQuestionsByProject(projectId);
    const order = existingQuestions.length;
    const question = {
      projectId,
      text,
      options,
      correctAnswers,
      multiCorrect,
      module: module.trim() || "Uncategorized",
      createdAt: Date.now(),
      order,
    };
    await createQuestion(question);
    // Reset form
    setText("");
    setModule("");
    setOptions(["", ""]);
    setCorrectAnswers([]);
    setMultiCorrect(false);
    alert("Question added!");
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Add Question</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Module (e.g. Module 1)"
        value={module}
        onChange={(e) => setModule(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Enter question"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <label className="block mb-2">Options:</label>
      {options.map((opt, index) => (
        <div key={index} className="flex items-center mb-2 gap-2">
          {" "}
          <input
            className="border p-2 flex-grow"
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, index)}
            placeholder={`Option ${index + 1}`}
          />{" "}
          <input
            type={multiCorrect ? "checkbox" : "radio"}
            checked={correctAnswers.includes(index)}
            onChange={() => toggleCorrect(index)}
          />{" "}
          <span className="text-sm">Correct</span>{" "}
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => {
                const newOpts = options.filter((_, i) => i !== index);
                setOptions(newOpts); // adjust correctAnswers
                const updatedCorrect = correctAnswers
                  .filter((i) => i !== index)
                  .map((i) => (i > index ? i - 1 : i));
                setCorrectAnswers(updatedCorrect);
              }}
              className="text-red-500 text-xs ml-1"
            >
              {" "}
              ✖{" "}
            </button>
          )}{" "}
        </div>
      ))}

      {options.length < 4 && (
        <button onClick={addOption} className="text-blue-600 mb-4">
          ➕ Add Option
        </button>
      )}

      <div className="flex items-center mb-4">
        <label className="mr-2">Allow multiple correct answers?</label>
        <input
          type="checkbox"
          checked={multiCorrect}
          onChange={() => {
            setMultiCorrect(!multiCorrect);
            setCorrectAnswers([]);
          }}
        />
      </div>

      <button
        onClick={saveQuestion}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Save Question
      </button>
    </div>
  );
}
