import { useRef, useState } from 'react'
import { daire, sayi, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Kaydirici, Not } from './ortak'

// Sera etkisi: Güneş ışığı yüzeyi ısıtır, yüzey kızılötesi (IR) ışıma yapar,
// CO₂ molekülleri IR'yi soğurup her yöne yayar. CO₂ arttıkça yüzeye geri dönen ısı artar.

type Foton = { x: number; y: number; vx: number; vy: number; tur: 'gunes' | 'ir' }

export default function SeraSim() {
  const [ppm, setPpm] = useState(420)
  const sim = useRef<{ fotonlar: Foton[]; geri: number; kacan: number }>({ fotonlar: [], geri: 0, kacan: 0 })
  // basit model: ΔT ≈ 3 °C × log₂(C / 280) (iklim duyarlılığı varsayımı)
  const T = 14 + 3 * Math.log2(ppm / 280)

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const s = sim.current
    const zemin = H - 30
    // gökyüzü
    const g = ctx.createLinearGradient(0, 0, 0, zemin)
    g.addColorStop(0, '#0c2340')
    g.addColorStop(1, '#5aa0d8')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, zemin)
    ctx.fillStyle = '#3b6d11'
    ctx.fillRect(0, zemin, W, 30)
    yazi(ctx, '☀️', 24, 22, { boyut: 22 })
    // CO₂ molekülleri
    const nCO2 = Math.round(ppm / 40)
    const t = performance.now() / 1000
    const molekuller: [number, number][] = []
    for (let i = 0; i < nCO2; i++) {
      const x = ((i * 97) % (W - 20)) + 10 + Math.sin(t * 0.5 + i) * 8
      const y = 40 + ((i * 53) % (zemin - 90)) + Math.cos(t * 0.4 + i) * 6
      molekuller.push([x, y])
      daire(ctx, x, y, 3.5, '#3d3d3a')
      daire(ctx, x - 6, y, 3, '#e24b4a')
      daire(ctx, x + 6, y, 3, '#e24b4a')
    }
    // yeni fotonlar
    if (Math.random() < 0.25 * dt) s.fotonlar.push({ x: 30 + Math.random() * 40, y: 30, vx: 1.4 + Math.random(), vy: 2.2, tur: 'gunes' })
    for (const f of s.fotonlar) {
      f.x += f.vx * dt
      f.y += f.vy * dt
      if (f.tur === 'gunes' && f.y >= zemin) {
        // yüzey ısınır, IR yayar
        f.tur = 'ir'
        f.y = zemin - 2
        f.vx = (Math.random() - 0.5) * 1.6
        f.vy = -1.4
      } else if (f.tur === 'ir') {
        for (const [mx, my] of molekuller) {
          if (Math.abs(f.x - mx) < 7 && Math.abs(f.y - my) < 7 && Math.random() < 0.35) {
            const a = Math.random() * Math.PI * 2
            f.vx = Math.cos(a) * 1.5
            f.vy = Math.sin(a) * 1.5
            f.x += f.vx * 4
            f.y += f.vy * 4
          }
        }
        if (f.y >= zemin && f.vy > 0) { s.geri++; f.y = -999 }
      }
      if (f.y < 0 && f.tur === 'ir' && f.y > -900) { s.kacan++; f.y = -999 }
    }
    s.fotonlar = s.fotonlar.filter(f => f.y > -100 && f.x > -10 && f.x < W + 10)
    for (const f of s.fotonlar) {
      ctx.strokeStyle = f.tur === 'gunes' ? '#ffd84d' : '#ff6b4a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(f.x, f.y)
      ctx.lineTo(f.x - f.vx * 6, f.y - f.vy * 6)
      ctx.stroke()
    }
  })

  return (
    <div className="sim">
      <Gorev>CO₂ miktarını sanayi öncesi değerden (280 ppm) bugüne ve geleceğe doğru artır. Kızılötesi ışınların (kırmızı) uzaya kaçışı nasıl değişiyor? Yüzey sıcaklığı ne oluyor?</Gorev>
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Sera etkisi animasyonu" />
      <div className="sim-degerler">
        <Deger ad="Atmosferdeki CO₂" deger={`${ppm} ppm`} />
        <Deger ad="Ortalama yüzey sıcaklığı (model)" deger={`${sayi(T, 1)} °C`} vurgu />
        <Deger ad="Sanayi öncesine göre" deger={`+${sayi(T - 14, 1)} °C`} />
      </div>
      <Kaydirici etiket={<>CO₂ derişimi <b>{ppm} ppm</b> {ppm === 280 ? '(sanayi öncesi)' : ppm >= 410 && ppm <= 430 ? '(günümüz)' : ''}</>} deger={ppm} min={280} max={800} step={20} onChange={setPpm} />
      <Not>Sarı çizgiler Güneş ışığını, kırmızı çizgiler yüzeyin yaydığı kızılötesi ışınları gösterir. Sıcaklık, CO₂ iki katına çıkınca yaklaşık 3 °C artış varsayan basit bir modelle hesaplanmıştır; gerçek iklim sistemi çok daha karmaşıktır.</Not>
    </div>
  )
}
