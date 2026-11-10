import { useEffect, useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Not } from './ortak'

// Isıtma eğrisi: −20 °C buzdan 120 °C buhara. Sabit güçle ısıtılan 100 g su;
// hâl değişimlerinde sıcaklık sabit kalır, tanecik görünümü eş zamanlı değişir.

const M = 100 // g
const GUC = 500 // J/s (model)
const C_BUZ = 2.1
const C_SU = 4.18
const C_BUHAR = 2.0
const L_ERIME = 334
const L_BUHAR = 2260

// [başlangıç enerjisi (J), bitiş enerjisi, açıklama]
const E1 = M * C_BUZ * 20
const E2 = E1 + M * L_ERIME
const E3 = E2 + M * C_SU * 100
const E4 = E3 + M * L_BUHAR
const E5 = E4 + M * C_BUHAR * 20

function durum(E: number): { T: number; hal: string; katiOran: number; gazOran: number } {
  if (E < E1) return { T: -20 + E / (M * C_BUZ), hal: 'Katı (buz) ısınıyor', katiOran: 1, gazOran: 0 }
  if (E < E2) return { T: 0, hal: 'Erime (katı + sıvı)', katiOran: 1 - (E - E1) / (E2 - E1), gazOran: 0 }
  if (E < E3) return { T: (E - E2) / (M * C_SU), hal: 'Sıvı (su) ısınıyor', katiOran: 0, gazOran: 0 }
  if (E < E4) return { T: 100, hal: 'Kaynama (sıvı + gaz)', katiOran: 0, gazOran: (E - E3) / (E4 - E3) }
  return { T: 100 + Math.min(20, (E - E4) / (M * C_BUHAR)), hal: 'Gaz (buhar) ısınıyor', katiOran: 0, gazOran: 1 }
}

export default function IsitmaSim() {
  const [t, setT] = useState(0) // s
  const [calisiyor, setCalisiyor] = useState(false)
  const sure = E5 / GUC
  const E = Math.min(E5, t * GUC)
  const d = durum(E)

  useEffect(() => {
    if (!calisiyor) return
    const id = window.setInterval(() => setT(x => {
      const y = x + sure / 300
      if (y >= sure) { setCalisiyor(false); return sure }
      return y
    }), 40)
    return () => window.clearInterval(id)
  }, [calisiyor, sure])

  const canvas = useAnimasyon((ctx, W, H, _dt, zt) => {
    const kx = W / 2 - 80
    const ky = 10
    const kw = 160
    const kh = H - 20
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.strokeRect(kx, ky, kw, kh)
    const n = 40
    const hiz = 0.3 + Math.max(0, d.T + 20) / 60
    for (let i = 0; i < n; i++) {
      const kati = i < n * d.katiOran
      const gaz = !kati && i < n * (d.katiOran + d.gazOran) && d.gazOran > 0 ? true : d.gazOran >= 1
      let x: number
      let y: number
      if (kati) {
        // düzenli örgü, yerinde titreşim
        x = kx + 20 + (i % 8) * 17 + Math.sin(zt * 6 * hiz + i) * 1.5
        y = ky + kh - 20 - Math.floor(i / 8) * 17 + Math.cos(zt * 6 * hiz + i) * 1.5
      } else if (gaz) {
        x = kx + 10 + ((i * 53 + zt * 60 * hiz * (1 + (i % 3))) % (kw - 20))
        y = ky + 10 + ((i * 37 + zt * 45 * hiz * (1 + (i % 2))) % (kh * 0.7))
      } else {
        x = kx + 12 + ((i * 41 + Math.sin(zt * hiz + i) * 20 + zt * 10 * hiz) % (kw - 24))
        y = ky + kh - 12 - ((i * 7) % (kh * 0.35)) + Math.sin(zt * 2 * hiz + i) * 3
      }
      daire(ctx, x, y, 5, '#378add')
    }
    yazi(ctx, `${sayi(d.T, 1)} °C`, kx + kw + 34, ky + 20, { boyut: 14, kalin: true })
  })

  const egri: [number, number][] = []
  for (let s = 0; s <= t; s += sure / 120) egri.push([s, durum(s * GUC).T])
  egri.push([t, d.T])

  return (
    <div className="sim">
      <Gorev>Buzu ısıtmaya başla ve grafiği izle. Sıcaklığın sabit kaldığı iki bölge nerede? Bu sırada verilen ısı neye harcanıyor? Hangi düzlük daha uzun, neden?</Gorev>
      <canvas ref={canvas} className="sim-canvas" aria-label="Isıtılan suyun tanecik görünümü" />
      <div className="sim-degerler">
        <Deger ad="Sıcaklık" deger={`${sayi(d.T, 1)} °C`} vurgu />
        <Deger ad="Hâl" deger={d.hal} />
        <Deger ad="Verilen ısı" deger={`${sayi(E / 1000, 1)} kJ`} />
      </div>
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setCalisiyor(c => !c)}>{calisiyor ? 'Isıtmayı durdur' : 'Isıtmaya başla'}</button>
        <button type="button" className="btn-secondary" onClick={() => { setT(0); setCalisiyor(false) }}>Baştan</button>
      </div>
      <Grafik seriler={[{ ad: 'Sıcaklık', renk: '#e8593c', noktalar: egri }]} xEtiket="Zaman (s)" yEtiket="Sıcaklık (°C)" xMax={Math.ceil(sure)} yMin={-20} yMax={120} />
      <Not>100 g su sabit güçle ({GUC} J/s) ısıtılmıştır. Erime ısısı 334 J/g, buharlaşma ısısı 2260 J/g; kaynama düzlüğü bu yüzden çok daha uzundur. Hâl değişiminde verilen ısı tanecikler arası etkileşimleri yenmeye harcanır.</Not>
    </div>
  )
}
