import { useEffect, useRef, useState } from 'react'
import './advertising.css'

export const SPONSORSHIP_URL = 'https://kimya-kocun-reklam.dependablepin4.chatgpt.site'
// Başvuru hizmeti kullanıcı kararıyla yalnızca sahibine açıktır.
export const ADVERTISING_PUBLIC = false
type Placement = 'home' | 'banner' | 'content' | 'sponsor'
type Advertisement = { id: string; title: string; company: string; kind: Placement; url: string; image: string; receipt: string }
export function SponsorshipLink() {
  return <a className="sponsorship-link" href={SPONSORSHIP_URL} target="_blank" rel="noopener noreferrer">Reklam ve Sponsorluk</a>
}
function valid(ad: Advertisement) {
  try {
    const u = new URL(ad.url)
    return typeof ad.id === 'string' && typeof ad.title === 'string' && typeof ad.receipt === 'string' && u.protocol === 'https:' && !u.username && !u.password && (ad.image === '' || /^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(ad.image))
  } catch { return false }
}
function Creative({ ad }: { ad: Advertisement }) {
  const ref = useRef<HTMLElement>(null)
  const sent = useRef(new Set<string>())
  function record(type: 'impression' | 'click') {
    const key = ad.receipt + type
    if (sent.current.has(key)) return
    sent.current.add(key)
    fetch(`${SPONSORSHIP_URL}/api/event`, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receipt: ad.receipt, type }), keepalive: true }).then(r => { if (!r.ok) sent.current.delete(key) }).catch(() => sent.current.delete(key))
  }
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    let timer: ReturnType<typeof setTimeout> | undefined
    let visible = false
    const clear = () => { clearTimeout(timer) }
    const schedule = () => { clear(); if (visible && !document.hidden) timer = setTimeout(() => record('impression'), 1000) }
    const observer = new IntersectionObserver(entries => { visible = entries[0].intersectionRatio >= .5; schedule() }, { threshold: [0, .5, 1] })
    observer.observe(el)
    document.addEventListener('visibilitychange', schedule)
    return () => { clear(); observer.disconnect(); document.removeEventListener('visibilitychange', schedule) }
    // Ölçüm yaşam döngüsü yalnızca sunulan reklam makbuzuyla değişir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad.receipt])
  return <aside ref={ref} className={`sponsor-creative sponsor-creative-${ad.kind}`} aria-label={ad.kind === 'sponsor' ? 'Özel sponsor' : 'Reklam'}>
    <small>{ad.kind === 'sponsor' ? 'Özel sponsor' : ad.kind === 'content' ? 'Sponsorlu içerik' : 'Reklam'}</small>
    <a href={ad.url} target="_blank" rel="sponsored noopener noreferrer" onClick={() => record('click')}>
      {ad.image && <img src={SPONSORSHIP_URL + ad.image} alt={ad.title} loading="lazy" />}
      <span>{ad.title}</span>
    </a>
  </aside>
}
export function AdvertisingArea({ placement }: { placement: Placement }) {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!ADVERTISING_PUBLIC) return
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    fetch(`${SPONSORSHIP_URL}/api/ads?screen=home&placement=${placement}`, { signal: controller.signal, credentials: 'omit', cache: 'no-store' })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (!controller.signal.aborted) setAds(Array.isArray(data) ? data.filter(valid) : []) })
      .catch(() => { /* Çevrimdışı kullanımda alan sessizce boş kalır. */ })
      .finally(() => clearTimeout(timeout))
    return () => { controller.abort(); clearTimeout(timeout) }
  }, [placement])
  useEffect(() => {
    if (ads.length < 2 || placement === 'content') return
    const timer = setInterval(() => { if (!document.hidden) setIndex(i => (i + 1) % ads.length) }, 10000)
    return () => clearInterval(timer)
  }, [ads.length, placement])
  if (!ads.length) return null
  return <div className="sponsor-area">{(placement === 'content' ? ads : [ads[index % ads.length]]).map(ad => <Creative key={ad.receipt} ad={ad} />)}</div>
}
