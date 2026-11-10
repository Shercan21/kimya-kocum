import { useEffect, useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Not, Secenekler } from './ortak'

// Asit–baz titrasyonu: 25 mL 0,1 M asit, büretten 0,1 M NaOH eklenir.
// pH eğrisi canlı çizilir; indikatör rengi dönüm noktasında değişir.

const V0 = 25
const C0 = 0.1
const CB = 0.1
const KA = 1.8e-5
const KW = 1e-14

type Asit = 'HCl' | 'CH3COOH'
type Ind = 'fenolftalein' | 'metiloranj' | 'bromtimol'

function titrasyonPH(asit: Asit, vb: number): number {
  const nA = C0 * V0
  const nB = CB * vb
  const V = V0 + vb
  if (asit === 'HCl') {
    const fark = (nA - nB) / V
    const h = fark / 2 + Math.sqrt((fark * fark) / 4 + KW)
    return -Math.log10(h)
  }
  if (nB === 0) {
    const h = (-KA + Math.sqrt(KA * KA + 4 * KA * C0)) / 2
    return -Math.log10(h)
  }
  if (nB < nA) {
    return -Math.log10(KA) + Math.log10(nB / (nA - nB))
  }
  if (Math.abs(nB - nA) < 1e-9) {
    const oh = Math.sqrt((KW / KA) * (nA / V))
    return 14 + Math.log10(oh)
  }
  const fazla = (nB - nA) / V
  const kb = (KW / KA) * (nA / V)
  const oh = fazla / 2 + Math.sqrt((fazla * fazla) / 4 + kb)
  return 14 + Math.log10(oh)
}

function indRenk(ind: Ind, pH: number): string {
  if (ind === 'fenolftalein') {
    const f = Math.max(0, Math.min(1, (pH - 8.2) / 1.8))
    return `rgba(230, 60, 160, ${0.08 + 0.6 * f})`
  }
  if (ind === 'metiloranj') {
    const f = Math.max(0, Math.min(1, (pH - 3.1) / 1.3))
    return `rgba(${Math.round(225 + 15 * f)}, ${Math.round(60 + 150 * f)}, ${Math.round(50 * (1 - f))}, 0.65)`
  }
  const f = Math.max(0, Math.min(1, (pH - 6) / 1.6))
  return `rgba(${Math.round(230 * (1 - f) + 40 * f)}, ${Math.round(200 * (1 - f) + 110 * f)}, ${Math.round(40 * (1 - f) + 210 * f)}, 0.6)`
}

const IND_AD: Record<Ind, string> = { fenolftalein: 'Fenolftalein (8,2–10)', metiloranj: 'Metil oranj (3,1–4,4)', bromtimol: 'Bromtimol mavisi (6,0–7,6)' }

