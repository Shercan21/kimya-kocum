import { useState } from 'react'
import { DENEY_GOREVLERI } from '../data/deneyGorevleri'

// Sanal deney sonrası "Ne buldun?" kontrolü. Sonuç cihazda saklanır.
const KEY = 'kimya-kocum-deney-kontrol'

function oku(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Record<string, number>
  } catch {
    return {}
  }
}

export default function DeneyKontrol({ tur, anahtar }: { tur: string; anahtar: string }) {
  const sorular = DENEY_GOREVLERI[tur]
  const [cevap, setCevap] = useState<(number | null)[]>(() => (sorular ?? []).map(() => null))
  const [onceki, setOnceki] = useState<number | undefined>(() => oku()[anahtar])
  if (!sorular?.length) return null
  const bitti = cevap.every(c => c !== null)
  const dogru = cevap.filter((c, i) => c === sorular[i][2]).length

  function sec(i: number, j: number) {
    if (cevap[i] !== null) return
    const yeni = cevap.map((c, k) => (k === i ? j : c))
    setCevap(yeni)
    if (yeni.every(c => c !== null)) {
      const puan = yeni.filter((c, k) => c === sorular[k][2]).length
      try {
        const kayit = oku()
        kayit[anahtar] = Math.max(kayit[anahtar] ?? 0, puan)
        localStorage.setItem(KEY, JSON.stringify(kayit))
        setOnceki(kayit[anahtar])
      } catch { /* depolama kapalıysa yalnızca ekranda göster */ }
    }
  }

  return (
    <div className="deney-kontrol">
      <h4>🔎 Ne buldun? {onceki !== undefined && <small className="badge">En iyi: {onceki}/{sorular.length}</small>}</h4>
      {sorular.map(([s, secenekler, d, aciklama], i) => (
        <div key={i} className="dk-soru">
          <p>{i + 1}. {s}</p>
          <div className="dk-secenekler">
            {secenekler.map((x, j) => {
              const secildi = cevap[i] === j
              const sinif = cevap[i] === null ? '' : j === d ? 'is-dogru' : secildi ? 'is-yanlis' : 'is-pasif'
              return (
                <button key={j} type="button" className={`dk-secenek ${sinif}`} onClick={() => sec(i, j)} disabled={cevap[i] !== null && !secildi && j !== d}>
                  {x}
                </button>
              )
            })}
          </div>
          {cevap[i] !== null && <p className="dk-aciklama">{cevap[i] === d ? '✓ Doğru. ' : '✗ '}{aciklama}</p>}
        </div>
      ))}
      {bitti && (
        <p className="dk-sonuc">
          {dogru}/{sorular.length} doğru. {dogru === sorular.length ? 'Harika, deneyi tam anladın! 🎉' : 'Deneyi tekrar inceleyip yeniden deneyebilirsin.'}{' '}
          <button type="button" className="link-button" onClick={() => setCevap(sorular.map(() => null))}>Yeniden dene</button>
        </p>
      )}
    </div>
  )
}
