import { sonuclariYukle } from '../data/results'
import { examRecords, summarizeSkills, outcomeRates } from '../data/skillReport'
import { tumKonular } from '../data/content'
import type { TopicTab } from './TopicPage'

export default function SkillReport({ grades, onOpen, blocked = new Set() }: { grades: number[]; blocked?: Set<string>; onOpen: (grade: number, topic: string, tab: TopicTab) => void }) {
  const [assessmentGrade, setAssessmentGrade] = useState<number | null>(null)
  const [, refresh] = useState(0)
  const tests = sonuclariYukle().filter(r => grades.includes(r.grade))
  const exams = examRecords().filter(r => grades.includes(r.grade))
  const skills = summarizeSkills([...tests.flatMap(r => r.beceriler ?? []), ...exams.flatMap(r => r.evidence ?? [])])
  const suggestions = grades.flatMap(grade => {
    const counts = outcomeRates([...tests, ...exams].filter(r => r.grade === grade).map(r => ('outcomes' in r ? r.outcomes : r.kazanimlar) ?? {}))
    return tumKonular(grade).filter(({ konu }) => !blocked.has(`${grade}|${konu.kod}`)).flatMap(({ konu }) => {
      const values = konu.kazanimlar.map(k => counts[k]).filter(v => v !== undefined)
      const rate = values.length ? values.reduce((n, v) => n + v, 0) / values.length : 1
      return values.length && rate < .7 ? [{ grade, konu, percent: Math.round(100 * rate) }] : []
    })
  }).sort((a, b) => a.percent - b.percent).slice(0, 3)
  return <section className="card">
    <h3>Beceri karnem</h3>
    <p>Her sınıf için 27 özgün soruluk kısa değerlendirme hazır. Çözdüğünde cevap anahtarı ve açıklamaları açılır.</p>
    {[9, 10, 11].filter(g => grades.includes(g) || grades.includes(12)).map(g => <button key={g} className="btn-secondary" onClick={() => setAssessmentGrade(g)}>{g}. sınıf değerlendirmesi</button>)}
    {assessmentGrade !== null && <><button className="btn-secondary" onClick={() => setAssessmentGrade(null)}>Değerlendirmeyi kapat</button><SkillAssessment key={assessmentGrade} grade={assessmentGrade} onSaved={() => refresh(n => n + 1)} /></>}
    <p className="muted small">Yalnızca becerisi tanımlanmış sorular değerlendirilir. Yazılı puanları kendi değerlendirmeni içerir; resmî not değildir. Aynı değerlendirme sorusu tekrar çözülürse beceri karnesinde son cevabı kullanılır. Üçten az değerlendirme ilk gözlemdir.</p>
    {skills.map(s => <p key={s.id}><b>{s.label}</b> · {s.percent === null ? 'Henüz veri yok' : `${s.percent}% · ${s.count} değerlendirme${s.count < 3 ? ' · ilk gözlem' : ''}`}</p>)}
    <h3>Eksiklerime göre çalış</h3>
    <p className="muted small">Her test ve provanın kazanım yüzdesi eşit ağırlıkla ortalanır. Öz değerlendirme puanları da önerilere katılır. Kilitli konular önerilmez.</p>
    {!suggestions.length && <p>Şu an öneri oluşturacak eksik kazanım verisi yok. Test çözdükçe burada göreceksin.</p>}
    {suggestions.map(({ grade, konu, percent }) => <div key={`${grade}-${konu.kod}`} className="card">
      <b>{grade}. sınıf · {konu.ad}</b><p>Kayıtlı kazanım başarın %{percent}. Önce konuyu gözden geçir, sonra etkinlik ve testle pekiştir.</p>
      {konu.anlatim && <button className="btn-secondary" onClick={() => onOpen(grade, `${grade}-${konu.kod}`, 'anlatim')}>Konuyu çalış</button>}
      {konu.etkinlik > 0 && <button className="btn-secondary" onClick={() => onOpen(grade, `${grade}-${konu.kod}`, 'etkinlik')}>Etkinliği yap</button>}
      <button className="primary-button" onClick={() => onOpen(grade, `${grade}-${konu.kod}`, 'test')}>Sorularla pekiştir</button>
    </div>)}
  </section>
}
import { useState } from 'react'
import SkillAssessment from './SkillAssessment'
