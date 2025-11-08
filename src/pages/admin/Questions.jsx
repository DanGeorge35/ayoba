import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByProject, createQuestion } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import UploadQuestions from "../../components/UploadQuestions";
import AddQuestionForm from "../../components/AddQuestionForm";
import QuestionList from "../../components/QuestionList";

export default function Questions() {
  const { projectId } = useParams();
  const user = useAuth();
  const [project, setProject] = useState(null); // You may want to fetch project details via API
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!projectId || !user) return;
    const fetchData = async () => {
      const qList = await getQuestionsByProject(projectId);
      const sortedList = qList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setQuestions(sortedList);
    };
    fetchData();
  }, [projectId, user]);

  const handleDragEnd = async (event) => {
    // Implement reordering logic with API if needed
    // For now, just update local state
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q._id === active.id);
    const newIndex = questions.findIndex((q) => q._id === over.id);
    const newQuestions = [...questions];
    const [moved] = newQuestions.splice(oldIndex, 1);
    newQuestions.splice(newIndex, 0, moved);
    setQuestions(newQuestions);
    // Optionally, update order in backend
  };

  const handleEditSave = async (qid, updated) => {
    // Implement update logic with API
    // For now, just update local state
    setQuestions((prev) =>
      prev.map((q) => (q._id === qid ? { ...q, ...updated } : q))
    );
  };

  const handleDelete = async (qid) => {
    // Implement delete logic with API
    setQuestions(questions.filter((q) => q._id !== qid));
  };

  return (
    <main className="flex-1 p-6">
      <div className="main-head">
        <h1 className="text-2xl font-bold mb-2">{project?.name}</h1>
      </div>
      <div className="main-body">
        <p className="text-gray-600">{project?.description}</p>
        <p className="text-sm text-gray-400 mb-6">
          Total Questions: {questions.length}
        </p>
        <UploadQuestions
          projectId={projectId}
          onComplete={() => window.location.reload()}
        />
        <AddQuestionForm projectId={projectId} />
        <QuestionList
          questions={questions}
          onDragEnd={handleDragEnd}
          onSave={handleEditSave}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
