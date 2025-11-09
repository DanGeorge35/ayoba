/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
const API_URL = "http://localhost:3000";

// ==== INTERFACES ====
export interface RegisterAdminParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginAdminParams {
  email: string;
  password: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface Question {
  id: string;
  projectId: string;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  [key: string]: any;
}

export interface Candidate {
  id?: string;
  name: string;
  email: string;
  projectId: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  access_token?: string;
  [key: string]: any;
}

// ==== GENERIC HELPER ====
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ==== AUTH ====
export async function registerAdmin(
  data: RegisterAdminParams
): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/admin/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiResponse>(res);
}

export async function loginAdmin(data: LoginAdminParams): Promise<ApiResponse> {
  alert(3);
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  alert(2);
  return handleResponse<ApiResponse>(res);
}

// ==== PROJECTS ====
export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/project/all`);
  return handleResponse<Project[]>(res);
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_URL}/project/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Project>(res);
}

// ==== QUESTIONS ====
export async function getQuestionsByProject(
  projectId: string
): Promise<Question[]> {
  const res = await fetch(
    `${API_URL}/question/by-project?projectId=${projectId}`
  );
  return handleResponse<Question[]>(res);
}

export async function createQuestion(
  data: Partial<Question>
): Promise<Question> {
  const res = await fetch(`${API_URL}/question/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Question>(res);
}

// ==== CANDIDATES ====
export async function submitCandidate(data: Candidate): Promise<Candidate> {
  const res = await fetch(`${API_URL}/candidate/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Candidate>(res);
}

export async function getCandidatesByProject(
  projectId: string
): Promise<Candidate[]> {
  const res = await fetch(
    `${API_URL}/candidate/by-project?projectId=${projectId}`
  );
  return handleResponse<Candidate[]>(res);
}
