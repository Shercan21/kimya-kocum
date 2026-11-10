import { useRef, useState } from 'react'
import { applyMigration, captureMigration, DOMAIN_HOME, downloadMigration, validateMigration, type MigrationPackage } from '../data/domainMigration'
import './domain-migration.css'

export default function DomainMigration() {
  const old = location.hostname === 'shercan21.github.io'
  const target = ['kimyakocum.com.tr', 'www.kimyakocum.com.tr', 'localhost', '127.0.0.1'].includes(location.hostname)
  const [open, setOpen] = useState(old || (target && !localStorage.getItem('kimya-kocum-profile-v1') && !localStorage.getItem('kk-domain-migrated-v1')))
  const [pending, setPending] = useState<MigrationPackage | null>(null)
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
  if (!old && !target) return null
  async function read(file?: File) {
    if (!file) return
    setError(''); setPending(null)
    try {
      if (file.size > 25000000) throw Error('Dosya çok büyük.')
      setPending(validateMigration(JSON.parse(await file.text())))
    } catch (e) { setError(e instanceof Error ? e.message : 'Dosya okunamadı.') }
  }
  function restore() {
    if (!pending) return
    try {
      if (Object.keys(captureMigration(localStorage)).length) downloadMigration(localStorage)
      applyMigration(localStorage, pending)
      window.location.reload()
    } catch { setError('Aktarım tamamlanamadı. Mevcut kayıtlar korundu; cihazında boş alan olduğundan emin ol.') }
  }
  return <aside className="domain-migration" aria-label="Yeni adrese geçiş">
    <button className="domain-migration-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>{old ? 'Yeni adresimiz: kimyakocum.com.tr' : 'Eski uygulamadaki kayıtlarını taşı'} <span>{open ? '−' : '+'}</span></button>
    {open && <div className="domain-migration-body">
      {old ? <>
        <p>Ders ilerlemeni, yarım kalan çalışmalarını ve kaldığın sayfayı yeni adrese taşımak için önce geçiş dosyanı indir. Eski kayıtların bu cihazda kalır.</p>
        <ol><li><button className="btn-secondary" onClick={() => downloadMigration(localStorage)}>Geçiş dosyamı indir</button></li><li><a href={DOMAIN_HOME} rel="noopener" target="_blank">kimyakocum.com.tr adresini aç</a></li><li>Yeni adreste “Geçiş dosyasını seç” düğmesiyle indirdiğin dosyayı yükle.</li></ol>
        <p className="small">Yeni adres açılmıyorsa geçiş yapmadan burada çalışmaya devam et. Dosya kişisel çalışma kayıtlarını ve hesap bilgilerini içerir; paylaşma. Eski PWA’yı ancak aktarımı kontrol ettikten sonra kaldır.</p>
      </> : <>
        <p>Daha önce bu cihazda Kimya Koçum kullandıysan eski uygulamadan indirdiğin geçiş dosyasını seç. Dosya sunucuya gönderilmez; yalnızca bu tarayıcıya kaydedilir.</p>
        <button className="btn-secondary" onClick={() => input.current?.click()}>Geçiş dosyasını seç</button>
        <input ref={input} type="file" accept=".json,application/json" hidden onChange={e => void read(e.target.files?.[0])} />
        <p className="small">Aktarımdan sonra ilerlemeni kontrol et, çevrimdışı ders paketini yeniden indir ve yeni adresi ana ekranına ekle. Google yedekleme için yeniden izin vermen gerekebilir. Yeni kullanıcıysan aşağıdan başlayabilirsin.</p>
      </>}
      {error && <p role="alert" className="form-error">{error}</p>}
      {pending && <div role="alert" className="domain-migration-confirm"><b>{Object.keys(pending.store).length} kayıt taşınmaya hazır.</b><p>Bu tarayıcıdaki Kimya Koçum kayıtları dosyadaki kayıtlarla değiştirilecek. Mevcut kayıtların varsa önce bir kopyası indirilecek ve bu cihazda güvenlik kopyası tutulacak. Eski uygulamadaki kayıtlar silinmez.</p><button className="primary-button" onClick={restore}>Bu cihazı yedekle ve aktar</button> <button className="btn-ghost" onClick={() => setPending(null)}>Vazgeç</button></div>}
    </div>}
  </aside>
}
