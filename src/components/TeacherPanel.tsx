import { useEffect, useMemo, useState } from 'react'
import Icon from './Icon'
import { ogrencileriGetir, type OgrenciOzeti } from '../data/cloud'

type Sirala = 'ad' | 'son' | 'ogrenilen' | 'basari'

function tarih(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export default function TeacherPanel({ onClose }: { onClose: () => void }) {
  const [liste, setListe] = useState<OgrenciOzeti[] | null>(null)
  const [hata, setHata] = useState('')
  const [sinif, setSinif] = useState<number | 'hepsi'>('hepsi')
  const [sirala, setSirala] = useState<Sirala>('son')

  useEffect(() => {
    let iptal = false
    ogrencileriGetir()
      .then(data => !iptal && setListe(data))
      .catch(() => !iptal && setHata('Öğrenci listesi alınamadı. İnternet bağlantını kontrol et.'))
    return () => {
      iptal = true
    }
  }, [])

  const gorunen = useMemo(() => {
    const items = (liste ?? []).filter(o => sinif === 'hepsi' || o.ozet?.grade === sinif)
    const by: Record<Sirala, (a: OgrenciOzeti, b: OgrenciOzeti) => number> = {
      ad: (a, b) => a.ad.localeCompare(b.ad, 'tr'),
      son: (a, b) => (b.guncellendi ?? '').localeCompare(a.guncellendi ?? ''),
      ogrenilen: (a, b) => (b.ozet?.ogrenilen ?? 0) - (a.ozet?.ogrenilen ?? 0),
      basari: (a, b) => (b.ozet?.basari ?? -1) - (a.ozet?.basari ?? -1),
    }
    return [...items].sort(by[sirala])
  }, [liste, sinif, sirala])

  return (
    <section className="card teacher-panel">
      <div className="teacher-head">
        <h2>
          <Icon name="users" />
          Öğrencilerim
        </h2>
        <button type="button" className="btn-ghost" onClick={onClose}>Kapat</button>
      </div>
      <p className="muted small">
        Google ile giriş yapmış öğrenciler burada görünür. Bilgiler öğrenci uygulamayı açtığında güncellenir.
      </p>

      <div className="chip-row">
        {(['hepsi', 9, 10, 11, 12] as const).map(g => (
          <button
            key={g}
            type="button"
            className={sinif === g ? 'chip is-active' : 'chip'}
            onClick={() => setSinif(g)}
          >
            {g === 'hepsi' ? 'Hepsi' : `${g}. sınıf`}
          </button>
        ))}
      </div>

      {hata && <p className="form-error">{hata}</p>}
      {!liste && !hata && <p className="muted">Yükleniyor…</p>}
      {liste && gorunen.length === 0 && <p className="muted">Bu grupta henüz giriş yapan öğrenci yok.</p>}

      {gorunen.length > 0 && (
        <div className="teacher-table-wrap">
          <table className="teacher-table">
            <thead>
              <tr>
                <th><button type="button" onClick={() => setSirala('ad')}>Öğrenci</button></th>
                <th>Sınıf</th>
                <th><button type="button" onClick={() => setSirala('ogrenilen')}>Öğrenilen</button></th>
                <th>Test</th>
                <th><button type="button" onClick={() => setSirala('basari')}>Başarı</button></th>
                <th>Açık hata</th>
                <th><button type="button" onClick={() => setSirala('son')}>Son giriş</button></th>
              </tr>
            </thead>
            <tbody>
              {gorunen.map(o => (
                <tr key={o.uid}>
                  <td>
                    <b>{o.ad || 'İsimsiz'}</b>
                    <small>{o.eposta}</small>
                  </td>
                  <td>{o.ozet?.grade ?? '—'}</td>
                  <td>
                    {o.ozet?.ogrenilen ?? 0}
                    {o.ozet?.kalici ? <small>{o.ozet.kalici} kalıcı</small> : null}
                  </td>
                  <td>{o.ozet?.test ?? 0}</td>
                  <td>{o.ozet?.basari == null ? '—' : `%${o.ozet.basari}`}</td>
                  <td>{o.ozet?.hata ?? 0}</td>
                  <td>{tarih(o.guncellendi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
