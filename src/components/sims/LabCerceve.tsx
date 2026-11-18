import { useEffect, useRef, useState } from 'react'
import type { SimProps } from './index'

// Laboratuvar ortamı: public/lab/<ad>.html sayfasını konu içinde gösterir.
// Sayfa kendi yüksekliğini postMessage ile bildirir; çerçeve ona göre uzar.
export default function LabCerceve({ modlar }: SimProps) {
  const ad = modlar?.[0] ?? 'titrasyon'
  const ref = useRef<HTMLIFrameElement>(null)
  const [h, setH] = useState(1100)
  useEffect(() => {
    function dinle(e: MessageEvent) {
      const d = e.data as { tur?: string; ad?: string; h?: number } | null
      if (!d || d.tur !== 'kk-lab-yukseklik' || d.ad !== ad || typeof d.h !== 'number') return
      if (ref.current && e.source !== ref.current.contentWindow) return
      setH(Math.max(600, Math.min(4000, Math.ceil(d.h) + 8)))
    }
    window.addEventListener('message', dinle)
    return () => window.removeEventListener('message', dinle)
  }, [ad])
  return (
    <iframe
      ref={ref}
      className="lab-cerceve"
      title={`Laboratuvar: ${ad}`}
      src={`${import.meta.env.BASE_URL}lab/${ad}.html#gomulu`}
      style={{ width: '100%', height: h, border: 0, display: 'block' }}
      loading="lazy"
    />
  )
}
