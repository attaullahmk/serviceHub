import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure Vercel uses the correct build directory
  },
  define: {
    'process.env': {}, // Fix for some environment variables in production
  },
});
