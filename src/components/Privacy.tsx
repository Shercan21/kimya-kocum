import { useEffect, useState } from 'react'
import { useBackStep } from '../data/backNav'
import { TEACHER_EMAIL } from '../data/cloud'
import { kvkkOnayla } from '../data/kvkk'

export function AydinlatmaMetni() {
  return (
    <div className="privacy-text">
      <p className="muted small">Son güncelleme: 2 Kasım 2026</p>

      <h4>Kısaca</h4>
      <ul>
        <li>Kimya Koçum'u <b>giriş yapmadan</b> kullanırsan bütün çalışma bilgilerin yalnızca kendi cihazında kalır; hiçbir yere gönderilmez.</li>
        <li><b>Google ile giriş yaparsan</b> ilerlemen yedeklenir ve kimya öğretmenin gelişimini görebilir.</li>
        <li>Reklam yok, verilerin satılmaz ve başka kimseyle paylaşılmaz.</li>
        <li>İstediğin zaman hesabını ve verilerini kendin silebilirsin.</li>
      </ul>

      <h4>Veri sorumlusu</h4>
      <p>
        Uygulamayı hazırlayan ve yöneten kimya öğretmeni Hasan. İletişim:{' '}
        <a href={`mailto:${TEACHER_EMAIL}`}>{TEACHER_EMAIL}</a>
      </p>

      <h4>Hangi bilgiler işlenir?</h4>
      <ul>
        <li><b>Google hesabından:</b> adın, e-posta adresin ve profil fotoğrafın (fotoğraf yalnızca ekranda gösterilir, kaydedilmez).</li>
        <li><b>Uygulama içinden:</b> sınıfın, çalışma amacın ve düzenin (günler, süre, hedef), çözdüğün testlerin sonuçları, hata defterin ve seçtiğin hata nedenleri, konuların öğrenme durumu ve çalışma programın.</li>
      </ul>
      <p>Kimlik numarası, telefon, adres, sağlık bilgisi gibi bilgiler istenmez ve işlenmez.</p>

      <h4>Neden işlenir?</h4>
      <ul>
        <li>İlerlemeni yedeklemek ve başka cihazda kaldığın yerden devam etmeni sağlamak,</li>
        <li>Koç bölümünde sana kişisel çalışma önerileri sunmak (öneriler cihazında hesaplanır),</li>
        <li>Öğretmeninin gelişimini takip edip sana daha iyi yol gösterebilmesi.</li>
      </ul>

      <h4>Nerede saklanır, kim görür?</h4>
      <p>
        Bilgiler Google'ın Firebase hizmetinde, Avrupa'daki sunucularda saklanır. Bu nedenle yurt dışına aktarılmış olur;
        giriş yaparken buna onay verirsin. Bilgilerini yalnızca sen ve öğretmenin görebilir; diğer öğrenciler göremez.
        Google bu bilgileri yalnızca barındırma hizmeti sağlamak için işler.
      </p>

      <h4>Ne kadar süre saklanır?</h4>
      <p>
        Hesabını silene kadar. "Hesabımı ve verilerimi sil" düğmesine bastığında sunucudaki bütün bilgilerin silinir.
        Uzun süre kullanılmayan hesaplar da öğretmen tarafından silinebilir.
      </p>

      <h4>18 yaşından küçüksen</h4>
      <p>
        Google ile giriş yapmadan önce bu metni velinle birlikte oku ve onun onayını al. Velin istemezse uygulamayı
        giriş yapmadan kullanmaya devam edebilirsin; hiçbir özellik kaybetmezsin, yalnızca yedekleme olmaz.
      </p>

      <h4>Hakların</h4>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesi uyarınca verilerinin işlenip işlenmediğini öğrenme,
        bilgi isteme, düzeltilmesini ya da silinmesini isteme, onayını geri çekme ve şikâyet hakların vardır. Bunun için
        yukarıdaki e-posta adresine yazabilir ya da hesabını uygulamadan kendin silebilirsin.
      </p>
    </div>
  )
}

export function PrivacyModal({ onClose, children }: { onClose: () => void; children?: React.ReactNode }) {
  useBackStep(true, onClose)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Aydınlatma metni" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Gizlilik ve aydınlatma metni</h3>
          <button type="button" className="btn-ghost" onClick={onClose} aria-label="Kapat">×</button>
        </div>
        <div className="modal-body">
          <AydinlatmaMetni />
        </div>
        {children && <div className="modal-foot">{children}</div>}
      </div>
    </div>
  )
}

export function PrivacyLink({ label = 'Gizlilik ve aydınlatma metni' }: { label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className="link-button" onClick={() => setOpen(true)}>{label}</button>
      {open && <PrivacyModal onClose={() => setOpen(false)} />}
    </>
  )
}

// Google ile girişten önce ilk seferde aydınlatma metnini gösterip onay ister.
export function GirisOnayi({ onOnay, onClose }: { onOnay: () => void; onClose: () => void }) {
  const [onay, setOnay] = useState(false)
  return (
    <PrivacyModal onClose={onClose}>
      <label className="consent">
        <input type="checkbox" checked={onay} onChange={e => setOnay(e.target.checked)} />
        <span>
          Metni okudum. Bilgilerimin bu metinde anlatıldığı şekilde işlenmesine ve Avrupa'daki sunucularda saklanmasına
          onay veriyorum. 18 yaşından küçüksem velimin de onayı var.
        </span>
      </label>
      <div className="row-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>Vazgeç</button>
        <button
          type="button"
          className="primary-button"
          disabled={!onay}
          onClick={() => {
            kvkkOnayla()
            onOnay()
          }}
        >
          Onaylıyorum, giriş yap
        </button>
      </div>
    </PrivacyModal>
  )
}
