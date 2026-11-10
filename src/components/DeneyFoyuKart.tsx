import { useState } from 'react'
import type { DeneyFoyu } from '../data/content'

// MEB ders kitaplarındaki deney biçiminde laboratuvar föyü:
// amaç, malzemeler, güvenlik, işlem basamakları (işaretlenebilir), gözlem tablosu, değerlendirme.
export default function DeneyFoyuKart({ foy, no }: { foy: DeneyFoyu; no: number }) {
  const [yapilan, setYapilan] = useState<Set<number>>(new Set())
  const [acik, setAcik] = useState<Set<number>>(new Set())

  const degistir = (kume: Set<number>, i: number) => {
    const yeni = new Set(kume)
    if (yeni.has(i)) yeni.delete(i)
    else yeni.add(i)
    return yeni
  }

  return (
    <article className="foy">
      <header className="foy-bas">
        <span className="badge">Laboratuvar deneyi {no}</span>
        {foy.sure && <small>⏱ {foy.sure}</small>}
      </header>
      <h3 className="foy-ad">{foy.ad}</h3>
      <dl className="foy-bilgi">
        <dt>Deneyin amacı</dt>
        <dd>{foy.amac}</dd>
        <dt>Malzemeler</dt>
        <dd>{foy.malzemeler.join(', ')}</dd>
      </dl>
      {foy.guvenlik.length > 0 && (
        <div className="foy-guvenlik" role="note">
          <b>⚠️ Güvenlik</b>
          <ul>{foy.guvenlik.map(g => <li key={g}>{g}</li>)}</ul>
        </div>
      )}
      <h4>İşlem basamakları</h4>
      <ol className="foy-adimlar">
        {foy.adimlar.map((a, i) => (
          <li key={i} className={yapilan.has(i) ? 'is-yapildi' : ''}>
            <button type="button" aria-pressed={yapilan.has(i)} onClick={() => setYapilan(k => degistir(k, i))}>
              <span className="foy-kutu" aria-hidden="true">{yapilan.has(i) ? '✓' : i + 1}</span>
              <span>{a}</span>
            </button>
          </li>
        ))}
      </ol>
      {foy.tablo && (
        <>
          <h4>Gözlem tablosu</h4>
          <div className="table-wrap">
            <table className="foy-tablo">
              <thead><tr>{foy.tablo.basliklar.map(b => <th key={b}>{b}</th>)}</tr></thead>
              <tbody>
                {foy.tablo.satirlar.map((satir, r) => (
                  <tr key={r}>
                    {satir.map((hucre, c) => (
                      <td key={c}>{hucre ? hucre : <input aria-label={`${foy.tablo!.basliklar[c]} ${r + 1}`} placeholder="…" />}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <h4>Değerlendirme</h4>
      <ol className="foy-sorular">
        {foy.sorular.map((q, i) => (
          <li key={i}>
            <p>{q.s}</p>
            <textarea rows={2} placeholder="Cevabını yaz" aria-label={`${i + 1}. soru cevabı`} />
            <button type="button" className="link-button" onClick={() => setAcik(k => degistir(k, i))}>
              {acik.has(i) ? 'Örnek cevabı gizle' : 'Örnek cevabı göster'}
            </button>
            {acik.has(i) && <p className="foy-cevap">{q.c}</p>}
          </li>
        ))}
      </ol>
      {foy.ipucu && <p className="sim-not">💡 {foy.ipucu}</p>}
    </article>
  )
}
