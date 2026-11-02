import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// KIMYA_KOCUM, KIMYA_KOCUN (5173) ile karışmasın diye 5174'te açılır.
export default defineConfig({
  // GitHub Pages için: BASE_PATH=/kimya-kocum/ npm run build
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
})
