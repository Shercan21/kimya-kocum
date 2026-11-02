import Icon from './Icon'
import { cikisYap, googleIleGiris, isTeacher, syncNow, useCloud } from '../data/cloud'

function zaman(iso: string | null) {
  if (!iso) return 'henüz eşitlenmedi'
  const d = new Date(iso)
  const dk = Math.round((Date.now() - d.getTime()) / 60000)
  if (dk < 1) return 'az önce eşitlendi'
  if (dk < 60) return `${dk} dk önce eşitlendi`
  return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} eşitlendi`
}

export default function AccountCard({ onOpenTeacher }: { onOpenTeacher?: () => void }) {
  const cloud = useCloud()

  if (!cloud.ready) return null

  if (!cloud.user) {
    return (
      <section className="card account-card">
        <h3 className="card-title">
          <Icon name="cloud" />
          Hesabım
        </h3>
        <p className="muted">
          Google ile giriş yaparsan ilerlemen yedeklenir; telefonunu değiştirsen de kaldığın yerden devam edersin.
        </p>
        {cloud.error && <p className="form-error">{cloud.error}</p>}
        <button type="button" className="google-button" onClick={() => googleIleGiris()}>
          <GoogleMark />
          Google ile giriş yap
        </button>
      </section>
    )
  }

  const user = cloud.user
  return (
    <section className="card account-card">
      <h3 className="card-title">
        <Icon name="cloud" />
        Hesabım
      </h3>
      <div className="account-row">
        {user.photoURL ? (
          <img className="account-photo" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="account-photo">{(user.displayName ?? '?').slice(0, 1)}</span>
        )}
        <div>
          <b>{user.displayName}</b>
          <small className="muted">{user.email}</small>
        </div>
      </div>
      <p className="muted small">
        {cloud.syncing ? 'Eşitleniyor…' : zaman(cloud.lastSync)}
      </p>
      {cloud.error && <p className="form-error">{cloud.error}</p>}
      <div className="row-actions start">
        {isTeacher(user) && onOpenTeacher && (
          <button type="button" className="primary-button" onClick={onOpenTeacher}>
            <Icon name="users" size={18} />
            Öğrencilerim
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={() => syncNow()}>
          Şimdi eşitle
        </button>
        <button type="button" className="btn-ghost" onClick={() => cikisYap()}>
          Çıkış yap
        </button>
      </div>
    </section>
  )
}

export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4C12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4C16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}
