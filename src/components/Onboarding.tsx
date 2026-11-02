import { useState } from 'react'
import Icon from './Icon'
import {
  purposes,
  purposeTitle,
  saveProfile,
  SINAV_AD,
  type Sinav,
  type StudentProfile,
  type StudyPurpose,
} from '../data/profile'

type Props = {
  initial: StudentProfile | null
  onDone: (profile: StudentProfile) => void
  onCancel?: () => void
}

const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const dayLong = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const minuteOptions = [20, 30, 45, 60, 90]
const steps = ['Amaç', 'Sınıf', 'Çalışma düzeni', 'Sözleşme']

export default function Onboarding({ initial, onDone, onCancel }: Props) {
  const [step, setStep] = useState(0)
  const [purpose, setPurpose] = useState<StudyPurpose | null>(initial?.purpose ?? null)
  const [grade, setGrade] = useState<number | null>(initial?.grade ?? null)
  const [sinav, setSinav] = useState<Sinav | null>(initial?.sinav ?? null)
  const [dailyMinutes, setDailyMinutes] = useState(initial?.dailyMinutes ?? 45)
  const [days, setDays] = useState<number[]>(initial?.days ?? [0, 1, 2, 3, 4])
  const [goal, setGoal] = useState(initial?.goal ?? '')
  const [error, setError] = useState('')

  function next() {
    if (step === 0 && !purpose) return setError('Devam etmek için bir seçenek seç.')
    if (step === 1 && !grade) return setError('Devam etmek için sınıfını seç.')
    if (step === 1 && purpose === 'tyt_ayt' && !sinav) return setError('Hangi sınava hazırlandığını seç.')
    if (step === 2 && days.length === 0) return setError('En az bir çalışma günü seç.')
    setError('')
    setStep(value => value + 1)
  }

  function back() {
    setError('')
    if (step === 0) onCancel?.()
    else setStep(value => value - 1)
  }

  function finish(contractAccepted: boolean) {
    if (!purpose || !grade) return
    const now = new Date().toISOString()
    const profile: StudentProfile = {
      purpose,
      grade,
      ...(purpose === 'tyt_ayt' && sinav ? { sinav } : {}),
      dailyMinutes,
      days: [...days].sort((a, b) => a - b),
      goal: goal.trim(),
      contractAccepted,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    }
    saveProfile(profile)
    onDone(profile)
  }

  function toggleDay(day: number) {
    setError('')
    setDays(previous =>
      previous.includes(day)
        ? previous.filter(item => item !== day)
        : [...previous, day]
    )
  }

  const weeklyMinutes = days.length * dailyMinutes
  const weeklyText =
    weeklyMinutes >= 60
      ? `${Math.floor(weeklyMinutes / 60)} saat${weeklyMinutes % 60 ? ` ${weeklyMinutes % 60} dakika` : ''}`
      : `${weeklyMinutes} dakika`

  return (
    <div className="onboarding">
      <div className="ob-card">
        <div className="ob-top">
          <span className="brand-mark"><Icon name="flask" /></span>
          <div className="ob-steps" aria-label={`Adım ${step + 1} / ${steps.length}`}>
            {steps.map((name, index) => (
              <span
                key={name}
                className={index <= step ? 'is-on' : ''}
                title={name}
              />
            ))}
          </div>
          {onCancel && (
            <button type="button" className="btn-ghost" onClick={onCancel} aria-label="Kapat">
              ×
            </button>
          )}
        </div>

        {step === 0 && (
          <>
            <h1>Ne yapmak istiyorsun?</h1>
            <p className="muted">Bunu istediğin zaman değiştirebilirsin.</p>
            <div className="ob-options">
              {purposes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'ob-option',
                    index === 0 ? 'is-main' : '',
                    purpose === item.id ? 'is-selected' : '',
                  ].join(' ')}
                  onClick={() => {
                    setPurpose(item.id)
                    setError('')
                  }}
                  aria-pressed={purpose === item.id}
                >
                  <span>
                    {item.title}
                    <small>{item.detail}</small>
                  </span>
                  {index === 0 && <em>Önerilen</em>}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1>Kaçıncı sınıftasın?</h1>
            <p className="muted">
              {purpose === 'tyt_ayt'
                ? 'Mezunsan 12. sınıfı seç.'
                : 'Konuların ve programın sınıfına göre hazırlanır.'}
            </p>
            <div className="ob-grades">
              {[9, 10, 11, 12].map(item => (
                <button
                  key={item}
                  type="button"
                  className={grade === item ? 'ob-grade is-selected' : 'ob-grade'}
                  onClick={() => {
                    setGrade(item)
                    setError('')
                  }}
                  aria-pressed={grade === item}
                >
                  <b>{item}</b>
                  <span>{item === 12 && purpose === 'tyt_ayt' ? '12. sınıf / mezun' : 'sınıf'}</span>
                </button>
              ))}
            </div>

            {purpose === 'tyt_ayt' && (
              <>
                <h3 className="ob-label">Hangi sınava hazırlanıyorsun?</h3>
                <div className="ob-options">
                  {([
                    ['TYT', '9 ve 10. sınıf konuları'],
                    ['AYT', '11. sınıf konuları (12. sınıf yeni programla eklenecek)'],
                    ['TYT_AYT', '9, 10 ve 11. sınıf konuları'],
                  ] as const).map(([id, detail]) => (
                    <button
                      key={id}
                      type="button"
                      className={sinav === id ? 'ob-option is-selected' : 'ob-option'}
                      onClick={() => {
                        setSinav(id)
                        setError('')
                      }}
                      aria-pressed={sinav === id}
                    >
                      <span>
                        {SINAV_AD[id]}
                        <small>{detail}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h1>Nasıl çalışmak istersin?</h1>
            <p className="muted">Programını buna göre hazırlayacağız.</p>

            <h3 className="ob-label">Hangi günler?</h3>
            <div className="ob-days">
              {dayNames.map((name, index) => (
                <button
                  key={name}
                  type="button"
                  className={days.includes(index) ? 'chip is-active' : 'chip'}
                  onClick={() => toggleDay(index)}
                  aria-pressed={days.includes(index)}
                  aria-label={dayLong[index]}
                >
                  {name}
                </button>
              ))}
            </div>

            <h3 className="ob-label">Günde ne kadar?</h3>
            <div className="ob-days">
              {minuteOptions.map(minutes => (
                <button
                  key={minutes}
                  type="button"
                  className={dailyMinutes === minutes ? 'chip is-active' : 'chip'}
                  onClick={() => setDailyMinutes(minutes)}
                  aria-pressed={dailyMinutes === minutes}
                >
                  {minutes} dk
                </button>
              ))}
            </div>

            <h3 className="ob-label">Hedefin <span className="muted">(isteğe bağlı)</span></h3>
            <input
              className="ob-input"
              type="text"
              value={goal}
              onChange={event => setGoal(event.target.value)}
              placeholder={
                purpose === 'tyt_ayt'
                  ? 'AYT kimyada 10 net'
                  : purpose === 'written_exam'
                    ? 'Kimya yazılısından 85 almak'
                    : 'Kimyayı sevmek ve anlamak'
              }
              aria-label="Hedefin"
            />

            <p className="ob-summary">
              Haftada <b>{days.length} gün</b>, toplam <b>{weeklyText}</b>
            </p>
          </>
        )}

        {step === 3 && purpose && grade && (
          <>
            <h1>Kişisel öğrenme sözleşmem</h1>
            <p className="muted">
              Gönüllü bir taahhüt. İstediğin zaman değiştirebilirsin.
            </p>
            <div className="ob-contract">
              <p><Icon name="target" size={18} /> {purposeTitle(purpose)}.</p>
              <p>
                <Icon name="book" size={18} /> {grade}. sınıf kimya
                {purpose === 'tyt_ayt' && sinav ? ` · ${SINAV_AD[sinav]} hazırlığı` : ''}
              </p>
              <p>
                <Icon name="list" size={18} />
                {days.map(day => dayLong[day]).join(', ')} günleri, günde {dailyMinutes} dakika
              </p>
              {goal.trim() && <p><Icon name="star" size={18} /> Hedefim: {goal.trim()}</p>}
              <p className="ob-promise">
                Planladığım günlerde çalışmaya, yanlışlarımdan öğrenmeye ve
                gelişimimi düzenli takip etmeye çalışacağım.
              </p>
            </div>
          </>
        )}

        {error && <p className="ob-error" role="alert">{error}</p>}

        <div className="ob-actions">
          {(step > 0 || onCancel) && (
            <button type="button" className="btn-secondary" onClick={back}>
              {step === 0 ? 'Vazgeç' : 'Geri'}
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="primary-button" onClick={next}>
              Devam
            </button>
          ) : (
            <>
              <button type="button" className="btn-ghost ob-skip" onClick={() => finish(false)}>
                Şimdilik geç
              </button>
              <button type="button" className="primary-button" onClick={() => finish(true)}>
                Kabul ediyorum
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
