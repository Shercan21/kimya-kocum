import { useRef, useState } from 'react'
import { daire, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Rutherford saçılma deneyi: alfa tanecikleri altın levhaya gönderilir.
// Thomson modelinde (pozitif yük dağınık) sapma çok küçük; Rutherford modelinde
// küçük ve yoğun çekirdek nedeniyle çok az tanecik büyük açıyla saçılır.

type Model = 'rutherford' | 'thomson'
type Alfa = { x: number; y: number; vx: number; vy: number; iz: [number, number][]; bitti: boolean }

export default function RutherfordSim() {
  const [model, setModel] = useState<Model>('rutherford')
  const [sayac, setSayac] = useState({ gecen: 0, az: 0, geri: 0 })
  const sim = useRef<{ alfalar: Alfa[]; model: Model | null; atis: boolean }>({ alfalar: [], model: null, atis: true })

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const s = sim.current
    if (s.model !== model) {
      s.model = model
      s.alfalar = []
    }
    const levhaX = W * 0.55
    // altın atomları
    const cekirdekler: [number, number][] = []
    for (let j = 0; j < 7; j++) {
      const y = 18 + j * ((H - 36) / 6)
      cekirdekler.push([levhaX, y])
      if (model === 'thomson') {
        daire(ctx, levhaX, y, 15, 'rgba(242,166,35,.35)')
        for (let k = 0; k < 6; k++) daire(ctx, levhaX + Math.cos(k) * 9, y + Math.sin(k * 2) * 9, 1.6, '#378add')
      } else {
        ctx.strokeStyle = 'rgba(55,138,221,.25)'
        ctx.beginPath()
        ctx.arc(levhaX, y, 15, 0, Math.PI * 2)
        ctx.stroke()
        daire(ctx, levhaX, y, 2.5, '#e8a21a')
      }
    }
    // kaynak
    ctx.fillStyle = '#5f5e5a'
    ctx.fillRect(4, H / 2 - 16, 26, 32)
    yazi(ctx, 'α', 17, H / 2, { boyut: 14, kalin: true, renk: '#fff' })
    // ekran (dedektör)
    ctx.strokeStyle = 'rgba(29,158,117,.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(levhaX, H / 2, Math.min(W * 0.42, H * 0.95), -Math.PI * 0.9, Math.PI * 0.9)
    ctx.stroke()
    if (s.atis && Math.random() < 0.45 * dt) {
      s.alfalar.push({ x: 30, y: H / 2 + (Math.random() - 0.5) * (H - 30), vx: 3, vy: 0, iz: [], bitti: false })
    }
    for (const a of s.alfalar) {
      if (a.bitti) continue
      for (let adim = 0; adim < 3; adim++) {
        for (const [cx, cy] of cekirdekler) {
          const dx = a.x - cx
          const dy = a.y - cy
          const r2 = dx * dx + dy * dy
          if (model === 'rutherford') {
            const r = Math.sqrt(r2) + 0.5
            const f = (25 / (r * r * r)) * Math.exp(-r / 2) // perdelenmiş Coulomb itmesi
            a.vx += f * dx * 0.33 * dt
            a.vy += f * dy * 0.33 * dt
          } else if (r2 < 225) {
            a.vy += (Math.random() - 0.5) * 0.004
          }
        }
        a.x += a.vx * dt * 0.33
        a.y += a.vy * dt * 0.33
      }
      a.iz.push([a.x, a.y])
      if (a.iz.length > 60) a.iz.shift()
      if (a.x > W + 5 || a.x < 0 || a.y < -5 || a.y > H + 5) {
        a.bitti = true
        const aci = Math.abs((Math.atan2(a.vy, a.vx) * 180) / Math.PI)
        setSayac(c => ({ gecen: c.gecen + (aci < 5 ? 1 : 0), az: c.az + (aci >= 5 && aci < 90 ? 1 : 0), geri: c.geri + (aci >= 90 ? 1 : 0) }))
      }
    }
    s.alfalar = s.alfalar.filter(a => !a.bitti || a.iz.length > 0).slice(-60)
    for (const a of s.alfalar) {
      if (a.bitti) { a.iz.shift(); }
      ctx.strokeStyle = 'rgba(232,89,60,.45)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      a.iz.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
      if (!a.bitti) daire(ctx, a.x, a.y, 3, '#e8593c')
    }
  })

  const toplam = sayac.gecen + sayac.az + sayac.geri
  const yuzde = (n: number) => (toplam ? `%${((n / toplam) * 100).toFixed(1).replace('.', ',')}` : '—')

  return (
    <div className="sim">
      <Gorev>Alfa taneciklerini altın levhaya gönder ve sayaçları izle. Taneciklerin çoğu neden doğrudan geçiyor? Az sayıda tanecik neden geri dönüyor? İki modelin sonuçlarını karşılaştır.</Gorev>
      <Secenekler secenekler={[{ id: 'rutherford', ad: 'Rutherford modeli (çekirdekli)' }, { id: 'thomson', ad: 'Thomson modeli (üzümlü kek)' }]} secili={model} onSec={m => { setModel(m); setSayac({ gecen: 0, az: 0, geri: 0 }) }} etiket="Atom modeli" />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Alfa taneciklerinin altın levhadan saçılması" />
      <div className="sim-degerler">
        <Deger ad="Sapmadan geçen" deger={`${sayac.gecen} (${yuzde(sayac.gecen)})`} />
        <Deger ad="Az sapan" deger={`${sayac.az} (${yuzde(sayac.az)})`} />
        <Deger ad="Geri dönen (>90°)" deger={`${sayac.geri} (${yuzde(sayac.geri)})`} vurgu={sayac.geri > 0} />
      </div>
      <div className="row-actions start">
        <button type="button" className="btn-secondary" onClick={() => { sim.current.atis = !sim.current.atis }}>Atışı durdur / başlat</button>
        <button type="button" className="btn-secondary" onClick={() => setSayac({ gecen: 0, az: 0, geri: 0 })}>Sayaçları sıfırla</button>
      </div>
      <Not>Çekirdekler görülebilsin diye büyütülmüştür; gerçekte çekirdek atomdan yaklaşık 100 000 kat küçüktür ve geri dönen tanecik oranı çok daha azdır.</Not>
    </div>
  )
}
