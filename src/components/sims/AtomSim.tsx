import { useState } from 'react'
import { daire, useAnimasyon, yazi } from './cizim'
import { dizilim, ELEMENTLER, iyonDizilimi, ustSayi } from './elementler'
import { Deger, Gorev, Kaydirici, Not } from './ortak'

// Atom kurucu: proton sayısını seç, elektronlar katmanlara ve orbitallere yerleşsin.
// Elektron ekleyip çıkararak iyon oluştur; periyot ve grup bilgisi.

export default function AtomSim() {
  const [z, setZ] = useState(11)
  const [yuk, setYuk] = useState(0)
  const el = ELEMENTLER[z - 1]
  const elektron = z - yuk
  const diz = yuk === 0 ? dizilim(z, z) : iyonDizilimi(z, yuk)
  const katman = [0, 0, 0, 0]
  diz.forEach(([ad, n]) => (katman[Number(ad[0]) - 1] += n))
  const dizYazi = diz.map(([a, n]) => `${a}${ustSayi(n)}`).join(' ')
  const yukYazi = yuk === 0 ? '' : `${Math.abs(yuk) > 1 ? Math.abs(yuk) : ''}${yuk > 0 ? '⁺' : '⁻'}`.replace(/\d/g, d => ustSayi(Number(d)))

  const canvas = useAnimasyon((ctx, W, H, _dt, t) => {
    const cx = Math.min(W * 0.3, 120)
    const cy = H / 2
    // çekirdek
    daire(ctx, cx, cy, 14, '#e8593c')
    yazi(ctx, `${z}p⁺`, cx, cy, { boyut: 9, kalin: true, renk: '#fff' })
    const maxR = Math.min(cx - 8, H / 2 - 8)
    katman.forEach((n, i) => {
      if (!n) return
      const r = 24 + (i * (maxR - 24)) / 3
      ctx.strokeStyle = '#cecbf6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + t * (0.8 - i * 0.15)
        daire(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3.2, '#378add')
      }
    })
    // orbital kutuları
    const ox = cx * 2 + 16
    let y = 14
    const kutu = 18
    for (const [ad, n] of diz) {
      const kutuSayisi = ad.endsWith('s') ? 1 : ad.endsWith('p') ? 3 : 5
      yazi(ctx, ad, ox, y + kutu / 2, { boyut: 11, kalin: true, hiza: 'left' })
      for (let k = 0; k < kutuSayisi; k++) {
        const x = ox + 24 + k * (kutu + 2)
        ctx.strokeStyle = '#26215c'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, kutu, kutu)
        // Hund kuralı: önce tek tek, sonra eşleşme
        const yukari = n > k
        const asagi = n > kutuSayisi + k
        if (yukari) yazi(ctx, '↑', x + (asagi ? 5 : 9), y + kutu / 2, { boyut: 12, kalin: true, renk: '#534ab7' })
        if (asagi) yazi(ctx, '↓', x + 13, y + kutu / 2, { boyut: 12, kalin: true, renk: '#e8593c' })
      }
      y += kutu + 6
      if (y > H - kutu) break
    }
  })

  return (
    <div className="sim">
      <Gorev>Proton sayısını değiştirerek elementleri kur. Elektronlar hangi sırayla yerleşiyor? Elektron verip alarak iyon oluştur: dizilim nasıl değişiyor, hangi soy gaza benziyor?</Gorev>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Atom modeli ve orbital diyagramı" />
      <div className="sim-degerler">
        <Deger ad="Element" deger={`${el.ad} (${el.s}${yukYazi})`} vurgu />
        <Deger ad="Proton / elektron" deger={`${z} / ${elektron}`} />
        <Deger ad="Periyot · grup" deger={`${el.periyot}. periyot · ${el.grup}`} />
        <Deger ad="Katmanlardaki e⁻" deger={katman.filter(Boolean).join(' – ')} />
      </div>
      <p className="sim-dizilim">{el.s}{yukYazi}: {dizYazi}</p>
      <Kaydirici etiket={<>Proton sayısı (atom numarası) <b>{z}</b></>} deger={z} min={1} max={36} step={1} onChange={v => { setZ(v); setYuk(0) }} />
      <div className="row-actions start">
        <button type="button" className="btn-secondary" disabled={elektron <= 0} onClick={() => setYuk(y => y + 1)}>Elektron ver (−e⁻)</button>
        <button type="button" className="btn-secondary" disabled={yuk <= -3} onClick={() => setYuk(y => y - 1)}>Elektron al (+e⁻)</button>
        <button type="button" className="btn-secondary" disabled={yuk === 0} onClick={() => setYuk(0)}>Nötr atom</button>
      </div>
      <Not>Orbital kutularında ↑ ve ↓ zıt spinli elektronları gösterir. Cr ve Cu atomlarında yarı dolu/tam dolu d orbitali kararlılığı nedeniyle dizilim istisnadır. Geçiş metalleri katyon oluştururken elektronlarını önce 4s orbitalinden verir.</Not>
    </div>
  )
}
