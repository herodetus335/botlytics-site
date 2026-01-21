import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: '../js',
    emptyOutDir: false,
    lib: {
      entry: 'src/main.jsx',
      name: 'BotlyticsComponents',
      fileName: () => 'roi-calculator.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        extend: true
      }
    }
  }
});
