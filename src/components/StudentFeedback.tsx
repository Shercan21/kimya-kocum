import { useState } from 'react'
import { TEACHER_EMAIL } from '../data/cloud'
import './advertising.css'

export default function StudentFeedback() {
  const [kind, setKind] = useState('Hatalı soru')
  const [message, setMessage] = useState('')
  const body = `Bildirim türü: ${kind}\n\nSınıf / konu / test ve soru numarası:\n\nAçıklamam:\n${message}\n\nVarsa ekran görüntüsünü e-postaya ekleyebilirim.`
  return (
    <details className="student-feedback">
      <summary>Hata bildir / Öneri gönder</summary>
      <p>Eksik içerik, hatalı soru veya önerini Hasan Hoca’ya iletebilirsin.</p>
      <label>Bildirim türü
        <select value={kind} onChange={e => setKind(e.target.value)}>
          {['Hatalı soru', 'Eksik içerik', 'Teknik sorun', 'Öneri', 'Diğer geri bildirim'].map(item => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>Açıklaman <span className="muted">isteğe bağlı</span>
        <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={1500} placeholder="Sorunu veya önerini kısaca yazabilirsin." />
      </label>
      <a className="btn-secondary" href={`mailto:${TEACHER_EMAIL}?subject=${encodeURIComponent(`Kimya Koçum · ${kind}`)}&body=${encodeURIComponent(body)}`}>E-posta hazırla</a>
      <p className="small">E-posta uygulaman açılır; mesajı kontrol edip sen gönderirsin. Çalışma sonuçların otomatik eklenmez.</p>
      <a href={`mailto:${TEACHER_EMAIL}`}>{TEACHER_EMAIL}</a>
    </details>
  )
}
