import { useState } from 'react'
import Icon from './Icon'
import TestRunner from './TestRunner'
import { sinifMufredati } from '../data/content'
import { basari, testSonuclari } from '../data/results'

type Props = { grade: number | null }

type Active = { id: string; baslik: string }

export default function ExamsPage({ grade }: Props) {
  const data = sinifMufredati(grade)
  const [active, setActive] = useState<Active | null>(null)
  const [, refresh] = useState(0)

  if (grade !== null && active) {
    return (
      <TestRunner
        grade={grade}
        testId={active.id}
        testIndex={0}
        konuKod={null}
        konuBaslik={null}
        baslik={active.baslik}
        onClose={() => {
          setActive(null)
          refresh(value => value + 1)
        }}
      />
    )
  }

  const score = (id: string) => {
    if (grade === null) return null
    const results = testSonuclari(grade, id, null)
    const last = results[results.length - 1]
    return last ? basari(last) : null
  }

  const row = (id: string, baslik: string, alt: string) => {
    const last = score(id)
    return (
      <li key={id}>
        <span className="test-title">
          {baslik}
          <small>{alt}{last !== null ? ` · Son sonuç: %${last}` : ''}</small>
        </span>
        <button
          type="button"
          className={last === null ? 'primary-button' : 'btn-secondary'}
          onClick={() => setActive({ id, baslik })}
        >
          {last === null ? 'Başla' : 'Tekrar çöz'}
        </button>
      </li>
    )
  }

  return (
    <div className="stack">
      {!data && (
        <section className="card coming">
          <Icon name="file" size={28} />
          <h2>{grade ? `${grade}. sınıf testleri hazırlanıyor` : 'Önce sınıfını seç'}</h2>
          <p>Şu an 9, 10 ve 11. sınıfların sarmal ve karma testleri hazır.</p>
        </section>
      )}

      {data && (
        <>
          <section className="card">
            <h3 className="card-title"><Icon name="repeat" /> Sarmal testler</h3>
            <p className="muted small">Bir bölümün bütün konularını birlikte tekrar eder.</p>
            <ul className="test-list">
              {data.temalar.flatMap(tema =>
                tema.bolumler.flatMap(bolum =>
                  bolum.sarmal.map(test => row(test.id, `${bolum.kod} ${bolum.ad}`, `${tema.no}. tema · ${test.soru} soru`))
                )
              )}
            </ul>
          </section>

          <section className="card">
            <h3 className="card-title"><Icon name="list" /> Karma testler</h3>
            <p className="muted small">Bütün kazanımlardan karışık sorular. Deneme gibi çöz.</p>
            <ul className="test-list">
              {data.karma.map((test, index) => row(test.id, `Karma test ${index + 1}`, `${test.soru} soru`))}
            </ul>
          </section>
        </>
      )}

      <section className="card coming">
        <Icon name="file" size={28} />
        <h2>Yazılıya hazırlık</h2>
        <p>
          Senaryoya uygun yazılı provası ve açık uçlu cevap değerlendirmesi bu
          bölüme gelecek.
        </p>
        <span className="badge">Hazırlanıyor</span>
      </section>
    </div>
  )
}
