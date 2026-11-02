import { useState } from 'react'
import './App.css'
import Icon, { type IconName } from './components/Icon'
import TodayPage from './components/TodayPage'
import TopicMap from './components/TopicMap'
import ProgramPage from './components/ProgramPage'
import CurriculumPage from './components/CurriculumPage'
import TopicPage from './components/TopicPage'
import ExamsPage from './components/ExamsPage'
import { sinifMufredati } from './data/content'
import StudyTopics from './components/StudyTopics'
import LearningTracker from './components/LearningTracker'
import QuestionBankManager from './components/QuestionBankManager'
import Onboarding from './components/Onboarding'
import {
  loadProfile,
  profilSiniflari,
  saveProfile,
  SINAV_AD,
  SINAV_SINIFLARI,
  type Sinav,
  type StudentProfile,
  type StudyPurpose,
} from './data/profile'
import { loadTopics } from './data/topics'
import {
  getGradeLearningSummary,
  getTopicProgress,
} from './data/learningProgress'

type PageId = 'today' | 'program' | 'lessons' | 'exams' | 'progress'

const pages: { id: PageId; label: string; short: string; icon: IconName }[] = [
  { id: 'today', label: 'Bugün', short: 'Bugün', icon: 'home' },
  { id: 'program', label: 'Programım', short: 'Program', icon: 'calendar' },
  { id: 'lessons', label: 'Derslerim', short: 'Dersler', icon: 'book' },
  { id: 'exams', label: 'Yazılı ve TYT/AYT', short: 'Sınav', icon: 'file' },
  { id: 'progress', label: 'Gelişimim', short: 'Gelişim', icon: 'chart' },
]

const grades = [9, 10, 11, 12]

// İlk girişten sonra amaca göre açılacak sayfa.
const startPage: Record<StudyPurpose, PageId> = {
  long_term: 'program',
  school: 'today',
  written_exam: 'exams',
  tyt_ayt: 'program',
  topic: 'lessons',
  practice: 'lessons',
  gaps: 'lessons',
}

const PAGE_KEY = 'kimya-kocum-page'
const GOAL_KEY = 'kimya-kocum-goal'
const GRADE_KEY = 'kimya-kocum-grade'
const VIEW_KEY = 'kimya-kocum-ders-gorunum'

