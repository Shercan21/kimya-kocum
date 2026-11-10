import { useState } from 'react'
import { beher, daire, sayi, useAnimasyon } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// Az çözünen tuzlar: molar çözünürlük, Kçç, Qçç ve ortak iyon etkisi (100 mL su).

type Tuz = {
  id: string
  ad: string
  M: number
  Ksp: number
  y: 1 | 2 // anyon katsayısı (MX ya da MX₂)
  katyon: string
  anyon: string
  ortakAnyon: string
  ortakKatyon: string
  maxMg: number
  dH: number // çözünme entalpisi (kJ/mol, yaklaşık)
}
const TUZLAR: Tuz[] = [
  { id: 'AgCl', ad: 'AgCl', M: 143.3, Ksp: 1.8e-10, y: 1, katyon: 'Ag⁺', anyon: 'Cl⁻', ortakAnyon: 'NaCl', ortakKatyon: 'AgNO₃', maxMg: 1, dH: 65 },
  { id: 'CaF2', ad: 'CaF₂', M: 78.1, Ksp: 4.0e-11, y: 2, katyon: 'Ca²⁺', anyon: 'F⁻', ortakAnyon: 'NaF', ortakKatyon: 'Ca(NO₃)₂', maxMg: 5, dH: 12 },
  { id: 'PbCl2', ad: 'PbCl₂', M: 278.1, Ksp: 1.7e-5, y: 2, katyon: 'Pb²⁺', anyon: 'Cl⁻', ortakAnyon: 'NaCl', ortakKatyon: 'Pb(NO₃)₂', maxMg: 1000, dH: 26 },
]
const V = 0.1 // L

function cozunurluk(t: Tuz, K: number, ck: number, ca: number) {
  // K = (s + ck)(y·s + ca)^y  → s (ikiye bölme)
  const f = (s: number) => (s + ck) * Math.pow(t.y * s + ca, t.y) - K
  let lo = 0
  let hi = 1
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2
    if (f(m) > 0) hi = m
    else lo = m
  }
  return (lo + hi) / 2
}

