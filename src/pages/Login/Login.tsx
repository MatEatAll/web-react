import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter correct password");
      return;
    }
    setError("");
    console.log("Login:", email, password);
    navigate("/");
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

          <label className="login-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label" htmlFor="password">Password</label>
          
            <input
              id="password"
              type= "password"
              placeholder="Enter your password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
  

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
