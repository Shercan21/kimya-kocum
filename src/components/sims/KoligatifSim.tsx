import { useState } from 'react'
import { beher, daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// Koligatif özellikler: kaynama noktası yükselmesi ve donma noktası alçalması.
// ΔT = K · m · i  (su için Kk = 0,52, Kd = 1,86 °C·kg/mol)

const CEZUNENLER = [
  { id: 'seker', ad: 'Şeker (i = 1)', i: 1 },
  { id: 'NaCl', ad: 'NaCl (i = 2)', i: 2 },
  { id: 'CaCl2', ad: 'CaCl₂ (i = 3)', i: 3 },
]

export default function KoligatifSim() {
  const [cid, setCid] = useState('NaCl')
  const [m, setM] = useState(1)
  const [mod, setMod] = useState<'kaynama' | 'donma'>('kaynama')
  const c = CEZUNENLER.find(x => x.id === cid)!
  const dKaynama = 0.52 * m * c.i
  const dDonma = 1.86 * m * c.i

  const canvas = useAnimasyon((ctx, W, H) => {
    const t = performance.now() / 1000
    const ciz = (x: number, cozelti: boolean) => {
      const bw = Math.min(130, W / 2 - 30)
      const by = 30
      const bh = H - 44
      beher(ctx, x, by, bw, bh, 0.7, mod === 'donma' ? 'rgba(180,220,250,.35)' : 'rgba(120,180,240,.22)')
      // su molekülleri ve çözünen tanecikler
      for (let i = 0; i < 26; i++) daire(ctx, x + 10 + ((i * 41) % (bw - 20)), by + bh * 0.35 + ((i * 23) % (bh * 0.6)), 3, 'rgba(55,138,221,.7)')
      if (cozelti) for (let i = 0; i < Math.round(m * c.i * 6); i++) daire(ctx, x + 12 + ((i * 59) % (bw - 24)) + Math.sin(t + i) * 2, by + bh * 0.33 + ((i * 37) % (bh * 0.6)), 3.5, '#e8593c')
      if (mod === 'kaynama') {
        // buhar kabarcıkları: çözeltide yüzeyden kaçan su daha az
        const n = cozelti ? Math.max(2, 10 - Math.round(m * c.i * 1.5)) : 10
        for (let i = 0; i < n; i++) daire(ctx, x + 14 + ((i * 29) % (bw - 28)), by + bh * 0.3 - ((t * 25 + i * 13) % 30), 2.5, 'rgba(180,180,180,.8)')
      } else {
        for (let i = 0; i < 6; i++) {
          ctx.fillStyle = 'rgba(255,255,255,.85)'
          ctx.fillRect(x + 12 + i * 18, by + bh * 0.3 + 4, 12, 8)
        }
      }
      const T = mod === 'kaynama' ? 100 + (cozelti ? dKaynama : 0) : 0 - (cozelti ? dDonma : 0)
      yazi(ctx, `${sayi(T, 2)} °C`, x + bw / 2, 14, { boyut: 13, kalin: true })
      yazi(ctx, cozelti ? 'Çözelti' : 'Saf su', x + bw / 2, H - 6, { boyut: 11 })
    }
    ciz(16, false)
    ciz(W / 2 + 12, true)
  })

  return (
    <div className="sim">
      <Gorev>Saf su ile çözeltinin kaynama ve donma noktalarını karşılaştır. Çözünen tanecik sayısı (i) iki katına çıkınca sıcaklık farkı ne oluyor? Yollara neden tuz serpilir?</Gorev>
      <Secenekler secenekler={[{ id: 'kaynama', ad: 'Kaynama noktası' }, { id: 'donma', ad: 'Donma noktası' }]} secili={mod} onSec={setMod} />
      <Secenekler secenekler={CEZUNENLER.map(x => ({ id: x.id, ad: x.ad }))} secili={cid} onSec={setCid} etiket="Çözünen" />
      <canvas ref={canvas} className="sim-canvas" aria-label="Saf su ve çözeltinin karşılaştırılması" />
      <div className="sim-degerler">
        <Deger ad="Çözünen tanecik (mol/kg)" deger={sayi(m * c.i, 2)} />
        <Deger ad="Kaynama noktası" deger={`${sayi(100 + dKaynama, 2)} °C`} vurgu={mod === 'kaynama'} />
        <Deger ad="Donma noktası" deger={`${sayi(-dDonma, 2)} °C`} vurgu={mod === 'donma'} />
      </div>
      <Kaydirici etiket={<>1 kg suda çözünen <b>{sayi(m, 2)} mol</b></>} deger={m} min={0} max={3} step={0.25} onChange={setM} />
      <Not>Koligatif özellikler çözünenin türüne değil, çözünen tanecik sayısına bağlıdır. Hesaplar ideal çözelti ve tam iyonlaşma kabulüyle yapılmıştır; gerçek değerler biraz farklı olabilir.</Not>
    </div>
  )
}