export default function KccSim() {
  const [tuzId, setTuzId] = useState('PbCl2')
  const [eklenen, setEklenen] = useState(0.6) // en fazla miktarın oranı
  const [ortak, setOrtak] = useState<'yok' | 'anyon' | 'katyon'>('yok')
  const [ortakC, setOrtakC] = useState(0.01)
  const [T, setT] = useState(25)
  const tuz = TUZLAR.find(t => t.id === tuzId)!
  const K = tuz.Ksp * Math.exp(((tuz.dH * 1000) / 8.314) * (1 / 298 - 1 / (T + 273)))
  const ck = ortak === 'katyon' ? ortakC : 0
  const ca = ortak === 'anyon' ? ortakC : 0
  const s = cozunurluk(tuz, K, ck, ca)
  const eklenenMol = (eklenen * tuz.maxMg) / 1000 / tuz.M
  const cozunebilir = s * V
  const cozunen = Math.min(eklenenMol, cozunebilir)
  const dipte = eklenenMol - cozunen
  const cK = cozunen / V + ck
  const cA = tuz.y * (cozunen / V) + ca
  const Q = cK * Math.pow(cA, tuz.y)
  const doymus = dipte > 1e-12

  const canvas = useAnimasyon((ctx, W, H) => {
    const bx = W / 2 - 80
    const bw = 160
    const by = 16
    const bh = H - 28
    beher(ctx, bx, by, bw, bh, 0.8, 'rgba(120,180,240,.18)')
    // çözünmüş iyonlar (temsili)
    const oranli = Math.min(1, cozunen / (tuz.maxMg / 1000 / tuz.M))
    const n = Math.round(6 + 30 * oranli)
    let tohum = 7
    const rnd = () => ((tohum = (tohum * 16807) % 2147483647) / 2147483647)
    const t = performance.now() / 1000
    for (let i = 0; i < n; i++) {
      const x = bx + 12 + rnd() * (bw - 24) + Math.sin(t + i) * 3
      const y = by + bh * 0.25 + rnd() * (bh * 0.6) + Math.cos(t * 1.3 + i) * 3
      daire(ctx, x, y, 4, '#7f77dd')
      for (let k = 0; k < tuz.y; k++) {
        const x2 = bx + 12 + rnd() * (bw - 24) + Math.cos(t + i + k) * 3
        const y2 = by + bh * 0.25 + rnd() * (bh * 0.6) + Math.sin(t * 1.1 + i) * 3
        daire(ctx, x2, y2, 3, '#1d9e75')
      }
    }
    // ortak iyon (temsili)
    if (ortak !== 'yok') {
      const m = Math.round(4 + Math.log10(ortakC * 1000) * 6)
      for (let i = 0; i < m; i++) {
        const x = bx + 12 + rnd() * (bw - 24)
        const y = by + bh * 0.25 + rnd() * (bh * 0.6)
        daire(ctx, x, y, 3, ortak === 'anyon' ? '#1d9e75' : '#7f77dd')
      }
    }
    // dipteki katı
    if (dipte > 0) {
      const yuk = Math.min(bh * 0.25, 6 + (dipte / (tuz.maxMg / 1000 / tuz.M)) * bh * 0.25)
      ctx.fillStyle = '#e8e6f5'
      ctx.beginPath()
      ctx.moveTo(bx + 6, by + bh - 2)
      ctx.quadraticCurveTo(bx + bw / 2, by + bh - yuk * 2, bx + bw - 6, by + bh - 2)
      ctx.fill()
      ctx.strokeStyle = '#b4b2a9'
      ctx.stroke()
    }
  })

  const mg = (mol: number) => sayi(mol * tuz.M * 1000, mol * tuz.M * 1000 < 1 ? 3 : 1)

  return (
    <div className="sim">
      <Gorev>Kaba tuz ekle ve dibe çöken katıyı gözle. Çözelti ne zaman doygun oluyor? Sonra ortak iyon ekle: çözünürlük nasıl değişiyor? Qçç ile Kçç'yi karşılaştır.</Gorev>
      <Secenekler secenekler={TUZLAR.map(t => ({ id: t.id, ad: t.ad }))} secili={tuzId} onSec={setTuzId} etiket="Tuz" />
      <canvas ref={canvas} className="sim-canvas" aria-label="100 mL suda az çözünen tuz" />
      <div className="sim-degerler">
        <Deger ad="Kçç" deger={K.toExponential(2).replace('.', ',')} />
        <Deger ad="Qçç" deger={Q.toExponential(2).replace('.', ',')} vurgu={doymus} />
        <Deger ad="Molar çözünürlük (M)" deger={s.toExponential(2).replace('.', ',')} />
        <Deger ad="Çözünen / dipte (mg)" deger={`${mg(cozunen)} / ${mg(dipte)}`} />
        <Deger ad="Durum" deger={doymus ? 'Doygun (Q = Kçç)' : 'Doymamış (Q < Kçç)'} />
      </div>
      <Kaydirici etiket={<>Eklenen {tuz.ad} <b>{mg(eklenenMol)} mg</b></>} deger={eklenen} min={0} max={1} step={0.02} onChange={setEklenen} />
      <Secenekler
        secenekler={[{ id: 'yok', ad: 'Ortak iyon yok' }, { id: 'anyon', ad: `${tuz.ortakAnyon} ekle (${tuz.anyon})` }, { id: 'katyon', ad: `${tuz.ortakKatyon} ekle (${tuz.katyon})` }]}
        secili={ortak}
        onSec={setOrtak}
        etiket="Ortak iyon"
      />
      {ortak !== 'yok' && <Kaydirici etiket={<>Ortak iyon derişimi <b>{sayi(ortakC, 3)} M</b></>} deger={ortakC} min={0.001} max={0.1} step={0.001} onChange={setOrtakC} />}
      <Kaydirici etiket={<>Sıcaklık <b>{T} °C</b></>} deger={T} min={10} max={80} step={5} onChange={setT} />
      <Not>Mor noktalar katyonu, yeşil noktalar anyonu temsil eder (sayıları temsilidir). Kçç değerleri 25 °C içindir; sıcaklıkla değişim yaklaşık çözünme entalpisiyle hesaplanmıştır.</Not>
    </div>
  )
}
