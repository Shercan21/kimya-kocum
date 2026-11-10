import { useState } from 'react'
import { beher, daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// pH laboratuvarı: kuvvetli/zayıf asit ve bazlar, derişim, indikatör renkleri,
// suyun iyonlaşmasının sıcaklıkla değişimi ve evdeki ürünlerin pH değerleri.

type Mod = 'cozelti' | 'su' | 'urun'
type Madde = { id: string; ad: string; tur: 'asit' | 'baz'; K: number | null; iyon: [string, string] }
const MADDELER: Madde[] = [
  { id: 'HCl', ad: 'HCl (kuvvetli asit)', tur: 'asit', K: null, iyon: ['H₃O⁺', 'Cl⁻'] },
  { id: 'CH3COOH', ad: 'CH₃COOH (zayıf asit, Ka = 1,8·10⁻⁵)', tur: 'asit', K: 1.8e-5, iyon: ['H₃O⁺', 'CH₃COO⁻'] },
  { id: 'NaOH', ad: 'NaOH (kuvvetli baz)', tur: 'baz', K: null, iyon: ['Na⁺', 'OH⁻'] },
  { id: 'NH3', ad: 'NH₃ (zayıf baz, Kb = 1,8·10⁻⁵)', tur: 'baz', K: 1.8e-5, iyon: ['NH₄⁺', 'OH⁻'] },
]
// Yaklaşık pH değerleri
const URUNLER: [string, number][] = [
  ['Limon suyu', 2.3], ['Kola', 2.5], ['Sirke', 2.9], ['Domates suyu', 4.3], ['Kahve', 5.0], ['Süt', 6.6],
  ['Saf su (25 °C)', 7.0], ['Kan', 7.4], ['Deniz suyu', 8.1], ['Karbonat çözeltisi', 8.3], ['Diş macunu', 9.0],
  ['Antiasit tablet', 9.8], ['Sabunlu su', 10.0], ['Amonyaklı temizleyici', 11.5], ['Çamaşır suyu', 12.5],
]
const KW: [number, number][] = [[0, 1.14e-15], [10, 2.93e-15], [25, 1.01e-14], [40, 2.92e-14], [60, 9.6e-14], [80, 2.4e-13]]

function kw(t: number) {
  for (let i = 0; i < KW.length - 1; i++) {
    const [t1, k1] = KW[i]
    const [t2, k2] = KW[i + 1]
    if (t <= t2) return Math.pow(10, Math.log10(k1) + ((t - t1) / (t2 - t1)) * (Math.log10(k2) - Math.log10(k1)))
  }
  return KW[KW.length - 1][1]
}

// Evrensel indikatör rengi
function evrensel(pH: number) {
  const renkler = ['#d7191c', '#e8432a', '#f46d43', '#fb9a3b', '#fdc441', '#f4e04d', '#c7e26b', '#86cf6a', '#4cb86b', '#2e9e8f', '#2c7fb8', '#3b5fae', '#4b3f9e', '#5b2a8c', '#4a1f70']
  return renkler[Math.max(0, Math.min(14, Math.round(pH)))]
}
// Kırmızı lahana suyu rengi
function lahana(pH: number) {
  if (pH < 3) return '#d6204e'
  if (pH < 5) return '#e05298'
  if (pH < 7.5) return '#8e4aa8'
  if (pH < 9) return '#4a63c9'
  if (pH < 11) return '#2a9d8f'
  if (pH < 13) return '#5cbd4f'
  return '#e3d33b'
}

export default function PHSim({ modlar }: { modlar?: string[] }) {
  const mevcut = (modlar?.length ? modlar : ['cozelti', 'su', 'urun']) as Mod[]
  const [mod, setMod] = useState<Mod>(mevcut[0])
  const [maddeId, setMaddeId] = useState('HCl')
  const [logC, setLogC] = useState(-1)
  const [sicaklik, setSicaklik] = useState(25)
  const [urun, setUrun] = useState(0)
  const [indikator, setIndikator] = useState<'evrensel' | 'lahana'>('evrensel')
  const madde = MADDELER.find(m => m.id === maddeId)!
  const C = Math.pow(10, logC)

  let pH = 7
  let alfa = 1
  if (mod === 'cozelti') {
    const Kw = 1e-14
    let x: number // [H₃O⁺] ya da [OH⁻]
    if (madde.K === null) x = (C + Math.sqrt(C * C + 4 * Kw)) / 2
    else x = (-madde.K + Math.sqrt(madde.K * madde.K + 4 * madde.K * C)) / 2
    alfa = madde.K === null ? 1 : x / C
    pH = madde.tur === 'asit' ? -Math.log10(x) : 14 + Math.log10(x)
  } else if (mod === 'su') {
    pH = -Math.log10(Math.sqrt(kw(sicaklik)))
  } else pH = URUNLER[urun][1]
  const renk = indikator === 'evrensel' ? evrensel(pH) : lahana(pH)
  const H = Math.pow(10, -pH)
  const OH = (mod === 'su' ? kw(sicaklik) : 1e-14) / H

  const canvas = useAnimasyon((ctx, W, Hc) => {
    const bx = 16
    const bw = Math.min(150, W * 0.42)
    beher(ctx, bx, 20, bw, Hc - 34, 0.75, renk + 'cc')
    // pH metre
    const mx = bx + bw + 30
    ctx.fillStyle = '#26215c'
    ctx.fillRect(mx, 24, Math.min(150, W - mx - 10), 70)
    ctx.fillStyle = '#b8f2c9'
    ctx.fillRect(mx + 8, 32, Math.min(150, W - mx - 10) - 16, 40)
    yazi(ctx, `pH ${sayi(pH, 2)}`, mx + Math.min(150, W - mx - 10) / 2, 52, { boyut: 20, kalin: true, renk: '#13361f' })
    yazi(ctx, 'pH metre', mx + Math.min(150, W - mx - 10) / 2, 84, { boyut: 10, renk: '#fff' })
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(mx + 20, 94)
    ctx.quadraticCurveTo(mx, 120, bx + bw * 0.7, 80)
    ctx.stroke()
    // tanecik görünümü (asit/baz modunda)
    if (mod === 'cozelti') {
      const n = 12
      const iyonlu = Math.round(n * alfa)
      for (let i = 0; i < n; i++) {
        const x = mx + 14 + (i % 4) * 34
        const y = 120 + Math.floor(i / 4) * 26
        if (i < iyonlu) {
          daire(ctx, x - 6, y, 6, madde.tur === 'asit' ? '#e8593c' : '#7f77dd')
          daire(ctx, x + 8, y, 6, madde.tur === 'asit' ? '#7f77dd' : '#378add')
        } else {
          daire(ctx, x - 3, y, 7, '#b4b2a9')
          daire(ctx, x + 5, y, 7, '#888780')
        }
      }
      yazi(ctx, alfa >= 0.999 ? 'Tamamen iyonlaşmış' : `İyonlaşma ≈ %${sayi(alfa * 100, 1)}`, mx + 70, 120 + 3 * 26 + 6, { boyut: 11 })
    }
  })

  return (
    <div className="sim">
      {mevcut.length > 1 && (
        <Secenekler
          secenekler={mevcut.map(m => ({ id: m, ad: m === 'cozelti' ? 'Asit ve bazlar' : m === 'su' ? 'Saf su ve sıcaklık' : 'Evdeki ürünler' }))}
          secili={mod}
          onSec={setMod}
        />
      )}
      {mod === 'cozelti' && <Gorev>Aynı derişimdeki kuvvetli ve zayıf asitlerin pH değerlerini karşılaştır. Derişimi 10 kat azaltınca pH kaç birim değişiyor?</Gorev>}
      {mod === 'su' && <Gorev>Saf suyu ısıt. pH değeri neden 7'nin altına iniyor? Su asidik mi oldu? [H₃O⁺] ile [OH⁻] değerlerini karşılaştır.</Gorev>}
      {mod === 'urun' && <Gorev>Evdeki ürünleri tek tek test et ve asidik, nötr, bazik olarak sınıflandır. Kırmızı lahana suyu ile renkleri karşılaştır.</Gorev>}

      {mod === 'cozelti' && (
        <label className="sim-secim">
          <select value={maddeId} onChange={e => setMaddeId(e.target.value)}>
            {MADDELER.map(m => <option key={m.id} value={m.id}>{m.ad}</option>)}
          </select>
        </label>
      )}
      {mod === 'urun' && (
        <label className="sim-secim">
          <select value={urun} onChange={e => setUrun(Number(e.target.value))}>
            {URUNLER.map(([ad], i) => <option key={ad} value={i}>{ad}</option>)}
          </select>
        </label>
      )}
      <canvas ref={canvas} className="sim-canvas" aria-label="Beher, indikatör rengi ve pH metre" />
      <div className="sim-ph-skala" aria-hidden="true">
        {Array.from({ length: 15 }, (_, i) => <span key={i} style={{ background: indikator === 'evrensel' ? evrensel(i) : lahana(i) }}>{i}</span>)}
        <i style={{ left: `${(pH / 14) * 100}%` }} />
      </div>
      <div className="sim-degerler">
        <Deger ad="pH" deger={sayi(pH, 2)} vurgu />
        <Deger ad="pOH" deger={sayi(-Math.log10(OH), 2)} />
        <Deger ad="[H₃O⁺] (M)" deger={H.toExponential(1).replace('.', ',')} />
        <Deger ad="[OH⁻] (M)" deger={OH.toExponential(1).replace('.', ',')} />
        <Deger ad="Ortam" deger={Math.abs(H - OH) / H < 0.01 ? 'Nötr' : H > OH ? 'Asidik' : 'Bazik'} />
      </div>
      {mod === 'cozelti' && <Kaydirici etiket={<>Derişim <b>{C >= 0.01 ? sayi(C, 3) : C.toExponential(0).replace('.', ',')} M</b></>} deger={logC} min={-4} max={0} step={1} onChange={setLogC} />}
      {mod === 'su' && <Kaydirici etiket={<>Sıcaklık <b>{sicaklik} °C</b> · Kw = {kw(sicaklik).toExponential(2).replace('.', ',')}</>} deger={sicaklik} min={0} max={80} step={5} onChange={setSicaklik} />}
      <Secenekler secenekler={[{ id: 'evrensel', ad: 'Evrensel indikatör' }, { id: 'lahana', ad: 'Kırmızı lahana suyu' }]} secili={indikator} onSec={setIndikator} etiket="İndikatör" />
      <Not>Ürünlerin pH değerleri yaklaşıktır; markaya ve derişime göre değişir. Zayıf asit ve bazlarda pH, denge sabitiyle hesaplanmıştır (25 °C).</Not>
    </div>
  )
}
