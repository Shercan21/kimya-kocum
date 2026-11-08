import { useEffect, useState } from 'react'
import { icerikHtml, type YaziliSinav } from '../data/content'
import { saveExam, SKILLS, type ExamRecord } from '../data/skillReport'

type Draft = { id: string; signature: string; started: number; submitted: boolean; answers: Record<string, string>; points: Record<string, number>; saved: boolean }
export default function ExamPractice({ grade, exam }: { grade: number; exam: YaziliSinav }) {
  const key = `kimya-kocum-prova-taslak-${grade}-${exam.id}`
  const signature = JSON.stringify(exam)
  const fresh = (): Draft => ({ id: crypto.randomUUID(), signature, started: Date.now(), submitted: false, answers: {}, points: {}, saved: false })
  const [draft, setDraft] = useState<Draft | null>(() => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || 'null')
      return data && data.signature === signature && typeof data.id === 'string' && Number.isFinite(data.started) && typeof data.submitted === 'boolean' && typeof data.saved === 'boolean' && data.answers && data.points ? data as Draft : null
    } catch { return null }
  })
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState('')
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  function update(next: Draft) {
    try { localStorage.setItem(key, JSON.stringify(next)); setDraft(next); setError('') }
    catch { setDraft(next); setError('Cihazda kayıt yapılamadı. Sayfayı kapatmadan depolama alanını kontrol et; cevapların şu an yalnız bu ekranda.') }
  }
  const html = (text: string) => <div dangerouslySetInnerHTML={{ __html: icerikHtml(text) }} />
  const total = exam.sorular.reduce((n, q) => n + q.maddeler.reduce((s, m) => s + m.p, 0), 0)
  const remaining = draft ? Math.min(exam.sure * 60, Math.max(0, Math.ceil((draft.started + exam.sure * 60000 - now) / 1000))) : 0
  function save() {
    if (!draft) return
    const record: ExamRecord = { id: draft.id, grade, exam: exam.id, date: new Date().toISOString(), outcomes: {}, evidence: [] }
    for (const [i, q] of exam.sorular.entries()) {
      for (const [j, m] of q.maddeler.entries()) {
        const earned = draft.points[`${i}-${j}`]
        if (!Number.isFinite(earned) || earned < 0 || earned > m.p) { setError('Her alt maddeye 0 ile belirtilen tam puan arasında bir puan gir.'); return }
        const previous = record.outcomes[q.kazanim] ?? [0, 0]
        record.outcomes[q.kazanim] = [previous[0] + earned, previous[1] + m.p]
        for (const skill of m.beceriler ?? []) if (SKILLS[skill]) record.evidence.push({ skill, earned, possible: m.p })
      }
    }
    try { saveExam(record); update({ ...draft, saved: true }) }
    catch { setError('Karne kaydedilemedi. Depolama alanını kontrol edip tekrar dene.') }
  }
  return <section className="card exam-practice" aria-label="Yazılı provası">
    <h3>Yazılı provası</h3>
    <p>{exam.sorular.length} soru · {total} puan · önerilen süre {exam.sure} dakika. Bu bir çalışma provasıdır; resmî sınav değildir.</p>
    <p>Önce cevaplarını yaz. Bitirince cevap anahtarıyla karşılaştırıp her alt maddeye kendin puan ver. Uzun cevaplar otomatik puanlanmaz.</p>
    {!draft && <button className="primary-button" onClick={() => update(fresh())}>Provayı başlat</button>}
    {error && <p role="alert">{error}</p>}
    {draft && <>
      {!draft.submitted && <p role="timer">{remaining ? `Kalan süre: ${Math.floor(remaining / 60)} dk ${remaining % 60} sn` : 'Önerilen süre doldu. Cevapların korunuyor; tamamlayıp değerlendirmeye geçebilirsin.'}</p>}
      {exam.sorular.map((q, i) => <article className="ysoru" key={i}>
        <h4>Soru {i + 1} · {q.kazanim}</h4>{html(q.baglam)}
        {q.maddeler.map((m, j) => { const id = `${i}-${j}`; return <div className="ymadde" key={id}>
          <b>{m.h}) · {m.p} puan</b>{html(m.s)}
          <label>Cevabın<textarea style={{ width: '100%', minHeight: 100 }} value={draft.answers[id] ?? ''} disabled={draft.submitted} onChange={e => update({ ...draft, answers: { ...draft.answers, [id]: e.target.value } })} /></label>
          {draft.submitted && <><b>Cevap anahtarı</b>{html(m.c)}
            <p className="muted small">Doğruluk, gerekçe ve işlem adımlarını karşılaştır. Ayrıntılı puanlama ölçütü yoksa bu puan yaklaşık öz değerlendirmendir.</p>
            <label>Verdiğin puan (0–{m.p}) <input type="number" min={0} max={m.p} step="any" value={draft.points[id] ?? ''} disabled={draft.saved} onChange={e => { const points = { ...draft.points }; if (e.target.value === '') delete points[id]; else points[id] = Number(e.target.value); update({ ...draft, points }) }} /></label>
          </>}
        </div> })}
      </article>)}
      {!draft.submitted && <button className="primary-button" onClick={() => { if (window.confirm('Cevapların kilitlenecek ve cevap anahtarı açılacak. Bitirmek istiyor musun?')) update({ ...draft, submitted: true }) }}>Bitir ve kendini değerlendir</button>}
      {draft.submitted && !draft.saved && <button className="primary-button" onClick={save}>Öz değerlendirmeyi karneme kaydet</button>}
      {draft.saved && <p role="status">Sonucun kaydedildi. Gelişimim bölümünde kazanım eksiklerini ve tanımlı becerilerini görebilirsin. Toplam: {Object.values(draft.points).reduce((n, p) => n + p, 0)} / {total}.</p>}
      {draft.submitted && <button className="btn-secondary" onClick={() => { if (window.confirm('Yeni prova mevcut cevap taslağının yerine geçer. Kaydettiğin karne sonuçları korunur. Devam edilsin mi?')) update(fresh()) }}>Yeni deneme başlat</button>}
    </>}
  </section>
}

