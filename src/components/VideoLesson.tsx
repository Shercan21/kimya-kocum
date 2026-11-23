import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { sureYazi, videoAdresi, type DersVideosu, type VideoSoru } from '../data/content'
import './video.css'
import { CanliBoyayici, KALEMLER, TEMALAR, YAZI, YAZI_ADI, ayarOku, ayarYaz, koyuMu, kutularAt, varsayilanMi, yaziSecenekleri, type TahtaAyari } from './canliBoya'

type Props = {
  video: DersVideosu
  onEnded?: () => void
}

const VIDEO_SUBTITLE_KEY = 'kimya-kocum-video-subtitle-language'
const EMPTY_SUBTITLES: NonNullable<DersVideosu['subtitles']> = []

function readSubtitlePreference() {
  try { return localStorage.getItem(VIDEO_SUBTITLE_KEY) || 'off' } catch { return 'off' }
}

function saveSubtitlePreference(language: string) {
  try { localStorage.setItem(VIDEO_SUBTITLE_KEY, language) } catch { /* Captions still work if storage is unavailable. */ }
}

// Videolu anlatım oynatıcısı: bölümlere atlama ve "Kendini dene" durakları.
// Soru zamanı gelince video durur, öğrenci şıkkı seçer, açıklamayı görür ve devam eder.
function ornekZemin(tema: string) {
  if (tema === 'kareli') return 'repeating-linear-gradient(0deg,#dee8f2 0 1px,#fff 1px 6px),#fff'
  if (koyuMu(tema)) return tema === 'kara' ? '#242826' : tema === 'yesil' ? '#1e4632' : '#1a385a'
  return '#fff'
}

