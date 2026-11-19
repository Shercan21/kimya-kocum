import { useEffect, useRef, useState } from 'react'

// Yönetimden eklenen Deney Atölyesi labını public/lab/oynat.html içinde oynatır.
// Çerçeve "hazırım" deyince deney verisi postMessage ile gönderilir.
export default function LabPaketiKart({ deney, ad }: { deney: Record<string, unknown>; ad: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [h, setH] = useState(1100)
  useEffect(() => {
    function dinle(e: MessageEvent) {
      const w = ref.current?.contentWindow
      if (!w || e.source !== w || e.origin !== location.origin) return
      const d = e.data as { tip?: string; tur?: string; h?: number } | null
      if (d?.tip === 'kimya-lab-hazir') w.postMessage({ tip: 'kimya-lab-deney', deney }, location.origin)
      else if (d?.tur === 'kk-lab-yukseklik' && typeof d.h === 'number') setH(Math.max(600, Math.min(4000, Math.ceil(d.h) + 8)))
    }
    window.addEventListener('message', dinle)
    return () => window.removeEventListener('message', dinle)
  }, [deney])
  return (
    <iframe
      ref={ref}
      className="lab-cerceve"
      title={`Laboratuvar: ${ad}`}
      src={`${import.meta.env.BASE_URL}lab/oynat.html#gomulu`}
      style={{ width: '100%', height: h, border: 0, display: 'block' }}
      loading="lazy"
      allow="fullscreen"
      allowFullScreen
    />
  )
}
