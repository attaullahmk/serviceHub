import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server URL
        changeOrigin: true, // Ensures the host header of the request matches the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove `/api` prefix
      },
    },
  },
  
  plugins: [react()],
});
