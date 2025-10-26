import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Attach JWT as Bearer token when available
api.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
});

export default api;