import { useState } from 'react'
import { daire, sayi, simdi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not } from './ortak'

// Viskozite: sıvılarda bırakılan bilyenin düşme süresi. Viskozite sıcaklıkla azalır:
// η(T) = η₂₀ · exp(B · (1/T − 1/293))

const SIVILAR = [
  { ad: 'Su', eta: 1.0, B: 1800, renk: 'rgba(133,183,235,.45)' },
  { ad: 'Etanol', eta: 1.2, B: 1500, renk: 'rgba(250,199,117,.35)' },
  { ad: 'Zeytinyağı', eta: 84, B: 3500, renk: 'rgba(186,160,40,.5)' },
  { ad: 'Gliserin', eta: 1410, B: 7000, renk: 'rgba(240,240,250,.75)' },
]
const BOY = 20 // cm

export default function ViskoziteSim() {
  const [T, setT] = useState(20)
  const [baslangic, setBaslangic] = useState<number | null>(null)
  const eta = SIVILAR.map(s => s.eta * Math.exp(s.B * (1 / (T + 273) - 1 / 293)))
  // düşme süresi (s): viskoziteyle orantılı (model), su için ~0,4 s
  const sure = eta.map(e => Math.max(0.35, 0.18 * e + 0.3))

  const canvas = useAnimasyon((ctx, W, H) => {
    const n = SIVILAR.length
    const tw = Math.min(54, (W - 40) / n - 14)
    const gecen = baslangic === null ? 0 : (simdi() - baslangic) / 1000
    SIVILAR.forEach((s, i) => {
      const x = 20 + i * ((W - 40) / n) + ((W - 40) / n - tw) / 2
      const y0 = 26
      const h = H - 50
      ctx.fillStyle = s.renk
      ctx.fillRect(x, y0, tw, h)
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y0, tw, h)
      // ölçek: hızlandırılmış gösterim (gerçek sürenin karekökü kadar)
      const animSure = Math.sqrt(sure[i]) * 1.6
      const f = Math.min(1, gecen / animSure)
      daire(ctx, x + tw / 2, y0 + 8 + f * (h - 16), 6, '#5f5e5a')
      yazi(ctx, s.ad, x + tw / 2, 12, { boyut: 10, kalin: true })
      yazi(ctx, f >= 1 && baslangic !== null ? `${sayi(sure[i], 1)} s` : '', x + tw / 2, H - 12, { boyut: 11, kalin: true, renk: '#993c1d' })
    })
  })

  return (
    <div className="sim">
      <Gorev>Bilyeleri aynı anda bırak. Hangi sıvıda bilye en yavaş düşüyor? Sıcaklığı artırıp deneyi tekrarla: düşme süreleri ve viskozite nasıl değişiyor?</Gorev>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Farklı sıvılarda düşen bilyeler" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setBaslangic(simdi())}>Bilyeleri bırak</button>
      </div>
      <div className="sim-degerler">
        {SIVILAR.map((s, i) => <Deger key={s.ad} ad={`${s.ad} (mPa·s)`} deger={sayi(eta[i], eta[i] < 10 ? 2 : 0)} />)}
      </div>
      <Kaydirici etiket={<>Sıcaklık <b>{T} °C</b></>} deger={T} min={10} max={80} step={5} onChange={v => { setT(v); setBaslangic(null) }} />
      <Not>Düşme süreleri {BOY} cm'lik tüp için yaklaşık model değerleridir; animasyon hızlandırılmıştır. Gliserinin yüksek viskozitesi molekülleri arasındaki çok sayıda hidrojen bağından kaynaklanır.</Not>
    </div>
  )
}
