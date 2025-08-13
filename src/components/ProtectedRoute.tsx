import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // 경로 별칭 없으면 ../hooks/useAuth 로
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();
  const location = useLocation();

  // 토큰 없으면 로그인으로 보내되, 돌아올 위치를 state에 담아둔다.
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
