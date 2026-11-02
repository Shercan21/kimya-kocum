import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startCloud } from './data/cloud'

// Hesaptan başka cihazın verisi geldiyse uygulama yeni veriyle yeniden açılır.
startCloud(() => window.location.reload())

// Ayrı parçalar halindeki sayfaları boşta iken indir; böylece service worker
// onları önbelleğe alır ve uygulama çevrimdışıyken de bütün sayfalar açılır.
const warm = () => {
  void import('./components/TopicPage')
  void import('./components/ProgramPage')
  void import('./components/CoachPage')
  void import('./components/ExamsPage')
  void import('./components/MistakeBook')
}
if ('requestIdleCallback' in window) window.requestIdleCallback(warm, { timeout: 4000 })
else setTimeout(warm, 2000)

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
