import { useRef, useState } from 'react'
import Icon from './Icon'
import { sureYazi, videoAdresi, type DersVideosu, type VideoSoru } from '../data/content'
import './video.css'

type Props = {
  video: DersVideosu
  onEnded?: () => void
}

// Videolu anlatım oynatıcısı: bölümlere atlama ve "Kendini dene" durakları.
// Soru zamanı gelince video durur, öğrenci şıkkı seçer, açıklamayı görür ve devam eder.
export default function VideoLesson({ video, onEnded }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [now, setNow] = useState(0)
  const [soru, setSoru] = useState<VideoSoru | null>(null)
  const [secim, setSecim] = useState<number | null>(null)
  const [cevaplanan, setCevaplanan] = useState<Set<number>>(() => new Set())
  const [hata, setHata] = useState(false)
  const bolumler = video.bolumler ?? []
  const sorular = [...(video.sorular ?? [])].sort((a, b) => a.t - b.t)

  function zaman() {
    const el = ref.current
    if (!el) return
    const t = el.currentTime
    setNow(t)
    if (soru) return
    // Yalnız doğal izlemede tetiklenir: soru saniyesinden sonraki 1,5 saniye içinde.
    const gelen = sorular.find(q => !cevaplanan.has(q.t) && t >= q.t && t < q.t + 1.5)
    if (gelen) {
      el.pause()
      if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
      setSoru(gelen)
      setSecim(null)
    }
  }

  function git(t: number) {
    const el = ref.current
    if (!el) return
    el.currentTime = t
    el.play().catch(() => undefined)
  }

  function devam() {
    if (!soru) return
    setCevaplanan(prev => new Set(prev).add(soru.t))
    setSoru(null)
    setSecim(null)
    ref.current?.play().catch(() => undefined)
  }

  const aktifBolum = bolumler.reduce((acc, b, i) => (b.t <= now + 0.3 ? i : acc), -1)
  const dogru = secim !== null && soru !== null && secim === soru.d

  return (
    <div className="video-lesson">
      <div className="video-frame">
        <video
          ref={ref}
          src={videoAdresi(video.src)}
          poster={video.poster ? videoAdresi(video.poster) : undefined}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onTimeUpdate={zaman}
          onSeeked={() => ref.current && setNow(ref.current.currentTime)}
          onEnded={onEnded}
          onError={() => setHata(true)}
        />
        {soru && (
          <div className="video-quiz" role="dialog" aria-modal="true" aria-label="Kendini dene">
            <div className="video-quiz-card">
              <small className="video-quiz-tag">KENDİNİ DENE</small>
              <p className="video-quiz-q">{soru.s.replace(/\s+(?=(?:I|II|III|IV|V)\.\s)/g, '\n').replace(/\s+(yargı|ifade)/, '\n$1')}</p>
              <div className="video-quiz-options">
                {soru.sik.map((sik, i) => {
                  const durum = secim === null ? '' : i === soru.d ? ' is-correct' : i === secim ? ' is-wrong' : ' is-dim'
                  return (
                    <button
                      key={i}
                      type="button"
                      className={'video-quiz-option' + durum}
                      disabled={secim !== null}
                      onClick={() => setSecim(i)}
                    >
                      <b>{'ABCDE'[i]}</b> {sik}
                    </button>
                  )
                })}
              </div>
              {secim !== null && (
                <div className={dogru ? 'video-quiz-result ok' : 'video-quiz-result no'}>
                  <b>{dogru ? 'Doğru!' : `Doğru cevap ${'ABCDE'[soru.d]}.`}</b>
                  {soru.c && <p>{soru.c}</p>}
                </div>
              )}
              <div className="row-actions">
                {secim === null && (
                  <button type="button" className="btn-secondary" onClick={devam}>Şimdilik geç</button>
                )}
                {secim !== null && (
                  <button type="button" className="primary-button" onClick={devam}>
                    Videoya devam et <Icon name="play" size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {hata && <p className="form-error">Video yüklenemedi. İnternet bağlantını kontrol edip sayfayı yenile.</p>}

      <div className="video-meta muted small">
        <Icon name="clock" size={14} /> {sureYazi(video.sure)}
        {sorular.length > 0 && <> · {sorular.length} “Kendini dene” sorusu (video kendiliğinden durur)</>}
      </div>

      {bolumler.length > 1 && (
        <details className="video-chapters-box" open={typeof window !== 'undefined' && window.innerWidth > 700}>
        <summary>Bölümler ({bolumler.length}) · istediğin yere atla</summary>
        <ol className="video-chapters" aria-label="Bölümler">
          {bolumler.map((b, i) => (
            <li key={i}>
              <button
                type="button"
                className={i === aktifBolum ? 'is-active' : undefined}
                aria-current={i === aktifBolum ? 'true' : undefined}
                onClick={() => git(b.t)}
              >
                <span className="video-chapter-time">{sureYazi(b.t)}</span>
                <span className="video-chapter-name">{b.ad}</span>
              </button>
            </li>
          ))}
        </ol>
        </details>
      )}
    </div>
  )
}
