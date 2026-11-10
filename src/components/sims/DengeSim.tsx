import { useRef, useState } from 'react'
import { daire, sayi, useAnimasyon } from './cizim'
import { Deger, Gorev, Grafik, Kaydirici, Not, type Seri } from './ortak'

// Kimyasal denge ve Le Chatelier: N₂O₄(g, renksiz) ⇌ 2NO₂(g, kahverengi)   ΔH > 0
// İleri tepkime (ayrışma) sıcaklıkla hızlanır; geri tepkime iki NO₂'nin çarpışmasıyla olur.

type Tan = { x: number; y: number; vx: number; vy: number; tur: 'N2O4' | 'NO2'; yas: number }

export default function DengeSim() {
  const [T, setT] = useState(330)
  const [hacim, setHacim] = useState(1) // 0,5–1 (bağıl)
  const [veri, setVeri] = useState<{ t: number; a: number; b: number; il: number; ge: number }[]>([])
  const sim = useRef({ tanecikler: [] as Tan[], zaman: 0, sonKayit: 0, kurulu: false, ileri: 0, geri: 0, ileriH: 0, geriH: 0, W: 300, H: 200 })

  function ekle(tur: Tan['tur'], adet: number, W = sim.current.W, H = sim.current.H) {
    for (let i = 0; i < adet; i++) {
      const a = Math.random() * Math.PI * 2
      sim.current.tanecikler.push({ x: 10 + Math.random() * (W * hacim - 20), y: 10 + Math.random() * (H - 20), vx: Math.cos(a), vy: Math.sin(a), tur, yas: 30 })
    }
  }

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const s = sim.current
    s.W = W
    s.H = H
    if (!s.kurulu) {
      s.tanecikler = []
      s.kurulu = true
      ekle('N2O4', 40, W, H)
    }
    const TT = T
    const hv = hacim
    const kutuW = W * hv
    const hiz = 1.4 * Math.sqrt(TT / 300)
    const r = 4
    // ayrışma olasılığı (kare başına), endotermik: sıcaklıkla hızla artar
    const kIleri = 0.004 * Math.exp(9 * (1 - 300 / TT))
    const no2 = s.tanecikler.filter(p => p.tur === 'NO2').length
    const yogunluk = Math.min(1, no2 / ((kutuW * H) / 1500))
    ctx.fillStyle = `rgba(160, 82, 30, ${0.05 + 0.4 * yogunluk})`
    ctx.fillRect(2, 2, kutuW - 4, H - 4)
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2.5
    ctx.strokeRect(1, 1, kutuW - 2, H - 2)
    ctx.fillStyle = '#534ab7'
    ctx.fillRect(kutuW - 4, 2, 8, H - 4)
    const yeni: Tan[] = []
    for (const p of s.tanecikler) {
      p.x += p.vx * hiz * dt
      p.y += p.vy * hiz * dt
      p.yas += dt
      if (p.x < r) { p.x = r; p.vx = Math.abs(p.vx) }
      if (p.x > kutuW - r - 4) { p.x = kutuW - r - 4; p.vx = -Math.abs(p.vx) }
      if (p.y < r) { p.y = r; p.vy = Math.abs(p.vy) }
      if (p.y > H - r) { p.y = H - r; p.vy = -Math.abs(p.vy) }
      if (p.tur === 'N2O4' && p.yas > 20 && Math.random() < kIleri * dt) {
        p.tur = 'NO2'
        p.yas = 0
        const a = Math.random() * Math.PI * 2
        yeni.push({ x: p.x + 6, y: p.y, vx: Math.cos(a), vy: Math.sin(a), tur: 'NO2', yas: 0 })
        s.ileri++
      }
    }
    s.tanecikler.push(...yeni)
    // geri tepkime: iki NO₂ çarpışınca birleşir
    const liste = s.tanecikler
    for (let i = 0; i < liste.length; i++) {
      const a = liste[i]
      if (a.tur !== 'NO2' || a.yas < 20) continue
      for (let j = i + 1; j < liste.length; j++) {
        const b = liste[j]
        if (b.tur !== 'NO2' || b.yas < 20) continue
        const dx = a.x - b.x
        const dy = a.y - b.y
        if (dx * dx + dy * dy < 64 && Math.random() < 0.5) {
          a.tur = 'N2O4'
          a.yas = 0
          liste.splice(j, 1)
          s.geri++
          break
        }
      }
    }
    for (const p of liste) {
      if (p.tur === 'N2O4') {
        daire(ctx, p.x - 3, p.y, r, '#c9c6ef')
        daire(ctx, p.x + 3, p.y, r, '#c9c6ef')
      } else daire(ctx, p.x, p.y, r, '#a0521e')
    }
    s.zaman += dt * 16.7
    if (s.zaman - s.sonKayit > 500) {
      s.ileriH = s.ileriH * 0.7 + s.ileri * 0.3
      s.geriH = s.geriH * 0.7 + s.geri * 0.3
      s.ileri = 0
      s.geri = 0
      s.sonKayit = s.zaman
      const a = liste.filter(p => p.tur === 'N2O4').length
      const b = liste.filter(p => p.tur === 'NO2').length
      setVeri(v => [...v, { t: s.zaman / 1000, a, b, il: s.ileriH, ge: s.geriH }].slice(-160))
    }
  })

  const son = veri[veri.length - 1]
  const a = son?.a ?? 40
  const b = son?.b ?? 0
  const Q = a > 0 ? (b / hacim) ** 2 / (a / hacim) / 10 : 0
  const il = son?.il ?? 0
  const ge = son?.ge ?? 0
  const dengede = veri.length > 8 && Math.abs(il - ge) <= Math.max(1, 0.25 * il)
  const seriler: Seri[] = [
    { ad: 'N₂O₄', renk: '#7f77dd', noktalar: veri.map(v => [v.t, v.a]) },
    { ad: 'NO₂', renk: '#a0521e', noktalar: veri.map(v => [v.t, v.b]) },
  ]

  return (
    <div className="sim">
      <Gorev>Sistemin dengeye gelmesini bekle (grafikte çizgiler yataylaşır). Sonra bir değişiklik yap: N₂O₄ ya da NO₂ ekle, sıcaklığı değiştir, hacmi küçült. Denge hangi yöne kayıyor, renk nasıl değişiyor?</Gorev>
      <p className="sim-sabit">N₂O₄(g) renksiz ⇌ 2NO₂(g) kahverengi · ΔH &gt; 0 (ileri tepkime endotermik)</p>
      <canvas ref={canvas} className="sim-canvas" aria-label="N2O4 ve NO2 taneciklerinin denge animasyonu" />
      <div className="sim-degerler">
        <Deger ad="N₂O₄" deger={a} />
        <Deger ad="NO₂" deger={b} />
        <Deger ad="İleri / geri olay (s⁻¹)" deger={`${sayi(il * 2, 0)} / ${sayi(ge * 2, 0)}`} />
        <Deger ad="Durum" deger={dengede ? 'Dengede' : 'Dengeye gidiyor'} vurgu={dengede} />
      </div>
      <Kaydirici etiket={<>Sıcaklık <b>{T} K</b></>} deger={T} min={280} max={400} step={10} onChange={setT} />
      <Kaydirici etiket={<>Hacim <b>{hacim === 1 ? 'büyük' : hacim <= 0.55 ? 'küçük' : 'orta'}</b></>} deger={hacim} min={0.5} max={1} step={0.05} onChange={setHacim} />
      <div className="row-actions start">
        <button type="button" className="btn-secondary" onClick={() => ekle('N2O4', 15)}>+ N₂O₄ ekle</button>
        <button type="button" className="btn-secondary" onClick={() => ekle('NO2', 20)}>+ NO₂ ekle</button>
        <button type="button" className="btn-secondary" onClick={() => { sim.current.kurulu = false; setVeri([]) }}>Baştan başlat</button>
      </div>
      {veri.length > 1 && <Grafik seriler={seriler} xEtiket="Zaman (s)" yEtiket="Tanecik sayısı" xMin={veri[0].t} xMax={Math.max(veri[0].t + 10, son!.t)} yMax={Math.max(60, a, b) + 5} />}
      <p className="sim-sabit">Q = [NO₂]² / [N₂O₄] (bağıl) ≈ {sayi(Q, 2)}</p>
      <Not>Model: N₂O₄ molekülleri sıcaklığa bağlı olasılıkla ayrışır, iki NO₂ çarpışınca birleşir. Dengede ileri ve geri olay sayıları eşitlenir ama tepkimeler durmaz (dinamik denge). Kc yalnızca sıcaklıkla değişir.</Not>
    </div>
  )
}
