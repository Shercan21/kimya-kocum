import { useState } from 'react'
import { sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// Nano ölçek: küpü bölünce toplam yüzey alanı / hacim oranı artar.
// Altın nanoparçacıkların rengi boyutla değişir.

export default function NanoSim({ modlar }: { modlar?: string[] }) {
  const mevcut = modlar?.length ? modlar : ['yuzey', 'altin']
  const [mod, setMod] = useState(mevcut[0])
  const [bolme, setBolme] = useState(1)
  const [boyut, setBoyut] = useState(20)
  const kenar = 1 / bolme // cm
  const adet = bolme ** 3
  const alan = adet * 6 * kenar * kenar
  const oran = alan / 1

  // altın kolloit rengi (yaklaşık): küçük → kırmızı, büyük → mor/mavi
  const altinRenk = (d: number) => {
    if (d < 10) return '#d0273b'
    if (d < 40) return '#c0263f'
    if (d < 60) return '#a12f63'
    if (d < 80) return '#7a3f8f'
    return '#4f5fa8'
  }

  const canvas = useAnimasyon((ctx, W, H) => {
    if (mod === 'yuzey') {
      const boy = Math.min(W * 0.5, H - 30)
      const x0 = W / 2 - boy / 2
      const y0 = (H - boy) / 2
      const k = boy / bolme
      for (let i = 0; i < bolme; i++) for (let j = 0; j < bolme; j++) {
        const g = 2
        ctx.fillStyle = `hsl(${40 + (i + j) * 6}, 80%, ${60 + ((i + j) % 2) * 8}%)`
        ctx.fillRect(x0 + i * k + g / 2, y0 + j * k + g / 2, k - g, k - g)
      }
      ctx.strokeStyle = '#26215c'
      ctx.strokeRect(x0, y0, boy, boy)
      yazi(ctx, '1 cm', W / 2, y0 + boy + 12, { boyut: 10 })
    } else {
      const bx = W / 2 - 50
      ctx.fillStyle = altinRenk(boyut)
      ctx.beginPath()
      ctx.moveTo(bx, 20)
      ctx.lineTo(bx, H - 20)
      ctx.quadraticCurveTo(bx + 50, H, bx + 100, H - 20)
      ctx.lineTo(bx + 100, 20)
      ctx.fill()
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 2
      ctx.stroke()
      yazi(ctx, `${boyut} nm altın parçacıklar`, W / 2, 12, { boyut: 11, kalin: true })
    }
  })

  return (
    <div className="sim">
      {mevcut.length > 1 && <Secenekler secenekler={mevcut.map(m => ({ id: m, ad: m === 'yuzey' ? 'Yüzey alanı / hacim' : 'Altın nanoparçacık rengi' }))} secili={mod} onSec={setMod} />}
      {mod === 'yuzey' ? (
        <>
          <Gorev>1 cm'lik küpü daha küçük küplere böl. Toplam hacim değişmezken toplam yüzey alanı nasıl değişiyor? Nanoparçacıklar neden çok etkindir?</Gorev>
          <canvas ref={canvas} className="sim-canvas" aria-label="Küçük küplere bölünen küp (önden görünüm)" />
          <div className="sim-degerler">
            <Deger ad="Küp sayısı" deger={adet.toLocaleString('tr-TR')} />
            <Deger ad="Bir küpün kenarı" deger={kenar >= 0.01 ? `${sayi(kenar * 10, 2)} mm` : `${sayi(kenar * 1e7, 0)} nm`} />
            <Deger ad="Toplam yüzey alanı" deger={`${sayi(alan, 0)} cm²`} vurgu />
            <Deger ad="Yüzey / hacim" deger={`${sayi(oran, 0)} cm⁻¹`} />
          </div>
          <Kaydirici etiket={<>Her kenarı kaç parçaya böl? <b>{bolme}</b></>} deger={bolme} min={1} max={10} step={1} onChange={setBolme} />
          <p className="sim-sabit">Kenar 1 nm olacak kadar bölünseydi toplam yüzey alanı 60 000 000 cm² (6 000 m²) olurdu.</p>
        </>
      ) : (
        <>
          <Gorev>Parçacık boyutunu değiştir ve kolloidal altının rengini gözle. Aynı element neden farklı renklerde görünüyor?</Gorev>
          <canvas ref={canvas} className="sim-canvas" aria-label="Altın nanoparçacık çözeltisinin rengi" />
          <Kaydirici etiket={<>Parçacık çapı <b>{boyut} nm</b></>} deger={boyut} min={5} max={100} step={5} onChange={setBoyut} />
          <p className="sim-sabit">Külçe altın sarı renklidir; nano boyutta ışıkla etkileşimi değiştiği için çözeltisi kırmızıdan mora, maviye kadar farklı renklerde görünür.</p>
        </>
      )}
      <Not>Renkler yaklaşıktır. Nano ölçek 1–100 nm aralığıdır.</Not>
    </div>
  )
}
