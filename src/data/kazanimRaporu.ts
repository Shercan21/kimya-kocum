// Kazanım raporu: öğrencinin çözdüğü testlerden kazanım bazında başarı.
// - Konu testleri → konunun kazanımları
// - Bağlam testleri → testin kendi kazanımı
// - Eksik taraması → soru bazında kazanım
// Sarmal ve karma testlerde soruların kazanımı bilinmediği için onlar ayrıca
// bölüm / sınıf düzeyinde raporlanır.

import { sinifMufredati, tumKonular } from './content'
import { sonuclariYukle, type TestSonucu } from './results'
import type { TaramaSonucu } from './screening'

export type KazanimDurum = 'iyi' | 'tekrar' | 'eksik' | 'yok'

export type KazanimSatiri = {
  grade: number
  kod: string
  ad: string
  dogru: number
  toplam: number
  oran: number | null
  durum: KazanimDurum
  konular: { kod: string; ad: string }[]
}

export type GenelTestSatiri = {
  grade: number
  tur: 'sarmal' | 'karma'
  baslik: string
  oran: number
  deneme: number
}

export function durumOf(oran: number | null): KazanimDurum {
  if (oran === null) return 'yok'
  if (oran >= 70) return 'iyi'
  if (oran >= 40) return 'tekrar'
  return 'eksik'
}

export function kazanimRaporu(grades: number[], taramalar: (TaramaSonucu | null)[]) {
  const sonuclar = sonuclariYukle().filter(r => grades.includes(r.grade))
  const satirlar: KazanimSatiri[] = []
  const genel: GenelTestSatiri[] = []

  for (const grade of grades) {
    const m = sinifMufredati(grade)
    if (!m) continue
    const konular = tumKonular(grade)
    const sayac = new Map<string, { dogru: number; toplam: number }>()
    const ekle = (kod: string, dogru: number, toplam: number) => {
      const c = sayac.get(kod) ?? { dogru: 0, toplam: 0 }
      c.dogru += dogru
      c.toplam += toplam
      sayac.set(kod, c)
    }

    // Test kimliği → kazanım(lar)
    const baglamKazanim = new Map<string, string>()
    const konuTestKazanim = new Map<string, string[]>()
    const sarmalBaslik = new Map<string, string>()
    for (const { konu } of konular) {
      konuTestKazanim.set(konu.test, konu.kazanimlar)
      konu.baglam.forEach(b => b.kazanim && baglamKazanim.set(b.id, b.kazanim))
    }
    m.temalar.forEach(t => t.bolumler.forEach(b => b.sarmal.forEach(s => sarmalBaslik.set(s.id, `${b.kod} ${b.ad}`))))
    const karmaNo = new Map(m.karma.map((k, i) => [k.id, i + 1]))

    const sonGenel = new Map<string, { r: TestSonucu; deneme: number }>()
    for (const r of sonuclar.filter(x => x.grade === grade)) {
      const bk = baglamKazanim.get(r.testId)
      const kk = konuTestKazanim.get(r.testId)
      if (bk) ekle(bk, r.dogru, r.toplam)
      else if (kk && kk.length) {
        // Birden çok kazanımlı konuda sonuç kazanımlara eşit paylaştırılır.
        kk.forEach(k => ekle(k, r.dogru / kk.length, r.toplam / kk.length))
      } else if (sarmalBaslik.has(r.testId) || karmaNo.has(r.testId)) {
        const prev = sonGenel.get(r.testId)
        sonGenel.set(r.testId, { r, deneme: (prev?.deneme ?? 0) + 1 })
      }
    }

    const tarama = taramalar.find(t => t?.grade === grade)
    tarama?.kazanimlar.forEach(k => ekle(k.kazanim, k.dogru, k.toplam))

    for (const [kod, ad] of Object.entries(m.kazanimlar)) {
      const c = sayac.get(kod)
      const oran = c && c.toplam ? Math.round((c.dogru / c.toplam) * 100) : null
      satirlar.push({
        grade,
        kod,
        ad,
        dogru: Math.round(c?.dogru ?? 0),
        toplam: Math.round(c?.toplam ?? 0),
        oran,
        durum: durumOf(oran),
        konular: konular.filter(({ konu }) => konu.kazanimlar.includes(kod)).map(({ konu }) => ({ kod: konu.kod, ad: konu.ad })),
      })
    }

    for (const [id, { r, deneme }] of sonGenel) {
      const oran = r.toplam ? Math.round((r.dogru / r.toplam) * 100) : 0
      genel.push({
        grade,
        tur: sarmalBaslik.has(id) ? 'sarmal' : 'karma',
        baslik: sarmalBaslik.get(id) ?? `Karma test ${karmaNo.get(id)}`,
        oran,
        deneme,
      })
    }
  }

  return { satirlar, genel }
}
