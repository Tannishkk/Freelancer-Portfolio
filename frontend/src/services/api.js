import axios from "axios";

const API = axios.create({
  baseURL: "https://freelancer-portfolio-9i0k.onrender.com/api",
});

// 🔥 ADD TOKEN IN EVERY REQUEST
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // 👈 debug

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;