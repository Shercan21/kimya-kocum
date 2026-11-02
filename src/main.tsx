import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service worker yalnızca derlenmiş sürümde (npm run build / preview)
// çalışır; geliştirme sırasında eski dosyaların önbellekte kalmasını önler.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Kayıt başarısız olsa da uygulama normal çalışmaya devam eder.
    })
  })
}
