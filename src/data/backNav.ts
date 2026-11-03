// Telefonun geri tuşu: uygulamadan çıkmak yerine bir önceki ekrana döner.
// Bir ekran (konu, test, hata defteri, pencere…) açılınca tarayıcı geçmişine
// bir adım eklenir; geri tuşu en son açılanı kapatır. Ana sayfada geri tuşu
// her zamanki gibi uygulamadan çıkar.
//
// Her geçmiş adımı bir kimlik taşır. Geri gidilince, kimliği şimdiki adımdan
// büyük olan açık ekranlar kapatılır. Uygulama içinden kapatılan ekranın
// adımı en üstteyse geçmişten de geri alınır; bu sırada gelen yeni adımlar,
// geri alma bitene kadar bekletilir (aksi halde tarayıcı sırayı karıştırır).

import { useEffect, useRef, useState } from 'react'

type Entry = { id: number; fn: () => void }
const live: Entry[] = []
let seq = 0
let pendingBack = 0
const queue: number[] = []

function currentId(): number {
  const st = window.history.state as { kimyaKocum?: number } | null
  return st?.kimyaKocum ?? 0
}

function doPush(id: number) {
  window.history.pushState({ kimyaKocum: id }, '')
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    if (pendingBack > 0) {
      pendingBack--
      if (pendingBack === 0) {
        // Bekleyen adımlardan hâlâ açık olanları geçmişe ekle.
        queue.splice(0).forEach(id => {
          if (live.some(e => e.id === id)) doPush(id)
        })
      }
      return
    }
    const cur = currentId()
    // Şimdiki adımdan sonra açılmış ekranları (en sondan başlayarak) kapat.
    const kapanacak = live.filter(e => e.id > cur).sort((a, b) => b.id - a.id)
    kapanacak.forEach(e => {
      live.splice(live.indexOf(e), 1)
      e.fn()
    })
    // Uygulama içinden kapatılmış eski bir adıma düştüysek onu da atla.
    if (cur !== 0 && !live.some(e => e.id === cur)) window.history.back()
  })
}

function pushBack(fn: () => void): () => void {
  const id = ++seq
  live.push({ id, fn })
  if (pendingBack > 0) queue.push(id)
  else doPush(id)
  return () => {
    const i = live.findIndex(e => e.id === id)
    if (i < 0) return
    live.splice(i, 1)
    const q = queue.indexOf(id)
    if (q >= 0) {
      queue.splice(q, 1)
      return
    }
    if (currentId() === id) {
      pendingBack++
      window.history.back()
    }
  }
}

// active true olduğu sürece geri tuşu onBack'i çağırır. onBack çağrıldıktan
// sonra ekran hâlâ açıksa (ör. çok adımlı akışta bir önceki adım) yeni bir
// geri adımı eklenir.
export function useBackStep(active: boolean, onBack: () => void) {
  const ref = useRef(onBack)
  const [gen, setGen] = useState(0)
  useEffect(() => {
    ref.current = onBack
  })
  useEffect(() => {
    if (!active) return
    let released = false
    const release = pushBack(() => {
      released = true
      ref.current()
      setGen(g => g + 1)
    })
    return () => {
      if (!released) release()
    }
  }, [active, gen])
}
