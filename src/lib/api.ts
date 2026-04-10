const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
const AUTH_TOKEN_KEY = "paradigm_auth_token";

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
const setToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

const buildHeaders = (extra = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: buildHeaders(options.headers),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }
  return data;
};

export const auth = {
  signUp: async (username, email, password) => {
    const result = await request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    setToken(result.token);
    return result.user;
  },
  signIn: async (email, password) => {
    const result = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(result.token);
    return result.user;
  },
  me: async () => {
    return request("/api/auth/me");
  },
  signOut: () => {
    clearToken();
  },
};

export const notes = {
  fetch: async () => request("/api/notes"),
  fetchShared: async (token) => request(`/api/notes/share/${token}`),
  create: async (title) => request("/api/notes", { method: "POST", body: JSON.stringify({ title }) }),
  update: async (id, payload) => request(`/api/notes/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: async (id) => request(`/api/notes/${id}`, { method: "DELETE" }),
};

export const habits = {
  fetch: async () => request("/api/habits"),
  create: async ({ name, frequency = "daily", reminderTime }) => request("/api/habits", { method: "POST", body: JSON.stringify({ name, frequency, reminderTime }) }),
  checkIn: async (id) => request(`/api/habits/${id}/checkin`, { method: "PATCH" }),
  updateReminder: async (id, reminderTime) => request(`/api/habits/${id}/reminder`, { method: "PATCH", body: JSON.stringify({ reminderTime }) }),
};

export const goals = {
  fetch: async () => request("/api/goals"),
  create: async (goal) => request("/api/goals", { method: "POST", body: JSON.stringify(goal) }),
};

export const journal = {
  fetch: async () => request("/api/journal"),
  create: async (entry) => request("/api/journal", { method: "POST", body: JSON.stringify(entry) }),
};

export const leaderboard = {
  fetch: async () => request("/api/leaderboard"),
};

export const api = {
  auth,
  notes,
  habits,
  goals,
  journal,
  leaderboard,
  getToken,
  clearToken,
};
