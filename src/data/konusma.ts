// Konu anlatımı metnini Türkçe metin okuma (TTS) için sadeleştirir:
// formüller, iyon yükleri, oklar, hâl simgeleri okunabilir sözcüklere çevrilir.

const ALT_RAKAM: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' }
const UST_RAKAM: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }

export function konusmaMetni(ham: string): string {
  let t = ham
  // Kazanım kodları ve emojiler sesli okunmaz
  t = t.replace(/KİM\.\d+\.\d+\.\d+(\.[a-zçğıöşü])?/g, '')
  t = t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/\u{FE0F}/gu, '')
  // Bilimsel gösterim: 6,02·10²³ → 6,02 çarpı 10 üzeri 23
  t = t.replace(/[·×]\s*10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, us: string) =>
    ` çarpı 10 üzeri ${us.startsWith('⁻') ? 'eksi ' : ''}${[...us.replace('⁻', '')].map(c => UST_RAKAM[c] ?? '').join('')}`)
  // İyon yükleri: Ca²⁺ → Ca 2 artı, Cl⁻ → Cl eksi
  t = t.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])/g, (_, n: string, y: string) =>
    ` ${[...n].map(c => UST_RAKAM[c]).join('')} ${y === '⁺' ? 'artı' : 'eksi'} `)
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => ` üzeri ${[...m].map(c => UST_RAKAM[c]).join('')} `)
  // Formüllerde alt indisler: H₂O → H 2 O
  t = t.replace(/[₀-₉]+/g, m => ` ${[...m].map(c => ALT_RAKAM[c]).join('')} `)
  // Hâl simgeleri
  t = t.replace(/\(k\)/g, ' katı ').replace(/\(s\)/g, ' sıvı ').replace(/\(g\)/g, ' gaz ').replace(/\(suda\)/g, ' suda ')
  // Oklar ve işaretler
  t = t
    .replace(/⇌|⇄/g, ' çift yönlü ok ')
    .replace(/→|⟶|->/g, ' oluşturur ')
    .replace(/ΔH°?/g, ' delta H ')
    .replace(/Δ/g, ' delta ')
    .replace(/°C/g, ' derece ')
    .replace(/≈/g, ' yaklaşık ')
    .replace(/≤/g, ' küçük eşit ')
    .replace(/≥/g, ' büyük eşit ')
    .replace(/±/g, ' artı eksi ')
    .replace(/(\d)\s*−\s*(\d)/g, '$1 eksi $2')
    .replace(/−/g, ' eksi ')
    .replace(/…+|\.{3,}/g, ', ')
  return t.replace(/\s+/g, ' ').trim()
}
