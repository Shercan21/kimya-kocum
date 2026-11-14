export const CONTENT_ROOT = 'https://kimya-kocun-reklam.dependablepin4.chatgpt.site/content/'
let revision = 'baseline'
export async function preparePublishedContent() {
  try {
    const response = await fetch(CONTENT_ROOT + 'revision', { cache: 'no-cache', signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw Error()
    const data = await response.json() as { revision: string }
    if (!/^(baseline|[a-f0-9-]{36})$/.test(data.revision)) throw Error()
    revision = data.revision
    localStorage.setItem('kk-content-revision', revision)
  } catch {
    const saved = localStorage.getItem('kk-content-revision')
    if (saved && /^(baseline|[a-f0-9-]{36})$/.test(saved)) revision = saved
  }
}
export function publishedContentUrl(path: string) {
  return CONTENT_ROOT + 'icerik/' + path + '?v=' + revision
}

