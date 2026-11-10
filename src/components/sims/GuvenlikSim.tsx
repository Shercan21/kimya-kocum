import { useState } from 'react'
import { Deger, Gorev, Not } from './ortak'

// Laboratuvar güvenliği: sahnedeki tehlikeleri bul. Her tehlikeye dokununca açıklaması çıkar.

type Tehlike = { id: string; x: number; y: number; r: number; baslik: string; aciklama: string }
const TEHLIKELER: Tehlike[] = [
  { id: 'gozluk', x: 70, y: 92, r: 26, baslik: 'Gözlüksüz çalışma', aciklama: 'Kimyasal sıçramalarına karşı koruyucu gözlük takılmalıdır.' },
  { id: 'yemek', x: 300, y: 150, r: 24, baslik: 'Laboratuvarda yiyecek', aciklama: 'Laboratuvarda yiyecek ve içecek tüketilmez; kimyasallarla karışabilir.' },
  { id: 'etiket', x: 205, y: 132, r: 20, baslik: 'Etiketsiz şişe', aciklama: 'Her kap içindeki maddenin adıyla etiketlenmelidir.' },
  { id: 'alev', x: 128, y: 160, r: 24, baslik: 'Alevin yanında yanıcı madde', aciklama: 'Alkol, aseton gibi yanıcı maddeler açık alevden uzak tutulur.' },
  { id: 'koklama', x: 250, y: 70, r: 22, baslik: 'Doğrudan koklama', aciklama: 'Kimyasallar doğrudan koklanmaz; el yelpazelenerek koku buruna yönlendirilir.' },
  { id: 'tup', x: 168, y: 104, r: 20, baslik: 'Tüpün ağzı arkadaşa dönük', aciklama: 'Isıtılan tüpün ağzı kimseye doğrultulmaz.' },
  { id: 'kablo', x: 340, y: 205, r: 22, baslik: 'Islak zeminde kablo', aciklama: 'Elektrikli aletler sıvılardan uzak tutulur; dökülen sıvı hemen temizlenir.' },
  { id: 'sac', x: 108, y: 60, r: 20, baslik: 'Açık saç', aciklama: 'Uzun saçlar toplanır; alevle temas edebilir.' },
]

export default function GuvenlikSim() {
  const [bulunan, setBulunan] = useState<string[]>([])
  const [son, setSon] = useState<Tehlike | null>(null)
  const bitti = bulunan.length === TEHLIKELER.length

  function dokun(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM()?.inverse())
    const t = TEHLIKELER.find(h => Math.hypot(h.x - p.x, h.y - p.y) < h.r)
    if (t) {
      setSon(t)
      if (!bulunan.includes(t.id)) setBulunan(b => [...b, t.id])
    }
  }

  return (
    <div className="sim">
      <Gorev>Bu laboratuvarda {TEHLIKELER.length} güvenlik hatası var. Hepsini bulup üzerine dokun.</Gorev>
      <svg viewBox="0 0 400 240" className="sim-sahne-svg" onClick={dokun} role="img" aria-label="Laboratuvar sahnesi">
        {/* zemin, tezgâh */}
        <rect x="0" y="0" width="400" height="240" fill="#f4f3ee" />
        <rect x="0" y="175" width="400" height="65" fill="#d3d1c7" />
        <rect x="20" y="170" width="300" height="10" fill="#888780" />
        {/* öğrenci 1 (gözlüksüz, saç açık, tüp ısıtıyor) */}
        <circle cx="90" cy="70" r="18" fill="#f5c4b3" />
        <path d="M72 66 Q70 40 92 46 Q112 40 110 66 L116 110 L100 80 Z" fill="#633806" />
        <rect x="76" y="88" width="30" height="50" rx="8" fill="#378add" />
        <circle cx="84" cy="70" r="2" fill="#26215c" />
        <circle cx="96" cy="70" r="2" fill="#26215c" />
        {/* tüp ve ispirto */}
        <rect x="150" y="100" width="34" height="9" rx="4" fill="#c9e3f7" stroke="#26215c" transform="rotate(-10 167 104)" />
        <rect x="120" y="150" width="18" height="20" rx="3" fill="#b4b2a9" />
        <path d="M129 150 Q122 138 129 128 Q136 138 129 150" fill="#f2a623" />
        {/* yanıcı alkol şişesi alevin yanında */}
        <rect x="140" y="140" width="14" height="30" rx="2" fill="#fac775" />
        <text x="147" y="160" fontSize="6" textAnchor="middle" fill="#633806">ALKOL</text>
        {/* etiketsiz şişe */}
        <rect x="196" y="115" width="18" height="55" rx="3" fill="#c0dd97" />
        <rect x="200" y="106" width="10" height="10" fill="#97c459" />
        {/* öğrenci 2 koklama */}
        <circle cx="262" cy="64" r="16" fill="#f5c4b3" />
        <rect x="248" y="80" width="28" height="55" rx="8" fill="#e8593c" />
        <rect x="236" y="70" width="10" height="22" rx="2" fill="#cecbf6" />
        {/* yiyecek */}
        <circle cx="300" cy="160" r="10" fill="#d85a30" />
        <rect x="286" y="140" width="10" height="20" rx="2" fill="#5f5e5a" />
        {/* kablo ve su birikintisi */}
        <ellipse cx="345" cy="210" rx="34" ry="8" fill="#85b7eb" opacity=".7" />
        <path d="M300 180 Q330 215 380 200" stroke="#26215c" strokeWidth="3" fill="none" />
        {/* bulunan işaretleri */}
        {TEHLIKELER.filter(t => bulunan.includes(t.id)).map(t => (
          <g key={t.id}>
            <circle cx={t.x} cy={t.y} r={t.r} fill="none" stroke="#1d9e75" strokeWidth="3" />
            <text x={t.x + t.r - 4} y={t.y - t.r + 6} fontSize="14" fill="#1d9e75" fontWeight="700">✓</text>
          </g>
        ))}
      </svg>
      <div className="sim-degerler">
        <Deger ad="Bulunan" deger={`${bulunan.length} / ${TEHLIKELER.length}`} vurgu={bitti} />
      </div>
      {son && <div className="sim-sonuc"><p><b>{son.baslik}:</b> {son.aciklama}</p></div>}
      {bitti && <div className="sim-sonuc"><p>🎉 Tebrikler, tüm hataları buldun! Laboratuvarda bu kuralları her zaman uygula.</p></div>}
      <div className="row-actions start">
        <button type="button" className="btn-secondary" onClick={() => { setBulunan([]); setSon(null) }}>Baştan başla</button>
      </div>
      <Not>Bulamadığın hatalar için ipucu: öğrencilerin donanımına, şişelere, alevin çevresine ve zemine bak.</Not>
    </div>
  )
}
