import { useEffect, useRef, useState } from 'react'

// Sanal deney: kaptaki gaz tanecikleri. Hacim (piston), sıcaklık ve mol sayısı
// değiştirilir; basınç hem ideal gaz denkleminden hem çarpışmalardan izlenir.

export type GazModu = 'serbest' | 'boyle' | 'charles' | 'gaylussac' | 'avogadro' | 'ideal'

type Props = { modlar: GazModu[] }

const R = 0.082
const V_MIN = 4
const V_MAX = 20
const T_MIN = 150
const T_MAX = 600
const N_MIN = 0.5
const N_MAX = 2
const P_SABIT = 2 // Charles ve Avogadro deneylerinde sabit tutulan basınç (atm)

const MOD_BILGI: Record<GazModu, { ad: string; sabit: string; gorev: string }> = {
  serbest: {
    ad: 'Serbest keşif',
    sabit: 'Hiçbiri',
    gorev: 'Hacmi, sıcaklığı ve gaz miktarını değiştirip taneciklerin hareketini ve basıncı gözle. Basıncı hangi değişiklikler artırıyor?',
  },
  boyle: {
    ad: 'Boyle (P–V)',
    sabit: 'Sıcaklık ve gaz miktarı',
    gorev: 'Pistonu farklı konumlara getirip her seferinde "Ölçüm al"a bas. P·V çarpımına bak: ne fark ediyorsun?',
  },
  charles: {
    ad: 'Charles (V–T)',
    sabit: `Basınç (${P_SABIT} atm) ve gaz miktarı`,
    gorev: 'Sıcaklığı değiştir; piston basıncı sabit tutmak için kendiliğinden hareket eder. V/T oranı nasıl değişiyor?',
  },
  gaylussac: {
    ad: 'Gay-Lussac (P–T)',
    sabit: 'Hacim ve gaz miktarı',
    gorev: 'Kabı sabit hacimde ısıt ve soğut. Taneciklerin çeperlere çarpması ve P/T oranı ne oluyor?',
  },
  avogadro: {
    ad: 'Avogadro (V–n)',
    sabit: `Basınç (${P_SABIT} atm) ve sıcaklık`,
    gorev: 'Kaba gaz ekle ya da çıkar. Hacim ile mol sayısı arasında nasıl bir ilişki var? V/n oranına bak.',
  },
  ideal: {
    ad: 'İdeal gaz (PV = nRT)',
    sabit: 'Hiçbiri',
    gorev: 'Her ölçümde PV/(nT) değerini hesapla. Değişkenler ne olursa olsun bu değer neye eşit çıkıyor?',
  },
}

type Olcum = { P: number; V: number; T: number; n: number }

const yuvarla = (x: number, b = 2) => x.toLocaleString('tr-TR', { maximumFractionDigits: b, minimumFractionDigits: b })

