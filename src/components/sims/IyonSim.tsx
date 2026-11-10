import { useState } from 'react'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// İyonik bileşik kurucu (yük denkliği, formül, ad) ve moleküler bileşik adlandırma (ön ekler).

type Iyon = { s: string; ad: string; yuk: number; cok?: boolean }
const KATYONLAR: Iyon[] = [
  { s: 'Na', ad: 'sodyum', yuk: 1 }, { s: 'K', ad: 'potasyum', yuk: 1 }, { s: 'Mg', ad: 'magnezyum', yuk: 2 }, { s: 'Ca', ad: 'kalsiyum', yuk: 2 },
  { s: 'Al', ad: 'alüminyum', yuk: 3 }, { s: 'Fe', ad: 'demir(II)', yuk: 2 }, { s: 'Fe', ad: 'demir(III)', yuk: 3 }, { s: 'Cu', ad: 'bakır(II)', yuk: 2 },
  { s: 'NH₄', ad: 'amonyum', yuk: 1, cok: true },
]
const ANYONLAR: Iyon[] = [
  { s: 'Cl', ad: 'klorür', yuk: -1 }, { s: 'Br', ad: 'bromür', yuk: -1 }, { s: 'O', ad: 'oksit', yuk: -2 }, { s: 'S', ad: 'sülfür', yuk: -2 },
  { s: 'N', ad: 'nitrür', yuk: -3 }, { s: 'OH', ad: 'hidroksit', yuk: -1, cok: true }, { s: 'NO₃', ad: 'nitrat', yuk: -1, cok: true },
  { s: 'SO₄', ad: 'sülfat', yuk: -2, cok: true }, { s: 'CO₃', ad: 'karbonat', yuk: -2, cok: true }, { s: 'PO₄', ad: 'fosfat', yuk: -3, cok: true },
]
const ALT = '₀₁₂₃₄₅₆₇₈₉'
const alt = (n: number) => (n === 1 ? '' : String(n).split('').map(c => ALT[Number(c)]).join(''))
const ebob = (a: number, b: number): number => (b ? ebob(b, a % b) : a)
const yukYaz = (y: number) => `${Math.abs(y) > 1 ? Math.abs(y) : ''}${y > 0 ? '+' : '−'}`

const AMETAL = [
  { s: 'C', ad: 'karbon' }, { s: 'N', ad: 'azot' }, { s: 'P', ad: 'fosfor' }, { s: 'S', ad: 'kükürt' }, { s: 'Cl', ad: 'klor' },
]
const IKINCI = [{ s: 'O', ad: 'oksit' }, { s: 'F', ad: 'florür' }, { s: 'Cl', ad: 'klorür' }, { s: 'S', ad: 'sülfür' }]
const ONEK = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hekza', 'hepta']

function Iyonik() {
  const [k, setK] = useState(3)
  const [a, setA] = useState(2)
  const kat = KATYONLAR[k]
  const an = ANYONLAR[a]
  const ortak = (kat.yuk * Math.abs(an.yuk)) / ebob(kat.yuk, Math.abs(an.yuk))
  const nk = ortak / kat.yuk
  const na = ortak / Math.abs(an.yuk)
  const parca = (i: Iyon, n: number) => (i.cok && n > 1 ? `(${i.s})${alt(n)}` : `${i.s}${alt(n)}`)
  const formul = parca(kat, nk) + parca(an, na)
  const ad = `${kat.ad[0].toLocaleUpperCase('tr-TR')}${kat.ad.slice(1)} ${an.ad}`
  return (
    <>
      <Gorev>Bir katyon ve bir anyon seç. Toplam yük sıfır olacak şekilde kaç tane iyon gerekiyor? Formülü ve adını kontrol et.</Gorev>
      <div className="sim-secim">
        <label>Katyon
          <select value={k} onChange={e => setK(Number(e.target.value))}>
            {KATYONLAR.map((x, i) => <option key={i} value={i}>{x.s}{yukYaz(x.yuk)} · {x.ad}</option>)}
          </select>
        </label>
        <label>Anyon
          <select value={a} onChange={e => setA(Number(e.target.value))}>
            {ANYONLAR.map((x, i) => <option key={i} value={i}>{x.s}{yukYaz(x.yuk)} · {x.ad}</option>)}
          </select>
        </label>
      </div>
      <div className="iyon-kart-alan" aria-label="Yük denkliği">
        <div>{Array.from({ length: nk }, (_, i) => <span key={i} className="iyon-kart katyon">{kat.s}<sup>{yukYaz(kat.yuk)}</sup></span>)}</div>
        <div>{Array.from({ length: na }, (_, i) => <span key={i} className="iyon-kart anyon">{an.s}<sup>{yukYaz(an.yuk)}</sup></span>)}</div>
      </div>
      <div className="sim-degerler">
        <Deger ad="Toplam (+) yük" deger={`+${nk * kat.yuk}`} />
        <Deger ad="Toplam (−) yük" deger={`−${na * Math.abs(an.yuk)}`} />
        <Deger ad="Formül" deger={formul} vurgu />
        <Deger ad="Adı" deger={ad} />
      </div>
    </>
  )
}

