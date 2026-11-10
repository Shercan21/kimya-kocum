import { FOYLU_KONULAR } from './foyIndex'

// Konulara bağlı sanal deneyler (animasyonlu, dokunmatik). Anahtar: "sınıf:konu kodu"
export type SimTanim = { tur: string; baslik: string; modlar?: string[] }

const DENEYLER: Record<string, SimTanim[]> = {
  '10:1.2.1': [{ tur: 'gaz', baslik: 'Kaptaki gaz tanecikleri', modlar: ['serbest'] }],
  '10:1.2.2-A': [{ tur: 'gaz', baslik: 'Gaz yasaları laboratuvarı', modlar: ['boyle', 'charles', 'avogadro'] }],
  '10:1.2.2-B': [{ tur: 'gaz', baslik: 'Basınç–sıcaklık ve birleşik gaz yasası', modlar: ['gaylussac', 'serbest'] }],
  '10:1.2.3': [{ tur: 'gaz', baslik: 'İdeal gaz denklemi', modlar: ['ideal', 'boyle', 'charles', 'gaylussac', 'avogadro'] }],
  '10:1.2.4': [{ tur: 'difuzyon', baslik: 'Cam boruda difüzyon (NH₃ – HCl)' }],

  '11:1.1.1': [{ tur: 'kalorimetre', baslik: 'Kalorimetre: çözünme ısısı', modlar: ['cozunme', 'yakit'] }],
  '11:1.1.2': [{ tur: 'kalorimetre', baslik: 'Kalorimetre: yakıtların enerjisi', modlar: ['yakit', 'cozunme'] }],
  '11:1.1.3': [{ tur: 'entalpi', baslik: 'Bağ kır, bağ kur: tepkime entalpisi' }],
  '11:1.1.4': [{ tur: 'entalpi', baslik: 'Enerji diyagramı ve tepkime entalpisi' }],
  '11:1.2.1': [{ tur: 'hiz', baslik: 'Çarpışma teorisi ve aktivasyon enerjisi' }],
  '11:1.2.2': [{ tur: 'hiz', baslik: 'Derişim–zaman grafiği ve ortalama hız' }],
  '11:1.2.3': [{ tur: 'hiz', baslik: 'Sıcaklık, derişim ve katalizörün hıza etkisi' }],
  '11:1.2.4': [{ tur: 'hiz', baslik: 'Derişim ve hız ilişkisi' }],
  '11:2.1.1': [{ tur: 'denge', baslik: 'N₂O₄ ⇌ 2NO₂ tersinir tepkimesi' }],
  '11:2.1.2': [{ tur: 'denge', baslik: 'Dinamik denge' }],
  '11:2.1.3': [{ tur: 'denge', baslik: 'Denge ve denge sabiti' }],
  '11:2.1.4': [{ tur: 'denge', baslik: 'Tepkime oranı (Q) ile dengeyi izle' }],
  '11:2.1.5': [{ tur: 'denge', baslik: 'Le Chatelier laboratuvarı' }],
  '11:2.2.1': [{ tur: 'ph', baslik: 'Suyun iyonlaşması ve sıcaklık', modlar: ['su', 'cozelti'] }],
  '11:2.2.2': [{ tur: 'ph', baslik: 'Asit ve bazlar suda', modlar: ['cozelti', 'urun'] }],
  '11:2.2.3': [{ tur: 'ph', baslik: 'Kuvvetli ve zayıf asit–baz', modlar: ['cozelti'] }],
  '11:2.2.4': [{ tur: 'ph', baslik: 'pH laboratuvarı', modlar: ['cozelti', 'su', 'urun'] }],
  '11:2.2.5': [{ tur: 'titrasyon', baslik: 'Nötralleşme ve indikatörler' }],
  '11:2.2.6': [{ tur: 'titrasyon', baslik: 'Sanal titrasyon' }],
  '11:2.2.7': [{ tur: 'ph', baslik: 'Evdeki ürünlerin pH değeri', modlar: ['urun'] }],
  '11:2.3.1': [{ tur: 'kcc', baslik: 'Az çözünen tuzlar ve Kçç' }],
  '11:2.3.2': [{ tur: 'kcc', baslik: 'Ortak iyon ve sıcaklık etkisi' }],
  '11:3.1.1': [{ tur: 'elektroliz', baslik: 'Suyun elektrolizi ve yeşil hidrojen' }],
}

export function konuDeneyleri(grade: number, kod: string): SimTanim[] {
  return DENEYLER[`${grade}:${kod}`] ?? []
}

export function konudaFoyVar(grade: number, kod: string): boolean {
  return FOYLU_KONULAR.has(`${grade}:${kod}`)
}