export default function GasSim({ modlar }: Props) {
  const [mod, setMod] = useState<GazModu>(modlar[0])
  const [V, setV] = useState(12)
  const [T, setT] = useState(300)
  const [n, setN] = useState(1)
  const [olcumler, setOlcumler] = useState<Olcum[]>([])
  const canvas = useRef<HTMLCanvasElement>(null)
  const durum = useRef({ V, T, n })
  useEffect(() => {
    durum.current = { V, T, n }
  }, [V, T, n])
  const P = (n * R * T) / V

  // Moda göre bağımlı değişkeni hesapla
  function ayarla(degisken: 'V' | 'T' | 'n', deger: number) {
    if (degisken === 'V') setV(deger)
    if (degisken === 'T') {
      setT(deger)
      if (mod === 'charles') setV(Math.min(V_MAX, Math.max(V_MIN, (n * R * deger) / P_SABIT)))
    }
    if (degisken === 'n') {
      setN(deger)
      if (mod === 'avogadro') setV(Math.min(V_MAX, Math.max(V_MIN, (deger * R * T) / P_SABIT)))
    }
  }

  function modSec(yeni: GazModu) {
    setMod(yeni)
    setOlcumler([])
    if (yeni === 'charles') { setN(1); setT(240); setV((1 * R * 240) / P_SABIT) }
    if (yeni === 'avogadro') { setT(300); setN(1); setV((1 * R * 300) / P_SABIT) }
    if (yeni === 'boyle') { setT(300); setN(1); setV(12) }
    if (yeni === 'gaylussac') { setV(12); setN(1); setT(300) }
  }

  // Tanecik animasyonu
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const W = c.clientWidth
    const H = c.clientHeight
    c.width = W * dpr
    c.height = H * dpr
    ctx.scale(dpr, dpr)
    const KAP_X = 14
    const KAP_Y = 14
    const KAP_H = H - 28
    const KAP_W = W - 70 // en büyük hacim
    type Tan = { x: number; y: number; vx: number; vy: number; isik: number }
    const tanecikler: Tan[] = []
    const ekle = () => {
      const a = Math.random() * Math.PI * 2
      tanecikler.push({ x: KAP_X + 10 + Math.random() * 40, y: KAP_Y + 10 + Math.random() * (KAP_H - 20), vx: Math.cos(a), vy: Math.sin(a), isik: 0 })
    }
    let piston = KAP_X + KAP_W * (durum.current.V / V_MAX)
    let son = performance.now()
    let kare = 0
    const r = 4.5
    const ciz = (simdi: number) => {
      const dt = Math.min(40, simdi - son) / 16.7
      son = simdi
      const { V: v, T: t, n: mol } = durum.current
      const hedefSayi = Math.round(mol * 30)
      while (tanecikler.length < hedefSayi) ekle()
      if (tanecikler.length > hedefSayi) tanecikler.length = hedefSayi
      const hedefPiston = KAP_X + KAP_W * (v / V_MAX)
      piston += (hedefPiston - piston) * 0.15
      const hiz = 2.2 * Math.sqrt(t / 300)
      ctx.clearRect(0, 0, W, H)
      // gaz bölgesi (sıcaklığa göre renk)
      const sicak = (t - T_MIN) / (T_MAX - T_MIN)
      ctx.fillStyle = `rgba(${Math.round(120 + 120 * sicak)}, ${Math.round(160 - 60 * sicak)}, ${Math.round(240 - 160 * sicak)}, 0.10)`
      ctx.fillRect(KAP_X, KAP_Y, piston - KAP_X, KAP_H)
      // kap
      ctx.strokeStyle = '#26215c'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(KAP_X + KAP_W + 40, KAP_Y)
      ctx.lineTo(KAP_X, KAP_Y)
      ctx.lineTo(KAP_X, KAP_Y + KAP_H)
      ctx.lineTo(KAP_X + KAP_W + 40, KAP_Y + KAP_H)
      ctx.stroke()
      // piston
      ctx.fillStyle = '#534ab7'
      ctx.fillRect(piston, KAP_Y + 2, 10, KAP_H - 4)
      ctx.fillStyle = '#7f77dd'
      ctx.fillRect(piston + 10, KAP_Y + KAP_H / 2 - 5, W - piston - 10, 10)
      // tanecikler
      for (const p of tanecikler) {
        p.x += p.vx * hiz * dt
        p.y += p.vy * hiz * dt
        if (p.x < KAP_X + r) { p.x = KAP_X + r; p.vx = Math.abs(p.vx); p.isik = 1 }
        if (p.x > piston - r) { p.x = piston - r; p.vx = -Math.abs(p.vx); p.isik = 1 }
        if (p.y < KAP_Y + r) { p.y = KAP_Y + r; p.vy = Math.abs(p.vy); p.isik = 1 }
        if (p.y > KAP_Y + KAP_H - r) { p.y = KAP_Y + KAP_H - r; p.vy = -Math.abs(p.vy); p.isik = 1 }
        p.isik = Math.max(0, p.isik - 0.08 * dt)
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = p.isik > 0 ? `rgb(${Math.round(232 * p.isik + 83 * (1 - p.isik))}, ${Math.round(89 * p.isik + 74 * (1 - p.isik))}, ${Math.round(60 * p.isik + 183 * (1 - p.isik))})` : '#534ab7'
        ctx.fill()
      }
      kare = requestAnimationFrame(ciz)
    }
    kare = requestAnimationFrame(ciz)
    return () => cancelAnimationFrame(kare)
  }, [])

  const kilitV = mod === 'charles' || mod === 'avogadro' || mod === 'gaylussac'
  const kilitT = mod === 'boyle' || mod === 'avogadro'
  const kilitN = mod === 'boyle' || mod === 'charles' || mod === 'gaylussac'

  function olcumAl() {
    setOlcumler(o => [...o, { P, V, T, n }].slice(-8))
  }

  const sutunlar: { ad: string; deger: (o: Olcum) => string }[] = [
    { ad: 'P (atm)', deger: o => yuvarla(o.P) },
    { ad: 'V (L)', deger: o => yuvarla(o.V, 1) },
    { ad: 'T (K)', deger: o => String(Math.round(o.T)) },
    { ad: 'n (mol)', deger: o => yuvarla(o.n, 1) },
  ]
  if (mod === 'boyle') sutunlar.push({ ad: 'P·V', deger: o => yuvarla(o.P * o.V, 1) })
  if (mod === 'charles') sutunlar.push({ ad: 'V/T', deger: o => yuvarla(o.V / o.T, 3) })
  if (mod === 'gaylussac') sutunlar.push({ ad: 'P/T', deger: o => yuvarla(o.P / o.T, 4) })
  if (mod === 'avogadro') sutunlar.push({ ad: 'V/n', deger: o => yuvarla(o.V / o.n, 1) })
  if (mod === 'ideal' || mod === 'serbest') sutunlar.push({ ad: 'PV/(nT)', deger: o => yuvarla((o.P * o.V) / (o.n * o.T), 3) })

  const bilgi = MOD_BILGI[mod]
  const ibre = Math.min(1, P / 8)

  return (
    <div className="sim">
      {modlar.length > 1 && (
        <div className="sim-modlar" role="group" aria-label="Deney seç">
          {modlar.map(m => (
            <button key={m} type="button" className={m === mod ? 'chip is-active' : 'chip'} aria-pressed={m === mod} onClick={() => modSec(m)}>
              {MOD_BILGI[m].ad}
            </button>
          ))}
        </div>
      )}
      <p className="sim-gorev"><b>Görev:</b> {bilgi.gorev}</p>
      <p className="sim-sabit">Sabit tutulan: {bilgi.sabit}</p>

      <div className="sim-sahne">
        <canvas ref={canvas} className="sim-canvas" aria-label="Kaptaki gaz taneciklerinin animasyonu" />
      </div>

      <div className="sim-gosterge" aria-live="polite">
        <svg viewBox="0 0 100 60" className="sim-ibre" aria-hidden="true">
          <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="#cecbf6" strokeWidth="8" />
          <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="#e8593c" strokeWidth="8" strokeDasharray={`${ibre * 125.6} 200`} />
          <line x1="50" y1="55" x2={50 - 34 * Math.cos(ibre * Math.PI)} y2={55 - 34 * Math.sin(ibre * Math.PI)} stroke="#26215c" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <b>{yuvarla(P)} atm</b>
        <small>Basınç</small>
      </div>

      <div className="sim-kontroller">
        <label className={kilitV ? 'is-kilitli' : ''}>
          <span>Hacim <b>{yuvarla(V, 1)} L</b></span>
          <input type="range" min={V_MIN} max={V_MAX} step={0.5} value={V} disabled={kilitV} onChange={e => ayarla('V', Number(e.target.value))} />
        </label>
        <label className={kilitT ? 'is-kilitli' : ''}>
          <span>Sıcaklık <b>{Math.round(T)} K</b> ({Math.round(T - 273)} °C)</span>
          <input type="range" min={T_MIN} max={T_MAX} step={10} value={T} disabled={kilitT} onChange={e => ayarla('T', Number(e.target.value))} />
        </label>
        <label className={kilitN ? 'is-kilitli' : ''}>
          <span>Gaz miktarı <b>{yuvarla(n, 1)} mol</b></span>
          <input type="range" min={N_MIN} max={N_MAX} step={0.25} value={n} disabled={kilitN} onChange={e => ayarla('n', Number(e.target.value))} />
        </label>
      </div>

      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={olcumAl}>Ölçüm al</button>
        {olcumler.length > 0 && <button type="button" className="btn-secondary" onClick={() => setOlcumler([])}>Tabloyu temizle</button>}
      </div>

      {olcumler.length > 0 && (
        <div className="table-wrap">
          <table className="sim-tablo">
            <thead><tr><th>#</th>{sutunlar.map(s => <th key={s.ad}>{s.ad}</th>)}</tr></thead>
            <tbody>
              {olcumler.map((o, i) => (
                <tr key={i}><td>{i + 1}</td>{sutunlar.map(s => <td key={s.ad}>{s.deger(o)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="sim-not">Model basitleştirilmiştir: tanecikler arası çarpışmalar ve etkileşimler gösterilmez (ideal gaz). Turuncu yanıp sönen tanecikler çepere çarpanlardır.</p>
    </div>
  )
}
