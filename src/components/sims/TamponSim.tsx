import { useState } from 'react'
import { beher, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Grafik, Not } from './ortak'

// Tampon çözelti: 100 mL saf su ile 100 mL asetik asit/asetat tamponuna (0,1 M + 0,1 M)
// damla damla HCl ya da NaOH eklenince pH değişimlerinin karşılaştırılması.

const KA = 1.8e-5
const C_EK = 0.1 // M
const V0 = 0.1 // L

function phSu(nH: number) {
  // nH > 0: eklenen asit (mol), < 0: baz
  const V = V0 + Math.abs(nH) / C_EK
  const c = nH / V
  const h = c / 2 + Math.sqrt((c * c) / 4 + 1e-14)
  return -Math.log10(h)
}
function phTampon(nH: number) {
  const nHA = 0.01 + nH
  const nA = 0.01 - nH
  if (nA <= 0) return phSu(nH - 0.01)
  if (nHA <= 0) return phSu(nH + 0.01)
  return -Math.log10(KA) + Math.log10(nA / nHA)
}

export default function TamponSim() {
  const [ml, setMl] = useState(0) // + asit, − baz
  const nH = (ml / 1000) * C_EK
  const p1 = phSu(nH)
  const p2 = phTampon(nH)
  const renk = (p: number) => `hsl(${Math.max(0, Math.min(260, (p / 14) * 260))}, 70%, 60%)`

  const canvas = useAnimasyon((ctx, W, H) => {
    const bw = Math.min(110, W * 0.32)
    beher(ctx, W * 0.25 - bw / 2, 30, bw, H - 44, 0.6, renk(p1) + '')
    beher(ctx, W * 0.75 - bw / 2, 30, bw, H - 44, 0.6, renk(p2))
    yazi(ctx, 'Saf su', W * 0.25, 14, { boyut: 12, kalin: true })
    yazi(ctx, 'Tampon', W * 0.75, 14, { boyut: 12, kalin: true })
    yazi(ctx, `pH ${sayi(p1, 2)}`, W * 0.25, H / 2 + 20, { boyut: 14, kalin: true, renk: '#fff' })
    yazi(ctx, `pH ${sayi(p2, 2)}`, W * 0.75, H / 2 + 20, { boyut: 14, kalin: true, renk: '#fff' })
  })

  const egri = (f: (n: number) => number): [number, number][] => Array.from({ length: 41 }, (_, i) => { const m = -20 + i; return [m, f((m / 1000) * C_EK)] })

  return (
    <div className="sim">
      <Gorev>İki behere aynı miktarda asit (HCl) ya da baz (NaOH) ekle. Hangi beherin pH değeri neredeyse hiç değişmiyor? Kanımızın pH'ının sabit kalması bu olayla nasıl ilişkili?</Gorev>
      <canvas ref={canvas} className="sim-canvas" aria-label="Saf su ve tampon çözeltinin pH karşılaştırması" />
      <div className="row-actions start">
        <button type="button" className="btn-secondary" onClick={() => setMl(m => Math.min(20, m + 1))}>+1 mL HCl</button>
        <button type="button" className="btn-secondary" onClick={() => setMl(m => Math.max(-20, m - 1))}>+1 mL NaOH</button>
        <button type="button" className="btn-secondary" onClick={() => setMl(0)}>Baştan</button>
      </div>
      <div className="sim-degerler">
        <Deger ad="Net eklenen" deger={ml === 0 ? '—' : ml > 0 ? `${ml} mL 0,1 M HCl` : `${-ml} mL 0,1 M NaOH`} />
        <Deger ad="Saf su pH" deger={sayi(p1, 2)} />
        <Deger ad="Tampon pH" deger={sayi(p2, 2)} vurgu />
      </div>
      <Grafik
        seriler={[{ ad: 'Saf su', renk: '#378add', noktalar: egri(phSu) }, { ad: 'Tampon', renk: '#1d9e75', noktalar: egri(phTampon) }]}
        xEtiket="Eklenen (mL) · − NaOH, + HCl"
        yEtiket="pH"
        xMin={-20}
        xMax={20}
        yMax={14}
        dikeyCizgi={{ x: ml, etiket: 'şimdi' }}
      />
      <Not>Konuyu genişleten deney: tampon, zayıf asit (CH₃COOH) ve onun tuzunu (CH₃COONa) birlikte içerir; eklenen H⁺ iyonlarını asetat, OH⁻ iyonlarını asetik asit nötralleştirir. Kanda karbonik asit/bikarbonat tamponu pH'ı ≈ 7,4'te tutar.</Not>
    </div>
  )
}
