// Yazılı modunda açılabilecek konular: öğrencinin Yazılı sayfasında seçtiği
// dönem ve yazılının (ör. 1. dönem 2. yazılı) senaryolarında geçen
// kazanımların konuları. Seçim yoksa yayındaki en son yazılı esas alınır.
// Diğer konular kilitli kalır.

const SECIM_KEY = 'kimya-kocum-yazili-secim' // WrittenExams: { [grade]: sinavId }

function seciliSinavId(grade: number): string | null {
  try {
    const all = JSON.parse(localStorage.getItem(SECIM_KEY) ?? '{}') as Record<string, string>
    return all[grade] ?? null
  } catch {
    return null
  }
}

import { useEffect, useState } from 'react'
import { tumKonular, yazililar } from './content'

export type YaziliKapsam = { kodlar: Set<string>; donem: number; yazili: number } | null

export function useYaziliKonulari(grades: number[], enabled: boolean): YaziliKapsam {
  const [kapsam, setKapsam] = useState<YaziliKapsam>(null)
  // Seçim değişince (Yazılı sayfasından dönüldüğünde) kapsam yeniden hesaplanır.
  const key = grades.join(',') + '#' + grades.map(g => seciliSinavId(g) ?? '').join(',')

  useEffect(() => {
    if (!enabled) return
    let active = true
    const gradePart = key.split('#')[0]
    const list = gradePart ? gradePart.split(',').map(Number) : []
    Promise.all(list.map(grade => yazililar(grade).then(file => ({ grade, file })).catch(() => null))).then(results => {
      if (!active) return
      const ok = results.filter((r): r is NonNullable<typeof r> => !!r && r.file.sinavlar.length > 0)
      if (!ok.length) {
        setKapsam({ kodlar: new Set(), donem: 0, yazili: 0 })
        return
      }
      // Seçilen yazılı; yoksa en son yazılı (en büyük dönem, sonra yazılı numarası)
      const tum = ok.flatMap(r => r.file.sinavlar)
      const secId = ok.map(r => seciliSinavId(r.grade)).find(Boolean)
      const son =
        tum.find(s => s.id === secId) ??
        tum.reduce((a, b) => (b.donem * 10 + b.yazili > a.donem * 10 + a.yazili ? b : a))
      const kodlar = new Set<string>()
      for (const { grade, file } of ok) {
        const codes = new Set(
          file.sinavlar
            .filter(s => s.donem === son.donem && s.yazili === son.yazili)
            .flatMap(s => s.sorular.map(q => q.kazanim))
        )
        for (const { konu } of tumKonular(grade)) {
          if (konu.kazanimlar.some(code => codes.has(code))) kodlar.add(`${grade}|${konu.kod}`)
        }
      }
      setKapsam({ kodlar, donem: son.donem, yazili: son.yazili })
    })
    return () => {
      active = false
    }
  }, [key, enabled])

  return kapsam
}
