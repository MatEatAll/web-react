import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Router>
      <Header /> {/* 모든 페이지 상단에 공통 렌더링 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* 필요한 라우트 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
