import { useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not } from './ortak'

// Mol kavramı: maddeyi tartarak sayma. Kütle ↔ mol ↔ tanecik sayısı dönüşümleri.

const NA = 6.02e23
const MADDELER = [
  { ad: 'Karbon (C)', M: 12, renk: '#3d3d3a', yogunluk: 2.2, tanecik: 'atom', atom: 1 },
  { ad: 'Demir (Fe)', M: 56, renk: '#8a8f96', yogunluk: 7.9, tanecik: 'atom', atom: 1 },
  { ad: 'Alüminyum (Al)', M: 27, renk: '#c8ccd0', yogunluk: 2.7, tanecik: 'atom', atom: 1 },
  { ad: 'Su (H₂O)', M: 18, renk: 'rgba(80,150,230,.6)', yogunluk: 1.0, tanecik: 'molekül', atom: 3 },
  { ad: 'Sofra tuzu (NaCl)', M: 58.5, renk: '#f1f1f1', yogunluk: 2.17, tanecik: 'formül birimi', atom: 2 },
  { ad: 'Şeker (C₁₂H₂₂O₁₁)', M: 342, renk: '#fafafa', yogunluk: 1.59, tanecik: 'molekül', atom: 45 },
]

function us(x: number) {
  if (x === 0) return '0'
  const e = Math.floor(Math.log10(x))
  const m = x / Math.pow(10, e)
  return `${m.toFixed(2).replace('.', ',')}·10${String(e).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)] ?? '⁻').join('')}`
}

export default function MolSim() {
  const [secim, setSecim] = useState(0)
  const [mol, setMol] = useState(1)
  const m = MADDELER[secim]
  const kutle = mol * m.M
  const hacim = kutle / m.yogunluk

  const canvas = useAnimasyon((ctx, W, H) => {
    // terazi
    const tx = W / 2
    const ty = H - 30
    ctx.fillStyle = '#d3d1c7'
    ctx.fillRect(tx - 90, ty, 180, 16)
    ctx.fillStyle = '#26215c'
    ctx.fillRect(tx - 70, ty + 4, 140, 10)
    ctx.fillStyle = '#b8f2c9'
    ctx.fillRect(tx - 34, ty + 4, 68, 10)
    yazi(ctx, `${sayi(kutle, 1)} g`, tx, ty + 9, { boyut: 9, kalin: true, renk: '#13361f' })
    ctx.fillStyle = '#b4b2a9'
    ctx.fillRect(tx - 80, ty - 4, 160, 4)
    // madde yığını (hacme göre)
    const r = Math.min(H - 70, 18 + Math.cbrt(hacim) * 18)
    ctx.fillStyle = m.renk
    ctx.strokeStyle = '#888780'
    ctx.beginPath()
    ctx.moveTo(tx - r * 1.2, ty - 4)
    ctx.quadraticCurveTo(tx, ty - 4 - r * 1.6, tx + r * 1.2, ty - 4)
    ctx.fill()
    ctx.stroke()
    // büyüteç: tanecikler
    const bx = 60
    const by = 56
    ctx.strokeStyle = '#534ab7'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(bx, by, 40, 0, Math.PI * 2)
    ctx.stroke()
    ctx.save()
    ctx.beginPath()
    ctx.arc(bx, by, 38, 0, Math.PI * 2)
    ctx.clip()
    const t = performance.now() / 1000
    for (let i = 0; i < 16; i++) daire(ctx, bx - 30 + (i % 4) * 20 + Math.sin(t + i) * 1.5, by - 30 + Math.floor(i / 4) * 20, 6, secim === 3 ? '#378add' : m.renk === '#f1f1f1' || m.renk === '#fafafa' ? '#b4b2a9' : m.renk)
    ctx.restore()
    yazi(ctx, `1 ${m.tanecik} ≈ ${us(m.M / NA)} g`, bx, by + 54, { boyut: 9 })
  })

  return (
    <div className="sim">
      <Gorev>Farklı maddelerden 1'er mol tart. Kütleler neden farklı? Tanecik sayıları neden aynı? Mol sayısını değiştirip kütle ve tanecik sayısının nasıl değiştiğini incele.</Gorev>
      <label className="sim-secim">
        <select value={secim} onChange={e => setSecim(Number(e.target.value))}>
          {MADDELER.map((x, i) => <option key={x.ad} value={i}>{x.ad} · {String(x.M).replace('.', ',')} g/mol</option>)}
        </select>
      </label>
      <canvas ref={canvas} className="sim-canvas" aria-label="Terazide madde yığını ve tanecik büyüteci" />
      <div className="sim-degerler">
        <Deger ad="Mol sayısı (n)" deger={sayi(mol, 2)} />
        <Deger ad="Kütle (m = n·M)" deger={`${sayi(kutle, 1)} g`} vurgu />
        <Deger ad={`${m.tanecik[0].toUpperCase() + m.tanecik.slice(1)} sayısı`} deger={us(mol * NA)} />
        <Deger ad="Toplam atom sayısı" deger={us(mol * NA * m.atom)} />
        <Deger ad="Hacim (yaklaşık)" deger={`${sayi(hacim, 1)} cm³`} />
      </div>
      <Kaydirici etiket={<>Mol sayısı <b>{sayi(mol, 2)} mol</b></>} deger={mol} min={0.25} max={3} step={0.25} onChange={setMol} />
      <Not>Avogadro sayısı N = 6,02·10²³. 1 mol her maddede aynı sayıda tanecik içerir; kütlesi ise mol kütlesine eşittir.</Not>
    </div>
  )
}
