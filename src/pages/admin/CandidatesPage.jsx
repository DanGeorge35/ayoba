import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCandidatesByProject } from "../../services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ===== CSV =====
function exportToCSV(data, filename = "candidates.csv") {
  const headers = ["Name", "Email", "Score", "Total", "Submitted At"];
  const rows = data.map((c) => [
    c.name,
    c.email,
    c.score,
    c.total,
    new Date(c.submittedAt).toLocaleString(),
  ]);
  const csvContent = [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===== EXCEL =====
function exportToExcel(data, filename = "candidates.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((c) => ({
      Name: c.name,
      Email: c.email,
      Score: c.score,
      Total: c.total,
      "Submitted At": new Date(c.submittedAt).toLocaleString(),
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
  XLSX.writeFile(workbook, filename);
}

// ===== PDF =====
function exportToPDF(data, filename = "candidates.pdf") {
  const doc = new jsPDF();
  const tableColumn = ["Name", "Email", "Score", "Total", "Submitted At"];
  const tableRows = data.map((c) => [
    c.name,
    c.email,
    c.score,
    c.total,
    new Date(c.submittedAt).toLocaleString(),
  ]);
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });
  doc.save(filename);
}

export default function CandidatesPage() {
  const { projectId } = useParams();
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

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="main-body">
        <h1 className="text-2xl font-bold mb-2">
          Candidates – {project?.name || "Loading..."}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Access Code:{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            {project?.accessCode}
          </code>
        </p>

        {candidates.length > 0 && (
          <div className="mb-4 space-x-2">
            <button
              onClick={() => exportToCSV(candidates)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              ⬇️ Export CSV
            </button>
            <button
              onClick={() => exportToExcel(candidates)}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              📊 Export Excel
            </button>
          </div>
        )}

        {candidates.length === 0 ? (
          <p className="text-gray-500">No candidates submitted yet.</p>
        ) : (
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
                {candidates.map((c, i) => (
                  <tr
                    key={c.id}
                    className={i === 0 ? "bg-yellow-50 font-semibold" : ""}
                  >
                    <td className="px-4 py-2">{i + 1}</td>
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
        )}
      </div>
    </main>
  );
}
