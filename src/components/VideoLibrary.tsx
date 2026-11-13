import { useEffect, useState } from 'react'
import Icon from './Icon'
import { dersVideolari, sinifMufredati, sureYazi, type DersVideosu } from '../data/content'
import './video.css'

type Props = {
  grades: number[]
  // Derslerim'deki kilitlerin aynısı: kilitli konunun videosu da kilitli kalır.
  locked?: Set<string>
  lockReason?: string
  onOpen: (grade: number, kod: string) => void
  onBack: () => void
}

// Videolu anlatım listesi: konular müfredat sırasıyla; videosu yüklenmiş ve
// kilidi açık olanlar izlenir, kilitliler kilitli, henüz yüklenmeyenler "Yakında".
export default function VideoLibrary({ grades, locked, lockReason = 'Önceki konuyu tamamlayınca açılır', onOpen, onBack }: Props) {
  const [videolar, setVideolar] = useState<Record<number, Record<string, DersVideosu>> | null>(null)
  const [openTema, setOpenTema] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all(grades.map(g => dersVideolari(g).then(v => [g, v] as const))).then(list => {
      if (active) setVideolar(Object.fromEntries(list))
    })
    return () => {
      active = false
    }
  }, [grades.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const toplam = grades.reduce((n, g) => n + (sinifMufredati(g)?.temalar.flatMap(t => t.bolumler.flatMap(b => b.konular)).length ?? 0), 0)
  const hazir = videolar ? grades.reduce((n, g) => n + Object.keys(videolar[g] ?? {}).filter(kod => sinifMufredati(g)?.temalar.some(t => t.bolumler.some(b => b.konular.some(k => k.kod === kod)))).length, 0) : 0

  return (
    <div className="stack">
      <section className="card">
        <button type="button" className="back-link" onClick={onBack}>‹ Derslerim</button>
        <div className="video-lib-head">
          <h2 style={{ margin: 0 }}><Icon name="play" /> Videolu anlatım</h2>
          {videolar && <span className="video-badge ready">{hazir} / {toplam} konu videolu</span>}
        </div>
        <p className="muted small">
          Kilidi açık konuların videolarını izleyebilirsin. Kilitli konular, Derslerim'deki sırayla açılır. Yeni videolar eklendikçe burada görünür.
        </p>
      </section>

      {!videolar && <p className="muted">Yükleniyor…</p>}

      {videolar && grades.map(grade => {
        const data = sinifMufredati(grade)
        if (!data) return null
        const ilk = data.temalar[0]?.no
        return (
          <div key={grade} className="stack">
            {grades.length > 1 && <h2 className="section-title">{grade}. sınıf</h2>}
            {data.temalar.map(tema => {
              const key = `${grade}|${tema.no}`
              const isOpen = openTema === null ? tema.no === ilk && grade === grades[0] : openTema === key
              const konular = tema.bolumler.flatMap(b => b.konular)
              const temaHazir = konular.filter(k => videolar[grade]?.[k.kod]).length
              return (
                <section key={key} className="card tema-card">
                  <button type="button" className="tema-head" onClick={() => setOpenTema(isOpen ? '-' : key)} aria-expanded={isOpen}>
                    <span className="tema-no">{tema.no}</span>
                    <span className="tema-title">
                      <small>{tema.no}. tema</small>
                      {tema.ad}
                    </span>
                    <span className="tema-progress">{temaHazir}/{konular.length} video</span>
                    <Icon name="chevron" size={18} />
                  </button>
                  {isOpen && tema.bolumler.map(bolum => (
                    <div key={bolum.kod} className="bolum">
                      <h3><span>{bolum.kod}</span> {bolum.ad}</h3>
                      <ul className="konu-list">
                        {bolum.konular.map(konu => {
                          const video = videolar[grade]?.[konu.kod]
                          const kilitli = locked?.has(`${grade}|${konu.kod}`) ?? false
                          const acik = !!video && !kilitli
                          return (
                            <li key={konu.kod} className={kilitli ? 'is-locked' : undefined}>
                              <button
                                type="button"
                                disabled={!acik}
                                title={kilitli ? lockReason : !video ? 'Video yakında' : undefined}
                                onClick={() => onOpen(grade, konu.kod)}
                              >
                                <span className="konu-kod">{konu.kod}</span>
                                <span className="konu-ad">
                                  {konu.ad}
                                  <small>
                                    {video ? `${sureYazi(video.sure)} · ` : ''}
                                    {video?.sorular?.length ? `${video.sorular.length} soru durağı · ` : ''}
                                    {kilitli ? lockReason : video ? 'İzlemek için dokun' : 'Video hazırlanıyor'}
                                  </small>
                                </span>
                                {!kilitli && !video && <span className="video-badge soon">Yakında</span>}
                                {kilitli ? <Icon name="lock" size={16} /> : video ? <Icon name="play" size={16} /> : null}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </section>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