export default function TitrasyonSim() {
  const [asit, setAsit] = useState<Asit>('HCl')
  const [ind, setInd] = useState<Ind>('fenolftalein')
  const [vb, setVb] = useState(0)
  const [akiyor, setAkiyor] = useState(false)
  const pH = titrasyonPH(asit, vb)

  useEffect(() => {
    if (!akiyor) return
    const id = window.setInterval(() => setVb(v => {
      const adim = Math.abs(v - 25) < 2 ? 0.05 : 0.25
      const yeni = Math.round((v + adim) * 100) / 100
      if (yeni >= 50) { setAkiyor(false); return 50 }
      return yeni
    }), 60)
    return () => window.clearInterval(id)
  }, [akiyor])

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const cx = W / 2
    // büret
    const bTop = 8
    const bH = H * 0.52
    ctx.fillStyle = '#eef6ff'
    ctx.fillRect(cx - 7, bTop, 14, bH)
    const doluluk = 1 - vb / 50
    ctx.fillStyle = 'rgba(55, 138, 221, .35)'
    ctx.fillRect(cx - 7, bTop + bH * (1 - doluluk), 14, bH * doluluk)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 1.5
    ctx.strokeRect(cx - 7, bTop, 14, bH)
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath()
      ctx.moveTo(cx + 7, bTop + (bH * i) / 10)
      ctx.lineTo(cx + 13, bTop + (bH * i) / 10)
      ctx.stroke()
      if (i % 2 === 0) yazi(ctx, String(i * 5), cx + 24, bTop + (bH * i) / 10, { boyut: 9, renk: '#6b6a7a' })
    }
    ctx.fillStyle = '#26215c'
    ctx.fillRect(cx - 12, bTop + bH, 24, 5)
    ctx.beginPath()
    ctx.moveTo(cx - 2, bTop + bH + 5)
    ctx.lineTo(cx + 2, bTop + bH + 5)
    ctx.lineTo(cx + 1, bTop + bH + 20)
    ctx.lineTo(cx - 1, bTop + bH + 20)
    ctx.fill()
    yazi(ctx, 'NaOH 0,1 M', cx - 48, bTop + 20, { boyut: 10 })
    // damla
    if (akiyor) {
      const t = (performance.now() / 300) % 1
      daire(ctx, cx, bTop + bH + 22 + t * 30, 2.5, 'rgba(55,138,221,.8)')
    }
    void dt
    // erlen
    const ey = H - 8
    const ew = 110
    const eh = H * 0.36
    ctx.beginPath()
    ctx.moveTo(cx - 9, ey - eh)
    ctx.lineTo(cx - 9, ey - eh * 0.62)
    ctx.lineTo(cx - ew / 2, ey)
    ctx.lineTo(cx + ew / 2, ey)
    ctx.lineTo(cx + 9, ey - eh * 0.62)
    ctx.lineTo(cx + 9, ey - eh)
    ctx.closePath()
    ctx.save()
    ctx.clip()
    ctx.fillStyle = indRenk(ind, pH)
    const sivi = eh * (0.42 + (vb / 50) * 0.2)
    ctx.fillRect(cx - ew / 2, ey - sivi, ew, sivi)
    ctx.restore()
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.stroke()
    yazi(ctx, `25 mL ${asit === 'HCl' ? 'HCl' : 'CH₃COOH'} 0,1 M`, cx + 92, ey - 20, { boyut: 10 })
  })

  const egri: [number, number][] = []
  for (let v = 0; v <= vb + 1e-9; v += 0.1) egri.push([v, titrasyonPH(asit, Math.min(v, vb))])
  const esdeger = asit === 'HCl' ? 7 : titrasyonPH('CH3COOH', 25)

  function ekle(m: number) {
    setVb(v => Math.min(50, Math.round((v + m) * 100) / 100))
  }

  return (
    <div className="sim">
      <Gorev>Büretten NaOH ekleyerek titrasyon eğrisini çiz. Eşdeğerlik noktası kaç mL'de ve pH kaç? Hangi indikatör bu titrasyon için uygun?</Gorev>
      <Secenekler secenekler={[{ id: 'HCl', ad: 'HCl (kuvvetli)' }, { id: 'CH3COOH', ad: 'CH₃COOH (zayıf)' }]} secili={asit} onSec={a => { setAsit(a); setVb(0); setAkiyor(false) }} etiket="Asit" />
      <Secenekler secenekler={(Object.keys(IND_AD) as Ind[]).map(i => ({ id: i, ad: IND_AD[i] }))} secili={ind} onSec={setInd} etiket="İndikatör" />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Büret ve erlen animasyonu" />
      <div className="sim-degerler">
        <Deger ad="Eklenen NaOH" deger={`${sayi(vb, 2)} mL`} />
        <Deger ad="pH" deger={sayi(pH, 2)} vurgu />
        <Deger ad="Durum" deger={vb < 24.95 ? 'Asit fazla' : vb <= 25.05 ? 'Eşdeğerlik' : 'Baz fazla'} />
      </div>
      <div className="row-actions start">
        <button type="button" className="btn-secondary" onClick={() => ekle(0.1)}>+1 damla (0,1 mL)</button>
        <button type="button" className="btn-secondary" onClick={() => ekle(1)}>+1 mL</button>
        <button type="button" className="btn-secondary" onClick={() => ekle(5)}>+5 mL</button>
        <button type="button" className="primary-button" onClick={() => setAkiyor(a => !a)}>{akiyor ? 'Musluğu kapat' : 'Musluğu aç'}</button>
        <button type="button" className="btn-secondary" onClick={() => { setVb(0); setAkiyor(false) }}>Baştan</button>
      </div>
      <Grafik seriler={[{ ad: 'pH', renk: '#534ab7', noktalar: egri }]} xEtiket="Eklenen NaOH (mL)" yEtiket="pH" xMax={50} yMax={14} dikeyCizgi={{ x: 25, etiket: `Eşdeğerlik (pH ≈ ${sayi(esdeger, 1)})` }} />
      <Not>Hesaplar 25 °C içindir; zayıf asitte Ka = 1,8·10⁻⁵ alınmıştır. Eşdeğerlik noktasına yaklaşırken damla damla eklemek doğru sonuç verir.</Not>
    </div>
  )
}