export default function VideoLesson({ video, onEnded }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [now, setNow] = useState(0)
  const [soru, setSoru] = useState<VideoSoru | null>(null)
  const [secim, setSecim] = useState<number | null>(null)
  const [cevaplanan, setCevaplanan] = useState<Set<number>>(() => new Set())
  const [hata, setHata] = useState(false)
  const subtitles = video.subtitles ?? EMPTY_SUBTITLES
  // Müfredat yayımlanmış içerik hizmetinden asenkron gelir. İlk render'da
  // altyazı listesi henüz yokken kaydedilmiş dili silme; track yüklenince uygula.
  const [subtitleLanguage, setSubtitleLanguage] = useState(readSubtitlePreference)
  const bolumler = video.bolumler ?? []
  const sorular = [...(video.sorular ?? [])].sort((a, b) => a.t - b.t)

  // Canlı tahta: yalnız atölyede nötr paketlenmiş (canli verisi olan) videolarda.
  const canli = video.canli?.notr ? video.canli : null
  const cvRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const boyayici = useRef<CanliBoyayici | null>(null)
  const [ayar, setAyar] = useState<TahtaAyari>(ayarOku)
  const [panel, setPanel] = useState(false)
  const [glYok, setGlYok] = useState(false)
  const [oynuyor, setOynuyor] = useState(false)
  const [sure, setSure] = useState(video.sure || 0)
  const [sessiz, setSessiz] = useState(false)
  const [hiz, setHiz] = useState(1)
  const [cue, setCue] = useState('')
  const boyali = !!canli && !glYok && !varsayilanMi(ayar)
  const ayarRef = useRef(ayar)
  ayarRef.current = ayar

  function ayarDegis(a: Partial<TahtaAyari>) {
    const y = { ...ayar, ...a }
    if (a.tema !== undefined && y.ink && !yaziSecenekleri(y.tema).includes(y.ink)) y.ink = ''
    setAyar(y)
    ayarYaz(y)
  }

  useEffect(() => {
    if (!boyali) return
    const el = ref.current, cv = cvRef.current
    if (!el || !cv || !canli) return
    if (!boyayici.current) {
      boyayici.current = CanliBoyayici.dene(cv)
      if (!boyayici.current) { setGlYok(true); return }
    }
    const b = boyayici.current
    let dur = false, rvfc = 0, raf = 0
    const kare = () => {
      const t = el.currentTime
      const kar = kutularAt(canli.karakter, t)[0] || null
      if (!b.ciz(el, ayarRef.current, kutularAt(canli.koru, t), kar) && el.readyState >= 2) setGlYok(true)
    }
    const v = el as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number; cancelVideoFrameCallback?: (n: number) => void }
    const dongu = () => {
      if (dur) return
      kare()
      if (v.requestVideoFrameCallback) rvfc = v.requestVideoFrameCallback(dongu)
      else raf = requestAnimationFrame(dongu)
    }
    dongu()
    const tekKare = () => kare()
    el.addEventListener('seeked', tekKare)
    el.addEventListener('loadeddata', tekKare)
    return () => {
      dur = true
      if (rvfc && v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(rvfc)
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('seeked', tekKare)
      el.removeEventListener('loadeddata', tekKare)
    }
  }, [boyali, canli, ayar])

  // Boyalı görünümde yerleşik altyazı tuvalin altında kalır; metni kendimiz gösteririz.
  useEffect(() => {
    const media = ref.current
    if (!media || !boyali) { setCue(''); return }
    const iz = Array.from(media.textTracks).find(tr => tr.mode !== 'disabled')
    if (!iz) { setCue(''); return }
    const guncelle = () => setCue(Array.from(iz.activeCues || []).map(c => (c as VTTCue).text).join('\n'))
    guncelle()
    iz.addEventListener('cuechange', guncelle)
    return () => iz.removeEventListener('cuechange', guncelle)
  }, [boyali, subtitleLanguage, subtitles])

  function oynatDurdur() {
    const el = ref.current
    if (!el || soru) return
    if (el.paused) el.play().catch(() => undefined)
    else el.pause()
  }
  function tamEkran() {
    const f = frameRef.current
    if (!f) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined)
    else f.requestFullscreen?.().catch(() => undefined)
  }
  function altyaziDegis() {
    const sira = ['off', ...subtitles.map(t => t.lang)]
    const y = sira[(sira.indexOf(subtitleLanguage) + 1) % sira.length]
    setSubtitleLanguage(y)
    saveSubtitlePreference(y)
  }

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

  useEffect(() => {
    const media = ref.current
    if (!media) return
    const applySelection = () => Array.from(media.textTracks).forEach(track => {
      track.mode = subtitleLanguage !== 'off' && track.language === subtitleLanguage ? (boyali ? 'hidden' : 'showing') : 'disabled'
    })
    const rememberNativeSelection = () => {
      if (boyali) return
      const showing = Array.from(media.textTracks).find(track => track.mode === 'showing')
      const language = showing?.language || 'off'
      setSubtitleLanguage(language)
      saveSubtitlePreference(language)
    }
    applySelection()
    media.textTracks.addEventListener('change', rememberNativeSelection)
    return () => media.textTracks.removeEventListener('change', rememberNativeSelection)
  }, [subtitleLanguage, video.src, subtitles, boyali])

  useEffect(() => {
    if (subtitles.length > 0 && subtitleLanguage !== 'off' && !subtitles.some(track => track.lang === subtitleLanguage)) {
      setSubtitleLanguage('off')
      saveSubtitlePreference('off')
    }
  }, [subtitleLanguage, subtitles])

  const aktifBolum = bolumler.reduce((acc, b, i) => (b.t <= now + 0.3 ? i : acc), -1)
  const dogru = secim !== null && soru !== null && secim === soru.d

  return (
    <div className="video-lesson">
      <div className={'video-frame' + (boyali ? ' is-canli' : '')} ref={frameRef}>
        <video
          ref={ref}
          src={videoAdresi(video.src)}
          poster={video.poster ? videoAdresi(video.poster) : undefined}
          crossOrigin={subtitles.length || canli ? 'anonymous' : undefined}
          controls={!boyali}
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onTimeUpdate={zaman}
          onSeeked={() => ref.current && setNow(ref.current.currentTime)}
          onEnded={onEnded}
          onPlay={() => setOynuyor(true)}
          onPause={() => setOynuyor(false)}
          onLoadedMetadata={() => { const el = ref.current; if (el && Number.isFinite(el.duration)) setSure(el.duration) }}
          onVolumeChange={() => setSessiz(!!ref.current?.muted)}
          onRateChange={() => setHiz(ref.current?.playbackRate || 1)}
          onError={() => setHata(true)}
        >
          {subtitles.map((track, i) => (
            <track
              key={`${track.lang}-${track.url}-${i}`}
              kind="subtitles"
              src={track.url}
              srcLang={track.lang}
              label={track.label}
              onLoad={() => {
                const textTrack = ref.current?.textTracks[i]
                if (textTrack) textTrack.mode = subtitleLanguage !== 'off' && textTrack.language === subtitleLanguage ? (boyali ? 'hidden' : 'showing') : 'disabled'
              }}
            />
          ))}
        </video>
        {canli && !glYok && (
          <canvas ref={cvRef} className="video-canli" hidden={!boyali} onClick={oynatDurdur} aria-hidden="true" />
        )}
        {boyali && cue && <div className="video-canli-cue">{cue}</div>}
        {boyali && (
          <div className="video-canli-bar">
            <button type="button" onClick={oynatDurdur} aria-label={oynuyor ? 'Durdur' : 'Oynat'}>{oynuyor ? '❚❚' : '▶'}</button>
            <span className="video-canli-time">{sureYazi(now)} / {sureYazi(sure)}</span>
            <input
              type="range" min={0} max={Math.max(1, sure)} step={0.1} value={Math.min(now, sure || now)}
              aria-label="Videoda ilerle"
              onChange={e => { const el = ref.current; if (el) { el.currentTime = Number(e.target.value); setNow(el.currentTime) } }}
            />
            <button type="button" onClick={() => { const el = ref.current; if (el) el.playbackRate = hiz >= 2 ? 1 : hiz === 1 ? 1.25 : hiz === 1.25 ? 1.5 : 2 }} aria-label="Oynatma hızı">{hiz}x</button>
            {subtitles.length > 0 && (
              <button type="button" onClick={altyaziDegis} aria-label="Altyazı" className={subtitleLanguage !== 'off' ? 'is-on' : undefined}>CC</button>
            )}
            <button type="button" onClick={() => { const el = ref.current; if (el) el.muted = !el.muted }} aria-label={sessiz ? 'Sesi aç' : 'Sesi kapat'}>{sessiz ? '🔇' : '🔊'}</button>
            {typeof document !== 'undefined' && document.fullscreenEnabled && (
              <button type="button" onClick={tamEkran} aria-label="Tam ekran">⛶</button>
            )}
          </div>
        )}
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

      {canli && !glYok && (
        <div className="video-tahta">
          <button type="button" className="video-tahta-ac" aria-expanded={panel} onClick={() => setPanel(p => !p)}>
            <span className="video-tahta-ornek" style={{ background: ornekZemin(ayar.tema) }} /> Tahta ve yazı rengi
            {!varsayilanMi(ayar) && <small> · {TEMALAR.find(t => t[0] === ayar.tema)?.[1]}</small>}
          </button>
          {panel && (
            <div className="video-tahta-panel">
              <div className="video-tahta-satir"><b>Tahta</b>
                {TEMALAR.map(([k, ad]) => (
                  <button key={k} type="button" className={'chip' + (ayar.tema === k ? ' is-active' : '')} onClick={() => ayarDegis({ tema: k })}>
                    <span className="video-tahta-ornek" style={{ background: ornekZemin(k) }} /> {ad}
                  </button>
                ))}
              </div>
              <div className="video-tahta-satir"><b>Yazı rengi</b>
                {yaziSecenekleri(ayar.tema).map(k => (
                  <button key={k || 'oto'} type="button" className={'chip' + (ayar.ink === k ? ' is-active' : '')} onClick={() => ayarDegis({ ink: k })}>
                    {k && <span className="video-tahta-ornek" style={{ background: `rgb(${YAZI[k].join(',')})` }} />} {YAZI_ADI[k]}
                  </button>
                ))}
              </div>
              <div className="video-tahta-satir"><b>Kalem</b>
                {KALEMLER.map(([k, ad]) => (
                  <button key={k || 'normal'} type="button" className={'chip' + (ayar.kalem === k ? ' is-active' : '')} onClick={() => ayarDegis({ kalem: k })}>{ad}</button>
                ))}
              </div>
              <p className="muted small">Video oynarken de değiştirebilirsin. Fotoğraflar ve resimler olduğu gibi kalır. Seçimin bu cihazda hatırlanır.</p>
              {!varsayilanMi(ayar) && (
                <button type="button" className="btn-secondary" onClick={() => ayarDegis({ tema: 'beyaz', ink: '', kalem: '' })}>Orijinal görünüme dön</button>
              )}
            </div>
          )}
        </div>
      )}

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

