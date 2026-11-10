import { useState } from 'react'
import { ELEMENTLER, type Element } from './elementler'
import { Deger, Gorev, Grafik, Not, Secenekler } from './ortak'

// Periyodik özellikler: atom yarıçapı, iyonlaşma enerjisi, elektronegatiflik (Z = 1–36)
// ısı haritası ve Z'ye karşı grafik; ardışık iyonlaşma enerjileri.

type Ozellik = 'r' | 'ie' | 'en' | 'ardisik'
const AD: Record<Ozellik, string> = { r: 'Atom yarıçapı', ie: '1. iyonlaşma enerjisi', en: 'Elektronegatiflik', ardisik: 'Ardışık iyonlaşma' }
const BIRIM: Record<string, string> = { r: 'pm', ie: 'kJ/mol', en: '' }
const ARDISIK: Record<string, number[]> = {
  Na: [496, 4562, 6910, 9543],
  Mg: [738, 1451, 7733, 10543],
  Al: [578, 1817, 2745, 11577],
  Si: [787, 1577, 3232, 4356],
}

function deger(e: Element, o: 'r' | 'ie' | 'en') {
  return o === 'en' ? e.en : e[o]
}

export default function PeriyodikSim({ modlar }: { modlar?: string[] }) {
  const mevcut = (modlar?.length ? modlar : ['r', 'ie', 'en', 'ardisik']) as Ozellik[]
  const [oz, setOz] = useState<Ozellik>(mevcut[0])
  const [secili, setSecili] = useState(11)
  const [ardisikEl, setArdisikEl] = useState('Mg')
  const o = oz === 'ardisik' ? 'ie' : oz
  const degerler = ELEMENTLER.map(e => deger(e, o)).filter((v): v is number => v !== null)
  const min = Math.min(...degerler)
  const max = Math.max(...degerler)
  const renk = (v: number | null) => {
    if (v === null) return '#f1efe8'
    const f = (v - min) / (max - min)
    return `hsl(${250 - f * 230}, 70%, ${88 - f * 38}%)`
  }
  const el = ELEMENTLER[secili - 1]

  return (
    <div className="sim">
      {mevcut.length > 1 && <Secenekler secenekler={mevcut.map(m => ({ id: m, ad: AD[m] }))} secili={oz} onSec={setOz} etiket="Özellik" />}
      {oz !== 'ardisik' ? (
        <>
          <Gorev>Tabloda renklerin değişimini incele: {AD[oz].toLocaleLowerCase('tr-TR')} bir periyotta soldan sağa ve bir grupta yukarıdan aşağıya nasıl değişiyor? Bir elemente dokunarak değerini gör.</Gorev>
          <div className="pt-mini" role="grid" aria-label="Periyodik tablo">
            {ELEMENTLER.map(e => (
              <button
                key={e.z}
                type="button"
                className={e.z === secili ? 'is-secili' : ''}
                style={{ gridColumn: e.sutun, gridRow: e.periyot, background: renk(deger(e, o)) }}
                onClick={() => setSecili(e.z)}
                aria-label={`${e.ad}: ${deger(e, o) ?? 'değer yok'}`}
              >
                <small>{e.z}</small>
                <b>{e.s}</b>
              </button>
            ))}
          </div>
          <div className="sim-degerler">
            <Deger ad="Element" deger={`${el.ad} (${el.s})`} />
            <Deger ad="Konum" deger={`${el.periyot}. periyot, ${el.grup}`} />
            <Deger ad={AD[oz]} deger={deger(el, o) === null ? 'Tanımlı değil' : `${String(deger(el, o)).replace('.', ',')} ${BIRIM[o]}`} vurgu />
          </div>
          <Grafik
            seriler={[{ ad: AD[oz], renk: '#534ab7', noktalar: ELEMENTLER.filter(e => deger(e, o) !== null).map(e => [e.z, deger(e, o) as number]) }]}
            xEtiket="Atom numarası (Z)"
            yEtiket={`${AD[oz]}${BIRIM[o] ? ` (${BIRIM[o]})` : ''}`}
            xMin={1}
            xMax={36}
            yMax={o === 'r' ? 250 : o === 'ie' ? 2500 : 4}
            dikeyCizgi={{ x: secili, etiket: el.s }}
          />
        </>
      ) : (
        <>
          <Gorev>Bir element seç ve ardışık iyonlaşma enerjilerini incele. Hangi elektrondan sonra enerji birden çok büyük artıyor? Bu, elementin grubu hakkında ne söylüyor?</Gorev>
          <Secenekler secenekler={Object.keys(ARDISIK).map(k => ({ id: k, ad: k }))} secili={ardisikEl} onSec={setArdisikEl} etiket="Element" />
          <div className="sim-cubuklar">
            {ARDISIK[ardisikEl].map((v, i) => {
              const sicrama = i > 0 && v / ARDISIK[ardisikEl][i - 1] > 2.5
              return (
                <div key={i} className="sim-cubuk">
                  <span style={{ height: `${(v / 12000) * 100}%` }} className={sicrama ? 'is-sicrama' : ''} />
                  <b>{v}</b>
                  <small>İE{i + 1}</small>
                </div>
              )
            })}
          </div>
          <p className="sim-sabit">Büyük sıçrama, soy gaz düzenine ulaşmış bir iç katmandan elektron koparıldığını gösterir. Sıçramadan önceki elektron sayısı değerlik elektron sayısıdır (A grubu numarası).</p>
        </>
      )}
      <Not>Değerler yaklaşıktır. Soy gazların (He, Ne, Ar) Pauling elektronegatiflik değeri tanımlı değildir; Kr için 3,0 alınmıştır.</Not>
    </div>
  )
}
