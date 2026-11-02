import { useEffect, useState } from 'react'
import Icon from './Icon'
import { icerikHtml, testDosyasi, type Soru, type TestDosyasi } from '../data/content'
import { basari, GECME_ORANI, sonucKaydet, type TestSonucu } from '../data/results'

type Props = {
  grade: number
  testId: string
  testIndex: number
  konuKod: string | null
  konuBaslik: string | null
  baslik: string
  onClose: () => void
}

const harf = ['A', 'B', 'C', 'D', 'E', 'F']

function Html({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: icerikHtml(html) }} />
}

export default function TestRunner({ grade, testId, testIndex, konuKod, konuBaslik, baslik, onClose }: Props) {
  const [dosya, setDosya] = useState<TestDosyasi | null>(null)
  const [hata, setHata] = useState('')
  const [index, setIndex] = useState(0)
  const [cevaplar, setCevaplar] = useState<Record<number, number>>({})
  const [sonuc, setSonuc] = useState<TestSonucu | null>(null)
  const [onay, setOnay] = useState(false)

  useEffect(() => {
    let active = true
    testDosyasi(grade, testId)
      .then(data => active && setDosya(data))
      .catch(() => active && setHata('Test yüklenemedi. İnternet bağlantını kontrol edip tekrar dene.'))
    return () => {
      active = false
    }
  }, [grade, testId])

  if (hata) {
    return (
      <section className="card">
        <p className="muted">{hata}</p>
        <button type="button" className="btn-secondary" onClick={onClose}>Geri dön</button>
      </section>
    )
  }

  if (!dosya) return <section className="card"><p className="muted">Test yükleniyor…</p></section>

  const test = dosya.testler[testIndex]
  const sorular: Soru[] = test?.sorular ?? []
  const cevaplanan = Object.keys(cevaplar).length
  const soru = sorular[index]

  function bitir() {
    if (!test) return
    const yanlisSorular: number[] = []
    let dogru = 0
    let bos = 0
    sorular.forEach((item, i) => {
      if (cevaplar[i] === undefined) bos++
      else if (cevaplar[i] === item.d) dogru++
      else yanlisSorular.push(i)
    })
    setSonuc(
      sonucKaydet(
        {
          grade,
          konuKod,
          testId,
          seviye: test.seviye,
          tur: dosya!.tur,
          dogru,
          yanlis: yanlisSorular.length,
          bos,
          toplam: sorular.length,
          yanlisSorular,
        },
        konuBaslik
      )
    )
    setIndex(0)
    window.scrollTo({ top: 0 })
  }

  if (sonuc) {
    const oran = basari(sonuc)
    return (
      <div className="stack">
        <section className="card result-card">
          <small>{baslik}</small>
          <h2>%{oran} başarı</h2>
          <div className="result-stats">
            <span className="ok">{sonuc.dogru} doğru</span>
            <span className="bad">{sonuc.yanlis} yanlış</span>
            <span>{sonuc.bos} boş</span>
          </div>
          <p className="muted">
            {oran >= GECME_ORANI
              ? konuKod
                ? 'Tebrikler, bu konuyu öğrendin. Kalıcı olması için birkaç gün sonra tekrar etmeyi unutma.'
                : 'Tebrikler, çok iyi bir sonuç.'
              : `Geçme sınırı %${GECME_ORANI}. Aşağıdan yanlışlarının çözümlerine bak, sonra tekrar dene.`}
          </p>
          <div className="row-actions start">
            <button type="button" className="btn-secondary" onClick={onClose}>Konuya dön</button>
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setSonuc(null)
                setCevaplar({})
                setIndex(0)
                setOnay(false)
              }}
            >
              Tekrar çöz
            </button>
          </div>
        </section>

        {sorular.map((item, i) => {
          const verilen = cevaplar[i]
          const durum = verilen === undefined ? 'bos' : verilen === item.d ? 'dogru' : 'yanlis'
          return (
            <section key={i} className={`card review review-${durum}`}>
              <div className="review-head">
                <b>{i + 1}. soru</b>
                <span>{durum === 'dogru' ? 'Doğru' : durum === 'yanlis' ? 'Yanlış' : 'Boş'}</span>
              </div>
              <Html className="soru-metni" html={item.s} />
              <ol className="siklar readonly">
                {item.sik.map((sik, j) => (
                  <li
                    key={j}
                    className={[
                      j === item.d ? 'is-correct' : '',
                      j === verilen && j !== item.d ? 'is-wrong' : '',
                    ].join(' ')}
                  >
                    <span className="harf">{harf[j]}</span>
                    <Html html={sik} />
                  </li>
                ))}
              </ol>
              {item.c && (
                <details className="cozum" open={durum !== 'dogru'}>
                  <summary>Çözüm</summary>
                  <Html html={item.c} />
                </details>
              )}
            </section>
          )
        })}
      </div>
    )
  }

  return (
    <div className="stack">
      <section className="card test-card">
        <div className="test-head">
          <button type="button" className="btn-ghost" onClick={onClose} aria-label="Testten çık">×</button>
          <div>
            <small>{baslik}</small>
            <b>{index + 1} / {sorular.length}</b>
          </div>
          <span className="muted small">{cevaplanan} cevaplandı</span>
        </div>
        <div className="test-dots" role="group" aria-label="Sorular">
          {sorular.map((_, i) => (
            <button
              key={i}
              type="button"
              className={[i === index ? 'is-current' : '', cevaplar[i] !== undefined ? 'is-answered' : ''].join(' ')}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}. soru`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {soru && (
          <>
            <Html className="soru-metni" html={soru.s} />
            <ol className="siklar">
              {soru.sik.map((sik, j) => (
                <li key={j}>
                  <button
                    type="button"
                    className={cevaplar[index] === j ? 'is-selected' : ''}
                    onClick={() =>
                      setCevaplar(previous => {
                        const next = { ...previous }
                        if (next[index] === j) delete next[index]
                        else next[index] = j
                        return next
                      })
                    }
                    aria-pressed={cevaplar[index] === j}
                  >
                    <span className="harf">{harf[j]}</span>
                    <Html html={sik} />
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="test-nav">
          <button type="button" className="btn-secondary" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>
            ‹ Önceki
          </button>
          {index < sorular.length - 1 ? (
            <button type="button" className="primary-button" onClick={() => setIndex(i => i + 1)}>
              Sonraki ›
            </button>
          ) : onay || cevaplanan === sorular.length ? (
            <button type="button" className="primary-button" onClick={bitir}>
              <Icon name="check" size={16} /> Testi bitir
            </button>
          ) : (
            <button type="button" className="primary-button" onClick={() => setOnay(true)}>
              Testi bitir
            </button>
          )}
        </div>
        {onay && cevaplanan < sorular.length && (
          <p className="program-message">
            {sorular.length - cevaplanan} soru boş. Yine de bitirmek için tekrar "Testi bitir"e bas.
          </p>
        )}
      </section>
    </div>
  )
}
