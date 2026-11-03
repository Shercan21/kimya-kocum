// Google ile giriş ve öğrencinin kendi Google Drive'ına yedekleme.
//
// - Giriş: Google Identity Services (tarayıcıda, sunucusuz).
// - İzinler: e-posta/ad (kim olduğunu göstermek için) ve drive.appdata
//   (yalnızca bu uygulamanın Drive'daki gizli klasörü; öğrencinin diğer
//   dosyalarına erişilemez).
// - Veri: appDataFolder içinde tek dosya (kimya-kocum.json): localStorage'daki
//   "kimya-kocum-" anahtarları.
// - Google tarayıcıda kalıcı oturum anahtarı vermez; erişim yaklaşık 1 saat
//   geçerlidir. Süre dolunca yedekleme, öğrencinin bir sonraki dokunuşunda
//   kısa bir Google penceresiyle yenilenir.

import { getState, HESAP_KEY, readSync, setState, SYNC_KEY, type CloudUser } from './cloud'

const CLIENT_ID = '1085307341925-pjrjdt4pv38t0soh3peglvq3hae3rre0.apps.googleusercontent.com'
const SCOPES = 'openid email profile https://www.googleapis.com/auth/drive.appdata'
const DOSYA = 'kimya-kocum.json'
const PREFIX = 'kimya-kocum-'
// Cihaza özel anahtarlar yedeğe girmez.
const LOCAL_ONLY = new Set([
  'kimya-kocum-page',
  'kimya-kocum-ders-gorunum',
  'kimya-kocum-sync',
  'kimya-kocum-hesap',
  'kimya-kocum-ogretmen-sinif',
])
const OTOMATIK_ARALIK = 12 * 60 * 60 * 1000 // 12 saatten eski yedek, ilk dokunuşta yenilenir

type TokenResponse = { access_token?: string; expires_in?: number; error?: string }
type TokenClient = { requestAccessToken: (o?: { prompt?: string; hint?: string }) => void; callback: (r: TokenResponse) => void }
type GoogleOAuth = {
  accounts: {
    oauth2: {
      initTokenClient: (c: { client_id: string; scope: string; callback: (r: TokenResponse) => void; error_callback?: (e: unknown) => void }) => TokenClient
      revoke: (token: string, done?: () => void) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleOAuth
  }
}

let token: { value: string; until: number } | null = null
let client: TokenClient | null = null
let bekleyen: { resolve: (t: string) => void; reject: (e: Error) => void } | null = null
let onChanged: () => void = () => undefined

function gsiYukle(): Promise<GoogleOAuth> {
  if (window.google?.accounts?.oauth2) return Promise.resolve(window.google)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => (window.google ? resolve(window.google) : reject(new Error('gsi')))
    s.onerror = () => reject(new Error('gsi'))
    document.head.appendChild(s)
  })
}

async function istemci(): Promise<TokenClient> {
  if (client) return client
  const g = await gsiYukle()
  client = g.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: r => {
      const b = bekleyen
      bekleyen = null
      if (r.access_token) {
        token = { value: r.access_token, until: Date.now() + ((r.expires_in ?? 3600) - 60) * 1000 }
        b?.resolve(r.access_token)
      } else b?.reject(new Error(r.error ?? 'izin'))
    },
    error_callback: () => {
      const b = bekleyen
      bekleyen = null
      b?.reject(new Error('iptal'))
    },
  })
  return client
}

function gecerli() {
  return token && token.until > Date.now() ? token.value : null
}

// Erişim anahtarı ister. Google penceresi açtığı için yalnızca dokunuşla çağrılmalı.
async function anahtarIste(prompt: string, hint?: string): Promise<string> {
  const c = await istemci()
  return new Promise((resolve, reject) => {
    bekleyen = { resolve, reject }
    c.requestAccessToken({ prompt, hint })
  })
}

async function api(path: string, init: RequestInit = {}, tekrar = true): Promise<Response> {
  const t = gecerli()
  if (!t) throw new Error('oturum')
  const r = await fetch(`https://www.googleapis.com${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${t}` },
  })
  if (r.status === 401 && tekrar) {
    token = null
    throw new Error('oturum')
  }
  if (!r.ok && r.status !== 404) throw new Error(`drive ${r.status}`)
  return r
}

function localStore(): Record<string, string> {
  const out: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(PREFIX) || LOCAL_ONLY.has(key)) continue
    const value = localStorage.getItem(key)
    if (value !== null) out[key] = value
  }
  return out
}

function hashOf(store: Record<string, string>) {
  const text = Object.keys(store).sort().map(k => `${k}=${store[k]}`).join('\n')
  let h = 0
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0
  return `${text.length}:${h}`
}

async function dosyaBul(): Promise<string | null> {
  const q = encodeURIComponent(`name='${DOSYA}'`)
  const r = await api(`/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id)`)
  const data = (await r.json()) as { files?: { id: string }[] }
  return data.files?.[0]?.id ?? null
}

async function indir(): Promise<Record<string, string> | null> {
  const id = await dosyaBul()
  if (!id) return null
  const r = await api(`/drive/v3/files/${id}?alt=media`)
  if (r.status === 404) return null
  const data = (await r.json()) as { store?: Record<string, string> }
  return data.store ?? null
}

