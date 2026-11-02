
import { useState } from 'react'
import {
  localDate,
  updateStudyTasks,
  useStudyTasks,
} from '../data/studyTasks'
import { loadTopics, type StudyTopic } from '../data/topics'

type Props = {
  selectedGrade: number | null
}

type StudyPreferences = {
  dailyMinutes: number
  days: number[]
  goal: string
}

type PlannedTask = {
  title: string
  date: string
  grade: number
}

const PREFERENCES_KEY = 'kimya-kocum-study-preferences'
const dayNames = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

const defaultPreferences: StudyPreferences = {
  dailyMinutes: 45,
  days: [0, 1, 2, 3, 4],
  goal: 'school',
}

function loadPreferences(): StudyPreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    if (!raw) return defaultPreferences

    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') {
      return defaultPreferences
    }

    const item = data as Partial<StudyPreferences>

    return {
      dailyMinutes:
        typeof item.dailyMinutes === 'number' &&
        [20, 30, 45, 60, 90].includes(item.dailyMinutes)
          ? item.dailyMinutes
          : 45,
      days: Array.isArray(item.days)
        ? [...new Set(item.days.filter(
            (day): day is number =>
              typeof day === 'number' &&
              Number.isInteger(day) &&
              day >= 0 &&
              day <= 6
          ))].sort((a, b) => a - b)
        : [0, 1, 2, 3, 4],
      goal: typeof item.goal === 'string'
        ? item.goal
        : 'school',
    }
  } catch {
    return defaultPreferences
  }
}

function getMonday(offset: number): Date {
  const now = new Date()
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12
  )

  monday.setDate(
    monday.getDate() -
    ((monday.getDay() + 6) % 7) +
    offset * 7
  )

  return monday
}

