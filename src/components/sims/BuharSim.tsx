import { useRef, useState } from 'react'
import { daire, rastgele, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Kaydirici, Not, Secenekler } from './ortak'

// Buharlaşma, denge buhar basıncı ve kaynama. Clausius–Clapeyron ile buhar basıncı:
// ln(P / 101,3) = −ΔH/R · (1/T − 1/Tk)

const SIVILAR = [
  { id: 'eter', ad: 'Dietil eter', Tk: 34.6, dH: 26.5, etkilesim: 'London ve zayıf dipol–dipol', renk: '#9fe1cb' },
  { id: 'aseton', ad: 'Aseton', Tk: 56, dH: 29.1, etkilesim: 'Dipol–dipol, London', renk: '#cecbf6' },
  { id: 'etanol', ad: 'Etanol', Tk: 78.4, dH: 38.6, etkilesim: 'Hidrojen bağı, London', renk: '#fac775' },
  { id: 'su', ad: 'Su', Tk: 100, dH: 40.7, etkilesim: 'Hidrojen bağı (çok sayıda)', renk: '#85b7eb' },
]
const YERLER = [
  { ad: 'Deniz kenarı (1 atm)', P: 101.3 },
  { ad: 'Ankara (≈ 900 m)', P: 91 },
  { ad: 'Erzurum (≈ 1900 m)', P: 81 },
  { ad: 'Everest zirvesi', P: 34 },
  { ad: 'Düdüklü tencere', P: 200 },
]

function buharBasinci(s: (typeof SIVILAR)[number], T: number) {
  return 101.3 * Math.exp((-s.dH * 1000 / 8.314) * (1 / (T + 273.15) - 1 / (s.Tk + 273.15)))
}
function kaynamaNoktasi(s: (typeof SIVILAR)[number], P: number) {
  return 1 / (1 / (s.Tk + 273.15) - (8.314 / (s.dH * 1000)) * Math.log(P / 101.3)) - 273.15
}

