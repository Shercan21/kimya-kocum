// Canlı tahta boyama: Ders Video Atölyesi'nin nötr (beyaz tahta) videolarını
// öğrencinin seçtiği tahta, yazı rengi ve kalem ile her karede tarayıcıda boyar.
// Fotoğraf/resim alanları (koru) olduğu gibi kalır; karakterin bulunduğu kutuda yalnız
// beyaz zemin boyanır. Algoritma atölyedeki canli.js ile aynıdır, burada GPU'da çalışır.

export type CanliVeri = {
  surum?: number
  notr?: boolean
  koru?: [number, number, number[][]][]
  karakter?: [number, number, number[][]][]
}

export type TahtaAyari = { tema: string; ink: string; kalem: string }

export const VARSAYILAN_AYAR: TahtaAyari = { tema: 'beyaz', ink: '', kalem: '' }

export const TEMALAR: [string, string][] = [['beyaz', 'Beyaz'], ['kareli', 'Kareli'], ['kara', 'Kara tahta'], ['yesil', 'Yeşil'], ['mavi', 'Mavi']]
export const KALEMLER: [string, string][] = [['', 'Normal'], ['tebesir', 'Tebeşir'], ['tahta', 'Tahta kalemi']]
const ZEMIN: Record<string, number[]> = { kara: [36, 40, 38], yesil: [30, 70, 50], mavi: [26, 56, 90] }
export const YAZI: Record<string, number[]> = { siyah: [22, 22, 26], mavi: [28, 88, 196], yesil: [18, 118, 78], mor: [108, 48, 170], kirmizi: [178, 38, 38], beyaz: [244, 242, 232], sari: [250, 226, 120] }
export const YAZI_ADI: Record<string, string> = { '': 'Otomatik', siyah: 'Siyah', beyaz: 'Beyaz', sari: 'Sarı', mavi: 'Mavi', yesil: 'Yeşil', mor: 'Mor', kirmizi: 'Kırmızı' }

export function koyuMu(tema: string) { return !!ZEMIN[tema] }
export function yaziSecenekleri(tema: string) {
  return koyuMu(tema) ? ['', 'sari', 'mavi', 'yesil', 'mor', 'kirmizi'] : ['', 'siyah', 'mavi', 'yesil', 'mor', 'kirmizi']
}
export function varsayilanMi(a: TahtaAyari) { return a.tema === 'beyaz' && !a.ink && !a.kalem }

function tebesirRengi(ink: string) {
  if (ink === 'sari') return YAZI.sari
  if (['mavi', 'yesil', 'mor', 'kirmizi'].includes(ink)) return YAZI[ink].map(v => Math.floor(v + (255 - v) * 0.55))
  return [244, 242, 232]
}

const AYAR_KEY = 'kimya-kocum-video-tahta'
export function ayarOku(): TahtaAyari {
  try {
    const a = JSON.parse(localStorage.getItem(AYAR_KEY) || 'null')
    if (a && typeof a.tema === 'string') return { tema: a.tema, ink: a.ink || '', kalem: a.kalem || '' }
  } catch { /* varsayılan */ }
  return VARSAYILAN_AYAR
}
export function ayarYaz(a: TahtaAyari) {
  try { localStorage.setItem(AYAR_KEY, JSON.stringify(a)) } catch { /* depolama yoksa yalnız bu oturum */ }
}

export function kutularAt(liste: CanliVeri['koru'], t: number): number[][] {
  if (!liste) return []
  for (const [a, b, k] of liste) if (t >= a && t < b) return k
  return []
}

