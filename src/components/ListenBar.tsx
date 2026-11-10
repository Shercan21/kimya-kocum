import { useEffect, useRef, useState, type RefObject } from 'react'
import { konusmaMetni } from '../data/konusma'

// Konu anlatımını telefonun kendi Türkçe sesiyle (Web Speech API) okur.
// Ücretsizdir; ses dosyası indirilmez, sunucuya bir şey gönderilmez.

type Props = {
  // Okunacak anlatımın bulunduğu kutu (içerik değişince bileşen key ile yeniden kurulur)
  target: RefObject<HTMLElement | null>
}

type Parca = { el: HTMLElement; metin: string }

const HIZ_KEY = 'kimya-kocum-ses-hizi'
const HIZLAR = [0.8, 1, 1.2, 1.5]
const BLOK = 'h2, h3, h4, p, li, tr, figcaption, .tanim, .dikkat, .formul'

// Chrome uzun cümleleri yarıda kesebildiği için metni ~220 karakterlik parçalara böler.
function bol(metin: string): string[] {
  if (metin.length <= 220) return [metin]
  const cumleler = metin.match(/[^.!?;:]+[.!?;:]*/g) ?? [metin]
  const sonuc: string[] = []
  let kova = ''
  for (const c of cumleler) {
    if ((kova + c).length > 220 && kova) {
      sonuc.push(kova.trim())
      kova = ''
    }
    kova += c
  }
  if (kova.trim()) sonuc.push(kova.trim())
  return sonuc
}

function parcalariTopla(kok: HTMLElement): Parca[] {
  const parcalar: Parca[] = []
  kok.querySelectorAll<HTMLElement>(BLOK).forEach(el => {
    // İç içe bloklarda (ör. li içinde p) yalnızca en içteki okunur
    if (el.querySelector(BLOK)) return
    let ham: string
    if (el.tagName === 'TR') {
      ham = Array.from(el.children).map(td => td.textContent?.trim() ?? '').filter(Boolean).join(', ')
    } else {
      ham = el.textContent ?? ''
    }
    const metin = konusmaMetni(ham)
    if (metin.length > 1) parcalar.push({ el, metin })
  })
  return parcalar
}

function turkceSes(): SpeechSynthesisVoice | null {
  const sesler = window.speechSynthesis.getVoices()
  const tr = sesler.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith('tr'))
  return tr.find(v => /google/i.test(v.name)) ?? tr.find(v => v.localService) ?? tr[0] ?? null
}

