import { useState } from "react";
import { useNavigate,useLocation} from "react-router-dom";
import "./Login.css";
import { loginAdmin } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { saveTokens } = useAuth();

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await loginAdmin({ adminName, password });
      if (res.isSuccess && res.result) {
        saveTokens(res.result);

        // from이 있으면 거기로, 없으면 /chat
        const from = (location.state as any)?.from?.pathname || "/chat";
        navigate(from, { replace: true });
      } else {
        setError(res.message || "로그인에 실패했습니다.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "서버 통신 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-slogan">
        <p className="login-subtitle">경험의 맛을 잇다</p>
        <h1 className="login-title">맛잇다</h1>
      </div>

      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="login-form-title">Admin Login</h2>

          <label className="login-label" htmlFor="adminName">Admin Name</label>
          <input
            id="adminName"
            type="text"
            placeholder="Enter your admin name"
            className="login-input"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            autoComplete="username"
          />

          <label className="login-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
