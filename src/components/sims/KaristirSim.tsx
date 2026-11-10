import { useState } from 'react'
import { beher, daire, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not } from './ortak'

// Sanal laboratuvar: iki maddeyi karıştır, değişimi gözle (çökelek, gaz, renk, ısı),
// sonra tepkime türünü ve denklemi gör.

type Madde = { id: string; ad: string; renk: string; kati?: boolean }
const MADDELER: Madde[] = [
  { id: 'AgNO3', ad: 'Gümüş nitrat çözeltisi (AgNO₃)', renk: 'rgba(220,230,245,.5)' },
  { id: 'NaCl', ad: 'Sodyum klorür çözeltisi (NaCl)', renk: 'rgba(220,230,245,.5)' },
  { id: 'PbNO3', ad: 'Kurşun(II) nitrat çözeltisi (Pb(NO₃)₂)', renk: 'rgba(220,230,245,.5)' },
  { id: 'KI', ad: 'Potasyum iyodür çözeltisi (KI)', renk: 'rgba(220,230,245,.5)' },
  { id: 'CuSO4', ad: 'Bakır(II) sülfat çözeltisi (CuSO₄)', renk: 'rgba(60,140,230,.55)' },
  { id: 'NaOH', ad: 'Sodyum hidroksit çözeltisi (NaOH)', renk: 'rgba(220,230,245,.5)' },
  { id: 'HCl', ad: 'Hidroklorik asit (HCl)', renk: 'rgba(220,230,245,.5)' },
  { id: 'CaCO3', ad: 'Mermer parçaları (CaCO₃)', renk: '#e8e6e0', kati: true },
  { id: 'Zn', ad: 'Çinko granül (Zn)', renk: '#9aa0a6', kati: true },
  { id: 'Mg', ad: 'Magnezyum şerit (Mg)', renk: '#c8ccd0', kati: true },
  { id: 'KNO3', ad: 'Potasyum nitrat çözeltisi (KNO₃)', renk: 'rgba(220,230,245,.5)' },
  { id: 'seker', ad: 'Toz şeker (C₁₂H₂₂O₁₁)', renk: '#ffffff', kati: true },
  { id: 'su', ad: 'Saf su (H₂O)', renk: 'rgba(200,225,250,.45)' },
]

type Sonuc = {
  gozlem: string
  tur: string
  denklem: string
  cokelek?: string
  gaz?: boolean
  dT?: number
  sonRenk?: string
  kaplama?: string
  kimyasal: boolean
}

