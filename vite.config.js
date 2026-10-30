import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// =====================================================================
// Vite 설정
// - 개발 서버: http://localhost:5173
// - /api 로 시작하는 요청은 분석 서버(localhost:8080)로 대신 전달(proxy)
//   → 브라우저 입장에서는 같은 주소로 요청하는 것이라 CORS 문제가 생기지 않음
// =====================================================================
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
