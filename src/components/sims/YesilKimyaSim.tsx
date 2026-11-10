import { useState } from 'react'
import { sayi } from './cizim'
import { Deger, Gorev, Not, Secenekler } from './ortak'

// Sanal fabrika: aynı ürünü (1 kg) farklı koşullarla üret; atık, enerji, atom ekonomisi
// ve yeşil kimya puanı canlı hesaplanır.

type Cozucu = 'benzen' | 'etanol' | 'su'
type Yol = 'klasik' | 'katalitik'
const COZUCU: Record<Cozucu, { ad: string; atik: number; tehlike: number }> = {
  benzen: { ad: 'Benzen (zehirli)', atik: 3.5, tehlike: 3 },
  etanol: { ad: 'Etanol', atik: 1.2, tehlike: 1 },
  su: { ad: 'Su', atik: 0.3, tehlike: 0 },
}
// Örnek: bir ilacın ara maddesi. Klasik yol: yan ürün oluşturan stokiyometrik reaktif; katalitik yol: katalizör + az yan ürün
const YOL: Record<Yol, { ad: string; atomEkonomisi: number; yanUrun: number; denklem: string }> = {
  klasik: { ad: 'Klasik (stokiyometrik reaktif)', atomEkonomisi: 42, yanUrun: 1.4, denklem: 'A + B (reaktif) → Ürün + yan ürünler' },
  katalitik: { ad: 'Katalitik', atomEkonomisi: 89, yanUrun: 0.12, denklem: 'A + B —(katalizör)→ Ürün + az yan ürün' },
}

export default function YesilKimyaSim() {
  const [cozucu, setCozucu] = useState<Cozucu>('benzen')
  const [yol, setYol] = useState<Yol>('klasik')
  const [sicaklik, setSicaklik] = useState<'yuksek' | 'oda'>('yuksek')
  const [hammadde, setHammadde] = useState<'petrol' | 'bitki'>('petrol')
  const y = YOL[yol]
  const c = COZUCU[cozucu]
  const atik = y.yanUrun + c.atik
  const enerji = (sicaklik === 'yuksek' ? 120 : 25) * (yol === 'katalitik' ? 0.7 : 1)
  const puan = Math.max(0, Math.min(100, Math.round(y.atomEkonomisi * 0.4 + (4 - c.tehlike) * 8 + (sicaklik === 'oda' ? 15 : 0) + (hammadde === 'bitki' ? 13 : 0) - atik * 4)))
  const ilkeler = [
    atik < 1 && 'Atık önleme',
    y.atomEkonomisi > 80 && 'Yüksek atom ekonomisi',
    c.tehlike === 0 && 'Daha güvenli çözücü',
    sicaklik === 'oda' && 'Enerji verimliliği',
    yol === 'katalitik' && 'Katalizör kullanımı',
    hammadde === 'bitki' && 'Yenilenebilir hammadde',
  ].filter(Boolean) as string[]

  return (
    <div className="sim">
      <Gorev>Fabrikanın ayarlarını değiştirerek 1 kg ürünü en az atık ve enerjiyle üret. Yeşil kimya puanını 80'in üzerine çıkarabilir misin? Hangi ilkeler puanı en çok artırıyor?</Gorev>
      <Secenekler secenekler={(Object.keys(YOL) as Yol[]).map(k => ({ id: k, ad: YOL[k].ad }))} secili={yol} onSec={setYol} etiket="Üretim yolu" />
      <Secenekler secenekler={(Object.keys(COZUCU) as Cozucu[]).map(k => ({ id: k, ad: COZUCU[k].ad }))} secili={cozucu} onSec={setCozucu} etiket="Çözücü" />
      <Secenekler secenekler={[{ id: 'yuksek', ad: '180 °C' }, { id: 'oda', ad: 'Oda sıcaklığı' }]} secili={sicaklik} onSec={setSicaklik} etiket="Sıcaklık" />
      <Secenekler secenekler={[{ id: 'petrol', ad: 'Petrol kaynaklı hammadde' }, { id: 'bitki', ad: 'Bitkisel hammadde' }]} secili={hammadde} onSec={setHammadde} etiket="Hammadde" />
      <div className="fabrika" aria-hidden="true">
        <span className="fabrika-giris">🛢️ {hammadde === 'bitki' ? '🌽' : ''}</span>
        <span className="fabrika-ok">→</span>
        <span className="fabrika-reaktor">⚗️<small>{yol === 'katalitik' ? 'katalizör' : 'reaktif'}</small></span>
        <span className="fabrika-ok">→</span>
        <span className="fabrika-urun">📦 1 kg</span>
        <span className="fabrika-atik" style={{ fontSize: `${14 + atik * 4}px` }}>🗑️ {sayi(atik, 1)} kg</span>
      </div>
      <p className="sim-sabit">{y.denklem}</p>
      <div className="sim-degerler">
        <Deger ad="Atom ekonomisi" deger={`%${y.atomEkonomisi}`} />
        <Deger ad="Atık / kg ürün" deger={`${sayi(atik, 1)} kg`} />
        <Deger ad="Enerji (bağıl)" deger={sayi(enerji, 0)} />
        <Deger ad="Yeşil kimya puanı" deger={`${puan} / 100`} vurgu={puan >= 80} />
      </div>
      {ilkeler.length > 0 && <p className="sim-sabit">Uygulanan ilkeler: {ilkeler.join(' · ')}</p>}
      <Not>Değerler örnek bir üretim için temsilidir. Atom ekonomisi = (istenen ürünün mol kütlesi / tepkenlerin toplam mol kütlesi) × 100.</Not>
    </div>
  )
}