const SONUCLAR: Record<string, Sonuc> = {
  'AgNO3+NaCl': { gozlem: 'Beyaz çökelek oluştu.', tur: 'Çökelme tepkimesi', denklem: 'AgNO₃(suda) + NaCl(suda) → AgCl(k) + NaNO₃(suda)', cokelek: '#ffffff', kimyasal: true },
  'KI+PbNO3': { gozlem: 'Sarı renkli çökelek oluştu.', tur: 'Çökelme tepkimesi', denklem: 'Pb(NO₃)₂(suda) + 2KI(suda) → PbI₂(k) + 2KNO₃(suda)', cokelek: '#f5d020', kimyasal: true },
  'CuSO4+NaOH': { gozlem: 'Açık mavi, jelatinimsi çökelek oluştu; çözeltinin mavisi açıldı.', tur: 'Çökelme tepkimesi', denklem: 'CuSO₄(suda) + 2NaOH(suda) → Cu(OH)₂(k) + Na₂SO₄(suda)', cokelek: '#7fb6ef', sonRenk: 'rgba(170,200,240,.45)', kimyasal: true },
  'HCl+NaOH': { gozlem: 'Gözle görülür bir değişim yok ama karışım ısındı.', tur: 'Asit–baz (nötralleşme) tepkimesi', denklem: 'HCl(suda) + NaOH(suda) → NaCl(suda) + H₂O(s)', dT: 6, kimyasal: true },
  'CaCO3+HCl': { gozlem: 'Mermerin yüzeyinden gaz kabarcıkları çıktı (köpürme).', tur: 'Asit–karbonat tepkimesi (gaz çıkışı)', denklem: 'CaCO₃(k) + 2HCl(suda) → CaCl₂(suda) + H₂O(s) + CO₂(g)', gaz: true, kimyasal: true },
  'CuSO4+Zn': { gozlem: 'Çinkonun yüzeyi kızıl-kahverengi bakırla kaplandı, mavi renk zamanla açıldı, kap biraz ısındı.', tur: 'İndirgenme–yükseltgenme tepkimesi', denklem: 'Zn(k) + CuSO₄(suda) → ZnSO₄(suda) + Cu(k)', kaplama: '#b5651d', sonRenk: 'rgba(170,210,245,.35)', dT: 3, kimyasal: true },
  'HCl+Mg': { gozlem: 'Magnezyum hızla gaz çıkararak küçüldü, kap ısındı.', tur: 'İndirgenme–yükseltgenme tepkimesi', denklem: 'Mg(k) + 2HCl(suda) → MgCl₂(suda) + H₂(g)', gaz: true, dT: 8, kimyasal: true },
  'HCl+Zn': { gozlem: 'Çinkonun yüzeyinden yavaş yavaş gaz kabarcıkları çıktı.', tur: 'İndirgenme–yükseltgenme tepkimesi', denklem: 'Zn(k) + 2HCl(suda) → ZnCl₂(suda) + H₂(g)', gaz: true, dT: 2, kimyasal: true },
  'seker+su': { gozlem: 'Şeker çözündü, görünmez oldu. Yeni madde oluşmadı.', tur: 'Fiziksel değişim (çözünme)', denklem: 'C₁₂H₂₂O₁₁(k) → C₁₂H₂₂O₁₁(suda)', kimyasal: false },
  'KNO3+NaCl': { gozlem: 'Hiçbir değişim gözlenmedi; çökelek, gaz ya da renk değişimi yok.', tur: 'Tepkime yok (iyonlar çözeltide kalır)', denklem: 'Na⁺, Cl⁻, K⁺ ve NO₃⁻ iyonları çözeltide serbest kalır.', kimyasal: false },
}

function anahtar(a: string, b: string) {
  return [a, b].sort().join('+')
}

