import { useState } from 'react'
import { beher, daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Kaydirici, Not, Secenekler } from './ortak'

// Çözünürlük: 100 g suya tuz ekle, sıcaklığı değiştir; doymamış / doymuş / aşırı doymuş.

const SICAKLIK = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const TUZLAR = [
  { id: 'KNO3', ad: 'KNO₃', veri: [13.3, 20.9, 31.6, 45.8, 63.9, 85.5, 110, 138, 169, 202, 246], renk: '#7f77dd' },
  { id: 'NaCl', ad: 'NaCl', veri: [35.7, 35.8, 36, 36.3, 36.6, 37, 37.3, 37.8, 38.4, 39, 39.8], renk: '#1d9e75' },
  { id: 'Li2SO4', ad: 'Li₂SO₄', veri: [36.1, 35.5, 34.8, 34.2, 33.7, 33.3, 32.6, 31.9, 31.4, 30.9, 30.7], renk: '#e8593c' },
]

function cozunurluk(veri: number[], T: number) {
  const i = Math.min(9, Math.floor(T / 10))
  return veri[i] + ((veri[i + 1] - veri[i]) * (T - i * 10)) / 10
}

export default function CozunurlukSim() {
  const [tuzId, setTuzId] = useState('KNO3')
  const [eklenen, setEklenen] = useState(20)
  const [T, setT] = useState(20)
  const [asiri, setAsiri] = useState(false)
  const tuz = TUZLAR.find(t => t.id === tuzId)!
  const S = cozunurluk(tuz.veri, T)
  const cozunen = asiri ? eklenen : Math.min(eklenen, S)
  const dipte = eklenen - cozunen
  const durum = eklenen < S - 0.05 ? 'Doymamış' : asiri && eklenen > S + 0.05 ? 'Aşırı doymuş' : 'Doymuş'

  const canvas = useAnimasyon((ctx, W, H, _dt, t) => {
    const bx = W / 2 - 75
    const bw = 150
    const by = 20
    const bh = H - 34
    beher(ctx, bx, by, bw, bh, 0.75, `rgba(120,180,240,${0.15 + Math.min(0.25, cozunen / 400)})`)
    // çözünmüş tanecikler
    const n = Math.min(80, Math.round(cozunen / 3))
    for (let i = 0; i < n; i++) {
      const x = bx + 10 + ((i * 47) % (bw - 20)) + Math.sin(t + i) * 3
      const y = by + bh * 0.3 + ((i * 29) % (bh * 0.6)) + Math.cos(t * 1.3 + i) * 3
      daire(ctx, x, y, 2.4, tuz.renk)
    }
    if (dipte > 0) {
      const yuk = Math.min(bh * 0.3, 4 + dipte * 0.6)
      for (let i = 0; i < Math.min(140, dipte * 3); i++) {
        const x = bx + 8 + ((i * 31) % (bw - 16))
        const y = by + bh - 4 - ((i * 17) % yuk)
        ctx.fillStyle = '#f4f3ee'
        ctx.fillRect(x, y, 4, 4)
        ctx.strokeStyle = '#b4b2a9'
        ctx.strokeRect(x, y, 4, 4)
      }
    }
    yazi(ctx, '100 g su', bx + bw / 2, by + 12, { boyut: 10, renk: '#185fa5' })
    yazi(ctx, `${T} °C`, bx + bw + 30, by + 20, { boyut: 13, kalin: true })
  })

  return (
    <div className="sim">
      <Gorev>Kaşık kaşık tuz ekle; dipte katı kalmaya başladığı anda kaç gram eklemiştin? Sonra sıcaklığı değiştir: dipteki katı çözünüyor mu, yeniden kristalleniyor mu?</Gorev>
      <Secenekler secenekler={TUZLAR.map(t => ({ id: t.id, ad: t.ad }))} secili={tuzId} onSec={v => { setTuzId(v); setAsiri(false) }} etiket="Tuz" />
      <canvas ref={canvas} className="sim-canvas" aria-label="100 g suda tuz çözünmesi" />
      <div className="sim-degerler">
        <Deger ad={`Çözünürlük (${T} °C)`} deger={`${sayi(S, 1)} g/100 g su`} />
        <Deger ad="Çözünen" deger={`${sayi(cozunen, 1)} g`} />
        <Deger ad="Dipte kalan" deger={`${sayi(dipte, 1)} g`} />
        <Deger ad="Çözelti" deger={durum} vurgu />
      </div>
      <Kaydirici etiket={<>Eklenen tuz <b>{eklenen} g</b></>} deger={eklenen} min={0} max={250} step={5} onChange={v => { setEklenen(v); setAsiri(false) }} />
      <Kaydirici etiket={<>Sıcaklık <b>{T} °C</b></>} deger={T} min={0} max={100} step={5} onChange={setT} />
      <label className="sim-onay">
        <input type="checkbox" checked={asiri} disabled={eklenen <= S && !asiri} onChange={e => setAsiri(e.target.checked)} />
        Sıcakta tamamen çözülmüş çözeltiyi sarsmadan yavaşça soğut (aşırı doymuş çözelti dene)
      </label>
      {asiri && <button type="button" className="btn-secondary" onClick={() => setAsiri(false)}>Küçük bir kristal at (kristallenme)</button>}
      <Grafik
        seriler={TUZLAR.map(t => ({ ad: t.ad, renk: t.renk, noktalar: SICAKLIK.map((s, i) => [s, t.veri[i]] as [number, number]) }))}
        xEtiket="Sıcaklık (°C)"
        yEtiket="g / 100 g su"
        xMax={100}
        yMax={250}
        dikeyCizgi={{ x: T, etiket: `${T} °C` }}
        yatayCizgi={{ y: eklenen, etiket: `eklenen ${eklenen} g` }}
      />
      <Not>Çözünürlük değerleri yaklaşıktır. Eklenen miktar eğrinin altındaysa çözelti doymamış, eğrinin üstündeyse fazlası dibe çöker (doymuş). Aşırı doymuş çözeltiler kararsızdır.</Not>
    </div>
  )
}
