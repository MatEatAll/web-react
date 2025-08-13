// src/api/auth.ts
import { api } from "./client";

export interface LoginPayload {
  adminName: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpireAt: string;
  refreshTokenExpireAt: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: LoginResult;
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/admin/login", payload);
  return data;
}
