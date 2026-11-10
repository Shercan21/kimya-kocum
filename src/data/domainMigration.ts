// Alan adı değişiminde kayıtlar yalnızca öğrencinin indirdiği dosyayla taşınır.
// Tarayıcı önbelleği ve OAuth erişim anahtarı aktarılmaz.
export const DOMAIN_HOME = 'https://kimyakocum.com.tr/'
export const MIGRATION_APP = 'kimya-kocum-alan-adi-gecisi'
export const MIGRATION_SAFETY = 'kk-domain-migration-safety-v1'
export type MigrationStore = Record<string, string>
export type MigrationPackage = { app: typeof MIGRATION_APP; version: 1; created: string; store: MigrationStore }
const EXTRA = new Set(['kk-kocum-guest-store', 'kk-usage-device-v1', 'kk-usage-optout-v1'])
export const migrationKey = (key: string) => key.startsWith('kimya-kocum-') || key.startsWith('kk-kocum-account:') || EXTRA.has(key)
export function captureMigration(storage: Storage): MigrationStore {
  const store: MigrationStore = {}
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key && migrationKey(key)) store[key] = storage.getItem(key)!
  }
  return store
}
export function migrationPackage(storage: Storage): MigrationPackage {
  return { app: MIGRATION_APP, version: 1, created: new Date().toISOString(), store: captureMigration(storage) }
}
export function validateMigration(value: unknown): MigrationPackage {
  if (!value || typeof value !== 'object') throw Error('Geçiş dosyası okunamadı.')
  const p = value as MigrationPackage
  if (p.app !== MIGRATION_APP || p.version !== 1 || !p.store || typeof p.store !== 'object' || Array.isArray(p.store)) throw Error('Kimya Koçum geçiş dosyasını seç.')
  if (Object.keys(p.store).length > 2000) throw Error('Dosyada çok fazla kayıt var.')
  const store: MigrationStore = {}
  let size = 0
  for (const [key, item] of Object.entries(p.store)) {
    if (!migrationKey(key) || typeof item !== 'string') throw Error('Dosyada beklenmeyen bir kayıt var.')
    size += key.length + item.length
    if (size > 25000000) throw Error('Geçiş dosyası çok büyük.')
    if (item.startsWith('{') || item.startsWith('[')) JSON.parse(item)
    store[key] = item
  }
  if (!Object.keys(store).length) throw Error('Dosyada taşınacak kayıt bulunamadı.')
  return { app: MIGRATION_APP, version: 1, created: typeof p.created === 'string' ? p.created : '', store }
}
export function applyMigration(storage: Storage, p: MigrationPackage) {
  const incoming = validateMigration(p).store, before = captureMigration(storage)
  const previousSafety = storage.getItem(MIGRATION_SAFETY)
  // Önce güvenlik kopyası. Kota doluysa mevcut kayıtlara dokunulmaz.
  storage.setItem(MIGRATION_SAFETY, JSON.stringify(migrationPackage(storage)))
  const write = (next: MigrationStore) => {
    for (const key of Object.keys(captureMigration(storage))) if (!(key in next)) storage.removeItem(key)
    for (const [key, value] of Object.entries(next)) storage.setItem(key, value)
  }
  try {
    write(incoming)
    for (const [key, value] of Object.entries(incoming)) if (storage.getItem(key) !== value) throw Error('Kayıt doğrulanamadı.')
    // Yeni adreste çevrimdışı paketler yeniden indirilmeli; eski hazır işareti taşınmaz.
    storage.setItem('kk-domain-migrated-v1', new Date().toISOString())
  } catch (e) {
    // Alanı önce boşalt: ortak anahtarlardaki büyük yeni değerler geri dönüşü engellemesin.
    storage.removeItem(MIGRATION_SAFETY)
    for (const key of Object.keys(captureMigration(storage))) storage.removeItem(key)
    write(before)
    if (previousSafety !== null) storage.setItem(MIGRATION_SAFETY, previousSafety)
    throw e
  }
}
export function downloadMigration(storage: Storage) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(migrationPackage(storage))], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url; a.download = 'kimya-kocum-alan-adi-gecisi-' + new Date().toISOString().slice(0, 10) + '.json'; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