export default function KaristirSim() {
  const [a, setA] = useState('AgNO3')
  const [b, setB] = useState('NaCl')
  const [karisti, setKaristi] = useState<number | null>(null) // karıştırma anı
  const sonuc = SONUCLAR[anahtar(a, b)] ?? {
    gozlem: 'Gözle görülür bir değişim olmadı.',
    tur: 'Belirgin bir tepkime gözlenmedi',
    denklem: '—',
    kimyasal: false,
  }
  const ma = MADDELER.find(m => m.id === a)!
  const mb = MADDELER.find(m => m.id === b)!

  const canvas = useAnimasyon((ctx, W, H) => {
    const t = karisti === null ? 0 : (performance.now() - karisti) / 1000
    const bx = W / 2 - 70
    const bw = 140
    const by = 30
    const bh = H - 44
    const sivi = karisti === null ? (ma.kati ? 0 : 0.45) : 0.65
    let renk = ma.kati ? 'rgba(220,230,245,.4)' : ma.renk
    if (karisti !== null) renk = sonuc.sonRenk && t > 2 ? sonuc.sonRenk : !ma.kati ? ma.renk : mb.renk
    beher(ctx, bx, by, bw, bh, Math.max(sivi, 0.08), renk)
    // katı madde
    const kati = ma.kati ? ma : mb.kati && karisti !== null ? mb : null
    if (kati && !(kati.id === 'seker' && karisti !== null && t > 2)) {
      const kucul = kati.id === 'Mg' && karisti !== null ? Math.max(0.15, 1 - t / 8) : 1
      for (let i = 0; i < 5; i++) {
        const x = bx + 26 + i * 22
        const y = by + bh - 12
        daire(ctx, x, y, 8 * kucul, kati.renk)
        if (sonuc.kaplama && karisti !== null) daire(ctx, x, y, 8 * Math.min(1, t / 3), sonuc.kaplama)
      }
    }
    if (karisti !== null) {
      // gaz kabarcıkları
      if (sonuc.gaz && t < 10) {
        for (let i = 0; i < 18; i++) {
          const x = bx + 20 + ((i * 37) % (bw - 40))
          const yol = (t * 50 + i * 23) % (bh * 0.6)
          daire(ctx, x + Math.sin(t * 4 + i) * 3, by + bh - 14 - yol, 2.5 + (i % 3), 'rgba(255,255,255,.9)')
        }
      }
      // çökelek
      if (sonuc.cokelek) {
        const oran = Math.min(1, t / 2.5)
        for (let i = 0; i < 60 * oran; i++) {
          const x = bx + 8 + ((i * 53) % (bw - 16))
          const yHedef = by + bh - 6 - (i % 4) * 3
          const y = by + bh * 0.4 + (yHedef - by - bh * 0.4) * Math.min(1, t / 3 + (i % 5) * 0.05)
          daire(ctx, x, y, 3, '#9a988f')
          daire(ctx, x, y, 2.4, sonuc.cokelek)
        }
      }
    } else if (!mb.kati) {
      // dökülecek ikinci madde
      ctx.save()
      ctx.translate(W / 2 + 70, 30)
      ctx.rotate(-0.6)
      beher(ctx, -20, -10, 40, 50, 0.6, mb.renk)
      ctx.restore()
    }
    // termometre
    const T = 22 + (karisti === null ? 0 : (sonuc.dT ?? 0) * Math.min(1, t / 3))
    yazi(ctx, `${T.toFixed(1).replace('.', ',')} °C`, bx + bw + 40, by + 20, { boyut: 13, kalin: true })
    yazi(ctx, '🌡️', bx + bw + 40, by + 44, { boyut: 18 })
  })

  return (
    <div className="sim">
      <Gorev>İki madde seç ve karıştır. Kimyasal değişimin göstergelerinden (çökelek, gaz, renk, ısı) hangisini gözlüyorsun? Değişim fiziksel mi kimyasal mı?</Gorev>
      <div className="sim-secim">
        <label>1. madde
          <select value={a} onChange={e => { setA(e.target.value); setKaristi(null) }}>
            {MADDELER.map(m => <option key={m.id} value={m.id}>{m.ad}</option>)}
          </select>
        </label>
        <label>2. madde
          <select value={b} onChange={e => { setB(e.target.value); setKaristi(null) }}>
            {MADDELER.filter(m => m.id !== a).map(m => <option key={m.id} value={m.id}>{m.ad}</option>)}
          </select>
        </label>
      </div>
      <canvas ref={canvas} className="sim-canvas" aria-label="Beherde karıştırma animasyonu" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setKaristi(performance.now())}>Karıştır</button>
        <button type="button" className="btn-secondary" onClick={() => setKaristi(null)}>Beheri temizle</button>
      </div>
      {karisti !== null && (
        <div className="sim-sonuc">
          <p><b>Gözlem:</b> {sonuc.gozlem}</p>
          <p><b>Değişim:</b> {sonuc.kimyasal ? 'Kimyasal' : 'Fiziksel ya da değişim yok'} · {sonuc.tur}</p>
          <p><b>Denklem:</b> {sonuc.denklem}</p>
        </div>
      )}
      <div className="sim-degerler">
        <Deger ad="Çökelek" deger={karisti !== null && sonuc.cokelek ? 'Var' : '—'} />
        <Deger ad="Gaz çıkışı" deger={karisti !== null && sonuc.gaz ? 'Var' : '—'} />
        <Deger ad="Isı" deger={karisti !== null && sonuc.dT ? 'Açığa çıktı' : '—'} />
      </div>
      <Not>Gerçek laboratuvarda bu maddelerin bir kısmı zehirli ya da aşındırıcıdır; yalnızca öğretmen gözetiminde, koruyucu donanımla çalışılır.</Not>
    </div>
  )
}
