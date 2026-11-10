import type { GazModu } from '../components/sims/GasSim'

// Konulara bağlı sanal deneyler (animasyonlu, dokunmatik). Anahtar: "sınıf:konu kodu"
export type Deney =
  | { tur: 'gaz'; baslik: string; modlar: GazModu[] }
  | { tur: 'difuzyon'; baslik: string }

const DENEYLER: Record<string, Deney[]> = {
  '10:1.2.1': [{ tur: 'gaz', baslik: 'Kaptaki gaz tanecikleri', modlar: ['serbest'] }],
  '10:1.2.2-A': [{ tur: 'gaz', baslik: 'Gaz yasaları laboratuvarı', modlar: ['boyle', 'charles', 'avogadro'] }],
  '10:1.2.2-B': [{ tur: 'gaz', baslik: 'Basınç–sıcaklık ve birleşik gaz yasası', modlar: ['gaylussac', 'serbest'] }],
  '10:1.2.3': [{ tur: 'gaz', baslik: 'İdeal gaz denklemi', modlar: ['ideal', 'boyle', 'charles', 'gaylussac', 'avogadro'] }],
  '10:1.2.4': [{ tur: 'difuzyon', baslik: 'Cam boruda difüzyon (NH₃ – HCl)' }],
}

export function konuDeneyleri(grade: number, kod: string): Deney[] {
  return DENEYLER[`${grade}:${kod}`] ?? []
}
