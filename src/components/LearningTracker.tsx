
import { useState } from 'react'
import MiniAssessment from './MiniAssessment'
import {
  getTopicProgress,
  setTopicProgress,
  type LearningStatus,
} from '../data/learningProgress'
import { loadTopics, type StudyTopic } from '../data/topics'

type Props = {
  selectedGrade: number | null
}

export default function LearningTracker({
  selectedGrade,
}: Props) {
  const [topics, setTopics] = useState<StudyTopic[]>(loadTopics)
  const [, setRevision] = useState(0)
  const [openAssessmentId, setOpenAssessmentId] =
    useState<string | null>(null)

  const visibleTopics = topics.filter(
    topic => topic.grade === selectedGrade
  )

  function refresh() {
    setTopics(loadTopics())
    setRevision(value => value + 1)
  }

  function markStudied(topic: StudyTopic) {
    setTopicProgress(
      topic.grade,
      topic.id,
      topic.title,
      'studied'
    )
    setRevision(value => value + 1)
  }

  function getStatus(topic: StudyTopic): LearningStatus {
    return getTopicProgress(
      topic.grade,
      topic.id
    )?.status ?? 'not_started'
  }

  

  const studied = visibleTopics.filter(
    topic => getStatus(topic) === 'studied'
  ).length

  const learned = visibleTopics.filter(
    topic => getStatus(topic) === 'learned'
  ).length

  const permanent = visibleTopics.filter(
    topic => getStatus(topic) === 'permanent'
  ).length

  const started = studied + learned + permanent

  const progress = visibleTopics.length
    ? Math.round(started / visibleTopics.length * 100)
    : 0

  return (
    <section
      className="dashboard-card"
      style={{ marginBottom: 24 }}
    >
      <div className="card-icon">🧠</div>
      <h2>Akıllı Öğrenme Takibim</h2>

      <p>
        Kimya konularındaki öğrenme yolculuğunu takip et.
      </p>

      {selectedGrade === null ? (
        <p>Öğrenme durumlarını görmek için önce sınıfını seç.</p>
      ) : (
        <>
          <p>📚 {selectedGrade}. Sınıf</p>

          <button type="button" onClick={refresh}>
            🔄 Konuları Yenile
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            marginTop: 20,
          }}>
            {[
              ['📚 Toplam Konu', visibleTopics.length],
              ['✏️ Çalışıldı', studied],
              ['🧠 Öğrenildi', learned],
              ['🏆 Kalıcı', permanent],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  background: '#f3f0ff',
                  padding: 14,
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <strong>{value}</strong>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 20 }}>
            Çalışılmaya başlanan konular: %{progress}
          </p>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            {visibleTopics.length === 0 && (
              <p>
                Henüz konu eklenmedi. Önce Çalışılacak Konularım
                bölümünden konu ekle.
              </p>
            )}

            {visibleTopics.map(topic => {
              const status = getStatus(topic)

              return (
                <div
                  key={topic.id}
                  style={{
                    padding: 16,
                    marginBottom: 12,
                    background: '#f3f0ff',
                    borderRadius: 12,
                  }}
                >
                  <h3>{topic.title}</h3>

                  <p>
                    {status === 'not_started'
                      ? '⚪ Henüz başlanmadı'
                      : status === 'studied'
                      ? '✏️ Çalışıldı'
                      : status === 'learned'
                      ? '🧠 Öğrenildi'
                      : '🏆 Kalıcı'}
                  </p>
                    
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}>
                    <button
                      type="button"
                      disabled={status !== 'not_started'}
                      onClick={() => markStudied(topic)}
                    >
                      ✓ Çalıştım
                    </button>

                    <button type="button" disabled>
                      🧠 Öğrenildi
                    </button>

                    <button type="button" disabled>
                      🏆 Kalıcı
                    </button>
                  </div>
                  {status !== 'not_started' && (
                    <div style={{ marginTop: 12 }}>
                        <button
                        type="button"
                        onClick={() =>
                            setOpenAssessmentId(current =>
                            current === topic.id ? null : topic.id
                            )
                        }
                        >
                        🧪 {openAssessmentId === topic.id
                            ? 'Değerlendirmeyi Kapat'
                            : 'Mini Değerlendirmeyi Aç'}
                        </button>

                        {openAssessmentId === topic.id && (
                        <MiniAssessment
                            key={topic.id}
                            grade={topic.grade}
                            topicId={topic.id}
                            topicTitle={topic.title}
                        />
                        )}
                    </div>
                    )}
                </div>
              )
            })}
          </div>

          <p style={{
            fontSize: 13,
            color: '#77718f',
          }}>
            Öğrenildi ve Kalıcı aşamaları, değerlendirme
            sistemi eklendiğinde açılacaktır.
          </p>
        </>
      )}
    </section>
  )
}