function Molekuler() {
  const [b1, setB1] = useState(0)
  const [b2, setB2] = useState(0)
  const [n1, setN1] = useState(1)
  const [n2, setN2] = useState(2)
  const e1 = AMETAL[b1]
  const e2 = IKINCI[b2]
  const formul = `${e1.s}${alt(n1)}${e2.s}${alt(n2)}`
  const on2 = ONEK[n2]
  const ikinciAd = on2 === 'mono' && e2.ad === 'oksit' ? 'monoksit' : on2 + e2.ad
  const ad = `${n1 > 1 ? ONEK[n1] : ''}${e1.ad} ${ikinciAd}`
  return (
    <>
      <Gorev>İki ametal ve atom sayılarını seç. Yunanca sayı ön eklerini kullanarak bileşiğin adını oluştur. İlk elementte "mono" neden kullanılmaz?</Gorev>
      <div className="sim-secim">
        <label>1. element
          <select value={b1} onChange={e => setB1(Number(e.target.value))}>{AMETAL.map((x, i) => <option key={i} value={i}>{x.s} · {x.ad}</option>)}</select>
        </label>
        <label>Sayısı
          <select value={n1} onChange={e => setN1(Number(e.target.value))}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}</select>
        </label>
        <label>2. element
          <select value={b2} onChange={e => setB2(Number(e.target.value))}>{IKINCI.map((x, i) => <option key={i} value={i}>{x.s} · {x.ad}</option>)}</select>
        </label>
        <label>Sayısı
          <select value={n2} onChange={e => setN2(Number(e.target.value))}>{[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}</select>
        </label>
      </div>
      <div className="sim-degerler">
        <Deger ad="Formül" deger={formul} vurgu />
        <Deger ad="Adı" deger={ad} vurgu />
      </div>
      <p className="sim-sabit">Ön ekler: 1 mono, 2 di, 3 tri, 4 tetra, 5 penta, 6 hekza, 7 hepta. Bazı seçimler gerçekte var olmayan bileşiklere karşılık gelebilir; kural alıştırması içindir.</p>
    </>
  )
}

export default function IyonSim({ modlar }: { modlar?: string[] }) {
  const mevcut = modlar?.length ? modlar : ['iyonik', 'molekuler']
  const [mod, setMod] = useState(mevcut[0])
  return (
    <div className="sim">
      {mevcut.length > 1 && <Secenekler secenekler={mevcut.map(m => ({ id: m, ad: m === 'iyonik' ? 'İyonik bileşik kur' : 'Moleküler bileşik adlandır' }))} secili={mod} onSec={setMod} />}
      {mod === 'iyonik' ? <Iyonik /> : <Molekuler />}
      <Not>İyonik bileşiklerde sayı ön eki kullanılmaz; birden fazla yük alabilen metallerin yükü Roma rakamıyla belirtilir. Çok atomlu iyonlar birden fazla gerekiyorsa paranteze alınır.</Not>
    </div>
  )
}
