import { useEffect, useState } from 'react'
import { beher, daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Kaydirici, Not, Secenekler } from './ortak'

// Kalorimetre: tuzların suda çözünmesindeki ısı değişimi ve yakıtların yanma ısısı.

type Mod = 'cozunme' | 'yakit'
const TUZLAR = [
  { ad: 'NH₄NO₃', M: 80, dH: 25.7 },
  { ad: 'KNO₃', M: 101, dH: 34.9 },
  { ad: 'NaOH', M: 40, dH: -44.5 },
  { ad: 'CaCl₂', M: 111, dH: -81.3 },
]
const YAKITLAR = [
  { ad: 'Etanol', isi: 29.7 },
  { ad: 'Metanol', isi: 22.7 },
  { ad: 'Hekzan', isi: 48.3 },
  { ad: 'Parafin mumu', isi: 46 },
]
const C_SU = 4.18

export default function KalorimetreSim({ modlar }: { modlar?: string[] }) {
  const mevcut = (modlar?.length ? modlar : ['cozunme', 'yakit']) as Mod[]
  const [mod, setMod] = useState<Mod>(mevcut[0])
  const [secim, setSecim] = useState(0)
  const [kutle, setKutle] = useState(5)
  const [su, setSu] = useState(50)
  const [t, setT] = useState(-1) // deney zamanı (s); -1 başlamadı
  const T0 = 22

  let q: number // ortama verilen ısı (kJ); + ise su ısınır
  if (mod === 'cozunme') {
    const tz = TUZLAR[secim]
    q = -(kutle / tz.M) * tz.dH
  } else {
    q = kutle * YAKITLAR[secim].isi * 0.45 // basit düzenekte ısının ~%45'i suya geçer
  }
  const kap = mod === 'cozunme' ? su + kutle : su
  const dT = (q * 1000) / (kap * C_SU)
  const sure = 30
  const sicaklik = (tt: number) => (tt < 0 ? T0 : T0 + dT * (1 - Math.exp(-tt / (sure / 4))))
  const anlik = sicaklik(t)

  useEffect(() => {
    if (t < 0 || t >= sure) return
    const id = window.setTimeout(() => setT(x => Math.min(sure, x + 0.5)), 50)
    return () => window.clearTimeout(id)
  }, [t])

  const canvas = useAnimasyon((ctx, W, H) => {
    const bx = W / 2 - 70
    const bw = 140
    const by = mod === 'yakit' ? 10 : 30
    const bh = mod === 'yakit' ? H * 0.55 : H - 42
    // strafor kalorimetre / beher
    if (mod === 'cozunme') {
      ctx.fillStyle = '#f4f3ee'
      ctx.fillRect(bx - 10, by - 6, bw + 20, bh + 12)
    }
    const sicakOran = Math.max(-1, Math.min(1, (anlik - T0) / 25))
    const renk = sicakOran >= 0 ? `rgba(232, 89, 60, ${0.12 + 0.3 * sicakOran})` : `rgba(55, 138, 221, ${0.12 + 0.35 * -sicakOran})`
    beher(ctx, bx, by, bw, bh, 0.7, renk)
    // termometre
    const tx = bx + bw - 26
    ctx.fillStyle = '#fff'
    ctx.fillRect(tx - 4, by - 18, 8, bh * 0.9)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 1.5
    ctx.strokeRect(tx - 4, by - 18, 8, bh * 0.9)
    const sev = Math.max(0.05, Math.min(1, (anlik + 10) / 80))
    ctx.fillStyle = '#e24b4a'
    ctx.fillRect(tx - 2, by - 18 + bh * 0.9 * (1 - sev), 4, bh * 0.9 * sev)
    daire(ctx, tx, by - 18 + bh * 0.9 + 5, 6, '#e24b4a')
    yazi(ctx, `${sayi(anlik, 1)} °C`, tx - 40, by + 10, { boyut: 14, kalin: true })
    if (mod === 'cozunme' && t >= 0) {
      for (let i = 0; i < 12 * Math.max(0, 1 - t / 10); i++) daire(ctx, bx + 20 + ((i * 37) % (bw - 50)), by + bh - 8 - ((i * 13 + t * 20) % 30), 3, '#ffffff')
    }
    if (mod === 'yakit') {
      // yakıt kabı ve alev
      const fy = by + bh + 50
      ctx.fillStyle = '#b4b2a9'
      ctx.fillRect(W / 2 - 22, fy, 44, 26)
      if (t >= 0 && t < sure) {
        const s = 1 + Math.sin(performance.now() / 90) * 0.12
        ctx.fillStyle = 'rgba(255, 170, 40, .9)'
        ctx.beginPath()
        ctx.ellipse(W / 2, fy - 16, 9 * s, 20 * s, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(55, 138, 221, .8)'
        ctx.beginPath()
        ctx.ellipse(W / 2, fy - 6, 5, 9, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      yazi(ctx, YAKITLAR[secim].ad, W / 2, fy + 13, { boyut: 10 })
    }
  })

  const egri: [number, number][] = []
  for (let x = 0; x <= Math.max(0, t); x += 0.5) egri.push([x, sicaklik(x)])

  return (
    <div className="sim">
      {mevcut.length > 1 && (
        <Secenekler secenekler={mevcut.map(m => ({ id: m, ad: m === 'cozunme' ? 'Çözünme ısısı' : 'Yakıtların yanma ısısı' }))} secili={mod} onSec={m => { setMod(m); setSecim(0); setT(-1) }} />
      )}
      {mod === 'cozunme' ? (
        <Gorev>Farklı tuzları suda çözüp sıcaklık değişimini ölç. Hangileri endotermik, hangileri ekzotermik? Suyun aldığı ya da verdiği ısıyı q = m·c·ΔT ile hesapla.</Gorev>
      ) : (
        <Gorev>Aynı kütlede farklı yakıtları yakıp suyun sıcaklık artışını karşılaştır. Gram başına en çok enerji veren yakıt hangisi?</Gorev>
      )}
      <Secenekler
        secenekler={(mod === 'cozunme' ? TUZLAR : YAKITLAR).map((x, i) => ({ id: String(i), ad: x.ad }))}
        secili={String(secim)}
        onSec={v => { setSecim(Number(v)); setT(-1) }}
        etiket="Madde"
      />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Kalorimetre animasyonu" />
      <div className="sim-degerler">
        <Deger ad="İlk sıcaklık" deger={`${T0} °C`} />
        <Deger ad="Son sıcaklık" deger={t >= sure ? `${sayi(sicaklik(sure), 1)} °C` : '…'} />
        <Deger ad="ΔT" deger={t >= sure ? `${dT > 0 ? '+' : ''}${sayi(dT, 1)} °C` : '…'} vurgu={t >= sure} />
        <Deger ad="Olay" deger={t >= sure ? (dT > 0 ? 'Ekzotermik' : 'Endotermik') : '…'} />
      </div>
      <Kaydirici etiket={<>{mod === 'cozunme' ? 'Tuz' : 'Yakıt'} kütlesi <b>{kutle} g</b></>} deger={kutle} min={1} max={10} step={1} onChange={v => { setKutle(v); setT(-1) }} />
      <Kaydirici etiket={<>Su kütlesi <b>{su} g</b></>} deger={su} min={50} max={200} step={10} onChange={v => { setSu(v); setT(-1) }} />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setT(0)}>{mod === 'cozunme' ? 'Tuzu ekle ve karıştır' : 'Yakıtı tutuştur'}</button>
      </div>
      {t >= 0 && <Grafik seriler={[{ ad: 'Sıcaklık', renk: '#e8593c', noktalar: egri }]} xEtiket="Zaman (s)" yEtiket="Sıcaklık (°C)" xMax={sure} yMin={Math.min(T0, T0 + dT) - 3} yMax={Math.max(T0, T0 + dT) + 3} />}
      <Not>Çözünme entalpileri: NH₄NO₃ +25,7; KNO₃ +34,9; NaOH −44,5; CaCl₂ −81,3 kJ/mol. Yakıt deneyinde ısının yaklaşık %45'inin suya geçtiği varsayılmıştır (gerisi çevreye kaçar).</Not>
    </div>
  )
}
