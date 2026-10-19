const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
};

export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.q) params.append("q", filters.q);
  if (filters.category) params.append("category", filters.category);

  const queryString = params.toString();
  return request(`/events${queryString ? `?${queryString}` : ""}`);
};

export const getEventById = async (id) => request(`/events/${id}`);
export const createEvent = async (payload) =>
  request("/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateEvent = async (id, payload) =>
  request(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const deleteEvent = async (id) =>
  request(`/events/${id}`, { method: "DELETE" });
