// Müfredat ve içerik (tools/icerik_aktar.py ile üretilir).
// Müfredat ağacı pakete gömülür; konu anlatımı, test ve etkinlikler
// ihtiyaç olduğunda public/icerik altından yüklenir.

import mufredatData from './mufredat.json'
import { preparePublishedContent, publishedContentUrl } from './publishedContent'

export type Seviye = 'Kolay' | 'Orta' | 'Zor' | null

export type BaglamTest = { id: string; baslik: string; kazanim: string | null; soru: number }
export type GenelTest = { id: string; baslik: string; soru: number }

export type VideoBolumu = { t: number; ad: string }
export type VideoSoru = { t: number; s: string; sik: string[]; d: number; c?: string }
export type VideoAltyazisi = { lang: string; label: string; url: string }
type EskiVideoAltyazisi = { lang?: string; label?: string; url?: string; dil?: string; ad?: string; src?: string }
export type DersVideosu = {
  src: string
  sure: number
  baslik?: string
  poster?: string
  bolumler?: VideoBolumu[]
  sorular?: VideoSoru[]
  subtitles?: VideoAltyazisi[]
  altyazi?: EskiVideoAltyazisi[]
  guncel?: string
  canli?: import('../components/canliBoya').CanliVeri
}

export type Konu = {
  kod: string
  ad: string
  gizli?: boolean
  kazanimlar: string[]
  test: string
  seviyeler: Seviye[]
  soru: number
  baglam: BaglamTest[]
  anlatim: boolean
  etkinlik: number
  video?: DersVideosu
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
  beceriler?: string[]
  gorselTamSoru?: boolean // Soru ve şıklar görselin içinde; yanıtta yalnız harfler gösterilir.
  id?: string
  s: string // HTML soru metni
  sik: string[] // HTML şıklar
  d: number // doğru şık sırası (0'dan)
  c?: string // HTML çözüm
  z?: string // zorluk
  k?: string // kazanım (sarmal/karma sorularında tahmini etiket)
}

export type TestDosyasi = {
  id: string
  baslik: string
  tur: 'kazanim' | 'baglam' | 'sarmal' | 'karma'
  testler: { seviye: Seviye; sorular: Soru[] }[]
  legacyTestler?: { seviye: Seviye; sorular: Soru[] }[]
  silindi?: boolean
}

let mufredat = mufredatData as unknown as Record<string, SinifMufredat>

