export const USAGE_DEVICE_KEY = 'kk-usage-device-v1'
export const USAGE_OPTOUT_KEY = 'kk-usage-optout-v1'
export async function usageIdentity(googleId: string | null, storage: Pick<Storage, 'getItem' | 'setItem'>, cryptoApi: Crypto) {
  if (storage.getItem(USAGE_OPTOUT_KEY) === '1') return null
  let device = storage.getItem(USAGE_DEVICE_KEY)
  if (!device) { device = cryptoApi.randomUUID(); storage.setItem(USAGE_DEVICE_KEY, device) }
  const hash = async (value: string) => Array.from(new Uint8Array(await cryptoApi.subtle.digest('SHA-256', new TextEncoder().encode('kimya-kocum-usage-v1/' + value))), b => b.toString(16).padStart(2, '0')).join('')
  return { device: await hash('device/' + device), account: googleId ? await hash('account/' + googleId) : null }
}
