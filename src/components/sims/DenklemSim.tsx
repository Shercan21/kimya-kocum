import { useState } from 'react'
import { daire, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// Tepkime denklemlerini denkleştirme (katsayı ayarlama, atom sayacı) ve
// sınırlayıcı bileşen (2H₂ + O₂ → 2H₂O) tanecik animasyonu.

type Bilesen = { formul: string; atomlar: Record<string, number> }
type Denklem = { ad: string; sol: Bilesen[]; sag: Bilesen[]; dogru: number[] }
const DENKLEMLER: Denklem[] = [
  { ad: 'H₂ + O₂ → H₂O', sol: [{ formul: 'H₂', atomlar: { H: 2 } }, { formul: 'O₂', atomlar: { O: 2 } }], sag: [{ formul: 'H₂O', atomlar: { H: 2, O: 1 } }], dogru: [2, 1, 2] },
  { ad: 'N₂ + H₂ → NH₃', sol: [{ formul: 'N₂', atomlar: { N: 2 } }, { formul: 'H₂', atomlar: { H: 2 } }], sag: [{ formul: 'NH₃', atomlar: { N: 1, H: 3 } }], dogru: [1, 3, 2] },
  { ad: 'Al + O₂ → Al₂O₃', sol: [{ formul: 'Al', atomlar: { Al: 1 } }, { formul: 'O₂', atomlar: { O: 2 } }], sag: [{ formul: 'Al₂O₃', atomlar: { Al: 2, O: 3 } }], dogru: [4, 3, 2] },
  { ad: 'CH₄ + O₂ → CO₂ + H₂O', sol: [{ formul: 'CH₄', atomlar: { C: 1, H: 4 } }, { formul: 'O₂', atomlar: { O: 2 } }], sag: [{ formul: 'CO₂', atomlar: { C: 1, O: 2 } }, { formul: 'H₂O', atomlar: { H: 2, O: 1 } }], dogru: [1, 2, 1, 2] },
  { ad: 'C₃H₈ + O₂ → CO₂ + H₂O', sol: [{ formul: 'C₃H₈', atomlar: { C: 3, H: 8 } }, { formul: 'O₂', atomlar: { O: 2 } }], sag: [{ formul: 'CO₂', atomlar: { C: 1, O: 2 } }, { formul: 'H₂O', atomlar: { H: 2, O: 1 } }], dogru: [1, 5, 3, 4] },
  { ad: 'Fe + O₂ → Fe₂O₃', sol: [{ formul: 'Fe', atomlar: { Fe: 1 } }, { formul: 'O₂', atomlar: { O: 2 } }], sag: [{ formul: 'Fe₂O₃', atomlar: { Fe: 2, O: 3 } }], dogru: [4, 3, 2] },
]
const RENK: Record<string, string> = { H: '#f1efe8', O: '#e24b4a', N: '#378add', C: '#3d3d3a', Al: '#b4b2a9', Fe: '#a0521e' }

function say(bilesenler: Bilesen[], kat: number[]) {
  const s: Record<string, number> = {}
  bilesenler.forEach((b, i) => Object.entries(b.atomlar).forEach(([a, n]) => (s[a] = (s[a] ?? 0) + n * kat[i])))
  return s
}

function Denklestir() {
  const [di, setDi] = useState(0)
  const d = DENKLEMLER[di]
  const [kat, setKat] = useState<number[]>(() => d.dogru.map(() => 1))
  const solKat = kat.slice(0, d.sol.length)
  const sagKat = kat.slice(d.sol.length)
  const sol = say(d.sol, solKat)
  const sag = say(d.sag, sagKat)
  const atomlar = Object.keys({ ...sol, ...sag })
  const denk = atomlar.every(a => sol[a] === sag[a])
  const ebob = (a: number, b: number): number => (b ? ebob(b, a % b) : a)
  const enKucuk = kat.reduce(ebob) === 1

  function degistir(i: number, f: number) {
    setKat(k => k.map((v, j) => (j === i ? Math.max(1, Math.min(9, v + f)) : v)))
  }
  const hepsi = [...d.sol, ...d.sag]

  const canvas = useAnimasyon((ctx, W, H) => {
    // her taraftaki atomları sütun grafiği olarak çiz
    const n = atomlar.length
    const gw = (W - 40) / Math.max(1, n)
    const maks = Math.max(1, ...atomlar.map(a => Math.max(sol[a] ?? 0, sag[a] ?? 0)))
    atomlar.forEach((a, i) => {
      const x = 20 + i * gw
      const h1 = ((sol[a] ?? 0) / maks) * (H - 50)
      const h2 = ((sag[a] ?? 0) / maks) * (H - 50)
      const esit = sol[a] === sag[a]
      ctx.fillStyle = '#7f77dd'
      ctx.fillRect(x + gw * 0.15, H - 24 - h1, gw * 0.3, h1)
      ctx.fillStyle = esit ? '#1d9e75' : '#e8593c'
      ctx.fillRect(x + gw * 0.5, H - 24 - h2, gw * 0.3, h2)
      yazi(ctx, String(sol[a] ?? 0), x + gw * 0.3, H - 32 - h1, { boyut: 11, kalin: true })
      yazi(ctx, String(sag[a] ?? 0), x + gw * 0.65, H - 32 - h2, { boyut: 11, kalin: true })
      daire(ctx, x + gw * 0.47, H - 10, 7, RENK[a] ?? '#ccc')
      yazi(ctx, a, x + gw * 0.47, H - 10, { boyut: 8, kalin: true })
    })
    yazi(ctx, '■ tepkenler   ■ ürünler', W / 2, 10, { boyut: 10, renk: '#6b6a7a' })
  })

  return (
    <>
      <Gorev>Katsayıları artırıp azaltarak her atomun sol ve sağ taraftaki sayısını eşitle. Formüllerdeki küçük rakamları değiştiremezsin; neden?</Gorev>
      <Secenekler secenekler={DENKLEMLER.map((x, i) => ({ id: String(i), ad: x.ad }))} secili={String(di)} onSec={v => { const i = Number(v); setDi(i); setKat(DENKLEMLER[i].dogru.map(() => 1)) }} etiket="Denklem" />
      <div className="sim-denklem" aria-live="polite">
        {hepsi.map((b, i) => (
          <span key={i} className="sim-terim">
            {i === d.sol.length && <span className="sim-ok">→</span>}
            {i > 0 && i !== d.sol.length && <span className="sim-arti">+</span>}
            <span className="sim-katsayi">
              <button type="button" aria-label={`${b.formul} katsayısını artır`} onClick={() => degistir(i, 1)}>▲</button>
              <b>{kat[i]}</b>
              <button type="button" aria-label={`${b.formul} katsayısını azalt`} onClick={() => degistir(i, -1)}>▼</button>
            </span>
            <span className="sim-formul">{b.formul}</span>
          </span>
        ))}
      </div>
      <canvas ref={canvas} className="sim-canvas kisa" aria-label="Sol ve sağ taraftaki atom sayıları" />
      <div className="sim-degerler">
        <Deger ad="Durum" deger={denk ? (enKucuk ? 'Denkleşti ✓' : 'Denk ama sadeleştir') : 'Denk değil'} vurgu={denk && enKucuk} />
        {atomlar.map(a => <Deger key={a} ad={a} deger={`${sol[a] ?? 0} / ${sag[a] ?? 0}`} />)}
      </div>
    </>
  )
}

type Tan = { x: number; y: number; tx: number; ty: number; tur: 'H2' | 'O2' | 'H2O' }

function Sinirlayici() {
  const [h2, setH2] = useState(6)
  const [o2, setO2] = useState(4)
  const [basladi, setBasladi] = useState(false)
  const urun = Math.min(h2, 2 * o2)
  const artanH = h2 - urun
  const artanO = o2 - urun / 2
  const sinirlayici = artanH === 0 && artanO === 0 ? 'Yok (tam oran)' : artanH === 0 ? 'H₂' : 'O₂'

  const canvas = useAnimasyon((ctx, W, H) => {
    const ciz = (x: number, y: number, tur: Tan['tur']) => {
      if (tur === 'H2') { daire(ctx, x - 4, y, 6, '#f1efe8'); daire(ctx, x + 4, y, 6, '#f1efe8'); ctx.strokeStyle = '#888'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x - 4, y, 6, 0, 7); ctx.arc(x + 4, y, 6, 0, 7); ctx.stroke() }
      if (tur === 'O2') { daire(ctx, x - 5, y, 8, '#e24b4a'); daire(ctx, x + 5, y, 8, '#e24b4a') }
      if (tur === 'H2O') { daire(ctx, x, y, 8, '#e24b4a'); daire(ctx, x - 8, y - 6, 5, '#f1efe8'); daire(ctx, x + 8, y - 6, 5, '#f1efe8') }
    }
    const yari = W / 2
    ctx.strokeStyle = '#d3d1c7'
    ctx.beginPath()
    ctx.moveTo(yari, 6)
    ctx.lineTo(yari, H - 6)
    ctx.stroke()
    yazi(ctx, 'Önce', yari / 2, 10, { boyut: 11, kalin: true })
    yazi(ctx, 'Sonra', yari + yari / 2, 10, { boyut: 11, kalin: true })
    for (let i = 0; i < h2; i++) ciz(20 + (i % 5) * 28, 34 + Math.floor(i / 5) * 24, 'H2')
    for (let i = 0; i < o2; i++) ciz(20 + (i % 5) * 28, H / 2 + 20 + Math.floor(i / 5) * 26, 'O2')
    if (basladi) {
      for (let i = 0; i < urun; i++) ciz(yari + 22 + (i % 5) * 28, 36 + Math.floor(i / 5) * 26, 'H2O')
      for (let i = 0; i < artanH; i++) ciz(yari + 20 + (i % 5) * 28, H / 2 + 20 + Math.floor(i / 5) * 24, 'H2')
      for (let i = 0; i < artanO; i++) ciz(yari + 20 + (i % 5) * 28, H / 2 + 20 + Math.floor(i / 5) * 26, 'O2')
    }
  })

  return (
    <>
      <Gorev>H₂ ve O₂ molekül sayılarını seç, tahmin et, sonra tepkimeyi başlat. Hangi madde tükendi (sınırlayıcı bileşen), hangisinden arttı? 2H₂ + O₂ → 2H₂O</Gorev>
      <canvas ref={canvas} className="sim-canvas" aria-label="Tepkimeden önce ve sonra moleküller" />
      <Kaydirici etiket={<>H₂ molekülü <b>{h2}</b></>} deger={h2} min={1} max={10} step={1} onChange={v => { setH2(v); setBasladi(false) }} />
      <Kaydirici etiket={<>O₂ molekülü <b>{o2}</b></>} deger={o2} min={1} max={10} step={1} onChange={v => { setO2(v); setBasladi(false) }} />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setBasladi(true)}>Tepkimeyi gerçekleştir</button>
      </div>
      {basladi && (
        <div className="sim-degerler">
          <Deger ad="Oluşan H₂O" deger={urun} vurgu />
          <Deger ad="Artan H₂" deger={artanH} />
          <Deger ad="Artan O₂" deger={artanO} />
          <Deger ad="Sınırlayıcı bileşen" deger={sinirlayici} />
        </div>
      )}
    </>
  )
}

export default function DenklemSim({ modlar }: { modlar?: string[] }) {
  const mevcut = modlar?.length ? modlar : ['denklestir', 'sinirlayici']
  const [mod, setMod] = useState(mevcut[0])
  return (
    <div className="sim">
      {mevcut.length > 1 && <Secenekler secenekler={mevcut.map(m => ({ id: m, ad: m === 'denklestir' ? 'Denkleştirme' : 'Sınırlayıcı bileşen' }))} secili={mod} onSec={setMod} />}
      {mod === 'denklestir' ? <Denklestir /> : <Sinirlayici />}
      <Not>Kütlenin korunumu: tepkimede atomlar yok olmaz ve yoktan var olmaz; yalnızca yeniden düzenlenir. Bu yüzden her atomun sayısı iki tarafta eşit olmalıdır.</Not>
    </div>
  )
}
