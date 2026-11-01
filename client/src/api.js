const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

export async function getRecords(resource) {
  const response = await fetch(`${API_BASE}/${resource}`);
  if (!response.ok) throw new Error("The server could not load this collection.");
  return response.json();
}

export async function createRecord(resource, record) {
  const response = await fetch(`${API_BASE}/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The record could not be saved.");
  return result;
}
