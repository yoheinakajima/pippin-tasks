import { Task, ApiTest } from "@db/schema";

const API_BASE = "/api";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks`);
  return response.json();
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return response.json();
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
}

export async function createApiTest(test: Omit<ApiTest, "id" | "createdAt">): Promise<ApiTest> {
  const response = await fetch(`${API_BASE}/tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(test),
  });
  return response.json();
}

export async function fetchApiTests(): Promise<ApiTest[]> {
  const response = await fetch(`${API_BASE}/tests`);
  return response.json();
}
