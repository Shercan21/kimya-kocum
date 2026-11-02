// Öğrenci profili ve ilk giriş (plan §1, §2).

export type StudyPurpose =
  | 'long_term'
  | 'school'
  | 'written_exam'
  | 'tyt_ayt'
  | 'topic'
  | 'practice'
  | 'gaps'

export const purposes: {
  id: StudyPurpose
  title: string
  detail: string
}[] = [
  {
    id: 'long_term',
    title: 'Bütün yıl veya sınava kadar Kimya Koçu ile çalışmak istiyorum',
    detail: 'Sana özel uzun vadeli program, takip ve tekrar',
  },
  { id: 'school', title: 'Okul derslerime çalışmak istiyorum', detail: 'Okulun güncel ünitesine göre' },
  { id: 'written_exam', title: 'Okul yazılıma hazırlanmak istiyorum', detail: 'Yazılı kapsamına göre hedefli hazırlık' },
  { id: 'tyt_ayt', title: "TYT / AYT'ye hazırlanmak istiyorum", detail: 'Eksik kazanımlar ve sınav hedefi' },
  { id: 'topic', title: 'Belirli bir konuyu öğrenmek istiyorum', detail: 'Tek bir konuya odaklan' },
  { id: 'practice', title: 'Soru çözmek istiyorum', detail: 'Seviyene uygun sorular' },
  { id: 'gaps', title: 'Eksiklerimi belirlemek istiyorum', detail: 'Kısa ön değerlendirme' },
]

export type Sinav = 'TYT' | 'AYT' | 'TYT_AYT'

// Sınavların kapsadığı sınıflar. AYT'nin 12. sınıf kısmı yeni Maarif
// programı gelince eklenecek.
export const SINAV_SINIFLARI: Record<Sinav, number[]> = {
  TYT: [9, 10],
  AYT: [11],
  TYT_AYT: [9, 10, 11],
}

export const SINAV_AD: Record<Sinav, string> = {
  TYT: 'TYT',
  AYT: 'AYT',
  TYT_AYT: 'TYT + AYT',
}

export type StudentProfile = {
  purpose: StudyPurpose
  grade: number
  sinav?: Sinav
  dailyMinutes: number
  days: number[]
  goal: string
  contractAccepted: boolean
  createdAt: string
  updatedAt: string
}

export const PROFILE_KEY = 'kimya-kocum-profile-v1'
const PREFERENCES_KEY = 'kimya-kocum-study-preferences'
const GRADE_KEY = 'kimya-kocum-grade'
const GOAL_KEY = 'kimya-kocum-goal'

export function purposeTitle(id: StudyPurpose): string {
  return purposes.find(item => item.id === id)?.title ?? ''
}

export function loadProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<StudentProfile>
    if (
      !data ||
      !purposes.some(item => item.id === data.purpose) ||
      typeof data.grade !== 'number' ||
      ![9, 10, 11, 12].includes(data.grade) ||
      typeof data.dailyMinutes !== 'number' ||
      !Array.isArray(data.days)
    ) {
      return null
    }
    return {
      purpose: data.purpose as StudyPurpose,
      grade: data.grade,
      dailyMinutes: data.dailyMinutes,
      days: data.days.filter(day => Number.isInteger(day) && day >= 0 && day <= 6),
      goal: typeof data.goal === 'string' ? data.goal : '',
      contractAccepted: data.contractAccepted === true,
      ...(data.sinav === 'TYT' || data.sinav === 'AYT' || data.sinav === 'TYT_AYT'
        ? { sinav: data.sinav }
        : {}),
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString(),
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

// Öğrencinin çalıştığı sınıflar: TYT/AYT hazırlığında sınavın sınıfları,
// diğer durumlarda kendi sınıfı.
export function profilSiniflari(profile: StudentProfile | null): number[] {
  if (!profile) return []
  if (profile.purpose === 'tyt_ayt' && profile.sinav) return SINAV_SINIFLARI[profile.sinav]
  return [profile.grade]
}

// Mevcut çalışma tercihlerindeki hedef türüne çevirir.
function preferenceGoal(purpose: StudyPurpose): string {
  if (purpose === 'written_exam') return 'exam'
  if (purpose === 'tyt_ayt') return 'tyt'
  if (purpose === 'gaps' || purpose === 'practice') return 'review'
  return 'school'
}

// Profili kaydeder ve uygulamanın diğer bölümlerinin okuduğu
// sınıf, hedef ve çalışma tercihlerini de günceller.
export function saveProfile(profile: StudentProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  localStorage.setItem(GRADE_KEY, String(profile.grade))
  if (profile.goal.trim()) localStorage.setItem(GOAL_KEY, profile.goal.trim())
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify({
      dailyMinutes: profile.dailyMinutes,
      days: [...profile.days].sort((a, b) => a - b),
      goal: preferenceGoal(profile.purpose),
    })
  )
}
