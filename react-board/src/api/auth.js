// src/api/auth.js
import { api } from "./client";

export const Auth = {
  signup: (loginId, nickname, password) =>
    api("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({ loginId, nickname, password }),
    }),

  login: (loginId, password) =>
    api("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ loginId, password }),
    }),


  logout: () =>
    api("/api/users/logout", {
      method: "POST",
    }),

  me: () => api("/api/users/me"),
};
