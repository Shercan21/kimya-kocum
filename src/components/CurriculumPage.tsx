import { useState } from 'react'
import Icon from './Icon'
import { konuId, sinifMufredati } from '../data/content'
import { getTopicProgress } from '../data/learningProgress'

type Props = {
  grade: number
  onOpenTopic: (kod: string) => void
}

const STATUS_LABEL = {
  not_started: '',
  studied: 'Çalışıldı',
  learned: 'Öğrenildi',
  permanent: 'Kalıcı',
} as const

export default function CurriculumPage({ grade, onOpenTopic }: Props) {
  const data = sinifMufredati(grade)
  const [openTema, setOpenTema] = useState<number | null>(null)

  if (!data) return null

  return (
    <div className="stack">
      {data.temalar.map(tema => {
        const konular = tema.bolumler.flatMap(bolum => bolum.konular)
        const done = konular.filter(konu => {
          const status = getTopicProgress(grade, konuId(grade, konu.kod))?.status
          return status === 'learned' || status === 'permanent'
        }).length
        const isOpen = openTema === null ? tema.no === data.temalar[0].no : openTema === tema.no

        return (
          <section key={tema.no} className="card tema-card">
            <button
              type="button"
              className="tema-head"
              onClick={() => setOpenTema(isOpen ? -1 : tema.no)}
              aria-expanded={isOpen}
            >
              <span className="tema-no">{tema.no}</span>
              <span className="tema-title">
                <small>{tema.no}. tema</small>
                {tema.ad}
              </span>
              <span className="tema-progress">
                {done}/{konular.length} konu
                <span className="mini-bar"><span style={{ width: `${(done / konular.length) * 100}%` }} /></span>
              </span>
              <Icon name="chevron" size={18} />
            </button>

            {isOpen &&
              tema.bolumler.map(bolum => (
                <div key={bolum.kod} className="bolum">
                  <h3>
                    <span>{bolum.kod}</span> {bolum.ad}
                  </h3>
                  <p className="muted small">{bolum.ozet}</p>
                  <ul className="konu-list">
                    {bolum.konular.map(konu => {
                      const status = getTopicProgress(grade, konuId(grade, konu.kod))?.status ?? 'not_started'
                      return (
                        <li key={konu.kod}>
                          <button type="button" onClick={() => onOpenTopic(konu.kod)}>
                            <span className={`dot status-dot-${status}`} />
                            <span className="konu-kod">{konu.kod}</span>
                            <span className="konu-ad">
                              {konu.ad}
                              <small>
                                {konu.anlatim ? 'Anlatım · ' : ''}
                                {konu.soru + konu.baglam.reduce((sum, test) => sum + test.soru, 0)} soru
                                {konu.etkinlik ? ` · ${konu.etkinlik} etkinlik` : ''}
                              </small>
                            </span>
                            {STATUS_LABEL[status] && (
                              <span className={`status-chip status-${status}`}>{STATUS_LABEL[status]}</span>
                            )}
                            <span className="chev">›</span>
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
}
