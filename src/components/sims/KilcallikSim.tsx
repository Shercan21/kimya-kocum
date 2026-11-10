import { useState } from 'react'
import { sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Kılcallık ve yüzey gerilimi: farklı çaplı cam borularda su ve cıva.
// h = 2γ·cosθ / (ρ·g·r)

type Sivi = 'su' | 'sabunlu' | 'civa'
const SIVI: Record<Sivi, { ad: string; gamma: number; aci: number; rho: number; renk: string }> = {
  su: { ad: 'Su', gamma: 0.0728, aci: 0, rho: 1000, renk: 'rgba(55,138,221,.55)' },
  sabunlu: { ad: 'Sabunlu su', gamma: 0.03, aci: 0, rho: 1000, renk: 'rgba(120,180,240,.5)' },
  civa: { ad: 'Cıva', gamma: 0.485, aci: 140, rho: 13534, renk: 'rgba(160,165,170,.95)' },
}
const CAPLAR = [0.5, 1, 2, 4] // mm

export default function KilcallikSim() {
  const [sv, setSv] = useState<Sivi>('su')
  const s = SIVI[sv]
  const h = CAPLAR.map(d => (2 * s.gamma * Math.cos((s.aci * Math.PI) / 180)) / (s.rho * 9.81 * (d / 2000)) * 1000) // mm

  const canvas = useAnimasyon((ctx, W, H) => {
    const seviye = H * 0.6
    const olcek = 1.6 // px/mm
    // kap
    ctx.fillStyle = s.renk
    ctx.fillRect(10, seviye, W - 20, H - seviye - 8)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.strokeRect(10, seviye - 30, W - 20, H - seviye + 22)
    CAPLAR.forEach((d, i) => {
      const x = 40 + i * ((W - 80) / 3)
      const w = 4 + d * 4
      const tepe = seviye - h[i] * olcek
      ctx.fillStyle = s.renk
      ctx.fillRect(x - w / 2, Math.min(tepe, seviye), w, Math.abs(seviye - tepe) + (H - seviye - 8))
      // menisküs
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x - w / 2, tepe)
      ctx.quadraticCurveTo(x, tepe + (s.aci < 90 ? w * 0.5 : -w * 0.5), x + w / 2, tepe)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(38,33,92,.8)'
      ctx.strokeRect(x - w / 2, 8, w, H - 16)
      yazi(ctx, `${d} mm`, x, 4 + 0, { boyut: 9 })
      yazi(ctx, `${h[i] > 0 ? '+' : ''}${sayi(h[i], 0)} mm`, x + w / 2 + 18, tepe, { boyut: 9, kalin: true, renk: '#993c1d' })
    })
  })

  return (
    <div className="sim">
      <Gorev>Farklı çaplı borulardaki sıvı seviyelerini karşılaştır. Boru inceldikçe ne oluyor? Su ile cıvanın menisküsleri neden farklı? Suya sabun ekleyince yükselme nasıl değişiyor?</Gorev>
      <Secenekler secenekler={(Object.keys(SIVI) as Sivi[]).map(k => ({ id: k, ad: SIVI[k].ad }))} secili={sv} onSec={setSv} etiket="Sıvı" />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Kılcal borularda sıvı seviyeleri" />
      <div className="sim-degerler">
        <Deger ad="Yüzey gerilimi" deger={`${sayi(s.gamma * 1000, 1)} mN/m`} />
        <Deger ad="Baskın kuvvet" deger={s.aci < 90 ? 'Adezyon > kohezyon' : 'Kohezyon > adezyon'} vurgu />
        <Deger ad="Menisküs" deger={s.aci < 90 ? 'İçbükey (çukur)' : 'Dışbükey (tümsek)'} />
      </div>
      <Not>Yükselme h = 2γcosθ/(ρgr) ile hesaplanmıştır (20 °C, temiz cam). Görsel ölçek 4 mm'lik boruda bile seviye farkını gösterecek şekilde seçilmiştir.</Not>
    </div>
  )
}
