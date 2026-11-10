import { useRef, useState } from 'react'
import { rastgele, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not } from './ortak'

// Mikroplastiklerin okyanusta parçalanması ve besin zincirine girişi; filtre ve geri dönüşüm kararları.

type Parca = { x: number; y: number; vx: number; boy: number; yutuldu: number }

export default function MikroplastikSim() {
  const [geriDonusum, setGeriDonusum] = useState(false)
  const [filtre, setFiltre] = useState(false)
  const [yil, setYil] = useState(0)
  const sim = useRef<{ parcalar: Parca[]; balik: number; t: number; yil: number }>({ parcalar: [], balik: 0, t: 0, yil: 0 })

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const s = sim.current
    s.t += dt
    if (s.yil !== yil) {
      // her yıl güneş ışığı ve dalgalarla parçalar küçülür
      for (const p of s.parcalar) p.boy = Math.max(1, p.boy * Math.pow(0.55, Math.max(0, yil - s.yil)))
      s.yil = yil
    }
    // gökyüzü ve deniz
    ctx.fillStyle = '#e6f1fb'
    ctx.fillRect(0, 0, W, 40)
    const g = ctx.createLinearGradient(0, 40, 0, H)
    g.addColorStop(0, '#378add')
    g.addColorStop(1, '#0c447c')
    ctx.fillStyle = g
    ctx.fillRect(0, 40, W, H - 40)
    yazi(ctx, '🏙️', 20, 26, { boyut: 18 })
    if (filtre) yazi(ctx, '🧺 arıtma', 60, 26, { boyut: 11 })
    // yeni plastik girişi
    const giris = geriDonusum ? 0.04 : 0.12
    if (rastgele() < giris * dt) {
      if (!(filtre && rastgele() < 0.6)) s.parcalar.push({ x: 40, y: 44, vx: 0.4 + rastgele() * 0.4, boy: 9, yutuldu: 0 })
    }
    // balıklar
    const baliklar = [0, 1, 2].map(i => ({ x: ((s.t * (0.6 + i * 0.2) + i * 120) % (W + 60)) - 30, y: 90 + i * 45 }))
    for (const p of s.parcalar) {
      p.x += p.vx * dt
      p.y = Math.min(H - 8, p.y + 0.05 * dt * (12 - p.boy))
      if (p.x > W - 10) p.vx = -Math.abs(p.vx)
      if (p.x < 10) p.vx = Math.abs(p.vx)
      // güneş ışığı ve dalga etkisiyle parçalanma
      if (rastgele() < 0.004 * dt && p.boy > 2) p.boy *= 0.7
      for (const b of baliklar) {
        if (p.boy < 4 && !p.yutuldu && Math.hypot(p.x - b.x, p.y - b.y) < 14) {
          p.yutuldu = 1
          s.balik++
        }
      }
    }
    s.parcalar = s.parcalar.filter(p => !p.yutuldu).slice(-160)
    for (const p of s.parcalar) {
      ctx.fillStyle = p.boy > 5 ? '#f2a623' : p.boy > 3 ? '#ed93b1' : '#ffffff'
      ctx.fillRect(p.x, p.y, p.boy, p.boy * 0.6)
    }
    for (const b of baliklar) yazi(ctx, '🐟', b.x, b.y, { boyut: 18 })
  })

  function ilerlet() {
    setYil(y => y + 1)
  }

  return (
    <div className="sim">
      <Gorev>Kentten denize plastik akıyor. Plastik parçalar zamanla küçülüyor. Balıklar hangi boyuttaki parçaları yutuyor? Geri dönüşüm ve arıtma tesisi kararlarıyla denize ulaşan plastiği azaltmayı dene.</Gorev>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Okyanusta plastik parçacıklar ve balıklar" />
      <label className="sim-onay"><input type="checkbox" checked={geriDonusum} onChange={e => setGeriDonusum(e.target.checked)} /> Geri dönüşümü yaygınlaştır (denize giren plastik azalır)</label>
      <label className="sim-onay"><input type="checkbox" checked={filtre} onChange={e => setFiltre(e.target.checked)} /> Atık su arıtmaya mikroplastik filtresi ekle</label>
      <div className="row-actions start">
        <button type="button" className="btn-secondary" onClick={ilerlet}>Bir yıl ilerlet (parçalanma)</button>
      </div>
      <div className="sim-degerler">
        <Deger ad="Geçen süre" deger={`${yil} yıl`} />
        <Deger ad="Renk anahtarı" deger="🟧 makro · 🩷 mikro · ⬜ nano" />
      </div>
      <Not>Turuncu: büyük plastik, pembe: mikroplastik (&lt; 5 mm), beyaz: nanoplastik (&lt; 1 µm). Küçülen parçalar balıklar tarafından yutulup besin zincirine girer. Hızlar temsilidir.</Not>
    </div>
  )
}
