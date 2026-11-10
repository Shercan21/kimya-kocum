import { useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Bağ enerjileriyle tepkime entalpisi: tepkenlerin bağları kırılır (enerji alınır),
// atomlar ürünlerde yeniden bağlanır (enerji verilir). Enerji diyagramı adım adım çizilir.

type Atom = { s: string; renk: string; r: number }
const A: Record<string, Atom> = {
  H: { s: 'H', renk: '#f1efe8', r: 9 },
  Cl: { s: 'Cl', renk: '#97c459', r: 13 },
  O: { s: 'O', renk: '#e24b4a', r: 12 },
  N: { s: 'N', renk: '#378add', r: 12 },
  C: { s: 'C', renk: '#5f5e5a', r: 12 },
  I: { s: 'I', renk: '#9b7fd1', r: 14 },
}
type Mol = { atomlar: string[]; bag: string; adet: number; ad: string }
type Tepkime = { id: string; denklem: string; tepken: Mol[]; urun: Mol[]; kirilan: [string, number, number][]; olusan: [string, number, number][] }

const TEPKIMELER: Tepkime[] = [
  {
    id: 'hcl', denklem: 'H₂ + Cl₂ → 2HCl',
    tepken: [{ atomlar: ['H', 'H'], bag: 'H–H', adet: 1, ad: 'H₂' }, { atomlar: ['Cl', 'Cl'], bag: 'Cl–Cl', adet: 1, ad: 'Cl₂' }],
    urun: [{ atomlar: ['H', 'Cl'], bag: 'H–Cl', adet: 2, ad: 'HCl' }],
    kirilan: [['H–H', 1, 436], ['Cl–Cl', 1, 243]], olusan: [['H–Cl', 2, 432]],
  },
  {
    id: 'su', denklem: '2H₂ + O₂ → 2H₂O(g)',
    tepken: [{ atomlar: ['H', 'H'], bag: 'H–H', adet: 2, ad: 'H₂' }, { atomlar: ['O', 'O'], bag: 'O=O', adet: 1, ad: 'O₂' }],
    urun: [{ atomlar: ['H', 'O', 'H'], bag: 'O–H', adet: 2, ad: 'H₂O' }],
    kirilan: [['H–H', 2, 436], ['O=O', 1, 498]], olusan: [['O–H', 4, 463]],
  },
  {
    id: 'nh3', denklem: 'N₂ + 3H₂ → 2NH₃',
    tepken: [{ atomlar: ['N', 'N'], bag: 'N≡N', adet: 1, ad: 'N₂' }, { atomlar: ['H', 'H'], bag: 'H–H', adet: 3, ad: 'H₂' }],
    urun: [{ atomlar: ['H', 'N', 'H'], bag: 'N–H', adet: 2, ad: 'NH₃' }],
    kirilan: [['N≡N', 1, 945], ['H–H', 3, 436]], olusan: [['N–H', 6, 391]],
  },
  {
    id: 'hi', denklem: '2HI → H₂ + I₂',
    tepken: [{ atomlar: ['H', 'I'], bag: 'H–I', adet: 2, ad: 'HI' }],
    urun: [{ atomlar: ['H', 'H'], bag: 'H–H', adet: 1, ad: 'H₂' }, { atomlar: ['I', 'I'], bag: 'I–I', adet: 1, ad: 'I₂' }],
    kirilan: [['H–I', 2, 299]], olusan: [['H–H', 1, 436], ['I–I', 1, 151]],
  },
]

export default function EntalpiSim() {
  const [id, setId] = useState('hcl')
  const [adim, setAdim] = useState(0) // 0 tepkenler, 1 atomlar, 2 ürünler
  const tp = TEPKIMELER.find(t => t.id === id)!
  const kirilan = tp.kirilan.reduce((t, [, n, e]) => t + n * e, 0)
  const olusan = tp.olusan.reduce((t, [, n, e]) => t + n * e, 0)
  const dH = kirilan - olusan

  const canvas = useAnimasyon((ctx, W, H) => {
    // sol: molekül görünümü
    const solW = W * 0.55
    const moller = adim === 2 ? tp.urun : tp.tepken
    const t = performance.now() / 1000
    let x = 26
    let y = 40
    for (const m of moller) {
      for (let k = 0; k < m.adet; k++) {
        const ayri = adim === 1
        let ax = x
        m.atomlar.forEach((s, i) => {
          const at = A[s]
          const dx = ayri ? i * 8 + Math.sin(t * 3 + i + k) * 3 : 0
          const cx = ax + dx
          const cy = y + (ayri ? Math.cos(t * 2 + i + k) * 3 : 0)
          if (i > 0 && !ayri) {
            ctx.strokeStyle = '#26215c'
            ctx.lineWidth = m.bag.includes('≡') ? 5 : m.bag.includes('=') ? 3.5 : 2
            ctx.beginPath()
            ctx.moveTo(cx - at.r - 4, cy)
            ctx.lineTo(cx - 2, cy)
            ctx.stroke()
          }
          daire(ctx, cx, cy, at.r, at.renk)
          ctx.strokeStyle = '#26215c'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(cx, cy, at.r, 0, Math.PI * 2)
          ctx.stroke()
          yazi(ctx, s, cx, cy, { boyut: 9, kalin: true })
          ax = cx + at.r * 2 + (ayri ? 10 : 2)
        })
        x = ax + 14
        if (x > solW - 50) { x = 26; y += 42 }
      }
    }
    yazi(ctx, adim === 0 ? 'Tepkenler' : adim === 1 ? 'Serbest atomlar' : 'Ürünler', solW / 2, H - 14, { boyut: 12, kalin: true })
    // sağ: enerji diyagramı
    const ox = solW + 16
    const ow = W - ox - 10
    const ust = Math.max(kirilan, 1)
    const yE = (e: number) => H - 30 - ((e - Math.min(0, dH)) / (ust - Math.min(0, dH))) * (H - 60)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(ox, 10)
    ctx.lineTo(ox, H - 20)
    ctx.stroke()
    yazi(ctx, 'Enerji', ox + 4, 8, { boyut: 9, hiza: 'left' })
    const cizgi = (e: number, x1: number, renk: string, et: string) => {
      ctx.strokeStyle = renk
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(ox + x1, yE(e))
      ctx.lineTo(ox + x1 + ow * 0.28, yE(e))
      ctx.stroke()
      yazi(ctx, et, ox + x1 + ow * 0.14, yE(e) - 9, { boyut: 9 })
    }
    cizgi(0, 4, '#534ab7', 'Tepken')
    if (adim >= 1) {
      cizgi(kirilan, ow * 0.36, '#e8593c', 'Atomlar')
      ctx.strokeStyle = '#e8593c'
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(ox + ow * 0.2, yE(0))
      ctx.lineTo(ox + ow * 0.45, yE(kirilan))
      ctx.stroke()
      ctx.setLineDash([])
    }
    if (adim >= 2) {
      cizgi(dH, ow * 0.7, '#1d9e75', 'Ürün')
      ctx.strokeStyle = '#1d9e75'
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(ox + ow * 0.55, yE(kirilan))
      ctx.lineTo(ox + ow * 0.82, yE(dH))
      ctx.stroke()
      ctx.setLineDash([])
    }
  })

  return (
    <div className="sim">
      <Gorev>Önce tepkenlerin bağlarını kır, sonra ürünlerin bağlarını oluştur. Enerji diyagramına bak: tepkime ısı mı veriyor, alıyor mu? ΔH'yi bağ enerjileriyle hesapla.</Gorev>
      <Secenekler secenekler={TEPKIMELER.map(t => ({ id: t.id, ad: t.denklem }))} secili={id} onSec={v => { setId(v); setAdim(0) }} etiket="Tepkime" />
      <canvas ref={canvas} className="sim-canvas" aria-label="Moleküllerin bağ kırma ve oluşturma animasyonu, enerji diyagramı" />
      <div className="row-actions start">
        <button type="button" className="primary-button" disabled={adim !== 0} onClick={() => setAdim(1)}>1. Bağları kır</button>
        <button type="button" className="primary-button" disabled={adim !== 1} onClick={() => setAdim(2)}>2. Yeni bağları oluştur</button>
        <button type="button" className="btn-secondary" onClick={() => setAdim(0)}>Baştan</button>
      </div>
      <div className="sim-degerler">
        <Deger ad="Kırılan bağlar (alınan)" deger={adim >= 1 ? `+${kirilan} kJ` : '?'} />
        <Deger ad="Oluşan bağlar (verilen)" deger={adim >= 2 ? `−${olusan} kJ` : '?'} />
        <Deger ad="ΔH" deger={adim >= 2 ? `${dH > 0 ? '+' : ''}${sayi(dH, 0)} kJ` : '?'} vurgu={adim >= 2} />
        <Deger ad="Tür" deger={adim >= 2 ? (dH < 0 ? 'Ekzotermik' : 'Endotermik') : '?'} />
      </div>
      <p className="sim-sabit">
        Kırılan: {tp.kirilan.map(([b, n, e]) => `${n}×${b} (${e})`).join(' + ')} · Oluşan: {tp.olusan.map(([b, n, e]) => `${n}×${b} (${e})`).join(' + ')} kJ/mol
      </p>
      <Not>Bağ enerjileri ortalama değerlerdir; hesaplanan ΔH yaklaşıktır. ΔH = Σ(kırılan bağ enerjileri) − Σ(oluşan bağ enerjileri).</Not>
    </div>
  )
}
