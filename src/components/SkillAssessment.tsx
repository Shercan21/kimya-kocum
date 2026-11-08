import { shuffleOrder } from '../data/testOrder'
import { useState } from 'react'
import questions from '../data/assessmentQuestions.json'
import { saveExam, SKILLS, type ExamRecord } from '../data/skillReport'

export default function SkillAssessment({ grade, onSaved }: { grade: number; onSaved: () => void }) {
  const source = questions.filter(q => q.grade === grade)
  const key = `kimya-kocum-beceri-taslak-${grade}-v1`
  const signature = JSON.stringify(source)
  const fresh = () => ({ id: crypto.randomUUID(), signature, order: shuffleOrder(source.length), answers: {} as Record<string, number>, done: false })
  const [draft, setDraft] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null')
      if (value?.signature === signature && typeof value.id === 'string' && typeof value.done === 'boolean' && value.answers && typeof value.answers === 'object' && Array.isArray(value.order) && value.order.length === source.length && new Set(value.order).size === source.length && value.order.every((i: number) => Number.isInteger(i) && i >= 0 && i < source.length)) {
        const answers: Record<string, number> = {}
        for (const q of source) if (Number.isInteger(value.answers[q.id]) && value.answers[q.id] >= 0 && value.answers[q.id] < q.options.length) answers[q.id] = value.answers[q.id]
        return { id: value.id as string, signature, order: value.order as number[], answers, done: value.done as boolean }
      }
    } catch { /* Yeni deneme açılır; eski sonuçlar silinmez. */ }
    return fresh()
  })
  const items = draft.order.map(i => source[i])
  const [error, setError] = useState('')
  function update(next: typeof draft) {
    setDraft(next)
    try { localStorage.setItem(key, JSON.stringify(next)); setError('') }
    catch { setError('Taslak kaydedilemedi. Bu ekranı kapatmadan değerlendirmeyi tamamla.') }
  }
  function finish() {
    const record: ExamRecord = { id: draft.id, grade, exam: 'beceri-degerlendirme-v1', date: new Date().toISOString(), outcomes: {}, evidence: [] }
    for (const q of items) {
      const earned = draft.answers[q.id] === q.correct ? 1 : 0
      record.evidence.push({ questionId: q.id, skill: q.skill, earned, possible: 1 })
      const value = record.outcomes[q.outcome] ?? [0, 0]
      record.outcomes[q.outcome] = [value[0] + earned, value[1] + 1]
    }
    try { saveExam(record); update({ ...draft, done: true }); onSaved() }
    catch { setError('Sonuç kaydedilemedi. Cevapların ekranda duruyor; tekrar deneyebilirsin.') }
  }
  const answered = items.filter(q => draft.answers[q.id] !== undefined).length
  return <section className="card exam-practice">
    <h4>{grade}. sınıf beceri değerlendirmesi</h4>
    <p>{items.length} soru · önerilen süre 35 dakika · {answered}/{items.length} cevaplandı.</p>
    <p className="muted small">Bu kısa seçmeli değerlendirme ilk gözlem sağlar. Hipotez veya model seçebilmek, bunları bağımsız oluşturma becerisini tek başına kanıtlamaz. Yanlış ve boş cevaplar çalışma önerilerine katılır; konu kilitleri değişmez.</p>
    {error && <p role="alert">{error}</p>}
    {items.map((q, i) => <fieldset className="ysoru" key={q.id} disabled={draft.done}>
      <legend><b>Soru {i + 1}</b></legend><p>{q.question}</p>
      {q.options.map((option, j) => <label key={j} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <input type="radio" name={q.id} checked={draft.answers[q.id] === j} onChange={() => update({ ...draft, answers: { ...draft.answers, [q.id]: j } })} />
        <span>{String.fromCharCode(65 + j)}) {option}</span>
      </label>)}
      {draft.done && <div><p><b>{draft.answers[q.id] === q.correct ? 'Doğru' : draft.answers[q.id] === undefined ? 'Boş bırakıldı' : 'Yanlış'} · Doğru cevap {String.fromCharCode(65 + q.correct)}</b></p><p>{q.explanation}</p><p className="muted small">{SKILLS[q.skill]} · {q.outcome}</p></div>}
    </fieldset>)}
    {!draft.done && <button className="primary-button" onClick={() => { if (window.confirm(`${items.length - answered} boş cevap var. Değerlendirme bitsin ve sonuç karnene kaydedilsin mi?`)) finish() }}>Bitir ve karneme kaydet</button>}
    {draft.done && <><p role="status">Sonucun kaydedildi: {items.filter(q => draft.answers[q.id] === q.correct).length}/{items.length} doğru. Beceri karnen güncellendi.</p><button className="btn-secondary" onClick={() => update(fresh())}>Yeni deneme</button></>}
  </section>
}
