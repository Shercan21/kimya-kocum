import { useEffect, useRef, useState } from 'react'

// Sanal deney: Graham yasası. Cam borunun iki ucundan iki gaz aynı anda salınır;
// hafif gaz daha hızlı yayılır, karşılaşma noktası ağır gazın ucuna yakın olur.

const GAZLAR = [
  { ad: 'H₂', M: 2 },
  { ad: 'He', M: 4 },
  { ad: 'CH₄', M: 16 },
  { ad: 'NH₃', M: 17 },
  { ad: 'O₂', M: 32 },
  { ad: 'HCl', M: 36.5 },
  { ad: 'CO₂', M: 44 },
]

const yuzde = (x: number) => `%${Math.round(x * 100)}`

export default function DiffusionSim() {
  const [solAd, setSolAd] = useState('NH₃')
  const [sagAd, setSagAd] = useState('HCl')
  const [calisiyor, setCalisiyor] = useState(false)
  const [sonuc, setSonuc] = useState<{ konum: number; sure: number } | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const sol = GAZLAR.find(g => g.ad === solAd)!
  const sag = GAZLAR.find(g => g.ad === sagAd)!
  const beklenen = Math.sqrt(sag.M) / (Math.sqrt(sol.M) + Math.sqrt(sag.M))
  const halka = solAd === 'NH₃' && sagAd === 'HCl'

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
    const X0 = 30
    const X1 = W - 30
    const Y0 = H / 2 - 22
    const Y1 = H / 2 + 22
    const L = X1 - X0
    type Tan = { x: number; y: number; taraf: 0 | 1 }
    const tanecikler: Tan[] = []
    const vSol = 1 / Math.sqrt(sol.M)
    const vSag = 1 / Math.sqrt(sag.M)
    const olcek = 0.9 / Math.max(vSol, vSag) // en hızlı gaz ~0,9 px/kare
    let onSol = 0
    let onSag = 0
    let bulusma: number | null = null
    let baslangic = performance.now()
    let kare = 0
    const ciz = (simdi: number) => {
      ctx.clearRect(0, 0, W, H)
      // boru
      ctx.fillStyle = '#f4f3fb'
      ctx.fillRect(X0, Y0, L, Y1 - Y0)
      ctx.strokeStyle = '#534ab7'
      ctx.lineWidth = 2
      ctx.strokeRect(X0, Y0, L, Y1 - Y0)
      // pamuklar
      ctx.fillStyle = '#c9c6ef'
      ctx.fillRect(X0 - 18, Y0 - 6, 18, Y1 - Y0 + 12)
      ctx.fillRect(X1, Y0 - 6, 18, Y1 - Y0 + 12)
      ctx.fillStyle = '#26215c'
      ctx.font = '600 13px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(sol.ad, X0 - 9, Y0 - 12)
      ctx.fillText(sag.ad, X1 + 9, Y0 - 12)
      if (calisiyor) {
        if (tanecikler.length < 200 && Math.random() < 0.9) {
          tanecikler.push({ x: X0 + 2, y: Y0 + 4 + Math.random() * (Y1 - Y0 - 8), taraf: 0 })
          tanecikler.push({ x: X1 - 2, y: Y0 + 4 + Math.random() * (Y1 - Y0 - 8), taraf: 1 })
        }
        // karşılaşmadan sonra halkaya ulaşan tanecikler tepkimeye girip halkaya katılır
        if (bulusma !== null) {
          const b = bulusma
          for (let i = tanecikler.length - 1; i >= 0; i--) {
            const p = tanecikler[i]
            if ((p.taraf === 0 && p.x >= b - 4) || (p.taraf === 1 && p.x <= b + 4)) tanecikler.splice(i, 1)
          }
        }
        for (const p of tanecikler) {
          const v = (p.taraf === 0 ? vSol : vSag) * olcek
          // basitleştirilmiş model: ortalama ilerleme + rastgele titreşim
          p.x += (p.taraf === 0 ? 1 : -1) * v * (0.6 + Math.random() * 0.8)
          p.y += (Math.random() - 0.5) * 2.4
          p.y = Math.min(Y1 - 3, Math.max(Y0 + 3, p.y))
          if (p.taraf === 0) onSol = Math.max(onSol, p.x)
          else onSag = onSag === 0 ? p.x : Math.min(onSag, p.x)
        }
        if (bulusma === null && onSag !== 0 && onSol >= onSag) {
          bulusma = (onSol + onSag) / 2
          setSonuc({ konum: (bulusma - X0) / L, sure: (simdi - baslangic) / 1000 })
        }
      } else {
        baslangic = simdi
      }
      for (const p of tanecikler) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2)
        ctx.fillStyle = p.taraf === 0 ? '#1d9e75' : '#e8593c'
        ctx.fill()
      }
      if (bulusma !== null) {
        ctx.fillStyle = halka ? '#ffffff' : '#ffd84d'
        ctx.strokeStyle = '#888'
        ctx.lineWidth = 1
        ctx.fillRect(bulusma - 5, Y0 + 1, 10, Y1 - Y0 - 2)
        ctx.strokeRect(bulusma - 5, Y0 + 1, 10, Y1 - Y0 - 2)
        ctx.fillStyle = '#26215c'
        ctx.fillText(halka ? 'NH₄Cl halkası' : 'Karşılaşma', bulusma, Y1 + 20)
      }
      kare = requestAnimationFrame(ciz)
    }
    kare = requestAnimationFrame(ciz)
    return () => cancelAnimationFrame(kare)
  }, [calisiyor, sol, sag, halka])

  function baslat() {
    setSonuc(null)
    setCalisiyor(false)
    requestAnimationFrame(() => setCalisiyor(true))
  }

  return (
    <div className="sim">
      <p className="sim-gorev"><b>Görev:</b> İki gazı seç ve deneyi başlat. Karşılaşma noktası hangi uca daha yakın? Sonucu √(M₂/M₁) oranıyla karşılaştır.</p>
      <div className="sim-secim">
        <label>Sol uç
          <select value={solAd} onChange={e => { setSolAd(e.target.value); setSonuc(null); setCalisiyor(false) }}>
            {GAZLAR.map(g => <option key={g.ad} value={g.ad}>{g.ad} ({String(g.M).replace('.', ',')} g/mol)</option>)}
          </select>
        </label>
        <label>Sağ uç
          <select value={sagAd} onChange={e => { setSagAd(e.target.value); setSonuc(null); setCalisiyor(false) }}>
            {GAZLAR.map(g => <option key={g.ad} value={g.ad}>{g.ad} ({String(g.M).replace('.', ',')} g/mol)</option>)}
          </select>
        </label>
      </div>
      <canvas ref={canvas} className="sim-canvas sim-boru" aria-label="Cam boruda iki gazın yayılma animasyonu" />
      <div className="row-actions start">
        <button type="button" className="primary-button" onClick={baslat}>{calisiyor ? 'Yeniden başlat' : 'Deneyi başlat'}</button>
      </div>
      {sonuc && (
        <div className="sim-sonuc">
          <p>Karşılaşma noktası sol uçtan <b>{yuzde(sonuc.konum)}</b> uzaklıkta.</p>
          <p>Graham yasasına göre beklenen: √{String(sag.M).replace('.', ',')} / (√{String(sol.M).replace('.', ',')} + √{String(sag.M).replace('.', ',')}) ≈ <b>{yuzde(beklenen)}</b></p>
          <p>Hız oranı v({sol.ad}) / v({sag.ad}) = √({String(sag.M).replace('.', ',')} / {String(sol.M).replace('.', ',')}) ≈ <b>{(Math.sqrt(sag.M / sol.M)).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</b></p>
        </div>
      )}
      <p className="sim-not">Model basitleştirilmiştir: gerçekte tanecikler hava molekülleriyle çarpışarak zikzaklı yol izler; burada ortalama ilerleme hızı mol kütlesinin kareköküyle ters orantılı alınmıştır.</p>
    </div>
  )
}
