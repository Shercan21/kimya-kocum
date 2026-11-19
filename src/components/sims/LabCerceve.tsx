import { useEffect, useRef, useState } from 'react'
import type { SimProps } from './index'
import { LAB_3B, LAB_3B_OZEL } from '../../data/lab3b'

// Laboratuvar ortamı: public/lab/<ad>.html sayfasını konu içinde gösterir.
// Sayfa kendi yüksekliğini postMessage ile bildirir; çerçeve ona göre uzar.
export default function LabCerceve({ modlar }: SimProps) {
  const ad = modlar?.[0] ?? 'titrasyon'
  const ref = useRef<HTMLIFrameElement>(null)
  const [h, setH] = useState(1100)
  const [uc, setUc] = useState(false)
  const ozel3b = LAB_3B_OZEL[ad]
  const var3b = LAB_3B.has(ad) || !!ozel3b
  useEffect(() => {
    function dinle(e: MessageEvent) {
      const d = e.data as { tur?: string; ad?: string; h?: number } | null
      if (!d || d.tur !== 'kk-lab-yukseklik' || typeof d.h !== 'number') return
      if (ref.current && e.source !== ref.current.contentWindow) return
      setH(Math.max(600, Math.min(4000, Math.ceil(d.h) + 8)))
    }
    window.addEventListener('message', dinle)
    return () => window.removeEventListener('message', dinle)
  }, [ad])
  return (
    <>
    {var3b && (
      <div className="lab-gorunum" role="tablist" aria-label="Lab görünümü">
        <button type="button" role="tab" aria-selected={!uc} className={uc ? '' : 'on'} onClick={() => setUc(false)}>🧪 2B lab</button>
        <button type="button" role="tab" aria-selected={uc} className={uc ? 'on' : ''} onClick={() => setUc(true)}>🧊 3B görünüm</button>
      </div>
    )}
    <iframe
      key={uc ? '3b' : '2b'}
      ref={ref}
      className="lab-cerceve"
      title={`Laboratuvar: ${ad}`}
      src={uc ? (ozel3b ? `${import.meta.env.BASE_URL}lab/3b/${ozel3b}#gomulu` : `${import.meta.env.BASE_URL}lab/3b/oynat3b.html#${ad}&gomulu`) : `${import.meta.env.BASE_URL}lab/${ad}.html#gomulu`}
      style={{ width: '100%', height: h, border: 0, display: 'block' }}
      loading="lazy"
      allow="fullscreen"
      allowFullScreen
    />
    </>
  )
}