export default function BuharSim() {
  const [sid, setSid] = useState('su')
  const [T, setT] = useState(25)
  const [yer, setYer] = useState(0)
  const [kapali, setKapali] = useState(true)
  const s = SIVILAR.find(x => x.id === sid)!
  const Pb = buharBasinci(s, T)
  const Pdis = YERLER[yer].P
  const kaynar = Pb >= Pdis
  const Tk = kaynamaNoktasi(s, Pdis)
  const sim = useRef({ buhar: [] as { x: number; y: number; vx: number; vy: number }[] })

  const canvas = useAnimasyon((ctx, W, H, dt, t) => {
    const kx = 30
    const kw = Math.min(180, W * 0.42)
    const ky = 16
    const kh = H - 32
    const sivi = kh * 0.4
    const yuzey = ky + kh - sivi
    ctx.fillStyle = s.renk + '88'
    ctx.fillRect(kx, yuzey, kw, sivi)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2.5
    ctx.strokeRect(kx, ky, kw, kh)
    if (kapali) {
      ctx.fillStyle = '#26215c'
      ctx.fillRect(kx - 4, ky - 4, kw + 8, 6)
    } else {
      ctx.clearRect(kx + 2, ky - 4, kw - 4, 8)
    }
    // buhar tanecikleri: dengede sayısı buhar basıncıyla orantılı
    const b = sim.current.buhar
    const hedef = Math.min(60, Math.round(Pb / 3))
    const oran = kaynar ? 1 : 0.06 + Math.min(0.5, Pb / 200)
    if (rastgele() < oran * dt && (!kapali || b.length < hedef + 2)) b.push({ x: kx + 10 + rastgele() * (kw - 20), y: yuzey - 2, vx: (rastgele() - 0.5) * 1.5, vy: -0.8 - rastgele() })
    for (let i = b.length - 1; i >= 0; i--) {
      const p = b[i]
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.x < kx + 4 || p.x > kx + kw - 4) p.vx *= -1
      if (p.y < ky + 6) {
        if (kapali) p.vy = Math.abs(p.vy)
        else { b.splice(i, 1); continue }
      }
      if (p.y > yuzey - 1) {
        // yoğuşma
        if (kapali && b.length > hedef) { b.splice(i, 1); continue }
        p.vy = -Math.abs(p.vy)
      }
      daire(ctx, p.x, p.y, 3, s.renk)
    }
    // kaynama kabarcıkları
    if (kaynar) {
      for (let i = 0; i < 12; i++) {
        const yol = (t * 40 + i * 17) % sivi
        daire(ctx, kx + 15 + ((i * 41) % (kw - 30)), ky + kh - 4 - yol, 3 + (i % 3), 'rgba(255,255,255,.85)')
      }
    }
    // manometre
    const mx = kx + kw + 14
    yazi(ctx, kapali ? 'Kapalı kap' : 'Açık kap', mx, ky + 14, { boyut: 10, hiza: 'left' })
    yazi(ctx, `P(buhar) ${sayi(Pb, 1)} kPa`, mx, ky + 34, { boyut: 10, kalin: true, hiza: 'left' })
    yazi(ctx, `P(dış) ${sayi(Pdis, 1)} kPa`, mx, ky + 52, { boyut: 10, hiza: 'left' })
    yazi(ctx, kaynar ? 'KAYNIYOR' : 'Kaynamıyor', mx, ky + 76, { boyut: 12, kalin: true, hiza: 'left', renk: kaynar ? '#993c1d' : '#6b6a7a' })
  })

  const egriler = SIVILAR.map(x => ({ ad: x.ad, renk: x.renk === '#85b7eb' ? '#185fa5' : x.renk === '#fac775' ? '#ba7517' : x.renk === '#cecbf6' ? '#534ab7' : '#0f6e56', noktalar: Array.from({ length: 21 }, (_, i) => [i * 6, buharBasinci(x, i * 6)] as [number, number]) }))

  return (
    <div className="sim">
      <Gorev>Sıvıları aynı sıcaklıkta karşılaştır: hangisinin buhar basıncı en yüksek, neden? Sıcaklığı artır ve buhar basıncı dış basınca eşit olunca ne olduğunu gözle. Rakım değişince kaynama noktası nasıl değişiyor?</Gorev>
      <Secenekler secenekler={SIVILAR.map(x => ({ id: x.id, ad: x.ad }))} secili={sid} onSec={setSid} etiket="Sıvı" />
      <canvas ref={canvas} className="sim-canvas" aria-label="Kaptaki sıvı ve buharı" />
      <div className="sim-degerler">
        <Deger ad="Buhar basıncı" deger={`${sayi(Pb, 1)} kPa`} vurgu />
        <Deger ad="Bu dış basınçta kaynama noktası" deger={`${sayi(Tk, 1)} °C`} />
        <Deger ad="Tanecikler arası etkileşim" deger={s.etkilesim} />
      </div>
      <Kaydirici etiket={<>Sıcaklık <b>{T} °C</b></>} deger={T} min={0} max={120} step={1} onChange={setT} />
      <label className="sim-secim">
        <select value={yer} onChange={e => setYer(Number(e.target.value))}>
          {YERLER.map((y, i) => <option key={y.ad} value={i}>{y.ad} · {String(y.P).replace('.', ',')} kPa</option>)}
        </select>
      </label>
      <label className="sim-onay"><input type="checkbox" checked={kapali} onChange={e => setKapali(e.target.checked)} /> Kabın ağzı kapalı (denge buhar basıncı)</label>
      <Grafik seriler={egriler} xEtiket="Sıcaklık (°C)" yEtiket="Buhar basıncı (kPa)" xMax={120} yMax={210} yatayCizgi={{ y: Pdis, etiket: 'dış basınç' }} dikeyCizgi={{ x: T, etiket: `${T} °C` }} />
      <Not>Buhar basıncı değerleri Clausius–Clapeyron bağıntısıyla yaklaşık hesaplanmıştır. Tanecikler arası etkileşim güçlendikçe buhar basıncı düşer, kaynama noktası yükselir.</Not>
    </div>
  )
}
