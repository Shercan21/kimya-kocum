
import { useState } from 'react'
import { loadTopics, saveTopics, type StudyTopic } from '../data/topics'

type Props = {
  selectedGrade: number | null
}

export default function StudyTopics({ selectedGrade }: Props) {
  const [topics, setTopics] = useState<StudyTopic[]>(loadTopics)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const visibleTopics = topics.filter(
    topic => topic.grade === selectedGrade
  )

  function addTopic() {
    const cleanedTitle = title.trim()

    if (!cleanedTitle || selectedGrade === null) return

    const alreadyExists = topics.some(
      topic =>
        topic.grade === selectedGrade &&
        topic.title.toLocaleLowerCase('tr-TR') ===
          cleanedTitle.toLocaleLowerCase('tr-TR')
    )

    if (alreadyExists) {
      setMessage('Bu konu zaten listende bulunuyor.')
      return
    }

    const next = [
      ...topics,
      {
        id: crypto.randomUUID(),
        title: cleanedTitle,
        grade: selectedGrade,
        createdAt: new Date().toISOString(),
      },
    ]

    try {
      saveTopics(next)
      setTopics(next)
      setTitle('')
      setMessage('Konu listene eklendi.')
    } catch {
      setMessage('Konu kaydedilemedi.')
    }
  }

  function deleteTopic(id: string, topicTitle: string) {
    if (!window.confirm(`"${topicTitle}" konusu silinsin mi?`)) {
      return
    }

    const next = topics.filter(topic => topic.id !== id)

    try {
      saveTopics(next)
      setTopics(next)
      setMessage('Konu listeden kaldırıldı.')
    } catch {
      setMessage('Konu silinemedi.')
    }
  }

  return (
    <section
      className="dashboard-card"
      style={{ marginBottom: 24 }}
    >
      <div className="card-icon">📚</div>
      <h2>Çalışılacak Konularım</h2>

      <p>
        Haftalık çalışma programına eklemek istediğin
        kimya konularını belirle.
      </p>

      {selectedGrade === null ? (
        <p style={{ color: '#6542c0', fontWeight: 600 }}>
          Konu eklemek için önce sınıfını seç.
        </p>
      ) : (
        <>
          <p>📚 {selectedGrade}. Sınıf</p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 16,
          }}>
            <input
              type="text"
              value={title}
              onChange={event => {
                setTitle(event.target.value)
                setMessage('')
              }}
              onKeyDown={event => {
                if (event.key === 'Enter') addTopic()
              }}
              placeholder="Örneğin: Atomun Yapısı"
              aria-label="Çalışılacak konu"
              style={{
                flex: '1 1 220px',
                padding: 12,
                border: '1px solid #d9d2ec',
                borderRadius: 10,
              }}
            />

            <button
              type="button"
              className="primary-button"
              onClick={addTopic}
              disabled={!title.trim()}
            >
              + Konu Ekle
            </button>
          </div>

          {message && (
            <p style={{ color: '#6542c0', marginTop: 12 }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <h3>Konu Listem ({visibleTopics.length})</h3>

            {visibleTopics.length === 0 && (
              <p>Henüz çalışma konusu eklemedin.</p>
            )}

            {visibleTopics.map((topic, index) => (
              <div
                key={topic.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  marginBottom: 8,
                  background: '#f3f0ff',
                  borderRadius: 10,
                }}
              >
                <span style={{ flex: 1 }}>
                  <strong>{index + 1}. {topic.title}</strong>
                </span>

                {topic.builtIn ? (
                  <small style={{ color: '#77718f' }}>
                    Hazır konu
                  </small>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      deleteTopic(topic.id, topic.title)
                    }
                    aria-label={`${topic.title} konusunu sil`}
                  >
                    🗑️ Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: '#77718f' }}>
            Bu konular henüz otomatik olarak takvime eklenmez.
            Program oluşturucu tamamlandığında kullanılacaktır.
          </p>
        </>
      )}
    </section>
  )
}
