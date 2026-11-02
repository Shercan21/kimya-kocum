import { useState } from 'react'
import Icon from './Icon'
import DailyTasks from './DailyTasks'
import TopicMap from './TopicMap'
import { loadTopics } from '../data/topics'
import { getTopicProgress } from '../data/learningProgress'
import { getQuestionCount } from '../data/questionBank'
import { useHataDefteri } from '../data/mistakes'
import {
  localDate,
  updateStudyTasks,
  useStudyTasks,
} from '../data/studyTasks'

type Props = {
  selectedGrade: number | null
  grades: number[]
  gradeLabel?: string
  studentGoal: string
  onGoalChange: (goal: string) => void
  onOpenLessons: () => void
  onOpenMistakes: () => void
}

type NextStep = {
  eyebrow: string
  title: string
  detail: string
  action: string
  onAction: () => void
}

const dayShort = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

function greeting(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return 'Günaydın'
  if (hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

export default function TodayPage({
  selectedGrade,
  grades,
  gradeLabel,
  studentGoal,
  onGoalChange,
  onOpenLessons,
  onOpenMistakes,
}: Props) {
  const acikHatalar = useHataDefteri().filter(
    item => item.durum === 'acik' && grades.includes(item.grade)
  ).length
  const tasks = useStudyTasks()
  const [editingGoal, setEditingGoal] = useState(!studentGoal.trim())
  const now = new Date()
  const today = localDate(now)

  const todayTasks = tasks.filter(
    task =>
      task.date === today &&
      (selectedGrade === null ||
        task.grade === selectedGrade ||
        task.grade === undefined ||
        grades.includes(task.grade))
  )
  const doneToday = todayTasks.filter(task => task.completed).length
  const dailyRate = todayTasks.length
    ? Math.round((doneToday / todayTasks.length) * 100)
    : 0

  // Son 7 günde tamamlanan görevler (gerçek kayıtlardan).
  const week = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + offset, 12)
    const key = localDate(day)
    return {
      key,
      label: offset === 6 ? 'Bugün' : dayShort[(day.getDay() + 6) % 7],
      count: tasks.filter(task => task.date === key && task.completed).length,
    }
  })
  const weekMax = Math.max(1, ...week.map(day => day.count))
  const weekTotal = week.reduce((sum, day) => sum + day.count, 0)

  function nextStep(): NextStep {
    if (selectedGrade === null) {
      return {
        eyebrow: 'Başlamak için',
        title: 'Sınıfını seç',
        detail: 'Konuların, programın ve sınavların sınıfına göre hazırlanır.',
        action: 'Sınıfımı seç',
        onAction: onOpenLessons,
      }
    }

    // Biriken hatalar varsa önce onları kapat (plan §7).
    if (acikHatalar >= 3) {
      return {
        eyebrow: 'Hata defterin',
        title: `${acikHatalar} soru seni bekliyor`,
        detail: 'Yanlış yaptığın soruları tekrar çöz, hatalarını kapat.',
        action: 'Tekrar çöz',
        onAction: onOpenMistakes,
      }
    }

    const topics = loadTopics().filter(topic => grades.includes(topic.grade))
    const studied = topics.find(
      topic => getTopicProgress(topic.grade, topic.id)?.status === 'studied'
    )
    if (studied) {
      const count = getQuestionCount(studied.grade, studied.id)
      return {
        eyebrow: 'Sıradaki görevin',
        title: `${studied.title} · mini sınav`,
        detail: count > 0
          ? 'Konuyu çalıştın. Öğrendiğini kısa bir sınavla göster.'
          : 'Konuyu çalıştın. Bu konuya soru eklendiğinde mini sınav açılacak.',
        action: 'Sınava git',
        onAction: onOpenLessons,
      }
    }

    const openTask = todayTasks.find(task => !task.completed)
    if (openTask) {
      return {
        eyebrow: 'Sıradaki görevin',
        title: openTask.title,
        detail: `Bugün ${todayTasks.length} görevinden ${doneToday} tanesi tamam.`,
        action: 'Tamamladım',
        onAction: () =>
          updateStudyTasks(previous =>
            previous.map(task =>
              task.id === openTask.id ? { ...task, completed: true } : task
            )
          ),
      }
    }

    const notStarted = topics.find(
      topic => (getTopicProgress(topic.grade, topic.id)?.status ?? 'not_started') === 'not_started'
    )
    if (notStarted) {
      return {
        eyebrow: 'Sıradaki konun',
        title: notStarted.title,
        detail: 'Bu konuya henüz başlamadın.',
        action: 'Derse git',
        onAction: onOpenLessons,
      }
    }

    return {
      eyebrow: 'Bugün',
      title: todayTasks.length ? 'Bugünkü görevlerin tamam' : 'Bugün için görev yok',
      detail: todayTasks.length
        ? 'Harika gidiyorsun. Yeni bir konu ekleyebilir ya da tekrar yapabilirsin.'
        : 'Aşağıdan bir görev ekle ya da Derslerim sayfasından program oluştur.',
      action: 'Derslerime git',
      onAction: onOpenLessons,
    }
  }

  const step = nextStep()

  return (
    <>
      <div className="page-head">
        <div>
          <small>
            {now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </small>
          <h1>{greeting(now)}</h1>
        </div>

        {editingGoal ? (
          <form
            className="goal goal-edit"
            onSubmit={event => {
              event.preventDefault()
              if (studentGoal.trim()) setEditingGoal(false)
            }}
          >
            <Icon name="target" size={18} />
            <input
              type="text"
              value={studentGoal}
              onChange={event => onGoalChange(event.target.value)}
              placeholder="Hedefin: TYT kimyada 7 net"
              aria-label="Kişisel kimya hedefim"
            />
            <button type="submit" className="goal-save" aria-label="Hedefi kaydet">
              <Icon name="check" size={18} />
            </button>
          </form>
        ) : (
          <button type="button" className="goal" onClick={() => setEditingGoal(true)}>
            <Icon name="target" size={18} />
            <span>Hedef: {studentGoal}</span>
            <Icon name="pencil" size={16} />
          </button>
        )}
      </div>

      <div className="today-grid">
        <div className="col">
          <section className="card next-card">
            <div>
              <small>{step.eyebrow}</small>
              <h2>{step.title}</h2>
              <p>{step.detail}</p>
              <button type="button" className="btn-light" onClick={step.onAction}>
                <Icon name="play" size={16} />
                {step.action}
              </button>
            </div>
            {todayTasks.length > 0 && (
              <div
                className="ring"
                style={{ ['--p' as string]: `${dailyRate}%` }}
                aria-label={`Günlük görevlerin yüzde ${dailyRate} tamam`}
              >
                <div>
                  %{dailyRate}
                  <span>bugün</span>
                </div>
              </div>
            )}
          </section>

          <DailyTasks selectedGrade={selectedGrade} grades={grades} />

          <section className="card">
            <h3 className="card-title">
              <Icon name="chart" />
              Son 7 gün
            </h3>
            <div className="week">
              <div className="bars">
                {week.map(day => (
                  <div key={day.key} className={day.label === 'Bugün' ? 'is-today' : ''}>
                    <span style={{ height: `${Math.max(4, (day.count / weekMax) * 100)}%` }} />
                    {day.label}
                  </div>
                ))}
              </div>
              <div className="stat">
                <small>Tamamlanan görev</small>
                <b>{weekTotal}</b>
              </div>
            </div>
          </section>
        </div>

        <div className="col">
          <TopicMap grades={grades} label={gradeLabel} onOpenLessons={onOpenLessons} />
        </div>
      </div>
    </>
  )
}
