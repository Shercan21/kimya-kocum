// Müfredat ve içerik (tools/icerik_aktar.py ile üretilir).
// Müfredat ağacı pakete gömülür; konu anlatımı, test ve etkinlikler
// ihtiyaç olduğunda public/icerik altından yüklenir.

import mufredatData from './mufredat.json'

export type Seviye = 'Kolay' | 'Orta' | 'Zor' | null

export type BaglamTest = { id: string; baslik: string; kazanim: string | null; soru: number }
export type GenelTest = { id: string; baslik: string; soru: number }

export type Konu = {
  kod: string
  ad: string
  kazanimlar: string[]
  test: string
  seviyeler: Seviye[]
  soru: number
  baglam: BaglamTest[]
  anlatim: boolean
  etkinlik: number
}

export type Bolum = {
  kod: string
  tema: number
  ad: string
  ozet: string
  konular: Konu[]
  sarmal: GenelTest[]
}

export type Tema = { no: number; ad: string; bolumler: Bolum[] }

export type SinifMufredat = {
  sinif: number
  temalar: Tema[]
  karma: GenelTest[]
  kazanimlar: Record<string, string>
  kelimeler: Record<string, string[]>
}

export type Soru = {
  s: string // HTML soru metni
  sik: string[] // HTML şıklar
  d: number // doğru şık sırası (0'dan)
  c?: string // HTML çözüm
  z?: string // zorluk
}

export type TestDosyasi = {
  id: string
  baslik: string
  tur: 'kazanim' | 'baglam' | 'sarmal' | 'karma'
  testler: { seviye: Seviye; sorular: Soru[] }[]
}

const mufredat = mufredatData as unknown as Record<string, SinifMufredat>

export function sinifMufredati(grade: number | null): SinifMufredat | null {
  return grade === null ? null : mufredat[String(grade)] ?? null
}

export function icerikliSiniflar(): number[] {
  return Object.keys(mufredat).map(Number)
}

export function konuId(grade: number, kod: string) {
  return `${grade}-${kod}`
}

export function tumKonular(grade: number): { konu: Konu; bolum: Bolum; tema: Tema }[] {
  const data = sinifMufredati(grade)
  if (!data) return []
  return data.temalar.flatMap(tema =>
    tema.bolumler.flatMap(bolum => bolum.konular.map(konu => ({ konu, bolum, tema })))
  )
}

export function konuBul(grade: number, kod: string) {
  return tumKonular(grade).find(item => item.konu.kod === kod) ?? null
}

const base = import.meta.env.BASE_URL

// İçerikteki img/... yollarını uygulamanın adresine çevirir.
export function icerikHtml(html: string): string {
  return html.replace(/(src=["'])(img\/)/g, `$1${base}icerik/$2`)
}

export function icerikYolu(path: string): string {
  return `${base}icerik/${path}`
}

const cache = new Map<string, Promise<unknown>>()

function load<T>(path: string, as: 'json'): Promise<T> {
  const key = `${as}:${path}`
  if (!cache.has(key)) {
    const promise = fetch(icerikYolu(path)).then(response => {
      if (!response.ok) throw new Error('İçerik yüklenemedi.')
      return response.json()
    })
    promise.catch(() => cache.delete(key))
    cache.set(key, promise)
  }
  return cache.get(key) as Promise<T>
}

function pick<T>(data: Record<string, T>, key: string): T {
  if (!(key in data)) throw new Error('İçerik bulunamadı.')
  return data[key]
}

export function konuAnlatimi(grade: number, kod: string) {
  return load<Record<string, string>>(`${grade}/konular.json`, 'json').then(data => icerikHtml(pick(data, kod)))
}

export function testDosyasi(grade: number, id: string) {
  return load<Record<string, TestDosyasi>>(`${grade}/testler.json`, 'json').then(data => pick(data, id))
}

export type Etkinlik = {
  no: number
  tur: 'dy' | 'es' | 'bo' | 'au' | 'ta' | 'kh'
  yonerge: string
  [key: string]: unknown
}

export type EtkinlikKitabi = { kod: string; ad: string; amac: string; etkinlikler: Etkinlik[] }

export function etkinlikler(grade: number, kod: string) {
  return load<Record<string, EtkinlikKitabi>>(`${grade}/etkinlikler.json`, 'json').then(data => pick(data, kod))
}
