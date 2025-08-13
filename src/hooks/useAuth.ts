// src/hooks/useAuth.ts
import { useCallback, useEffect, useState } from "react";
import type { LoginResult } from "../api/auth";
import { api } from "../api/client";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => ({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  }));

  // 토큰 변동 시 axios 기본 헤더 갱신
  useEffect(() => {
    if (auth.accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${auth.accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [auth.accessToken]);

  const saveTokens = useCallback((r: LoginResult) => {
    localStorage.setItem("accessToken", r.accessToken);
    localStorage.setItem("refreshToken", r.refreshToken);
    localStorage.setItem("accessTokenExpireAt", r.accessTokenExpireAt);
    localStorage.setItem("refreshTokenExpireAt", r.refreshTokenExpireAt);
    setAuth({ accessToken: r.accessToken, refreshToken: r.refreshToken });
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpireAt");
    localStorage.removeItem("refreshTokenExpireAt");
    setAuth({ accessToken: null, refreshToken: null });
  }, []);

  return { ...auth, saveTokens, clearTokens };
}