async function yukle(store: Record<string, string>) {
  const body = JSON.stringify({ surum: 1, guncellendi: new Date().toISOString(), store })
  const id = await dosyaBul()
  if (id) {
    await api(`/upload/drive/v3/files/${id}?uploadType=media`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    return
  }
  const sinir = 'kk' + Math.random().toString(36).slice(2)
  const meta = JSON.stringify({ name: DOSYA, parents: ['appDataFolder'], mimeType: 'application/json' })
  const multipart =
    `--${sinir}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n` +
    `--${sinir}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${sinir}--`
  await api('/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { 'Content-Type': `multipart/related; boundary=${sinir}` },
    body: multipart,
  })
}

async function gonder(zorla = false) {
  const user = getState().user
  if (!user) return
  const store = localStore()
  const hash = hashOf(store)
  const info = readSync()
  if (!zorla && info?.email === user.email && info.hash === hash) return
  setState({ syncing: true })
  await yukle(store)
  const at = new Date().toISOString()
  localStorage.setItem(SYNC_KEY, JSON.stringify({ email: user.email, hash, at }))
  setState({ syncing: false, lastSync: at, error: null })
}

// Girişten sonra: Drive'daki yedek bu cihaza alınır, sonra birleşik hali yüklenir.
async function cek(user: CloudUser) {
  setState({ syncing: true })
  const remote = await indir()
  const local = localStore()
  const info = readSync()
  let changed = false
  if (remote) {
    const ilkKez = info?.email !== user.email
    const yerelProfil = !!local['kimya-kocum-profile-v1']
    const yerelDegismedi = !ilkKez && info?.hash === hashOf(local)
    for (const [key, value] of Object.entries(remote)) {
      // Bu cihazda ilk kez: yedek esastır; cihazda profil varsa yalnız eksikler tamamlanır.
      // Daha önce eşitlenmiş ve değişmemiş cihaz yedeği olduğu gibi alır.
      const al = ilkKez ? !yerelProfil || !(key in local) : yerelDegismedi || !(key in local)
      if (al && local[key] !== value) {
        localStorage.setItem(key, value)
        changed = true
      }
    }
  }
  await gonder(true)
  return changed
}

function hataMesaji(e: unknown) {
  const m = e instanceof Error ? e.message : ''
  if (m === 'iptal' || m === 'access_denied') return 'Google penceresi kapatıldı; yedekleme yapılmadı.'
  if (m === 'gsi' || /Failed to fetch|NetworkError/i.test(m)) return 'İnternet bağlantısı yok; ilerlemen bu cihazda duruyor.'
  return 'Yedekleme sırasında bir sorun oldu. "Şimdi yedekle" ile tekrar deneyebilirsin.'
}

export function start(dataChanged: () => void) {
  onChanged = dataChanged
  // Google kütüphanesini önceden yükle ki dokunuşta pencere hemen açılsın.
  if (getState().user) void istemci().catch(() => undefined)

  // Yedek eskiyse öğrencinin ilk dokunuşunda sessizce yenile.
  const ilkDokunus = () => {
    const s = getState()
    const son = s.lastSync ? new Date(s.lastSync).getTime() : 0
    if (s.user && !gecerli() && Date.now() - son > OTOMATIK_ARALIK) void syncNow(true)
  }
  document.addEventListener('pointerdown', ilkDokunus, { once: true, capture: true })

  // Uygulama arka plana geçerken (oturum geçerliyse) yedekle.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && gecerli()) void gonder().catch(() => undefined)
  })
  window.setInterval(() => {
    if (gecerli()) void gonder().catch(() => undefined)
  }, 60_000)
}

export async function syncNow(interactive = false) {
  const user = getState().user
  if (!user) return
  try {
    if (!gecerli()) {
      if (!interactive) return
      await anahtarIste('', user.email)
    }
    await gonder()
  } catch (e) {
    setState({ syncing: false, error: hataMesaji(e) })
  }
}

export async function googleIleGiris() {
  try {
    const t = await anahtarIste('select_account')
    const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${t}` } })
    const u = (await r.json()) as { email: string; name?: string; picture?: string; email_verified?: boolean }
    const user: CloudUser = {
      email: u.email,
      displayName: u.name ?? null,
      photoURL: u.picture ?? null,
      emailVerified: !!u.email_verified,
    }
    localStorage.setItem(HESAP_KEY, JSON.stringify(user))
    setState({ user, error: null })
    const changed = await cek(user)
    if (changed) onChanged()
  } catch (e) {
    setState({ syncing: false, error: hataMesaji(e) })
  }
}

export async function cikisYap() {
  try {
    if (gecerli()) await gonder()
  } catch {
    // çıkışı engelleme
  }
  const t = gecerli()
  if (t) window.google?.accounts.oauth2.revoke(t)
  token = null
  localStorage.removeItem(HESAP_KEY)
  localStorage.removeItem(SYNC_KEY)
  setState({ user: null, lastSync: null, error: null, syncing: false })
}

// Drive'daki yedeği siler, uygulamanın izinlerini geri alır.
export async function hesabiSil(cihazdakiniDeSil: boolean) {
  const user = getState().user
  if (!user) return
  if (!gecerli()) await anahtarIste('', user.email)
  const id = await dosyaBul()
  if (id) await api(`/drive/v3/files/${id}`, { method: 'DELETE' })
  const t = gecerli()
  if (t) window.google?.accounts.oauth2.revoke(t)
  token = null
  localStorage.removeItem(HESAP_KEY)
  localStorage.removeItem(SYNC_KEY)
  if (cihazdakiniDeSil) {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(PREFIX)) keys.push(key)
    }
    keys.forEach(key => localStorage.removeItem(key))
  }
  setState({ user: null, lastSync: null, error: null, syncing: false })
}
