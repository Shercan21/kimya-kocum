import { useState } from 'react'
import { beher, daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not, Secenekler } from './ortak'

// Derişim: molarite (M = n / V), seyreltme (M₁V₁ = M₂V₂) ve ppm.

export default function DerisimSim({ modlar }: { modlar?: string[] }) {
  const mevcut = modlar?.length ? modlar : ['molarite', 'ppm']
  const [mod, setMod] = useState(mevcut[0])
  const [mol, setMol] = useState(0.1)
  const [hacim, setHacim] = useState(0.5) // L
  const [mg, setMg] = useState(30)
  const M = mol / hacim

  const canvas = useAnimasyon((ctx, W, H) => {
    const bx = W / 2 - 75
    const bw = 150
    const by = 16
    const bh = H - 30
    if (mod === 'molarite') {
      const yogun = Math.min(1, M / 1)
      beher(ctx, bx, by, bw, bh, 0.25 + 0.7 * (hacim / 1), `rgba(40,110,220,${0.08 + 0.75 * yogun})`)
      const n = Math.round(mol * 120)
      const sivi = bh * (0.25 + 0.7 * hacim)
      const t = performance.now() / 1000
      for (let i = 0; i < n; i++) {
        const x = bx + 8 + ((i * 47) % (bw - 16)) + Math.sin(t + i) * 2
        const y = by + bh - 6 - ((i * 23) % Math.max(10, sivi - 12)) + Math.cos(t * 1.2 + i) * 2
        daire(ctx, x, y, 2.2, '#0c447c')
      }
      yazi(ctx, `${sayi(hacim * 1000, 0)} mL`, bx + bw + 32, by + bh - sivi, { boyut: 11, kalin: true })
      yazi(ctx, 'CuSO₄ çözeltisi', bx + bw / 2, by + 10, { boyut: 10 })
    } else {
      beher(ctx, bx, by, bw, bh, 0.85, 'rgba(120,180,240,.18)')
      const n = Math.round(mg / 2)
      for (let i = 0; i < n; i++) daire(ctx, bx + 10 + ((i * 53) % (bw - 20)), by + 30 + ((i * 31) % (bh - 50)), 2.5, '#e8593c')
      yazi(ctx, '1 L su', bx + bw / 2, by + 12, { boyut: 10, renk: '#185fa5' })
    }
  })

  return (
    <div className="sim">
      {mevcut.length > 1 && <Secenekler secenekler={mevcut.map(m => ({ id: m, ad: m === 'molarite' ? 'Molarite ve seyreltme' : 'ppm' }))} secili={mod} onSec={setMod} />}
      {mod === 'molarite' ? (
        <>
          <Gorev>Çözünen mol sayısını ve çözelti hacmini değiştir. Renk koyuluğu ile molarite arasında nasıl bir ilişki var? Su ekleyince mol sayısı değişiyor mu?</Gorev>
          <canvas ref={canvas} className="sim-canvas" aria-label="Bakır sülfat çözeltisinin derişimi" />
          <div className="sim-degerler">
            <Deger ad="Çözünen (n)" deger={`${sayi(mol, 2)} mol`} />
            <Deger ad="Hacim (V)" deger={`${sayi(hacim, 2)} L`} />
            <Deger ad="Molarite (n/V)" deger={`${sayi(M, 2)} M`} vurgu />
            <Deger ad="Kütle (CuSO₄: 160 g/mol)" deger={`${sayi(mol * 160, 1)} g`} />
          </div>
          <Kaydirici etiket={<>Çözünen CuSO₄ <b>{sayi(mol, 2)} mol</b></>} deger={mol} min={0.02} max={0.5} step={0.02} onChange={setMol} />
          <Kaydirici etiket={<>Çözelti hacmi <b>{sayi(hacim * 1000, 0)} mL</b></>} deger={hacim} min={0.1} max={1} step={0.05} onChange={setHacim} />
          <div className="row-actions start">
            <button type="button" className="btn-secondary" disabled={hacim >= 1} onClick={() => setHacim(h => Math.min(1, Math.round(h * 2 * 100) / 100))}>Su ekleyerek hacmi 2 katına çıkar</button>
          </div>
          <p className="sim-sabit">Seyreltme: M₁·V₁ = M₂·V₂ → mol sayısı değişmez, derişim azalır.</p>
        </>
      ) : (
        <>
          <Gorev>1 L suya çözünen madde miktarını değiştir. ppm değeri ile mg/L arasındaki ilişkiyi bul. İçme suyunda nitrat sınırı 50 ppm'dir.</Gorev>
          <canvas ref={canvas} className="sim-canvas" aria-label="1 litre suda çözünmüş madde" />
          <div className="sim-degerler">
            <Deger ad="Çözünen" deger={`${mg} mg`} />
            <Deger ad="Derişim" deger={`${mg} ppm`} vurgu />
            <Deger ad="Nitrat sınırı (50 ppm)" deger={mg <= 50 ? 'Uygun' : 'Sınırın üstünde'} />
          </div>
          <Kaydirici etiket={<>Çözünen madde <b>{mg} mg</b></>} deger={mg} min={0} max={120} step={5} onChange={setMg} />
          <p className="sim-sabit">Seyreltik sulu çözeltilerde 1 L ≈ 1 kg olduğundan 1 mg/L ≈ 1 ppm (milyonda bir kısım).</p>
        </>
      )}
      <Not>Noktalar çözünen tanecikleri temsil eder; sayıları temsilidir.</Not>
    </div>
  )
}