export default function ListenBar({ target }: Props) {
  const destek = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  const [durum, setDurum] = useState<'bos' | 'okuyor' | 'duraklatildi'>('bos')
  const [sira, setSira] = useState(0)
  const [toplam, setToplam] = useState(0)
  const [hiz, setHiz] = useState<number>(() => {
    const kayitli = Number(localStorage.getItem(HIZ_KEY))
    return HIZLAR.includes(kayitli) ? kayitli : 1
  })
  const [sesYok, setSesYok] = useState(false)
  const [hata, setHata] = useState(false)
  const parcalar = useRef<Parca[]>([])
  const oturum = useRef(0)
  const siraRef = useRef(0)
  const hizRef = useRef(hiz)

  function isaretle(index: number | null) {
    target.current?.querySelectorAll('.tts-aktif').forEach(el => el.classList.remove('tts-aktif'))
    if (index === null) return
    const el = parcalar.current[index]?.el
    if (!el) return
    el.classList.add('tts-aktif')
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function durdur(sifirla: boolean) {
    oturum.current += 1
    if (destek) window.speechSynthesis.cancel()
    if (sifirla) {
      setDurum('bos')
      isaretle(null)
      siraRef.current = 0
      setSira(0)
    } else {
      setDurum('duraklatildi')
    }
  }

  function oku(index: number) {
    if (!destek) return
    if (!parcalar.current.length && target.current) {
      parcalar.current = parcalariTopla(target.current)
      setToplam(parcalar.current.length)
    }
    if (index >= parcalar.current.length) {
      durdur(true)
      return
    }
    const benim = ++oturum.current
    window.speechSynthesis.cancel()
    siraRef.current = index
    setSira(index)
    setDurum('okuyor')
    isaretle(index)
    const ses = turkceSes()
    setSesYok(window.speechSynthesis.getVoices().length > 0 && !ses)
    setHata(false)
    const bolumler = bol(parcalar.current[index].metin)
    bolumler.forEach((metin, i) => {
      const u = new SpeechSynthesisUtterance(metin)
      u.lang = 'tr-TR'
      if (ses) u.voice = ses
      u.rate = hizRef.current
      if (i === bolumler.length - 1) {
        u.onend = () => {
          if (oturum.current === benim) oku(index + 1)
        }
      }
      u.onerror = e => {
        if (oturum.current === benim && e.error !== 'interrupted' && e.error !== 'canceled') {
          durdur(false)
          setHata(true)
        }
      }
      window.speechSynthesis.speak(u)
    })
  }

  // Sayfadan çıkınca okumayı bitir
  useEffect(() => {
    const o = oturum
    return () => {
      o.current += 1
      if (destek) window.speechSynthesis.cancel()
    }
  }, [destek])

  // Sesler bazı tarayıcılarda geç yüklenir
  useEffect(() => {
    if (!destek) return
    const yukle = () => setSesYok(window.speechSynthesis.getVoices().length > 0 && !turkceSes())
    yukle()
    window.speechSynthesis.addEventListener('voiceschanged', yukle)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', yukle)
  }, [destek])

  // Okurken bir paragrafa dokununca oradan devam et
  useEffect(() => {
    const kok = target.current
    if (!kok || durum === 'bos') return
    const tikla = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(BLOK)
      const index = parcalar.current.findIndex(p => p.el === el || p.el.contains(el as Node) || (el?.contains(p.el) ?? false))
      if (index >= 0) oku(index)
    }
    kok.addEventListener('click', tikla)
    return () => kok.removeEventListener('click', tikla)
  })

  if (!destek) return null

  function hiziDegistir() {
    const yeni = HIZLAR[(HIZLAR.indexOf(hiz) + 1) % HIZLAR.length]
    setHiz(yeni)
    hizRef.current = yeni
    localStorage.setItem(HIZ_KEY, String(yeni))
    if (durum === 'okuyor') oku(siraRef.current)
  }

  return (
    <div className="listen-bar" role="region" aria-label="Sesli anlatım">
      {durum === 'bos' ? (
        <button type="button" className="listen-main" onClick={() => oku(0)}>
          <span aria-hidden="true">🔊</span> Sesli dinle
        </button>
      ) : (
        <>
          <button type="button" className="listen-btn" aria-label="Önceki bölüm" onClick={() => oku(Math.max(0, siraRef.current - 1))}>⏮</button>
          {durum === 'okuyor' ? (
            <button type="button" className="listen-btn is-main" aria-label="Duraklat" onClick={() => durdur(false)}>⏸</button>
          ) : (
            <button type="button" className="listen-btn is-main" aria-label="Devam et" onClick={() => oku(siraRef.current)}>▶</button>
          )}
          <button type="button" className="listen-btn" aria-label="Sonraki bölüm" onClick={() => oku(siraRef.current + 1)}>⏭</button>
          <button type="button" className="listen-btn" aria-label="Okumayı bitir" onClick={() => durdur(true)}>■</button>
          <span className="listen-progress">{toplam ? `${sira + 1}/${toplam}` : ''}</span>
        </>
      )}
      <button type="button" className="listen-speed" aria-label="Okuma hızı" onClick={hiziDegistir}>{String(hiz).replace('.', ',')}×</button>
      {durum !== 'bos' && <p className="listen-hint">Bir paragrafa dokunursan okuma oradan devam eder.</p>}
      {hata && <p className="listen-hint">Bu cihazda sesli okuma başlatılamadı. Telefonun metin okuma (TTS) ayarlarını kontrol edip yeniden dene.</p>}
      {sesYok && (
        <p className="listen-hint">
          Telefonunda Türkçe ses bulunamadı; okuma başka bir sesle yapılabilir. Ayarlar › Erişilebilirlik › Metin okuma
          çıkışı bölümünden Türkçe sesi indirebilirsin.
        </p>
      )}
    </div>
  )
}
