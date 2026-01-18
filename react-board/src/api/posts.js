import { api } from "./client";

export const PostsApi = {
  list: ({ keyword = "" } = {}) => {
    const q = keyword.trim();
    const qs = q ? `?keyword=${encodeURIComponent(q)}` : "";
    return api(`/api/posts${qs}`);
  },

  mine: () => api("/api/posts/mine"),
  detail: (id) => api(`/api/posts/${id}`),

  create: (title, content) =>
    api("/api/posts", { method: "POST", body: JSON.stringify({ title, content }) }),

  update: (id, title, content) =>
    api(`/api/posts/${id}`, { method: "PUT", body: JSON.stringify({ title, content }) }),

  remove: (id) => api(`/api/posts/${id}`, { method: "DELETE" }),
};
