const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(endpoint, options = {}) {
  const { method = "GET", body, token } = options;

  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.message || "Something went wrong", res.status);
  }

  return data;
}

// ── Auth endpoints ──────────────────────────────────────
export const authAPI = {
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  getMe: (token) =>
    request("/auth/me", { token }),
};

// ── Posts endpoints ─────────────────────────────────────
export const postsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.tag) query.set("tag", params.tag);
    const qs = query.toString();
    return request(`/posts${qs ? `?${qs}` : ""}`);
  },

  getById: (id) =>
    request(`/posts/${id}`),

  create: (postData, token) =>
    request("/posts", { method: "POST", body: postData, token }),

  update: (id, postData, token) =>
    request(`/posts/${id}`, { method: "PUT", body: postData, token }),

  delete: (id, token) =>
    request(`/posts/${id}`, { method: "DELETE", token }),
};
