import { useEffect, useState } from 'react'
import type { CloudUser } from '../data/cloud'
import { usageIdentity, USAGE_OPTOUT_KEY } from '../data/usageIdentity'
import { SPONSORSHIP_URL } from './Advertising'

const CHANGE_EVENT = 'kk-usage-preference-change'
export function useUsageMetrics(user: CloudUser | null) {
  useEffect(() => {
    let stopped = false, busy = false, lastKey = '', lastAt = 0
    const send = async () => {
      if (stopped || busy || document.hidden || !navigator.onLine) return
      busy = true
      try {
        const identity = await usageIdentity(user?.emailVerified ? user.googleId || null : null, localStorage, crypto)
        if (!identity || stopped) return
        const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' })
        const key = day + ':' + identity.account
        if (key === lastKey && Date.now() - lastAt < 15 * 60_000) return
        const response = await fetch(`${SPONSORSHIP_URL}/api/usage`, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(identity), signal: AbortSignal.timeout(5000) })
        if (response.ok) { lastKey = key; lastAt = Date.now() }
      } catch { /* Ölçüm hatası ders ve yedekleme işlevlerini etkilemez. */ }
      finally { busy = false }
    }
    const run = () => { void send() }
    run()
    const timer = setInterval(run, 60_000)
    document.addEventListener('visibilitychange', run)
    window.addEventListener('online', run)
    window.addEventListener(CHANGE_EVENT, run)
    return () => { stopped = true; clearInterval(timer); document.removeEventListener('visibilitychange', run); window.removeEventListener('online', run); window.removeEventListener(CHANGE_EVENT, run) }
  }, [user?.googleId, user?.emailVerified])
}

export function UsagePreference() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(USAGE_OPTOUT_KEY) !== '1')
  return <label className="consent"><input type="checkbox" checked={enabled} onChange={e => {
    setEnabled(e.target.checked)
    localStorage.setItem(USAGE_OPTOUT_KEY, e.target.checked ? '0' : '1')
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }} /><span>İsmimi ve ders kayıtlarımı içermeyen kayıtlı ve günlük aktif kullanım sayımına katıl. Kapatırsam sonraki kullanım bildirimleri gönderilmez.</span></label>
}
