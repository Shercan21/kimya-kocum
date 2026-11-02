// Google ile giriş ve ilerlemenin Firestore'a eşitlenmesi.
// Uygulama girişsiz de çalışır; giriş yapılınca localStorage'daki
// "kimya-kocum-" anahtarları users/{uid} belgesine yedeklenir ve
// başka cihazda giriş yapınca geri yüklenir.

import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  deleteUser,
  signOut,
  type User,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'
import { readSync, setState, SYNC_KEY, type CloudUser, type OgrenciOzeti, type Ozet } from './cloud'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const PREFIX = 'kimya-kocum-'
// Cihaza özel arayüz tercihleri eşitlenmez.
const LOCAL_ONLY = new Set([
  'kimya-kocum-page',
  'kimya-kocum-ders-gorunum',
  'kimya-kocum-sync',
  'kimya-kocum-ogretmen-sinif',
])

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

function parse<T>(raw: string | undefined, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// Öğretmen panelinde gösterilen kısa özet.
function summary(store: Record<string, string>): Ozet {
  const profile = parse<{ grade?: number; purpose?: string } | null>(store['kimya-kocum-profile-v1'], null)
  const progress = parse<{ status: string }[]>(store['kimya-kocum-learning-progress-v1'], [])
  const results = parse<{ dogru: number; toplam: number; tarih: string }[]>(store['kimya-kocum-test-sonuclari-v1'], [])
  const mistakes = parse<{ durum?: string }[]>(store['kimya-kocum-hata-defteri-v1'], [])
  const mistakeList = Array.isArray(mistakes) ? mistakes : []
  const dogru = results.reduce((s, r) => s + (r.dogru || 0), 0)
  const toplam = results.reduce((s, r) => s + (r.toplam || 0), 0)
  return {
    grade: profile?.grade ?? null,
    calisilan: progress.filter(p => p.status !== 'not_started').length,
    ogrenilen: progress.filter(p => p.status === 'learned' || p.status === 'permanent').length,
    kalici: progress.filter(p => p.status === 'permanent').length,
    test: results.length,
    basari: toplam ? Math.round((dogru / toplam) * 100) : null,
    hata: mistakeList.filter(m => m.durum === 'acik').length,
    sonTest: results.length ? results[results.length - 1].tarih : null,
  }
}

async function upload(user: User, force = false) {
  const store = localStore()
  const hash = hashOf(store)
  const info = readSync()
  if (!force && info?.uid === user.uid && info.hash === hash) return
  setState({ syncing: true })
  await setDoc(doc(db, 'users', user.uid), {
    ad: user.displayName ?? '',
    eposta: user.email ?? '',
    ozet: summary(store),
    store,
    guncellendi: serverTimestamp(),
  })
  const at = new Date().toISOString()
  localStorage.setItem(SYNC_KEY, JSON.stringify({ uid: user.uid, hash, at }))
  setState({ syncing: false, lastSync: at, error: null })
}

// Girişten sonra: hesapta veri varsa bu cihaza getir, yoksa bu cihazdakini yükle.
async function pull(user: User) {
  setState({ syncing: true })
  const snap = await getDoc(doc(db, 'users', user.uid))
  const remote = (snap.exists() ? snap.data().store : null) as Record<string, string> | null
  const local = localStore()
  const info = readSync()
  let changed = false

  if (remote) {
    const firstTimeHere = info?.uid !== user.uid
    const localHasProfile = !!local['kimya-kocum-profile-v1']
    const localUnchanged = !firstTimeHere && info?.hash === hashOf(local)
    for (const [key, value] of Object.entries(remote)) {
      // Cihaz bu hesapla ilk kez eşitleniyorsa hesaptaki veri esastır; ancak
      // cihazda zaten bir profil varsa yalnızca eksik anahtarlar tamamlanır.
      // Daha önce eşitlenmiş ve o zamandan beri değişmemiş cihaz, hesaptakini
      // (başka cihazda yapılan çalışmaları) olduğu gibi alır.
      const take = firstTimeHere
        ? !localHasProfile || !(key in local)
        : localUnchanged || !(key in local)
      if (take && local[key] !== value) {
        localStorage.setItem(key, value)
        changed = true
      }
    }
  }
  await upload(user, true)
  return changed
}

let timer: number | undefined

function toCloudUser(user: User): CloudUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  }
}

export function start(onDataChanged: () => void) {
  onAuthStateChanged(auth, async user => {
    setState({ ready: true, user: user ? toCloudUser(user) : null })
    window.clearInterval(timer)
    if (!user) return
    try {
      const changed = await pull(user)
      if (changed) onDataChanged()
    } catch (e) {
      setState({ syncing: false, error: hataMesaji(e) })
    }
    timer = window.setInterval(() => syncNow(), 60_000)
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') syncNow()
  })
}

export async function syncNow() {
  const user = auth.currentUser
  if (!user) return
  try {
    await upload(user)
  } catch (e) {
    setState({ syncing: false, error: hataMesaji(e) })
  }
}

export async function googleIleGiris() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  try {
    await signInWithPopup(auth, provider)
  } catch (e) {
    const code = (e as { code?: string }).code
    if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
      await signInWithRedirect(auth, provider)
      return
    }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return
    setState({ error: hataMesaji(e) })
  }
}

export async function cikisYap() {
  await syncNow()
  await signOut(auth)
  localStorage.removeItem(SYNC_KEY)
  setState({ lastSync: null })
}

// Sunucudaki bütün verileri ve (mümkünse) giriş kaydını siler.
export async function hesabiSil(cihazdakiniDeSil: boolean) {
  const user = auth.currentUser
  if (!user) return
  window.clearInterval(timer)
  await deleteDoc(doc(db, 'users', user.uid))
  try {
    await deleteUser(user)
  } catch {
    // Uzun süre önce giriş yapıldıysa Google yeniden giriş ister; veriler zaten silindi.
    await signOut(auth)
  }
  localStorage.removeItem(SYNC_KEY)
  if (cihazdakiniDeSil) {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(PREFIX)) keys.push(key)
    }
    keys.forEach(key => localStorage.removeItem(key))
  }
  setState({ lastSync: null })
}

function hataMesaji(e: unknown) {
  const code = (e as { code?: string }).code ?? ''
  if (code.includes('network')) return 'İnternet bağlantısı yok; ilerlemen bu cihazda duruyor, bağlanınca eşitlenecek.'
  if (code.includes('unauthorized-domain')) return 'Bu adresten giriş izni yok.'
  return 'Eşitleme sırasında bir sorun oldu. Biraz sonra yeniden denenecek.'
}

// --- Öğretmen paneli ---

export async function ogrencileriGetir(): Promise<OgrenciOzeti[]> {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => {
    const data = d.data()
    const ts = data.guncellendi as Timestamp | undefined
    return {
      uid: d.id,
      ad: data.ad ?? '',
      eposta: data.eposta ?? '',
      guncellendi: ts ? ts.toDate().toISOString() : null,
      ozet: data.ozet,
    }
  })
}
