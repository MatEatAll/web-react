import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mateatall.com",
        changeOrigin: true,
        // mateatall이 HTTPS이므로 기본적으로 OK.
        // (만약 로컬/사설 인증서라면 secure:false 추가)
        // secure: false,
      },
    },
  },
});