function altyazilariEsle(data: Record<string, SinifMufredat>) {
  for (const sinif of Object.values(data)) {
    for (const tema of sinif.temalar ?? []) {
      for (const bolum of tema.bolumler ?? []) {
        for (const konu of bolum.konular ?? []) {
          if (!konu.video || konu.video.subtitles?.length || !konu.video.altyazi?.length) continue
          const subtitles = konu.video.altyazi.flatMap(track => {
            const source = track.url || track.src
            if (!source) return []
            const lang = track.lang || track.dil || 'tr'
            // Eski müfredat altyazıyı `video/9/1.1.1.tr.vtt` olarak
            // işaretliyordu. Yayın hizmetinin sakladığı dosya adı
            // `video/9/1.1.1.altyazi.tr.vtt`; eski kaydı bu adrese eşle.
            const correctedSource = source.replace(/\.tr\.vtt(?=([?#]|$))/i, '.altyazi.tr.vtt')
            return [{
              lang,
              label: track.label || track.ad || (lang === 'tr' ? 'Türkçe' : lang),
              url: /^https?:\/\//i.test(correctedSource) ? correctedSource : publishedContentUrl(correctedSource),
            }]
          })
          if (subtitles.length) konu.video = { ...konu.video, subtitles }
        }
      }
    }
  }
  return data
}

export async function loadPublishedCurriculum() {
  await preparePublishedContent()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetch(publishedContentUrl('mufredat.json'), { cache: 'no-cache', signal: controller.signal })
    if (!response.ok) return
    const data = await response.json() as Record<string, SinifMufredat>
    if (Object.values(data).every(g => Array.isArray(g.temalar) && g.kazanimlar && Array.isArray(g.karma))) mufredat = altyazilariEsle(data)
  } catch { /* Offline: use bundled curriculum. */ } finally { clearTimeout(timer) }
}

export function sinifMufredati(grade: number | null): SinifMufredat | null {
  const data = grade === null ? null : mufredat[String(grade)] ?? null
  if (!data) return null
  return { ...data, temalar: data.temalar.map(t => ({ ...t, bolumler: t.bolumler.map(b => ({ ...b, konular: b.konular.filter(k => !k.gizli) })) })) }
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

export function videoAdresi(src: string): string {
  return icerikYolu(src)
}

export function sureYazi(seconds: number): string {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`
}

export function dersVideolari(grade: number): Promise<Record<string, DersVideosu>> {
  return Promise.resolve(Object.fromEntries(tumKonular(grade).flatMap(({ konu }) => konu.video ? [[konu.kod, konu.video] as const] : [])))
}

// İçerikteki img/... yollarını uygulamanın adresine çevirir.
export function icerikHtml(html: string): string {
  return html.replace(/(src=["'])(img\/[^"'<> ]+)/g, (_match, quote: string, path: string) => quote + publishedContentUrl(path))
}

export function icerikYolu(path: string): string {
  return publishedContentUrl(path)
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

export function ayrintiliAnlatim(grade: number, kod: string) {
  return load<Record<string, string>>(grade + '/anlatim-detay.json', 'json').then(data => icerikHtml(pick(data, kod)))
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

// ---------- Laboratuvar deneyi föyleri ----------

export type DeneyFoyu = {
  tur?: undefined
  ad: string
  amac: string
  sure?: string
  malzemeler: string[]
  guvenlik: string[]
  adimlar: string[]
  tablo?: { basliklar: string[]; satirlar: string[][] } // boş hücreler "" — öğrenci doldurur
  sorular: { s: string; c: string }[]
  ipucu?: string
}

// Yönetimden (Deney Atölyesi lab paketi) eklenen sanal lab; aynı dosyada tur:'lab' ile durur.
export type LabPaketi = { tur: 'lab'; ad: string; baslik: string; guncel?: string; deney: Record<string, unknown> }

export function deneyFoyleri(grade: number, kod: string): Promise<DeneyFoyu[]> {
  return deneyKayitlari(grade, kod).then(list => list.filter((x): x is DeneyFoyu => x?.tur !== 'lab'))
}

export function deneyKayitlari(grade: number, kod: string): Promise<(DeneyFoyu | LabPaketi)[]> {
  return load<Record<string, (DeneyFoyu | LabPaketi)[]>>(`${grade}/deney-foyleri.json`, 'json').then(data => (Array.isArray(data[kod]) ? data[kod] : []))
}

// ---------- Yazılıya hazırlık ----------

export type YaziliMadde = { h: string; p: number; s: string; c: string; beceriler?: string[] }
export type YaziliSoru = { baglam: string; maddeler: YaziliMadde[]; kazanim: string; puan: number }
export type YaziliSinav = {
  id: string
  donem: number
  yazili: number
  senaryo: number
  sure: number
  sorular: YaziliSoru[]
  aktif?: boolean
  tarih?: string
  pdfAvailable?: boolean
}
export type YaziliFoy = { id: string; baslik: string; aciklama?: string; pdf: string; boyut?: number; aktif?: boolean }
export type YaziliDosyasi = {
  acik?: boolean
  kapaliMesaj?: string
  foyler?: YaziliFoy[]
  sinavlar: YaziliSinav[]
  tumu: { donem: number; yazili: number }[]
  kazanimlar: Record<string, string>
}

export function yazililar(grade: number) {
  // Panelde "Yazılıya hazırlık" kapatılınca senaryolar ve föyler gizlenir; yalnız kapalı mesajı görünür.
  return load<YaziliDosyasi>(`${grade}/yazili.json`, 'json').then(d => d.acik === false
    ? { ...d, sinavlar: [], foyler: [] }
    : { ...d, sinavlar: d.sinavlar.filter(s => s.aktif !== false), foyler: (d.foyler ?? []).filter(f => f.aktif !== false && /^pdf\/[\w/-]+\.pdf$/.test(f.pdf)) })
}

export function foyAdresi(foy: YaziliFoy) {
  return icerikYolu(foy.pdf)
}

export function yaziliPdfAdi(grade: number, sinav: YaziliSinav) {
  return `${grade}-sinif-${sinav.donem}-donem-${sinav.yazili}-yazili-senaryo-${sinav.senaryo}`
}

// Bir testin sorularına varsayılan kazanım: bağlam testinin kazanımı ya da
// tek kazanımlı konunun kazanımı. Sarmal/karma sorularında soru kendi "k"sını taşır.
export function testKazanimi(grade: number, testId: string): string | null {
  for (const { konu } of tumKonular(grade)) {
    const b = konu.baglam.find(x => x.id === testId)
    if (b) return b.kazanim
    if (konu.test === testId) return konu.kazanimlar.length === 1 ? konu.kazanimlar[0] : null
  }
  return null
}