function App() {
  const [page, setPage] = useState<PageId>(() => {
    const saved = localStorage.getItem(PAGE_KEY)
    return pages.some(item => item.id === saved) ? (saved as PageId) : 'today'
  })

  const [studentGoal, setStudentGoal] = useState<string>(
    () => localStorage.getItem(GOAL_KEY) || ''
  )

  const [selectedGrade, setSelectedGrade] = useState<number | null>(() => {
    const saved = Number(localStorage.getItem(GRADE_KEY))
    return grades.includes(saved) ? saved : null
  })

  const [profile, setProfile] = useState<StudentProfile | null>(loadProfile)
  const [editingProfile, setEditingProfile] = useState(false)
  const [openTopic, setOpenTopic] = useState<{ grade: number; kod: string } | null>(null)

  // Derslerim'de gösterilen sınıf ya da sınav (TYT: 9+10, AYT: 11)
  const [gorunum, setGorunum] = useState<number | Sinav | null>(() => {
    const saved = localStorage.getItem(VIEW_KEY)
    if (saved === 'TYT' || saved === 'AYT' || saved === 'TYT_AYT') return saved
    if (saved && grades.includes(Number(saved))) return Number(saved)
    const p = loadProfile()
    if (p?.purpose === 'tyt_ayt' && p.sinav) return p.sinav
    return p?.grade ?? null
  })

  function changeView(next: number | Sinav) {
    setGorunum(next)
    setOpenTopic(null)
    localStorage.setItem(VIEW_KEY, String(next))
    if (typeof next === 'number') selectGrade(next)
  }

  function changePage(next: PageId) {
    setPage(next)
    setOpenTopic(null)
    localStorage.setItem(PAGE_KEY, next)
    window.scrollTo({ top: 0 })
  }

  function selectGrade(grade: number) {
    setSelectedGrade(grade)
    setOpenTopic(null)
    localStorage.setItem(GRADE_KEY, String(grade))
    if (profile) {
      const next = { ...profile, grade, updatedAt: new Date().toISOString() }
      saveProfile(next)
      setProfile(next)
    }
  }

  function updateStudentGoal(goal: string) {
    setStudentGoal(goal)
    if (goal.trim()) localStorage.setItem(GOAL_KEY, goal)
    else localStorage.removeItem(GOAL_KEY)
  }

  function finishOnboarding(next: StudentProfile) {
    setProfile(next)
    setEditingProfile(false)
    setSelectedGrade(next.grade)
    const view = next.purpose === 'tyt_ayt' && next.sinav ? next.sinav : next.grade
    setGorunum(view)
    localStorage.setItem(VIEW_KEY, String(view))
    setStudentGoal(localStorage.getItem(GOAL_KEY) || '')
    changePage(startPage[next.purpose])
  }

  if (!profile || editingProfile) {
    return (
      <Onboarding
        initial={profile}
        onDone={finishOnboarding}
        onCancel={profile ? () => setEditingProfile(false) : undefined}
      />
    )
  }

  const current = pages.find(item => item.id === page)!
  const activeGrades = profilSiniflari(profile)
  const isExam = profile.purpose === 'tyt_ayt' && !!profile.sinav
  const activeLabel = isExam && profile.sinav ? SINAV_AD[profile.sinav] : undefined
  const avatar = isExam && profile.sinav ? (profile.sinav === 'TYT_AYT' ? 'T+A' : profile.sinav) : selectedGrade ?? '?'
  const viewGrades = gorunum === null ? [] : typeof gorunum === 'number' ? [gorunum] : SINAV_SINIFLARI[gorunum]
  const contentGrades = viewGrades.filter(grade => sinifMufredati(grade))

  return (
    <div className="app">
      <aside className="side" aria-label="Ana menü">
        <div className="brand">
          <span className="brand-mark"><Icon name="flask" /></span>
          <span className="label">Kimya Koçum</span>
        </div>

        <nav className="side-nav">
          {pages.map(item => (
            <button
              key={item.id}
              type="button"
              className={item.id === page ? 'nav-item is-active' : 'nav-item'}
              onClick={() => changePage(item.id)}
              aria-current={item.id === page ? 'page' : undefined}
              title={item.label}
            >
              <Icon name={item.icon} />
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="profile"
          onClick={() => setEditingProfile(true)}
          title="Çalışma amacını ve düzenini değiştir"
        >
          <span className="avatar">{avatar}</span>
          <span className="label">
            {activeLabel ? `${activeLabel} hazırlığı` : selectedGrade ? `${selectedGrade}. sınıf` : 'Sınıfını seç'}
            <small>Amacımı değiştir</small>
          </span>
        </button>
      </aside>

      <main className="main">
        <button
          type="button"
          className="mobile-profile"
          onClick={() => setEditingProfile(true)}
          aria-label="Çalışma amacını ve düzenini değiştir"
        >
          {avatar}
        </button>

        {page === 'today' && (
          <TodayPage
            selectedGrade={selectedGrade}
            grades={activeGrades}
            gradeLabel={activeLabel}
            studentGoal={studentGoal}
            onGoalChange={updateStudentGoal}
            onOpenLessons={() => changePage('lessons')}
          />
        )}

        {page !== 'today' && (
          <div className="page-head">
            <div>
              <small>Kimya Koçum</small>
              <h1>{current.label}</h1>
            </div>
          </div>
        )}

        {page === 'lessons' && openTopic && (
          <TopicPage
            key={`${openTopic.grade}-${openTopic.kod}`}
            grade={openTopic.grade}
            kod={openTopic.kod}
            onBack={() => {
              setOpenTopic(null)
              window.scrollTo({ top: 0 })
            }}
          />
        )}

        {page === 'lessons' && !openTopic && (
          <div className="stack">
            <section className="card">
              <h3 className="card-title">Ne çalışmak istiyorsun?</h3>
              <div className="grade-picker" role="group" aria-label="Sınıf ya da sınav seçimi">
                {grades.map(grade => (
                  <button
                    key={grade}
                    type="button"
                    className={gorunum === grade ? 'chip is-active' : 'chip'}
                    onClick={() => changeView(grade)}
                    aria-pressed={gorunum === grade}
                  >
                    {grade}. sınıf
                  </button>
                ))}
                <span className="picker-sep" aria-hidden="true" />
                {(['TYT', 'AYT'] as const).map(sinav => (
                  <button
                    key={sinav}
                    type="button"
                    className={gorunum === sinav ? 'chip is-active' : 'chip'}
                    onClick={() => changeView(sinav)}
                    aria-pressed={gorunum === sinav}
                  >
                    {sinav}
                    <small>{SINAV_SINIFLARI[sinav].join(' + ')}. sınıf</small>
                  </button>
                ))}
              </div>
              {gorunum === 'AYT' && (
                <p className="muted small picker-note">
                  AYT'nin 12. sınıf konuları yeni Maarif programı yayımlanınca eklenecek.
                </p>
              )}
            </section>

            {contentGrades.map(grade => (
              <div key={grade} className="stack">
                {viewGrades.length > 1 && <h2 className="section-title">{grade}. sınıf konuları</h2>}
                <CurriculumPage
                  grade={grade}
                  onOpenTopic={kod => {
                    setOpenTopic({ grade, kod })
                    window.scrollTo({ top: 0 })
                  }}
                />
              </div>
            ))}

            {typeof gorunum === 'number' && !sinifMufredati(gorunum) && (
              /* İçeriği henüz hazır olmayan sınıflarda kendi konularını ekleyebilir. */
              <div className="stack" key={gorunum}>
                <p className="program-message">
                  {gorunum}. sınıfın konu anlatımı ve testleri yeni Maarif programıyla hazırlanacak. Şimdilik kendi konularını ekleyip takip edebilirsin.
                </p>
                <StudyTopics selectedGrade={gorunum} />
                <LearningTracker selectedGrade={gorunum} />
              </div>
            )}
          </div>
        )}

        {page === 'exams' && <ExamsPage grades={activeGrades} label={activeLabel} />}

        {page === 'program' && (
          <ProgramPage
            profile={profile}
            onProfileChange={setProfile}
            onOpenLessons={() => changePage('lessons')}
          />
        )}

        {page === 'progress' && (
          <ProgressPage
            grades={activeGrades}
            label={activeLabel}
            onOpenLessons={() => changePage('lessons')}
          />
        )}

        {import.meta.env.DEV && (
          <details className="dev-tools">
            <summary>
              <Icon name="tools" size={18} />
              Geliştirme araçları · soru havuzu
            </summary>
            <QuestionBankManager />
          </details>
        )}
      </main>

      <nav className="tabbar" aria-label="Alt menü">
        {pages.map(item => (
          <button
            key={item.id}
            type="button"
            className={item.id === page ? 'tab is-active' : 'tab'}
            onClick={() => changePage(item.id)}
            aria-current={item.id === page ? 'page' : undefined}
          >
            <Icon name={item.icon} size={22} />
            {item.short}
          </button>
        ))}
      </nav>
    </div>
  )
}

function ReviewPage({
  grades,
  onOpenLessons,
}: {
  grades: number[]
  onOpenLessons: () => void
}) {
  const learned = loadTopics().filter(
    topic =>
      grades.includes(topic.grade) &&
      getTopicProgress(topic.grade, topic.id)?.status === 'learned'
  )

  return (
    <section className="card">
      <h3 className="card-title">
        <Icon name="repeat" />
        Kalıcı hâle getirilecek konular
      </h3>
      {learned.length === 0 ? (
        <p className="muted">
          Öğrendiğin konular burada görünür. Programım sayfasındaki
          program oluşturucu bunlara 1, 3, 7, 14 ve 30 gün sonra tekrar
          görevi ekler.
        </p>
      ) : (
        <ul className="task-list">
          {learned.map(topic => (
            <li key={topic.id}>
              <span className="task-check tone-teal"><Icon name="check" /></span>
              <span className="task-title">
                {topic.title}
                {grades.length > 1 && <small className="muted"> · {topic.grade}. sınıf</small>}
              </span>
              <button type="button" className="btn-secondary" onClick={onOpenLessons}>
                Tekrar et
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ProgressPage({
  grades,
  label,
  onOpenLessons,
}: {
  grades: number[]
  label?: string
  onOpenLessons: () => void
}) {
  const summaries = grades.map(grade => getGradeLearningSummary(grade))
  const total = (key: 'studied' | 'learned' | 'permanent') =>
    summaries.reduce((sum, item) => sum + item[key], 0)

  return (
    <div className="today-grid">
      <div className="col">
        <section className="card">
          <h3 className="card-title">
            <Icon name="chart" />
            Öğrenme durumum
            {label && <span className="card-link">{label}</span>}
          </h3>
          {grades.length === 0 ? (
            <p className="muted">Gelişimini görmek için önce sınıfını seç.</p>
          ) : (
            <div className="stats">
              <div className="stat"><small>Çalışıldı</small><b>{total('studied')}</b></div>
              <div className="stat"><small>Öğrenildi</small><b>{total('learned')}</b></div>
              <div className="stat"><small>Kalıcı</small><b>{total('permanent')}</b></div>
            </div>
          )}
        </section>
        <ReviewPage grades={grades} onOpenLessons={onOpenLessons} />
      </div>
      <div className="col">
        <TopicMap grades={grades} label={label} onOpenLessons={onOpenLessons} />
      </div>
    </div>
  )
}

export default App
