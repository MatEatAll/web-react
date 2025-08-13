// src/api/client.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
// 프로덕션 빌드에서 누락되면 바로 실패하도록
if (!baseURL && import.meta.env.PROD) {
  throw new Error("VITE_API_BASE_URL is required in production");
}

export const api = axios.create({
  baseURL: baseURL || "/api", // 로컬 개발은 프록시로 /api 사용
  timeout: 10000,
});
// 요청 시 accessToken이 있으면 Authorization 헤더로 붙임
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