export default function SmartStudyPlan({
  selectedGrade,
}: Props) {
  const tasks = useStudyTasks()

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(() => localDate(new Date()))
  const [weekOffset, setWeekOffset] = useState(0)

  const [preferences, setPreferences] =
    useState<StudyPreferences>(loadPreferences)

  const [topics, setTopics] =
    useState<StudyTopic[]>(loadTopics)

  const [preview, setPreview] = useState<PlannedTask[]>([])
  const [message, setMessage] = useState('')

  const monday = getMonday(weekOffset)

  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)

    return {
      key: localDate(day),
      label: dayNames[index],
      dateLabel: day.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
      }),
      isStudyDay: preferences.days.includes(index),
    }
  })

  const weekly = tasks.filter(task =>
    selectedGrade !== null &&
    task.grade === selectedGrade &&
    task.date >= days[0].key &&
    task.date <= days[6].key
  )

  const completed = weekly.filter(task => task.completed).length
  const progress = weekly.length
    ? Math.round(completed / weekly.length * 100)
    : 0

  const weeklyMinutes =
    preferences.days.length * preferences.dailyMinutes

  function refreshData() {
    setPreferences(loadPreferences())
    setTopics(loadTopics())
    setPreview([])
    setMessage('Tercihler ve konular güncellendi.')
  }

  function add() {
    if (selectedGrade === null || !title.trim() || !date) return

    updateStudyTasks(previous => [
      ...previous,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        grade: selectedGrade,
        date,
        completed: false,
      },
    ])

    setTitle('')
    setPreview([])
    setMessage('Görev eklendi.')
  }

  function toggle(id: string, completed: boolean) {
    updateStudyTasks(previous =>
      previous.map(task =>
        task.id === id ? { ...task, completed } : task
      )
    )
  }

  function remove(id: string, taskTitle: string) {
    if (!window.confirm(`"${taskTitle}" silinsin mi?`)) return

    updateStudyTasks(previous =>
      previous.filter(task => task.id !== id)
    )

    setPreview([])
  }

  function generatePreview() {
    if (selectedGrade === null) return

    const currentPreferences = loadPreferences()
    const currentTopics = loadTopics()

    setPreferences(currentPreferences)
    setTopics(currentTopics)

    const gradeTopics = currentTopics.filter(
      topic => topic.grade === selectedGrade
    )

    if (gradeTopics.length === 0) {
      setPreview([])
      setMessage('Önce Çalışılacak Konularım bölümüne konu ekle.')
      return
    }

    const studyDays = days.filter(day =>
      currentPreferences.days.includes(
        dayNames.indexOf(day.label)
      )
    )

    if (studyDays.length === 0) {
      setPreview([])
      setMessage('En az bir çalışma günü seçmelisin.')
      return
    }

    const todayKey = localDate(new Date())
    const availableDays = studyDays.filter(
      day => day.key >= todayKey
    )

    if (availableDays.length === 0) {
      setPreview([])
      setMessage(
        'Bu haftada kalan çalışma günü yok. Sonraki haftayı seç.'
      )
      return
    }

    const generated: PlannedTask[] = []
    let topicIndex = 0

    // İlk sürüm: Her çalışma gününe bir konu.
    // Günlük süre, o günün hedef çalışma süresidir.
    for (const day of availableDays) {
      const existingTitles = new Set(
        tasks
          .filter(task =>
            task.grade === selectedGrade &&
            task.date === day.key
          )
          .map(task =>
            task.title.trim().toLocaleLowerCase('tr-TR')
          )
      )

      let selectedTopic: StudyTopic | undefined

      // Aynı tarihe aynı konuyu ikinci kez yerleştirme.
      for (let attempt = 0; attempt < gradeTopics.length; attempt++) {
        const candidate =
          gradeTopics[(topicIndex + attempt) % gradeTopics.length]

        const normalized =
          candidate.title.trim().toLocaleLowerCase('tr-TR')

        if (!existingTitles.has(normalized)) {
          selectedTopic = candidate
          topicIndex =
            (topicIndex + attempt + 1) % gradeTopics.length
          break
        }
      }

      if (selectedTopic) {
        generated.push({
          title: selectedTopic.title,
          date: day.key,
          grade: selectedGrade,
        })
      }
    }

    setPreview(generated)

    setMessage(
      generated.length > 0
        ? `${generated.length} günlük program hazır. Kaydetmeden önce kontrol et.`
        : 'Yeni görev oluşturulamadı. Bu günlerde konular zaten planlanmış olabilir.'
    )
  }

  function confirmPlan() {
    if (preview.length === 0) return

    let addedCount = 0

    updateStudyTasks(previous => {
      const next = [...previous]

      for (const item of preview) {
        const duplicate = next.some(task =>
          task.grade === item.grade &&
          task.date === item.date &&
          task.title.trim().toLocaleLowerCase('tr-TR') ===
            item.title.trim().toLocaleLowerCase('tr-TR')
        )

        if (duplicate) continue

        next.push({
          id: crypto.randomUUID(),
          title: item.title,
          grade: item.grade,
          date: item.date,
          completed: false,
        })

        addedCount++
      }

      return next
    })

    setPreview([])
    setMessage(`${addedCount} görev haftalık programa kaydedildi.`)
  }

  return (
    <section
      className="dashboard-card"
      style={{ marginBottom: 24 }}
    >
      <div className="card-icon">📅</div>
      <h2>Akıllı Çalışma Programım</h2>

      {selectedGrade === null ? (
        <p>Program oluşturmak için önce sınıfını seç.</p>
      ) : (
        <>
          <p>📚 {selectedGrade}. Sınıf</p>

          <div style={{
            background: '#e8f7f4',
            borderRadius: 12,
            padding: 16,
            marginTop: 16,
          }}>
            <h3>🎯 Kişisel Çalışma Düzenim</h3>
            <p>
              Haftada {preferences.days.length} gün ·
              Günlük {preferences.dailyMinutes} dakika
            </p>
            <strong>
              Haftalık hedef: {Math.floor(weeklyMinutes / 60)}
              {' '}saat {weeklyMinutes % 60} dakika
            </strong>
            <p>
              Kayıtlı konu sayısı:{' '}
              {topics.filter(topic =>
                topic.grade === selectedGrade
              ).length}
            </p>

            <button
              type="button"
              onClick={refreshData}
            >
              🔄 Tercihleri ve Konuları Yenile
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 20,
          }}>
            <input
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') add()
              }}
              placeholder="Çalışılacak konu veya görev"
              aria-label="Çalışma görevi"
              style={{
                flex: '1 1 220px',
                padding: 12,
                border: '1px solid #d9d2ec',
                borderRadius: 10,
              }}
            />

            <input
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
              aria-label="Çalışma tarihi"
            />

            <button
              type="button"
              className="primary-button"
              onClick={add}
              disabled={!title.trim() || !date}
            >
              + Programa Ekle
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 24,
          }}>
            <button
              type="button"
              onClick={() => {
                setWeekOffset(value => value - 1)
                setPreview([])
              }}
            >
              ← Önceki Hafta
            </button>

            <button
              type="button"
              onClick={() => {
                setWeekOffset(0)
                setPreview([])
              }}
            >
              Bu Hafta
            </button>

            <button
              type="button"
              onClick={() => {
                setWeekOffset(value => value + 1)
                setPreview([])
              }}
            >
              Sonraki Hafta →
            </button>
          </div>

          <div style={{
            marginTop: 20,
            padding: 16,
            background: '#f3f0ff',
            borderRadius: 12,
          }}>
            <h3>✨ Otomatik Program Oluşturucu</h3>

            <p>
              Kayıtlı konularını seçtiğin çalışma günlerine
              otomatik olarak dağıt.
            </p>

            <p>
              Günlük hedef süre: {preferences.dailyMinutes} dakika
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={generatePreview}
            >
              ✨ Haftalık Programımı Oluştur
            </button>

            {message && (
              <p style={{ marginTop: 12 }}>
                {message}
              </p>
            )}

            {preview.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3>📋 Program Önizlemesi</h3>

                {preview.map(item => (
                  <div
                    key={`${item.date}-${item.title}`}
                    style={{
                      padding: 12,
                      marginBottom: 8,
                      background: '#ffffff',
                      borderRadius: 10,
                    }}
                  >
                    <strong>{item.title}</strong>
                    <p style={{ margin: '6px 0' }}>
                      📅 {new Date(`${item.date}T12:00:00`)
                        .toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                    </p>
                    <small>
                      ⏱️ {preferences.dailyMinutes} dakika
                    </small>
                  </div>
                ))}

                <div style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                }}>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={confirmPlan}
                  >
                    ✓ Programı Onayla ve Kaydet
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPreview([])
                      setMessage('Önizleme iptal edildi.')
                    }}
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>

          <h3 style={{ marginTop: 24 }}>
            Haftalık Takvim
          </h3>

          <p>
            {days[0].dateLabel} – {days[6].dateLabel}
          </p>

          <div className="stat-value">
            {completed} / {weekly.length}
          </div>

          <p>Haftalık görev ilerlemesi: %{progress}</p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            marginTop: 20,
          }}>
            {days.map(day => {
              const dayTasks = weekly.filter(
                task => task.date === day.key
              )

              return (
                <div
                  key={day.key}
                  style={{
                    background: day.isStudyDay
                      ? '#e8f7f4'
                      : '#f3f0ff',
                    border: '1px solid #ddd5ee',
                    padding: 12,
                    borderRadius: 12,
                    minHeight: 130,
                  }}
                >
                  <strong>{day.label}</strong>
                  <small style={{ display: 'block' }}>
                    {day.dateLabel}
                  </small>

                  <p style={{ fontSize: 12 }}>
                    {day.isStudyDay
                      ? `📚 Çalışma günü · ${preferences.dailyMinutes} dk`
                      : '🌿 Dinlenme günü'}
                  </p>

                  {dayTasks.length === 0 && (
                    <p style={{ fontSize: 12 }}>
                      Görev yok
                    </p>
                  )}

                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      style={{
                        borderTop: '1px solid #ddd5ee',
                        paddingTop: 8,
                        marginTop: 10,
                      }}
                    >
                      <label style={{
                        display: 'flex',
                        gap: 6,
                        alignItems: 'flex-start',
                      }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={event =>
                            toggle(
                              task.id,
                              event.target.checked
                            )
                          }
                        />

                        <span style={{
                          fontSize: 13,
                          overflowWrap: 'anywhere',
                          textDecoration: task.completed
                            ? 'line-through'
                            : 'none',
                        }}>
                          {task.title}
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          remove(task.id, task.title)
                        }
                        style={{ marginTop: 8 }}
                      >
                        🗑️ Sil
                      </button>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
