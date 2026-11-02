import { useState } from 'react'
import './App.css'
import Icon, { type IconName } from './components/Icon'
import TodayPage from './components/TodayPage'
import TopicMap from './components/TopicMap'
import ProgramPage from './components/ProgramPage'
import CurriculumPage from './components/CurriculumPage'
import TopicPage from './components/TopicPage'
import ExamsPage from './components/ExamsPage'
import MistakeBook from './components/MistakeBook'
import { useHataDefteri } from './data/mistakes'
import { sinifMufredati } from './data/content'
import StudyTopics from './components/StudyTopics'
import LearningTracker from './components/LearningTracker'
import QuestionBankManager from './components/QuestionBankManager'
import Onboarding from './components/Onboarding'
import AccountCard from './components/AccountCard'
import { isTeacher, syncNow, useCloud } from './data/cloud'
import TeacherPanel from './components/TeacherPanel'
import {
  loadProfile,
  profilSiniflari,
  profilEtiketi,
  SINAV_SINIFLARI,
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
const VIEW_KEY = 'kimya-kocum-ders-gorunum'
const TEACHER_KEY = 'kimya-kocum-ogretmen'
const TEACHER_GRADE_KEY = 'kimya-kocum-ogretmen-sinif'
const ALL_GRADES = [9, 10, 11, 12] as const

function App() {
  const [page, setPage] = useState<PageId>(() => {
    const saved = localStorage.getItem(PAGE_KEY)
    return pages.some(item => item.id === saved) ? (saved as PageId) : 'today'
  })

  const [studentGoal, setStudentGoal] = useState<string>(
    () => localStorage.getItem(GOAL_KEY) || ''
  )

  const [profile, setProfile] = useState<StudentProfile | null>(loadProfile)
  const [editingProfile, setEditingProfile] = useState(false)
  const [openTopic, setOpenTopic] = useState<{ grade: number; kod: string } | null>(null)
  const [mistakesOpen, setMistakesOpen] = useState(false)
  const [teacherOpen, setTeacherOpen] = useState(false)

  // 12. sınıf / mezun Derslerim'de TYT (9+10), AYT (11) ve 12 arasında geçer.
  // 9, 10 ve 11. sınıflar yalnızca kendi sınıflarını görür; seçici gösterilmez.
  type Gorunum = 'TYT' | 'AYT' | 12
  const [gorunum, setGorunum] = useState<Gorunum>(() => {
    const saved = localStorage.getItem(VIEW_KEY)
    return saved === 'AYT' ? 'AYT' : saved === '12' ? 12 : 'TYT'
  })

  // Öğretmen görünümü: öğretmen hesabıyla giriş yapınca ya da onboarding'de
  // logoya 5 kez dokununca bütün sınıfların dersleri ve yazılıları açılır.
  const cloud = useCloud()
  const [ogretmenYerel, setOgretmenYerel] = useState(() => localStorage.getItem(TEACHER_KEY) === '1')
  const [ogretmenSinif, setOgretmenSinif] = useState<number>(() => {
    const saved = Number(localStorage.getItem(TEACHER_GRADE_KEY))
    return ALL_GRADES.includes(saved as 9) ? saved : 9
  })
  const teacherAccount = isTeacher(cloud.user)
  const teacherView = teacherAccount || ogretmenYerel

  function setTeacherLocal(on: boolean) {
    setOgretmenYerel(on)
    if (on) localStorage.setItem(TEACHER_KEY, '1')
    else localStorage.removeItem(TEACHER_KEY)
  }

  function changeTeacherGrade(next: number) {
    setOgretmenSinif(next)
    setOpenTopic(null)
    localStorage.setItem(TEACHER_GRADE_KEY, String(next))
  }

  function changeView(next: Gorunum) {
    setGorunum(next)
    setOpenTopic(null)
    localStorage.setItem(VIEW_KEY, String(next))
  }

  function changePage(next: PageId) {
    setPage(next)
    setOpenTopic(null)
    setMistakesOpen(false)
    setTeacherOpen(false)
    localStorage.setItem(PAGE_KEY, next)
    window.scrollTo({ top: 0 })
  }

  function updateStudentGoal(goal: string) {
    setStudentGoal(goal)
    if (goal.trim()) localStorage.setItem(GOAL_KEY, goal)
    else localStorage.removeItem(GOAL_KEY)
  }

  function finishOnboarding(next: StudentProfile) {
    setProfile(next)
    setEditingProfile(false)
    setStudentGoal(localStorage.getItem(GOAL_KEY) || '')
    changePage(startPage[next.purpose])
    syncNow()
  }

  if (!profile || editingProfile) {
    return (
      <Onboarding
        initial={profile}
        onDone={finishOnboarding}
        onCancel={profile ? () => setEditingProfile(false) : undefined}
        onTeacherMode={() => setTeacherLocal(true)}
      />
    )
  }

  const current = pages.find(item => item.id === page)!
  const activeGrades = profilSiniflari(profile)
  const activeLabel = profilEtiketi(profile)
  const avatar = profile.grade
  const isSenior = profile.grade === 12
  const viewGrades = teacherView
    ? [ogretmenSinif]
    : !isSenior ? [profile.grade] : gorunum === 12 ? [12] : SINAV_SINIFLARI[gorunum]
  const show12Placeholder = teacherView ? ogretmenSinif === 12 : isSenior && gorunum === 12
  const contentGrades = viewGrades.filter(grade => sinifMufredati(grade))
  // 12. sınıfta okul yazılısı yok; sınav sekmesi yalnızca TYT/AYT testleridir.
  const labelOf = (item: (typeof pages)[number]) =>
    item.id === 'exams' && isSenior && !teacherView ? 'TYT / AYT testleri' : item.label

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
              title={labelOf(item)}
            >
              <Icon name={item.icon} />
              <span className="label">{labelOf(item)}</span>
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
            {isSenior ? '12. sınıf · TYT + AYT' : `${profile.grade}. sınıf`}
            <small>{teacherView ? 'Öğretmen görünümü' : 'Amacımı değiştir'}</small>
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
            selectedGrade={profile.grade}
            grades={activeGrades}
            gradeLabel={activeLabel}
            studentGoal={studentGoal}
            onGoalChange={updateStudentGoal}
            onOpenLessons={() => changePage('lessons')}
            onOpenMistakes={() => {
              changePage('progress')
              setMistakesOpen(true)
            }}
          />
        )}

        {page !== 'today' && (
          <div className="page-head">
            <div>
              <small>Kimya Koçum</small>
              <h1>{labelOf(current)}</h1>
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
            {teacherView && (
              <section className="card teacher-view">
                <h3 className="card-title">
                  <Icon name="users" />
                  Öğretmen görünümü
                  {!teacherAccount && (
                    <button type="button" className="card-link" onClick={() => setTeacherLocal(false)}>
                      Kapat
                    </button>
                  )}
                </h3>
                <div className="grade-picker" role="group" aria-label="Sınıf">
                  {ALL_GRADES.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={ogretmenSinif === item ? 'chip is-active' : 'chip'}
                      onClick={() => changeTeacherGrade(item)}
                      aria-pressed={ogretmenSinif === item}
                    >
                      {item}. sınıf
                      <small>{item === 12 ? 'hazırlanıyor' : 'tüm konular'}</small>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {isSenior && !teacherView && (
              <section className="card">
                <h3 className="card-title">Ne çalışmak istiyorsun?</h3>
                <div className="grade-picker" role="group" aria-label="TYT, AYT ya da 12. sınıf">
                  {(['TYT', 'AYT', 12] as const).map(item => (
                    <button
                      key={item}
                      type="button"
                      className={gorunum === item ? 'chip is-active' : 'chip'}
                      onClick={() => changeView(item)}
                      aria-pressed={gorunum === item}
                    >
                      {item === 12 ? '12. sınıf' : item}
                      <small>
                        {item === 12 ? 'hazırlanıyor' : `${SINAV_SINIFLARI[item].join(' + ')}. sınıf konuları`}
                      </small>
                    </button>
                  ))}
                </div>
                {gorunum === 'AYT' && (
                  <p className="muted small picker-note">
                    AYT'nin 12. sınıf konuları yeni Maarif programı yayımlanınca eklenecek.
                  </p>
                )}
              </section>
            )}

            {!isSenior && !teacherView && (
              <h2 className="section-title">{profile.grade}. sınıf kimya</h2>
            )}

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

            {show12Placeholder && (
              /* 12. sınıf içeriği hazır olana kadar kendi konularını ekleyebilir. */
              <div className="stack">
                <p className="program-message">
                  12. sınıfın konu anlatımı ve testleri yeni Maarif programıyla hazırlanacak. Şimdilik kendi konularını ekleyip takip edebilirsin.
                </p>
                <StudyTopics selectedGrade={12} />
                <LearningTracker selectedGrade={12} />
              </div>
            )}
          </div>
        )}

        {page === 'exams' && (
          teacherView
            ? <ExamsPage grades={SINAV_SINIFLARI.TYT_AYT} label="Tüm sınıflar" showWritten />
            : <ExamsPage grades={activeGrades} label={activeLabel} showWritten={!isSenior} />
        )}

        {page === 'program' && (
          <ProgramPage
            profile={profile}
            onProfileChange={setProfile}
            onOpenLessons={() => changePage('lessons')}
          />
        )}

        {page === 'progress' && mistakesOpen && (
          <MistakeBook grades={activeGrades} onClose={() => setMistakesOpen(false)} />
        )}

        {page === 'progress' && teacherOpen && (
          <TeacherPanel onClose={() => setTeacherOpen(false)} />
        )}

        {page === 'progress' && !mistakesOpen && !teacherOpen && (
          <ProgressPage
            grades={activeGrades}
            label={activeLabel}
            onOpenLessons={() => changePage('lessons')}
            onOpenMistakes={() => {
              setMistakesOpen(true)
              window.scrollTo({ top: 0 })
            }}
            onOpenTeacher={() => {
              setTeacherOpen(true)
              window.scrollTo({ top: 0 })
            }}
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
  onOpenMistakes,
  onOpenTeacher,
}: {
  grades: number[]
  label?: string
  onOpenLessons: () => void
  onOpenMistakes: () => void
  onOpenTeacher: () => void
}) {
  const hatalar = useHataDefteri().filter(item => grades.includes(item.grade))
  const acikHata = hatalar.filter(item => item.durum === 'acik').length
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
        <section className="card">
          <h3 className="card-title">
            <Icon name="notebook" />
            Hata defterim
          </h3>
          <p className="muted">
            {hatalar.length === 0
              ? 'Testlerde yanlış yaptığın ya da boş bıraktığın sorular burada birikir.'
              : `${acikHata} açık hata · ${hatalar.length - acikHata} düzeltildi`}
          </p>
          <button type="button" className={acikHata ? 'primary-button' : 'btn-secondary'} onClick={onOpenMistakes}>
            Hata defterini aç
          </button>
        </section>
        <ReviewPage grades={grades} onOpenLessons={onOpenLessons} />
      </div>
      <div className="col">
        <AccountCard onOpenTeacher={onOpenTeacher} />
        <TopicMap grades={grades} label={label} onOpenLessons={onOpenLessons} />
      </div>
    </div>
  )
}

export default App
