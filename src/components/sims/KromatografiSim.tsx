import { useEffect, useState } from 'react'
import { sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Kâğıt kromatografisi: mürekkebi oluşturan boyalar çözücüyle farklı hızlarda ilerler.
// Rf = boyanın aldığı yol / çözücünün aldığı yol

type Cozucu = 'su' | 'alkol'
const MUREKKEPLER: Record<string, { ad: string; boyalar: { renk: string; ad: string; rfSu: number; rfAlkol: number }[] }> = {
  siyah: { ad: 'Siyah keçeli kalem', boyalar: [{ renk: '#f2c94c', ad: 'sarı', rfSu: 0.82, rfAlkol: 0.55 }, { renk: '#d4537e', ad: 'pembe', rfSu: 0.58, rfAlkol: 0.72 }, { renk: '#378add', ad: 'mavi', rfSu: 0.34, rfAlkol: 0.9 }] },
  yesil: { ad: 'Yeşil keçeli kalem', boyalar: [{ renk: '#f2c94c', ad: 'sarı', rfSu: 0.8, rfAlkol: 0.5 }, { renk: '#378add', ad: 'mavi', rfSu: 0.36, rfAlkol: 0.88 }] },
  kahve: { ad: 'Kahverengi kalem', boyalar: [{ renk: '#ef9f27', ad: 'turuncu', rfSu: 0.7, rfAlkol: 0.45 }, { renk: '#a32d2d', ad: 'kırmızı', rfSu: 0.48, rfAlkol: 0.62 }, { renk: '#26215c', ad: 'lacivert', rfSu: 0.18, rfAlkol: 0.8 }] },
}

export default function KromatografiSim() {
  const [mid, setMid] = useState('siyah')
  const [cozucu, setCozucu] = useState<Cozucu>('su')
  const [ilerleme, setIlerleme] = useState(0)
  const [calisiyor, setCalisiyor] = useState(false)
  const m = MUREKKEPLER[mid]

  useEffect(() => {
    if (!calisiyor) return
    const id = window.setInterval(() => setIlerleme(p => {
      if (p >= 1) { setCalisiyor(false); return 1 }
      return Math.min(1, p + 0.01)
    }), 50)
    return () => window.clearInterval(id)
  }, [calisiyor])

  const canvas = useAnimasyon((ctx, W, H) => {
    const kx = W / 2 - 50
    const kw = 100
    const ust = 16
    const baslangic = H - 50
    const bitis = ust + 20
    const cozucuY = baslangic - (baslangic - bitis) * ilerleme
    // beher ve çözücü
    ctx.fillStyle = cozucu === 'su' ? 'rgba(133,183,235,.35)' : 'rgba(250,199,117,.3)'
    ctx.fillRect(kx - 30, H - 34, kw + 60, 26)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.strokeRect(kx - 30, ust + 4, kw + 60, H - 12 - ust)
    // kâğıt
    ctx.fillStyle = '#fbfaf5'
    ctx.fillRect(kx, ust, kw, H - 30 - ust)
    ctx.fillStyle = cozucu === 'su' ? 'rgba(133,183,235,.25)' : 'rgba(250,199,117,.22)'
    ctx.fillRect(kx, cozucuY, kw, H - 30 - cozucuY)
    ctx.strokeStyle = '#b4b2a9'
    ctx.strokeRect(kx, ust, kw, H - 30 - ust)
    // başlangıç çizgisi
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(kx, baslangic)
    ctx.lineTo(kx + kw, baslangic)
    ctx.stroke()
    ctx.setLineDash([])
    // boyalar
    for (const b of m.boyalar) {
      const rf = cozucu === 'su' ? b.rfSu : b.rfAlkol
      const y = baslangic - (baslangic - cozucuY) * rf
      const g = ctx.createRadialGradient(kx + kw / 2, y, 1, kx + kw / 2, y, 10 + ilerleme * 4)
      g.addColorStop(0, b.renk)
      g.addColorStop(1, b.renk + '00')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(kx + kw / 2, y, 10 + ilerleme * 6, 6 + ilerleme * 5, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    if (ilerleme > 0) yazi(ctx, 'çözücü cephesi', kx + kw + 36, cozucuY, { boyut: 9, renk: '#6b6a7a' })
  })

  return (
    <div className="sim">
      <Gorev>Mürekkebi ve çözücüyü seçip kromatografiyi başlat. Mürekkep kaç boyadan oluşuyor? Çözücü değişince boyaların sırası neden değişiyor? Her boyanın Rf değerini bul.</Gorev>
      <Secenekler secenekler={Object.keys(MUREKKEPLER).map(k => ({ id: k, ad: MUREKKEPLER[k].ad }))} secili={mid} onSec={v => { setMid(v); setIlerleme(0); setCalisiyor(false) }} etiket="Mürekkep" />
      <Secenekler secenekler={[{ id: 'su', ad: 'Su (polar)' }, { id: 'alkol', ad: 'Alkol (daha az polar)' }]} secili={cozucu} onSec={v => { setCozucu(v); setIlerleme(0); setCalisiyor(false) }} etiket="Çözücü" />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Kâğıt kromatografisi" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => { if (ilerleme >= 1) setIlerleme(0); setCalisiyor(true) }}>Kâğıdı çözücüye daldır</button>
      </div>
      {ilerleme >= 1 && (
        <div className="sim-degerler">
          {m.boyalar.map(b => <Deger key={b.ad} ad={`${b.ad} boya Rf`} deger={sayi(cozucu === 'su' ? b.rfSu : b.rfAlkol, 2)} />)}
        </div>
      )}
      <Not>Konuyu genişleten deney: boyalar, çözücüyle ve kâğıtla kurdukları etkileşimin gücüne göre farklı hızlarda taşınır ("benzer benzeri çözer"). Rf değerleri temsilidir.</Not>
    </div>
  )
}
