import { useState } from 'react'
import './App.css'
import Icon, { type IconName } from './components/Icon'
import TodayPage from './components/TodayPage'
import TopicMap from './components/TopicMap'
import ProgramPage from './components/ProgramPage'
import StudyTopics from './components/StudyTopics'
import LearningTracker from './components/LearningTracker'
import QuestionBankManager from './components/QuestionBankManager'
import Onboarding from './components/Onboarding'
import { loadProfile, saveProfile, type StudentProfile, type StudyPurpose } from './data/profile'
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

  function changePage(next: PageId) {
    setPage(next)
    localStorage.setItem(PAGE_KEY, next)
    window.scrollTo({ top: 0 })
  }

  function selectGrade(grade: number) {
    setSelectedGrade(grade)
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
          <span className="avatar">{selectedGrade ?? '?'}</span>
          <span className="label">
            {selectedGrade ? `${selectedGrade}. sınıf` : 'Sınıfını seç'}
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
          {selectedGrade ?? '?'}
        </button>

        {page === 'today' && (
          <TodayPage
            selectedGrade={selectedGrade}
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

        {page === 'lessons' && (
          <div className="stack">
            <section className="card">
              <h3 className="card-title">Hangi sınıftasın?</h3>
              <div className="grade-picker" role="group" aria-label="Sınıf seçimi">
                {grades.map(grade => (
                  <button
                    key={grade}
                    type="button"
                    className={selectedGrade === grade ? 'chip is-active' : 'chip'}
                    onClick={() => selectGrade(grade)}
                    aria-pressed={selectedGrade === grade}
                  >
                    {grade}. sınıf
                  </button>
                ))}
              </div>
            </section>

            {/* Sınıf değişince bileşenler yeni sınıfın verisiyle açılsın. */}
            <div className="stack" key={selectedGrade ?? 'none'}>
              <StudyTopics selectedGrade={selectedGrade} />
              <LearningTracker selectedGrade={selectedGrade} />
            </div>
          </div>
        )}

        {page === 'exams' && (
          <section className="card coming">
            <Icon name="file" size={28} />
            <h2>Yazılıya hazırlık ve TYT/AYT</h2>
            <p>
              Senaryoya uygun yazılı provası, açık uçlu cevap değerlendirmesi
              ve TYT/AYT denemeleri bu bölüme gelecek.
            </p>
            <span className="badge">Hazırlanıyor</span>
          </section>
        )}

        {page === 'program' && (
          <ProgramPage
            profile={profile}
            onProfileChange={setProfile}
            onOpenLessons={() => changePage('lessons')}
          />
        )}

        {page === 'progress' && (
          <ProgressPage
            grade={selectedGrade}
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
  grade,
  onOpenLessons,
}: {
  grade: number | null
  onOpenLessons: () => void
}) {
  const learned =
    grade === null
      ? []
      : loadTopics().filter(
          topic =>
            topic.grade === grade &&
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
              <span className="task-title">{topic.title}</span>
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
  grade,
  onOpenLessons,
}: {
  grade: number | null
  onOpenLessons: () => void
}) {
  const summary = grade === null ? null : getGradeLearningSummary(grade)

  return (
    <div className="today-grid">
      <div className="col">
        <section className="card">
          <h3 className="card-title">
            <Icon name="chart" />
            Öğrenme durumum
          </h3>
          {summary === null ? (
            <p className="muted">Gelişimini görmek için önce sınıfını seç.</p>
          ) : (
            <div className="stats">
              <div className="stat"><small>Çalışıldı</small><b>{summary.studied}</b></div>
              <div className="stat"><small>Öğrenildi</small><b>{summary.learned}</b></div>
              <div className="stat"><small>Kalıcı</small><b>{summary.permanent}</b></div>
            </div>
          )}
        </section>
        <ReviewPage grade={grade} onOpenLessons={onOpenLessons} />
      </div>
      <div className="col">
        <TopicMap grade={grade} onOpenLessons={onOpenLessons} />
      </div>
    </div>
  )
}

export default App
