import { useRef, useState } from 'react'
import { daire, useAnimasyon, yazi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Çözünme süreci (tanecik düzeyi): NaCl iyonlarının hidratasyonu, şekerin moleküler
// çözünmesi ve yağın suda çözünmemesi. İletkenlik testi.

type Mod = 'tuz' | 'seker' | 'yag'
type Tan = { x: number; y: number; vx: number; vy: number; tur: 'Na' | 'Cl' | 'seker' | 'yag'; serbest: boolean; ox: number; oy: number }

export default function CozunmeSim() {
  const [mod, setMod] = useState<Mod>('tuz')
  const [karistir, setKaristir] = useState(false)
  const sim = useRef<{ mod: Mod | null; tan: Tan[]; t: number }>({ mod: null, tan: [], t: 0 })

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const s = sim.current
    if (s.mod !== mod) {
      s.mod = mod
      s.t = 0
      s.tan = []
      if (mod === 'tuz') {
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
          const x = W / 2 - 36 + i * 24
          const y = H - 90 + j * 20
          s.tan.push({ x, y, vx: 0, vy: 0, tur: (i + j) % 2 ? 'Cl' : 'Na', serbest: false, ox: x, oy: y })
        }
      } else if (mod === 'seker') {
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          const x = W / 2 - 34 + i * 34
          const y = H - 90 + j * 26
          s.tan.push({ x, y, vx: 0, vy: 0, tur: 'seker', serbest: false, ox: x, oy: y })
        }
      } else {
        for (let i = 0; i < 18; i++) s.tan.push({ x: 20 + Math.random() * (W - 40), y: 20 + Math.random() * 40, vx: 0, vy: 0, tur: 'yag', serbest: false, ox: 0, oy: 0 })
      }
    }
    // su molekülleri (arka plan)
    const t = performance.now() / 1000
    for (let i = 0; i < 46; i++) {
      const x = ((i * 71) % (W - 20)) + 10 + Math.sin(t * 1.5 + i) * 6
      const y = ((i * 37) % (H - 20)) + 10 + Math.cos(t * 1.2 + i * 2) * 6
      if (mod === 'yag' && y < 70) continue
      daire(ctx, x, y, 4.5, 'rgba(226,75,74,.55)')
      daire(ctx, x - 4, y - 4, 2.5, 'rgba(200,200,200,.9)')
      daire(ctx, x + 4, y - 4, 2.5, 'rgba(200,200,200,.9)')
    }
    if (karistir) s.t += dt
    for (const p of s.tan) {
      if (mod === 'yag') continue
      // kristal yüzeyinden sırayla kopma
      if (!p.serbest && karistir) {
        const yuzey = p.oy - (H - 90) // üst sıralar önce kopar
        if (s.t > 20 + yuzey * 4 + (p.ox % 7) * 6) {
          p.serbest = true
          const a = Math.random() * Math.PI * 2
          p.vx = Math.cos(a) * 0.8
          p.vy = -Math.abs(Math.sin(a)) * 0.8
        }
      }
      if (p.serbest) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.x < 14 || p.x > W - 14) p.vx *= -1
        if (p.y < 14 || p.y > H - 14) p.vy *= -1
        p.vx += (Math.random() - 0.5) * 0.08
        p.vy += (Math.random() - 0.5) * 0.08
        p.vx = Math.max(-1, Math.min(1, p.vx))
        p.vy = Math.max(-1, Math.min(1, p.vy))
      }
      if (p.tur === 'Na' || p.tur === 'Cl') {
        const r = p.tur === 'Na' ? 7 : 10
        if (p.serbest) {
          // hidratasyon kabuğu: su molekülleri doğru ucuyla yönelir
          for (let k = 0; k < 5; k++) {
            const a = (k / 5) * Math.PI * 2 + t * 0.5
            const wx = p.x + Math.cos(a) * (r + 8)
            const wy = p.y + Math.sin(a) * (r + 8)
            if (p.tur === 'Na') {
              daire(ctx, wx, wy, 4, '#e24b4a') // O ucu iyona dönük
              daire(ctx, wx + Math.cos(a) * 5, wy + Math.sin(a) * 5, 2.5, '#ddd')
            } else {
              daire(ctx, wx, wy, 2.5, '#ddd') // H ucu iyona dönük
              daire(ctx, wx + Math.cos(a) * 5, wy + Math.sin(a) * 5, 4, '#e24b4a')
            }
          }
        }
        daire(ctx, p.x, p.y, r, p.tur === 'Na' ? '#7f77dd' : '#1d9e75')
        yazi(ctx, p.tur === 'Na' ? 'Na⁺' : 'Cl⁻', p.x, p.y, { boyut: 7, kalin: true, renk: '#fff' })
      } else if (p.tur === 'seker') {
        ctx.fillStyle = '#f2a623'
        ctx.beginPath()
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2
          ctx.lineTo(p.x + Math.cos(a) * 11, p.y + Math.sin(a) * 11)
        }
        ctx.fill()
      }
    }
    if (mod === 'yag') {
      ctx.fillStyle = 'rgba(242,166,35,.45)'
      ctx.fillRect(4, 4, W - 8, 62)
      yazi(ctx, 'Yağ tabakası', W / 2, 34, { boyut: 12, kalin: true, renk: '#854f0b' })
      ctx.strokeStyle = '#854f0b'
      ctx.beginPath()
      ctx.moveTo(4, 66 + Math.sin(t * 2) * 2)
      ctx.lineTo(W - 4, 66 + Math.cos(t * 2) * 2)
      ctx.stroke()
      yazi(ctx, 'Su', W / 2, H - 16, { boyut: 12, kalin: true, renk: '#185fa5' })
    }
  })

  const iletir = mod === 'tuz' && karistir

  return (
    <div className="sim">
      <Gorev>Maddeyi suya koyup karıştır. Tanecikler nasıl ayrılıyor? Su moleküllerinin hangi ucu iyonlara dönüyor? Çözelti elektriği iletiyor mu?</Gorev>
      <Secenekler secenekler={[{ id: 'tuz', ad: 'Sofra tuzu (NaCl)' }, { id: 'seker', ad: 'Şeker' }, { id: 'yag', ad: 'Zeytinyağı' }]} secili={mod} onSec={m => { setMod(m); setKaristir(false) }} />
      <canvas ref={canvas} className="sim-canvas uzun" aria-label="Çözünmenin tanecik düzeyinde animasyonu" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={() => setKaristir(true)}>Karıştır</button>
      </div>
      <div className="sim-degerler">
        <Deger ad="Çözünme türü" deger={mod === 'tuz' ? 'İyonik' : mod === 'seker' ? 'Moleküler' : 'Çözünmez'} />
        <Deger ad="Etkileşim" deger={mod === 'tuz' ? 'İyon–dipol' : mod === 'seker' ? 'Hidrojen bağı' : 'Zayıf (London)'} />
        <Deger ad="İletkenlik" deger={iletir ? '💡 İletir' : 'İletmez'} vurgu={iletir} />
      </div>
      <Not>Kırmızı küreler oksijen, gri küreler hidrojen atomlarıdır. Na⁺ iyonuna suyun kısmi negatif O ucu, Cl⁻ iyonuna kısmi pozitif H uçları yönelir (hidratasyon).</Not>
    </div>
  )
}
