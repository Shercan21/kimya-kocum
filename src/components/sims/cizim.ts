import { useEffect, useRef } from 'react'

// Sanal deneylerin canvas yardımcıları

export type CizimFn = (ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) => void

// Canvas'ı cihaz piksel oranına göre kurar ve her karede `ciz` fonksiyonunu çağırır.
// `ciz` her render'da güncellenebilir; döngü yeniden başlamaz.
export function useAnimasyon(ciz: CizimFn) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const cizRef = useRef(ciz)
  useEffect(() => {
    cizRef.current = ciz
  })
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let W = 0
    let H = 0
    const boyutla = () => {
      const dpr = window.devicePixelRatio || 1
      W = c.clientWidth
      H = c.clientHeight
      c.width = Math.round(W * dpr)
      c.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    boyutla()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(boyutla) : null
    ro?.observe(c)
    let son = performance.now()
    let kare = 0
    const dongu = (simdi: number) => {
      const dt = Math.min(50, simdi - son) / 16.7
      son = simdi
      ctx.clearRect(0, 0, W, H)
      cizRef.current(ctx, W, H, dt)
      kare = requestAnimationFrame(dongu)
    }
    kare = requestAnimationFrame(dongu)
    return () => {
      cancelAnimationFrame(kare)
      ro?.disconnect()
    }
  }, [])
  return canvas
}


export const sayi = (x: number, b = 2) =>
  x.toLocaleString('tr-TR', { maximumFractionDigits: b, minimumFractionDigits: b })

// Çizim yardımcıları
export function daire(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, renk: string) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = renk
  ctx.fill()
}

export function yazi(ctx: CanvasRenderingContext2D, metin: string, x: number, y: number, opts: { boyut?: number; renk?: string; hiza?: CanvasTextAlign; kalin?: boolean } = {}) {
  ctx.font = `${opts.kalin ? '600 ' : ''}${opts.boyut ?? 12}px system-ui, sans-serif`
  ctx.fillStyle = opts.renk ?? '#26215c'
  ctx.textAlign = opts.hiza ?? 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(metin, x, y)
}

// Beher çizer; sıvı yüksekliği 0–1, renk rgba
export function beher(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, doluluk: number, sivi: string) {
  const sh = h * doluluk
  ctx.fillStyle = sivi
  ctx.fillRect(x + 2, y + h - sh, w - 4, sh - 2)
  ctx.strokeStyle = '#26215c'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x - 4, y)
  ctx.lineTo(x, y + 4)
  ctx.lineTo(x, y + h - 6)
  ctx.quadraticCurveTo(x, y + h, x + 6, y + h)
  ctx.lineTo(x + w - 6, y + h)
  ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - 6)
  ctx.lineTo(x + w, y + 4)
  ctx.lineTo(x + w + 4, y)
  ctx.stroke()
}
