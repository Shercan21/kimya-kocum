import { useState } from 'react'
import { useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not } from './ortak'

// Hızlandırılmış paslanma laboratuvarı: farklı koşullardaki çiviler, gün kaydırıcısı.

const KOSULLAR = [
  { ad: 'Kuru hava', hiz: 0.02, renk: 'rgba(255,255,255,.6)' },
  { ad: 'Musluk suyu', hiz: 0.5, renk: 'rgba(133,183,235,.5)' },
  { ad: 'Tuzlu su', hiz: 1, renk: 'rgba(133,183,235,.65)' },
  { ad: 'Havasız su', hiz: 0.06, renk: 'rgba(133,183,235,.5)' },
  { ad: 'Boyalı çivi', hiz: 0.04, renk: 'rgba(133,183,235,.5)' },
  { ad: 'Galvanizli', hiz: 0.05, renk: 'rgba(133,183,235,.5)' },
  { ad: 'Paslanmaz çelik', hiz: 0.01, renk: 'rgba(133,183,235,.65)' },
]

export default function PaslanmaSim() {
  const [gun, setGun] = useState(0)
  const pas = KOSULLAR.map(k => Math.min(1, (k.hiz * gun) / 20))

  const canvas = useAnimasyon((ctx, W, H) => {
    const n = KOSULLAR.length
    const w = (W - 20) / n
    KOSULLAR.forEach((k, i) => {
      const x = 10 + i * w
      const tw = Math.min(34, w - 8)
      const tx = x + (w - tw) / 2
      ctx.fillStyle = k.renk
      ctx.fillRect(tx, 50, tw, H - 80)
      if (k.ad === 'Havasız su') { ctx.fillStyle = 'rgba(242,166,35,.6)'; ctx.fillRect(tx, 50, tw, 8) }
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 1.5
      ctx.strokeRect(tx, 30, tw, H - 60)
      // çivi
      const p = pas[i]
      const govde = k.ad === 'Boyalı çivi' ? '#3b6d11' : k.ad === 'Galvanizli' ? '#c8ccd0' : k.ad === 'Paslanmaz çelik' ? '#d3d1c7' : '#8a8f96'
      const r = Math.round(138 + (160 - 138) * p)
      const g = Math.round(143 - 70 * p)
      const b = Math.round(150 - 120 * p)
      ctx.fillStyle = p > 0.05 && k.ad !== 'Boyalı çivi' ? `rgb(${r},${g},${b})` : govde
      ctx.fillRect(tx + tw / 2 - 3, 40, 6, H - 90)
      ctx.fillRect(tx + tw / 2 - 8, 36, 16, 5)
      // pas lekeleri
      for (let j = 0; j < Math.round(p * 14); j++) {
        ctx.fillStyle = 'rgba(160,82,30,.9)'
        ctx.beginPath()
        ctx.arc(tx + tw / 2 + ((j * 7) % 6) - 3, 50 + ((j * 37) % (H - 110)), 2 + (j % 3), 0, Math.PI * 2)
        ctx.fill()
      }
      yazi(ctx, k.ad, tx + tw / 2, 16, { boyut: 8, kalin: true })
      yazi(ctx, `${Math.round(p * 100)}%`, tx + tw / 2, H - 14, { boyut: 10, kalin: true, renk: '#993c1d' })
    })
  })

  const enCok = KOSULLAR[pas.indexOf(Math.max(...pas))]

  return (
    <div className="sim">
      <Gorev>Günleri ileri sar ve hangi çivinin en hızlı paslandığını gözle. Paslanma için hangi iki koşul birlikte gerekiyor? Boya, çinko kaplama ve alaşım demiri nasıl koruyor?</Gorev>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Farklı koşullardaki çivilerin paslanması" />
      <Kaydirici etiket={<>Geçen süre <b>{gun} gün</b></>} deger={gun} min={0} max={30} step={1} onChange={setGun} />
      <div className="sim-degerler">
        <Deger ad="En hızlı paslanan" deger={gun ? enCok.ad : '—'} vurgu />
        <Deger ad="Paslanma tepkimesi" deger="4Fe + 3O₂ + nH₂O → 2Fe₂O₃·nH₂O" />
      </div>
      <Not>Paslanma için su ve oksijen birlikte gerekir; tuz paslanmayı hızlandırır. Paslanmaz çelik krom ve nikel içeren bir alaşımdır. Hızlar temsilidir. Paslanan metal atıklar ayrı toplanıp geri dönüştürülmelidir.</Not>
    </div>
  )
}
