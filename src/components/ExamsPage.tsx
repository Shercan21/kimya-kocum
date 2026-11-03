import { useState } from 'react'
import Icon from './Icon'
import TestRunner from './TestRunner'
import WrittenExams from './WrittenExams'
import { konuId, sinifMufredati, type Konu } from '../data/content'
import { loadLearningProgress } from '../data/learningProgress'
import { basari, testinSonuclari } from '../data/results'

// 12. sınıf / mezun TYT-AYT için 9-11 testlerini görür ama o sınıfların
// okul yazılılarını görmez (showWritten=false).
type Props = {
  grades: number[]
  label?: string
  showWritten?: boolean
  onlyWritten?: boolean
  // Sıralı açılım: sarmal testler tema bitince, karma testler bütün konular
  // bitince açılır; her grupta bir test bitince sıradaki görünür.
  sirali?: boolean
  // Eksik taramasında bilindiği görülen konular (grade|kod) tamamlanmış sayılır.
  bilinen?: Set<string>
}

type Active = { grade: number; id: string; baslik: string }

export default function ExamsPage({ grades, label, showWritten = true, onlyWritten = false, sirali = false, bilinen }: Props) {
  const sets = grades
    .map(grade => ({ grade, data: sinifMufredati(grade) }))
    .filter((item): item is { grade: number; data: NonNullable<ReturnType<typeof sinifMufredati>> } => item.data !== null)
  const multi = sets.length > 1
  const [active, setActive] = useState<Active | null>(null)
  const [, refresh] = useState(0)

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
          refresh(value => value + 1)
        }}
      />
    )
  }

  const score = (grade: number, id: string) => {
    const results = testinSonuclari(grade, id)
    const last = results[results.length - 1]
    return last ? basari(last) : null
  }

  const progress = loadLearningProgress()
  const konuTamam = (grade: number, konu: Konu) => {
    const st = progress.find(p => p.grade === grade && p.topicId === konuId(grade, konu.kod))?.status
    return st === 'learned' || st === 'permanent' || !!bilinen?.has(`${grade}|${konu.kod}`)
  }
  const cozuldu = (grade: number, id: string) => testinSonuclari(grade, id).length > 0

  // Sıralı listede çözülenler + sıradaki tek test gösterilir; kalanların sayısı yazılır.
  const sirala = (grade: number, items: { id: string; baslik: string; alt: string }[]) => {
    if (!sirali) return { gorunen: items, kalan: 0 }
    const ilkCozulmemis = items.findIndex(t => !cozuldu(grade, t.id))
    if (ilkCozulmemis < 0) return { gorunen: items, kalan: 0 }
    return { gorunen: items.slice(0, ilkCozulmemis + 1), kalan: items.length - ilkCozulmemis - 1 }
  }

  const kilitSatiri = (key: string, baslik: string, neden: string) => (
    <li key={key} className="test-locked">
      <span className="test-title">
        {baslik}
        <small>{neden}</small>
      </span>
      <Icon name="lock" size={18} />
    </li>
  )

  const row = (grade: number, id: string, baslik: string, alt: string) => {
    const last = score(grade, id)
    return (
      <li key={`${grade}-${id}`}>
        <span className="test-title">
          {baslik}
          <small>{alt}{last !== null ? ` · Son sonuç: %${last}` : ''}</small>
        </span>
        <button
          type="button"
          className={last === null ? 'primary-button' : 'btn-secondary'}
          onClick={() => setActive({ grade, id, baslik })}
        >
          {last === null ? 'Başla' : 'Tekrar çöz'}
        </button>
      </li>
    )
  }

  return (
    <div className="stack">
      {showWritten && sets.length > 0 && <WrittenExams key={sets.map(item => item.grade).join('-')} grades={sets.map(item => item.grade)} />}

      {sets.length === 0 && (
        <section className="card coming">
          <Icon name="file" size={28} />
          <h2>{grades.length ? `${grades.join(', ')}. sınıf testleri hazırlanıyor` : 'Önce sınıfını seç'}</h2>
          <p>Şu an 9, 10 ve 11. sınıfların sarmal ve karma testleri hazır.</p>
        </section>
      )}

      {sets.length > 0 && !onlyWritten && (
        <>
          {label && (
            <p className="program-message">
              {label} hazırlığı: {sets.map(item => `${item.grade}. sınıf`).join(' ve ')} testleri
            </p>
          )}
          <section className="card">
            <h3 className="card-title"><Icon name="repeat" /> Sarmal testler</h3>
            <p className="muted small">Bir bölümün bütün konularını birlikte tekrar eder.</p>
            {sirali && <p className="muted small">Bir temanın bütün konularını bitirince o temanın sarmal testleri sırayla açılır.</p>}
            <ul className="test-list">
              {sets.flatMap(({ grade, data }) =>
                data.temalar.flatMap(tema => {
                  const onEk = multi ? `${grade}. sınıf · ` : ''
                  const items = tema.bolumler.flatMap(bolum =>
                    bolum.sarmal.map(test => ({ id: test.id, baslik: `${onEk}${bolum.kod} ${bolum.ad}`, alt: `${tema.no}. tema · ${test.soru} soru` }))
                  )
                  if (!items.length) return []
                  const temaBitti = tema.bolumler.every(b => b.konular.every(k => konuTamam(grade, k)))
                  if (sirali && !temaBitti) {
                    return [kilitSatiri(`${grade}-t${tema.no}`, `${onEk}${tema.no}. tema · ${tema.ad}`, `${items.length} sarmal test · Temanın konularını bitirince açılır`)]
                  }
                  const { gorunen, kalan } = sirala(grade, items)
                  return [
                    ...gorunen.map(t => row(grade, t.id, t.baslik, t.alt)),
                    ...(kalan ? [kilitSatiri(`${grade}-t${tema.no}-k`, `${kalan} sarmal test daha`, 'Bu testi bitirince sıradaki açılır')] : []),
                  ]
                })
              )}
            </ul>
          </section>

          {sets.map(({ grade, data }) => (
            <section key={grade} className="card">
              <h3 className="card-title"><Icon name="list" /> {multi ? `${grade}. sınıf karma testleri` : 'Karma testler'}</h3>
              <p className="muted small">Bütün kazanımlardan karışık sorular. Deneme gibi çöz.</p>
              <ul className="test-list">
                {(() => {
                  const items = data.karma.map((test, index) => ({ id: test.id, baslik: `Karma test ${index + 1}`, alt: `${test.soru} soru` }))
                  const hepsiBitti = data.temalar.every(t => t.bolumler.every(b => b.konular.every(k => konuTamam(grade, k))))
                  if (sirali && !hepsiBitti) {
                    return [kilitSatiri(`${grade}-karma`, `${items.length} karma test`, 'Bütün konuları bitirince açılır')]
                  }
                  const { gorunen, kalan } = sirala(grade, items)
                  return [
                    ...gorunen.map(t => row(grade, t.id, t.baslik, t.alt)),
                    ...(kalan ? [kilitSatiri(`${grade}-karma-k`, `${kalan} karma test daha`, 'Bu testi bitirince sıradaki açılır')] : []),
                  ]
                })()}
              </ul>
            </section>
          ))}
        </>
      )}

    </div>
  )
}