const MAX_KORU = 16
const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`
const FS = `precision mediump float;
varying vec2 uv;
uniform sampler2D tx;uniform vec2 px;
uniform vec3 zem,teb,yr;uniform float koyu,useYr,kareli,tbs,tahta;
uniform vec4 koru[${MAX_KORU}];uniform float nKoru;uniform vec4 kar;uniform float useKar;
float hash(vec2 q){return fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);}
bool icinde(vec2 q,vec4 k){return q.x>=k.x&&q.y>=k.y&&q.x<k.z&&q.y<k.w;}
void main(){
  vec3 o=texture2D(tx,uv).rgb;vec2 P=floor(uv*vec2(1280.,720.));
  for(int i=0;i<${MAX_KORU};i++){if(float(i)<nKoru&&icinde(P,koru[i])){gl_FragColor=vec4(o,1.);return;}}
  float cho=max(o.r,max(o.g,o.b))-min(o.r,min(o.g,o.b));
  if(useKar>.5&&icinde(P,kar)&&!(cho<.08&&dot(o,vec3(.299,.587,.114))>.88)){gl_FragColor=vec4(o,1.);return;}
  vec3 c=o;
  if(tahta>.5&&cho<40./255.&&uv.y>=.09&&uv.y<.9){
    vec3 mn=c;
    for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++)mn=min(mn,texture2D(tx,uv+vec2(float(dx),float(dy))*px).rgb);
    c=mn;
  }
  float ch=max(c.r,max(c.g,c.b))-min(c.r,min(c.g,c.b));
  float ne=clamp((40./255.-ch)*12.,0.,1.);
  float m=1.-dot(c,vec3(.299,.587,.114));
  vec3 R=c;
  if(koyu>.5){vec3 g=teb*m+zem*(1.-m);R=g*ne+(c*.7+.3)*(1.-ne);}
  else{
    if(useYr>.5){vec3 ir=yr*m+(1.-m);R=ir*ne+c*(1.-ne);}
    if(kareli>.5&&(mod(P.x,32.)<.5||mod(P.y,32.)<.5))R*=vec3(222.,232.,242.)/255.;
  }
  if(tbs>.5&&hash(P)<.22&&m*ne>90./255.)R=R*.3+zem*.7;
  gl_FragColor=vec4(R,1.);
}`

export class CanliBoyayici {
  private gl: WebGLRenderingContext
  private tex: WebGLTexture
  private u: Record<string, WebGLUniformLocation | null> = {}

  static dene(cv: HTMLCanvasElement): CanliBoyayici | null {
    try {
      const gl = cv.getContext('webgl', { premultipliedAlpha: false, preserveDrawingBuffer: false, antialias: false })
      return gl ? new CanliBoyayici(gl) : null
    } catch { return null }
  }

  private constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    const sh = (t: number, s: string) => {
      const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x)
      if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x) || 'shader')
      return x
    }
    const p = gl.createProgram()!
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link')
    gl.useProgram(p)
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(p, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    this.tex = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    for (const n of ['tx', 'px', 'zem', 'teb', 'yr', 'koyu', 'useYr', 'kareli', 'tbs', 'tahta', 'koru', 'nKoru', 'kar', 'useKar']) this.u[n] = gl.getUniformLocation(p, n)
  }

  ciz(video: HTMLVideoElement, a: TahtaAyari, koru: number[][], kar: number[] | null): boolean {
    const gl = this.gl, cv = gl.canvas as HTMLCanvasElement
    const w = video.videoWidth, h = video.videoHeight
    if (!w || !h) return false
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h }
    gl.viewport(0, 0, w, h)
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video) } catch { return false }
    const koyu = ZEMIN[a.tema], zem = (koyu || [255, 255, 255]).map(v => v / 255)
    const teb = (koyu ? tebesirRengi(a.ink) : [255, 255, 255]).map(v => v / 255)
    const yrr = !koyu && a.ink && YAZI[a.ink] && a.ink !== 'beyaz' && a.ink !== 'sari' ? YAZI[a.ink] : null
    const u = this.u
    gl.uniform1i(u.tx, 0); gl.uniform2f(u.px, 1 / w, 1 / h)
    gl.uniform3fv(u.zem, zem); gl.uniform3fv(u.teb, teb); gl.uniform3fv(u.yr, (yrr || [0, 0, 0]).map(v => v / 255))
    gl.uniform1f(u.koyu, koyu ? 1 : 0); gl.uniform1f(u.useYr, yrr ? 1 : 0); gl.uniform1f(u.kareli, a.tema === 'kareli' ? 1 : 0)
    gl.uniform1f(u.tbs, a.kalem === 'tebesir' ? 1 : 0); gl.uniform1f(u.tahta, a.kalem === 'tahta' ? 1 : 0)
    const k = new Float32Array(MAX_KORU * 4); const n = Math.min(MAX_KORU, koru.length)
    for (let i = 0; i < n; i++) k.set(koru[i].slice(0, 4), i * 4)
    gl.uniform4fv(u.koru, k); gl.uniform1f(u.nKoru, n)
    gl.uniform4fv(u.kar, new Float32Array(kar ? kar.slice(0, 4) : [0, 0, 0, 0])); gl.uniform1f(u.useKar, kar ? 1 : 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    return true
  }
}
