// Hesap ve eşitleme durumunun hafif kısmı. Firebase kütüphanesi büyük olduğu
// için cloudImpl.ts ayrı bir parça olarak, uygulama açıldıktan sonra arka
// planda yüklenir; ilk açılış bundan etkilenmez.

import { useSyncExternalStore } from 'react'

export const TEACHER_EMAIL = 'ercanseyithasan@gmail.com'
export const SYNC_KEY = 'kimya-kocum-sync' // { uid, hash, at }

export type CloudUser = {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  emailVerified: boolean
}

export type CloudState = {
  ready: boolean
  user: CloudUser | null
  syncing: boolean
  lastSync: string | null
  error: string | null
}

export type Ozet = {
  grade: number | null
  calisilan: number
  ogrenilen: number
  kalici: number
  test: number
  basari: number | null
  hata: number
  sonTest: string | null
}

export type OgrenciOzeti = {
  uid: string
  ad: string
  eposta: string
  guncellendi: string | null
  ozet: Ozet
}

type SyncInfo = { uid: string; hash: string; at: string }

export function readSync(): SyncInfo | null {
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    return raw ? (JSON.parse(raw) as SyncInfo) : null
  } catch {
    return null
  }
}

let state: CloudState = { ready: false, user: null, syncing: false, lastSync: readSync()?.at ?? null, error: null }
const listeners = new Set<() => void>()

export function setState(patch: Partial<CloudState>) {
  state = { ...state, ...patch }
  listeners.forEach(fn => fn())
}

export function useCloud() {
  return useSyncExternalStore(
    fn => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => state
  )
}

export function isTeacher(user: CloudUser | null) {
  return !!user && user.email === TEACHER_EMAIL && user.emailVerified
}

const impl = () => import('./cloudImpl')

export function startCloud(onDataChanged: () => void) {
  const go = () => {
    impl()
      .then(m => m.start(onDataChanged))
      .catch(() => setState({ ready: true, error: 'Hesap hizmetine ulaşılamadı; uygulama bu cihazda çalışmaya devam ediyor.' }))
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 2500 })
  else setTimeout(go, 800)
}

export async function syncNow() {
  if (!state.user) return
  return (await impl()).syncNow()
}

export async function googleIleGiris() {
  return (await impl()).googleIleGiris()
}

export async function cikisYap() {
  return (await impl()).cikisYap()
}

export async function hesabiSil(cihazdakiniDeSil: boolean) {
  return (await impl()).hesabiSil(cihazdakiniDeSil)
}

export async function ogrencileriGetir(): Promise<OgrenciOzeti[]> {
  return (await impl()).ogrencileriGetir()
}
