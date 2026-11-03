// Yazılı senaryolarında geçen kazanımlar ve bu kazanımları içeren konular.

import { useEffect, useState } from 'react'
import { tumKonular, yazililar } from './content'

export function useYaziliKonulari(grades: number[], enabled: boolean) {
  const [kodlar, setKodlar] = useState<Set<string> | null>(null)
  const key = grades.join(',')

  useEffect(() => {
    if (!enabled) return
    let active = true
    const list = key ? key.split(',').map(Number) : []
    Promise.all(
      list.map(grade =>
        yazililar(grade)
          .then(file => ({ grade, codes: new Set(file.sinavlar.flatMap(s => s.sorular.map(q => q.kazanim))) }))
          .catch(() => ({ grade, codes: new Set<string>() }))
      )
    ).then(results => {
      if (!active) return
      const out = new Set<string>()
      for (const { grade, codes } of results) {
        for (const { konu } of tumKonular(grade)) {
          if (konu.kazanimlar.some(code => codes.has(code))) out.add(`${grade}|${konu.kod}`)
        }
      }
      setKodlar(out)
    })
    return () => {
      active = false
    }
  }, [key, enabled])

  return kodlar
}
