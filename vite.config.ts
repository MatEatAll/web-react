// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // ✅ sockjs-client의 global 참조를 브라우저 window로 치환
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mateatall.com",
        changeOrigin: true,
        // HTTPS 자체 서명 등을 쓰는 로컬 서버를 프록시할 때만 사용
        // secure: false,
      },
    },
  },
});
