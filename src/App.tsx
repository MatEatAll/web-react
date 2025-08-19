// src/App.tsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

// 그대로 사용
import { useAuth } from "./hooks/useAuth";
// STOMP 상태/제어 훅
import { useStomp } from "./ws/StompProvider";

function App() {
  const { accessToken } = useAuth();
  const { status, connect, disconnect } = useStomp();

  // 로그인 여부를 accessToken 존재 여부로 판단
  useEffect(() => {
    if (accessToken) {
      connect(accessToken);
    } else {
      disconnect();
    }
    // connect/disconnect는 컨텍스트에서 안정된 참조이면 dep에 넣어도 무방
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 연결 상태 배지(개발용): 네트워크 프레임 확인 전 간단 피드백 */}
      <div
        style={{
          position: "fixed",
          right: 12,
          bottom: 12,
          fontSize: 12,
          padding: "6px 10px",
          borderRadius: 8,
          background: "#eee",
        }}
      >
        WS: {status}
      </div>
    </Router>
  );
}

export default App;
