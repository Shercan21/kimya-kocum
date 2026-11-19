import { useEffect, useRef, useState } from 'react'

// Yönetimden eklenen Deney Atölyesi labını public/lab/oynat.html içinde oynatır.
// Çerçeve "hazırım" deyince deney verisi postMessage ile gönderilir.
export default function LabPaketiKart({ deney, ad }: { deney: Record<string, unknown>; ad: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [h, setH] = useState(1100)
  const [uc, setUc] = useState(false)
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
    <>
    <div className="lab-gorunum" role="tablist" aria-label="Lab görünümü">
      <button type="button" role="tab" aria-selected={!uc} className={uc ? '' : 'on'} onClick={() => setUc(false)}>🧪 2B lab</button>
      <button type="button" role="tab" aria-selected={uc} className={uc ? 'on' : ''} onClick={() => setUc(true)}>🧊 3B görünüm</button>
    </div>
    <iframe
      key={uc ? '3b' : '2b'}
      ref={ref}
      className="lab-cerceve"
      title={`Laboratuvar: ${ad}`}
      src={uc ? `${import.meta.env.BASE_URL}lab/3b/oynat3b.html#gomulu` : `${import.meta.env.BASE_URL}lab/oynat.html#gomulu`}
      style={{ width: '100%', height: h, border: 0, display: 'block' }}
      loading="lazy"
      allow="fullscreen"
      allowFullScreen
    />
    </>
  )
}
