export const SKILLS: Record<string, string> = {
  kavram: 'Kavram bilgisi', hesaplama: 'Hesaplama', cikarim: 'Bilimsel çıkarım', hipotez: 'Hipotez kurma',
  modelleme: 'Model oluşturma', tumdengelim: 'Tümdengelim', tumevarim: 'Tümevarım',
  veri: 'Tablo ve grafik yorumlama', onerme: 'Önerme oluşturma',
}
export type Evidence = { questionId?: string; skill: string; earned: number; possible: number }
export function outcomeRates(records: Record<string, [number, number]>[]) {
  const values: Record<string, number[]> = {}
  for (const record of records) for (const [key, pair] of Object.entries(record)) {
    if (!Array.isArray(pair) || !Number.isFinite(pair[0]) || !Number.isFinite(pair[1]) || pair[1] <= 0 || pair[0] < 0 || pair[0] > pair[1]) continue
    ;(values[key] ??= []).push(pair[0] / pair[1])
  }
  return Object.fromEntries(Object.entries(values).map(([key, rates]) => [key, rates.reduce((a, b) => a + b, 0) / rates.length]))
}
export function summarizeSkills(rows: Evidence[]) {
  return Object.entries(SKILLS).map(([id, label]) => {
    const latest = new Map<string, Evidence>()
    rows.forEach((r, i) => latest.set(r.questionId ? `${r.skill}|${r.questionId}` : `legacy-${i}`, r))
    const valid = [...latest.values()].filter(r => r.skill === id && Number.isFinite(r.possible) && r.possible > 0 && Number.isFinite(r.earned) && r.earned >= 0 && r.earned <= r.possible)
    const earned = valid.reduce((n, r) => n + r.earned, 0)
    const possible = valid.reduce((n, r) => n + r.possible, 0)
    return { id, label, count: valid.length, percent: possible ? Math.round(100 * earned / possible) : null }
  })
}
export type ExamRecord = { id: string; grade: number; exam: string; date: string; outcomes: Record<string, [number, number]>; evidence: Evidence[] }
export const EXAM_KEY = 'kimya-kocum-prova-sonuclari-v1'
export function examRecords(): ExamRecord[] {
  try { const data = JSON.parse(localStorage.getItem(EXAM_KEY) || '[]'); return Array.isArray(data) ? data : [] } catch { return [] }
}
export function saveExam(record: ExamRecord) {
  localStorage.setItem(EXAM_KEY, JSON.stringify([...examRecords().filter(r => r.id !== record.id), record]))
}
