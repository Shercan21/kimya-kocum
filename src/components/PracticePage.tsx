import { useState } from 'react'
import { useBackStep } from '../data/backNav'
import Icon from './Icon'
import TestRunner from './TestRunner'
import { sinifMufredati } from '../data/content'
import { basari, testSonuclari } from '../data/results'
import { SINAV_SINIFLARI } from '../data/profile'

// "Soru çözmek istiyorum" akışı:
// (12. sınıf: TYT / AYT → sınıf) → Tema bazlı (sarmal) ya da Genel (karma).
type Props = { grade: number }
type Tur = 'tema' | 'genel'
type Active = { grade: number; id: string; baslik: string }

function Secim<T extends string | number>({
  baslik,
  secenekler,
  deger,
  onSec,
}: {
  baslik: string
  secenekler: { id: T; ad: string; alt?: string }[]
  deger: T | null
  onSec: (id: T) => void
}) {
  return (
    <section className="card">
      <h3 className="card-title">{baslik}</h3>
      <div className="grade-picker" role="group" aria-label={baslik}>
        {secenekler.map(s => (
          <button
            key={String(s.id)}
            type="button"
            className={deger === s.id ? 'chip is-active' : 'chip'}
            aria-pressed={deger === s.id}
            onClick={() => onSec(s.id)}
          >
            {s.ad}
            {s.alt && <small>{s.alt}</small>}
          </button>
        ))}
      </div>
    </section>
  )
}

export default function PracticePage({ grade: profileGrade }: Props) {
  const senior = profileGrade === 12
  const [sinav, setSinav] = useState<'TYT' | 'AYT' | null>(null)
  const [sinif, setSinif] = useState<number | null>(senior ? null : profileGrade)
  const [tur, setTur] = useState<Tur | null>(null)
  const [temaNo, setTemaNo] = useState<number | null>(null)
  const [active, setActive] = useState<Active | null>(null)
  const [, refresh] = useState(0)
  useBackStep(!!active, () => {
    setActive(null)
    refresh(v => v + 1)
  })

  if (active) {
    return (
      <TestRunner
        grade={active.grade}
        testId={active.id}
        testIndex={0}
        konuKod={null}
        konuBaslik={null}
        baslik={active.baslik}
        onClose={() => {
          setActive(null)
          refresh(v => v + 1)
        }}
      />
    )
  }

  const data = sinif ? sinifMufredati(sinif) : null

  const row = (g: number, id: string, baslik: string, alt: string) => {
    const results = testSonuclari(g, id, null)
    const last = results.length ? basari(results[results.length - 1]) : null
    return (
      <li key={`${g}-${id}`}>
        <span className="test-title">
          {baslik}
          <small>{alt}{last !== null ? ` · Son sonuç: %${last}` : ''}</small>
        </span>
        <button
          type="button"
          className={last === null ? 'primary-button' : 'btn-secondary'}
          onClick={() => setActive({ grade: g, id, baslik })}
        >
          {last === null ? 'Başla' : 'Tekrar çöz'}
        </button>
      </li>
    )
  }

  return (
    <div className="stack">
      {senior && (
        <Secim
          baslik="Hangi sınava hazırlanıyorsun?"
          secenekler={[
            { id: 'TYT' as const, ad: 'TYT', alt: '9 ve 10. sınıf' },
            { id: 'AYT' as const, ad: 'AYT', alt: '11. sınıf' },
          ]}
          deger={sinav}
          onSec={id => {
            setSinav(id)
            const list = SINAV_SINIFLARI[id]
            setSinif(list.length === 1 ? list[0] : null)
            setTur(null)
            setTemaNo(null)
          }}
        />
      )}

      {senior && sinav === 'TYT' && (
        <Secim
          baslik="Hangi sınıfın konularından?"
          secenekler={SINAV_SINIFLARI.TYT.map(g => ({ id: g, ad: `${g}. sınıf` }))}
          deger={sinif}
          onSec={g => {
            setSinif(g)
            setTur(null)
            setTemaNo(null)
          }}
        />
      )}

      {sinif && data && (
        <Secim
          baslik="Nasıl çözmek istersin?"
          secenekler={[
            { id: 'tema' as const, ad: 'Tema bazlı', alt: 'Sarmal testler' },
            { id: 'genel' as const, ad: 'Bütün sınıf', alt: 'Karma testler' },
          ]}
          deger={tur}
          onSec={id => {
            setTur(id)
            setTemaNo(null)
          }}
        />
      )}

      {sinif && data && tur === 'tema' && (
        <Secim
          baslik="Tema seç"
          secenekler={data.temalar.map(t => ({ id: t.no, ad: `${t.no}. tema`, alt: t.ad }))}
          deger={temaNo}
          onSec={id => setTemaNo(Number(id))}
        />
      )}

      {sinif && data && tur === 'tema' && temaNo !== null && (
        <section className="card">
          <h3 className="card-title"><Icon name="repeat" /> Sarmal testler</h3>
          <p className="muted small">Her test bir bölümün bütün konularını birlikte tekrar eder.</p>
          <ul className="test-list">
            {data.temalar
              .filter(t => t.no === temaNo)
              .flatMap(t =>
                t.bolumler.flatMap(b => b.sarmal.map(test => row(sinif, test.id, `${b.kod} ${b.ad}`, `${test.soru} soru`)))
              )}
          </ul>
        </section>
      )}

      {sinif && data && tur === 'genel' && (
        <section className="card">
          <h3 className="card-title"><Icon name="list" /> {sinif}. sınıf karma testleri</h3>
          <p className="muted small">Bütün kazanımlardan karışık sorular. Deneme gibi çöz.</p>
          <ul className="test-list">
            {data.karma.map((test, i) => row(sinif, test.id, `Karma test ${i + 1}`, `${test.soru} soru`))}
          </ul>
        </section>
      )}

      {sinif && !data && (
        <section className="card coming">
          <Icon name="file" size={28} />
          <h2>{sinif}. sınıf testleri hazırlanıyor</h2>
        </section>
      )}
    </div>
  )
}
