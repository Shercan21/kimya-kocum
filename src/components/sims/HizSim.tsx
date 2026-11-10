import { useRef, useState } from 'react'
import { daire, sayi, useAnimasyon } from './cizim'
import { Deger, Gorev, Grafik, Kaydirici, Not, type Seri } from './ortak'

// Çarpışma teorisi ve tepkime hızı: A + B → C
// Sıcaklık, derişim (tanecik sayısı) ve katalizörün etkisi; derişim–zaman grafiği
// ve Maxwell–Boltzmann dağılımında aktivasyon enerjisini aşan tanecik oranı.

const R = 8.314
type Tan = { x: number; y: number; vx: number; vy: number; tur: 0 | 1 | 2; parla: number }

export default function HizSim() {
  const [T, setT] = useState(300)
  const [nA, setNA] = useState(30)
  const [katalizor, setKatalizor] = useState(false)
  const [calisiyor, setCalisiyor] = useState(false)
  const [veri, setVeri] = useState<{ t: number; a: number; c: number }[]>([])
  const Ea = katalizor ? 12 : 20 // kJ/mol (modelde ölçeklenmiş)
  const oran = Math.exp((-Ea * 1000) / (R * T)) // aktivasyon enerjisini aşan kesir
  const olasilik = Math.min(1, oran * 100)
  const sim = useRef({ tanecikler: [] as Tan[], zaman: 0, sonKayit: 0, kurulu: false })

  function kur(W: number, H: number) {
    const t: Tan[] = []
    for (let i = 0; i < nA * 2; i++) {
      const a = Math.random() * Math.PI * 2
      t.push({ x: 10 + Math.random() * (W - 20), y: 10 + Math.random() * (H - 20), vx: Math.cos(a), vy: Math.sin(a), tur: i < nA ? 0 : 1, parla: 0 })
    }
    sim.current = { tanecikler: t, zaman: 0, sonKayit: 0, kurulu: true }
  }

  const canvas = useAnimasyon((ctx, W, H, dt) => {
    const s = sim.current
    if (!s.kurulu) kur(W, H)
    const hiz = 1.6 * Math.sqrt(T / 300)
    const r = 5
    ctx.strokeStyle = '#26215c'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, W - 2, H - 2)
    if (katalizor) {
      ctx.fillStyle = 'rgba(29,158,117,.12)'
      ctx.fillRect(2, H - 18, W - 4, 16)
    }
    for (const p of s.tanecikler) {
      if (calisiyor) {
        const k = p.tur === 2 ? 0.8 : 1
        p.x += p.vx * hiz * dt * k
        p.y += p.vy * hiz * dt * k
      }
      if (p.x < r) { p.x = r; p.vx = Math.abs(p.vx) }
      if (p.x > W - r) { p.x = W - r; p.vx = -Math.abs(p.vx) }
      if (p.y < r) { p.y = r; p.vy = Math.abs(p.vy) }
      if (p.y > H - r) { p.y = H - r; p.vy = -Math.abs(p.vy) }
    }
    if (calisiyor) {
      const liste = s.tanecikler
      for (let i = 0; i < liste.length; i++) {
        const a = liste[i]
        if (a.tur !== 0) continue
        for (let j = 0; j < liste.length; j++) {
          const b = liste[j]
          if (b.tur !== 1) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (dx * dx + dy * dy < (2 * r) ** 2) {
            // etkin çarpışma mı?
            if (Math.random() < olasilik) {
              a.tur = 2
              a.parla = 1
              liste.splice(j, 1)
              break
            }
            // esnek çarpışma: yönleri değiştir
            const tvx = a.vx; a.vx = b.vx; b.vx = tvx
            const tvy = a.vy; a.vy = b.vy; b.vy = tvy
            b.parla = 0.5
          }
        }
      }
      s.zaman += dt * 16.7
      if (s.zaman - s.sonKayit > 500) {
        s.sonKayit = s.zaman
        const a = liste.filter(p => p.tur === 0).length
        const c = liste.filter(p => p.tur === 2).length
        setVeri(v => [...v, { t: s.zaman / 1000, a, c }].slice(-120))
      }
    }
    for (const p of s.tanecikler) {
      p.parla = Math.max(0, p.parla - 0.03 * dt)
      if (p.parla > 0) daire(ctx, p.x, p.y, r + 5 * p.parla, `rgba(255,216,77,${p.parla})`)
      if (p.tur === 2) {
        daire(ctx, p.x - 3, p.y, r, '#378add')
        daire(ctx, p.x + 3, p.y, r, '#e8593c')
      } else daire(ctx, p.x, p.y, r, p.tur === 0 ? '#378add' : '#e8593c')
    }
  })

  function baslat() {
    sim.current.kurulu = false
    setVeri([])
    setCalisiyor(true)
  }

  // Maxwell–Boltzmann dağılımı (enerji ölçeği kJ/mol)
  const mb = (TT: number): [number, number][] => {
    const kT = (R * TT) / 1000
    const noktalar: [number, number][] = []
    for (let E = 0; E <= 30; E += 0.5) noktalar.push([E, 2 * Math.sqrt(E / Math.PI) * Math.pow(1 / kT, 1.5) * Math.exp(-E / kT)])
    return noktalar
  }
  const son = veri[veri.length - 1]
  const ilk = veri.find(v => v.t >= 0.5)
  const ortHiz = son && ilk && son.t > ilk.t ? (ilk.a - son.a) / (son.t - ilk.t) : 0
  const seriler: Seri[] = [
    { ad: 'A (tepken)', renk: '#378add', noktalar: veri.map(v => [v.t, v.a]) },
    { ad: 'C (ürün)', renk: '#1d9e75', noktalar: veri.map(v => [v.t, v.c]) },
  ]

  return (
    <div className="sim">
      <Gorev>Sıcaklığı, tanecik sayısını ve katalizörü değiştirip her seferinde deneyi yeniden başlat. Grafikteki eğimler (hız) nasıl değişiyor? Hangi çarpışmalar ürün veriyor?</Gorev>
      <canvas ref={canvas} className="sim-canvas" aria-label="A ve B taneciklerinin çarpışarak C oluşturduğu animasyon" />
      <div className="sim-degerler">
        <Deger ad="A" deger={son?.a ?? nA} />
        <Deger ad="C (ürün)" deger={son?.c ?? 0} />
        <Deger ad="Ort. hız (tanecik/s)" deger={sayi(Math.max(0, ortHiz), 1)} vurgu />
        <Deger ad="Etkin çarpışma olasılığı" deger={`%${Math.round(olasilik * 100)}`} />
      </div>
      <Kaydirici etiket={<>Sıcaklık <b>{T} K</b></>} deger={T} min={250} max={450} step={10} onChange={setT} />
      <Kaydirici etiket={<>Başlangıç tanecik sayısı (derişim) <b>{nA} A + {nA} B</b></>} deger={nA} min={10} max={50} step={5} onChange={setNA} />
      <label className="sim-onay"><input type="checkbox" checked={katalizor} onChange={e => setKatalizor(e.target.checked)} /> Katalizör ekle (Eₐ {katalizor ? '12' : '20'} kJ/mol)</label>
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={baslat}>{calisiyor ? 'Yeniden başlat' : 'Deneyi başlat'}</button>
        {calisiyor && <button type="button" className="btn-secondary" onClick={() => setCalisiyor(false)}>Durdur</button>}
      </div>
      {veri.length > 1 && <Grafik seriler={seriler} xEtiket="Zaman (s)" yEtiket="Tanecik sayısı" xMax={Math.max(10, Math.ceil(son!.t))} yMax={50} />}
      <Grafik
        seriler={[{ ad: `${T} K`, renk: '#534ab7', noktalar: mb(T) }, { ad: '300 K', renk: '#b4b2a9', noktalar: mb(300), kesikli: true }]}
        xEtiket="Kinetik enerji (kJ/mol, model)"
        yEtiket="Tanecik oranı"
        xMax={30}
        yMax={0.5}
        dikeyCizgi={{ x: Ea, etiket: `Eₐ = ${Ea}` }}
      />
      <Not>Mavi A, turuncu B taneciğidir; sarı parlama çarpışmayı, mavi-turuncu çift ürünü (C) gösterir. Eₐ çizgisinin sağındaki tanecikler etkin çarpışma yapabilir. Enerji değerleri modelde ölçeklenmiştir.</Not>
    </div>
  )
}
