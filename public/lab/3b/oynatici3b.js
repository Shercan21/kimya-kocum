/* Kimya Koçum · Deney Atölyesi JSON'unu 3B oynatır.
   Mevcut oynatıcı (deneyoynatici.js = window.DO) aynen kullanılır; ona labkit Scene API'sine uyan bir "3B sahne" (S3) verilir.
   3B karşılığı olan aletler 3B kurulur; olmayanlar (özel çizimler, nadir aletler) gizli bir 2B sahnede çizilip
   tezgâhın arkasındaki şeffaf panoya doku olarak yansıtılır. Böylece her deney açılır, 3B'leşen aletler arttıkça görünüm iyileşir. */
import { THREE } from './kit3b.js';
const hex = c => '#' + c.getHexString();

const S_ = 0.08, TAB = 522; // 1 px = 0.08 cm; 2B'de tezgâh çizgisi y=522
const rgbaAyir = c => { if (!c) return null; if (c instanceof THREE.Color) return { c, a: 1 }; const s = String(c).trim(); let m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (m) return { c: new THREE.Color(+m[1] / 255, +m[2] / 255, +m[3] / 255).convertSRGBToLinear(), a: m[4] == null ? 1 : +m[4] };
  try { return { c: new THREE.Color(s), a: 1 }; } catch { return null; } };

class SahteG { // DO'nun o.g.setAttribute('opacity'|'transform') çağrılarını 3B gruba çevirir
  constructor(grup, harita) { this.grup = grup; this.h = harita; this.tr = ''; this.op = '1'; this.__3d = true; this.taban = grup.position.clone(); this.tabanRz = grup.rotation.z; }
  setAttribute(k, v) { if (k === 'opacity') { this.op = String(v); this.grup.visible = +v > 0.3; } else if (k === 'transform') { this.tr = String(v || ''); let dx = 0, dy = 0, rz = 0; const t = this.tr.match(/translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/); if (t) { dx = +t[1]; dy = +t[2]; } const r = this.tr.match(/rotate\(\s*(-?[\d.]+)/); if (r) rz = -(+r[1]) * Math.PI / 180;
      this.grup.position.set(this.taban.x + dx * S_, this.taban.y - dy * S_, this.taban.z); this.grup.rotation.z = this.tabanRz + rz; } }
  getAttribute(k) { return k === 'transform' ? this.tr : k === 'opacity' ? this.op : null; }
  remove() { this.grup.parent && this.grup.parent.remove(this.grup); }
}

export const sahneAyari = D => ({ hedef: [0, 9, 0], uzak: Math.max(52, (D.W || 400) * S_ * 1.65) });
export function deneyKur(K, D) {
  const W = D.W || 400;
  const X = x => (x - W / 2) * S_, Y = y => (TAB - y) * S_;
  const genis = W * S_;
  const A = K.A;

  // ---------- gizli 2B sahne (yedek çizimler için) ----------
  const ns = 'http://www.w3.org/2000/svg';
  const svg2 = document.createElementNS(ns, 'svg'); svg2.setAttribute('width', W); svg2.setAttribute('height', 560);
  Object.assign(svg2.style, { position: 'absolute', left: '-20000px', top: '0', width: W + 'px', height: '560px' }); document.body.append(svg2);
  window.__lkSahne = (window.__lkSahne || 0) + 1;
  const S2 = (() => { // labkit Scene'i, LK.page dışında kur
    const svg = svg2; const S = LK.Scene ? LK.Scene(svg, W) : null; return S; })();
  // arka planı (duvar, tezgâh) gizle: yalnız defs + katmanlar kalsın
  [...svg2.childNodes].forEach(n => { if (n !== S2.defs && n !== S2.layer && n !== S2.top) n.style && (n.style.display = 'none'); });
  // pano: 2B çizimlerin dokusu
  const cv = document.createElement('canvas'); cv.width = W * 2; cv.height = 1120; const cx2 = cv.getContext('2d');
  const doku = new THREE.CanvasTexture(cv); doku.colorSpace = THREE.SRGBColorSpace;
  const pano = new THREE.Mesh(new THREE.PlaneGeometry(genis, 560 * S_), new THREE.MeshStandardMaterial({ map: doku, transparent: true, alphaTest: 0.03, roughness: 0.8, side: THREE.DoubleSide }));
  pano.position.set(0, Y(280), -2.5); pano.visible = false; K.sc.add(pano);
  let kirli = true, sonCiz = -1, cizerken = false, icerikVar = false;
  new MutationObserver(() => { kirli = true; }).observe(svg2, { subtree: true, childList: true, attributes: true, characterData: true });
  function ciz() { if (cizerken) return; cizerken = true; kirli = false; icerikVar = S2.layer.childNodes.length + S2.top.childNodes.length > 0;
    const kopya = svg2.cloneNode(true); kopya.setAttribute('xmlns', ns); kopya.setAttribute('viewBox', `0 0 ${W} 560`); kopya.removeAttribute('style'); kopya.setAttribute('width', W * 2); kopya.setAttribute('height', 1120);
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(kopya)], { type: 'image/svg+xml' })); const im = new Image();
    im.onload = () => { cx2.clearRect(0, 0, cv.width, cv.height); cx2.drawImage(im, 0, 0, cv.width, cv.height); doku.needsUpdate = true; URL.revokeObjectURL(url); pano.visible = icerikVar; cizerken = false; };
    im.onerror = () => { URL.revokeObjectURL(url); cizerken = false; }; im.src = url; }
  K.tick(() => { if (kirli && performance.now() - sonCiz > 90) { sonCiz = performance.now(); ciz(); } LK.T.paused = K.durdu; });
  LK.T.speed = () => K.hiz;
  // 2B animasyon döngüsü (damlalar, kabarcıklar) — labkit kendi rAF'ini S.tick içinde kuruyor; bir kez başlat
  if (S2.tick) requestAnimationFrame(S2.tick);

  // ---------- 3B nesne yardımcıları ----------
  const sar = (grup, o) => { o.g = new SahteG(grup, o); return o; };
  const renkle = (V, c) => { const p = rgbaAyir(c); if (!p) return; V.renkle(p.c, Math.min(0.9, 0.35 + p.a * 0.55)); };
  // 2B kap meta bilgisi + 3B kap
  function kap3(prof, ic, { cx, base, x0, x1, ybot, ytop, cap, shape, H }) {
    const level = v => { const f = shape ? shape(Math.max(0, Math.min(1, v / cap))) : Math.max(0, Math.min(1, v / cap)); return ybot - (ybot - ytop) * f; };
    const V = K.kap(prof, { ic, ust: H, hacim: cap, hacimY: v => Math.max(0.05, (ybot - level(v)) * S_ + 0.1), x0: X(cx), z0: 0 });
    V.g.position.y = Y(base);
    const o = { V, vol: 0, color: 'rgba(196,226,255,.82)', cap, x0, x1, ybot, ytop, level, __3d: true, mouth: [cx, base - H / S_],
      set(v, c) { o.vol = v; if (c) { o.color = c; renkle(V, c); } V.set(v); return o; },
      bubbles(r) { V.kabarcik(+r || 0); return o; }, cloudy(f, c) { V.bulanik(+f || 0, c ? rgbaAyir(c).c : undefined); return o; },
      ppt(f, c = 'rgba(240,240,240,.95)') { const p = rgbaAyir(c); V.cokelti(Math.max(0, +f || 0), p ? p.c : '#eee'); return o; } };
    renkle(V, o.color); return sar(V.g, o);
  }
  const S3 = { W, defs: S2.defs, layer: S2.layer, top: S2.top, svg: svg2, uid: S2.uid, anim: [], ticks: [], glass: S2.glass, G: S2.G };
  // --- cam kaplar ---
  S3.beaker = (cx, base = 520, w = 90, h = 110, cap = 250, label) => {
    const R = w / 2 * S_, H = h * S_; const prof = [[0, 0], [R - 0.4, 0], [R, 0.4], [R, H - 0.3], [R + 0.3, H]];
    const o = kap3(prof, () => R - 0.05, { cx, base, x0: cx - w / 2, x1: cx + w / 2, ybot: base - 1, ytop: base - h + 8, cap, H });
    for (let k = 1; k <= 4; k++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.04), K.M.koyu); t.position.set(-R * 0.4, H * k / 5.4, R + 0.02); o.V.g.add(t); }
    if (label) { const e = K.etiket(label, 1.15); e.position.set(0, -1.3, R + 1); o.V.g.add(e); o.lbl = e; } return o; };
  S3.erlen = (cx, base = 524, cap = 100, scale = 1, label) => {
    const s = scale, nw = 15 * s * S_, bw = 70 * s * S_, h = 120 * s * S_, neck = 42 * s * S_;
    const yb = h - neck - 16 * s * S_; const prof = [[0, 0], [bw - 0.6, 0], [bw - 0.1, 0.5], [bw - 0.3, 1.1], [nw + 0.5, yb], [nw, yb + 0.9], [nw, h - 0.2], [nw + 0.25, h]];
    const ic = y => (y < 1.1 ? bw - 0.35 : y < yb ? K.lerp(bw - 0.35, nw + 0.3, (y - 1.1) / (yb - 1.1)) : nw - 0.05);
    const o = kap3(prof, ic, { cx, base, x0: cx - 70 * s, x1: cx + 70 * s, ybot: base - 1, ytop: base - 120 * s + 42 * s, cap, shape: f => Math.min(1, Math.sqrt(f) * 0.95), H: h });
    o.mouth = [cx, base - 120 * s]; o.boyun = { r: nw, y: h };
    if (label) { const e = K.etiket(label, 1.15); e.position.set(0, -1.3, bw + 1); o.V.g.add(e); } return o; };
  S3.tube = (cx, base = 470, h = 150, cap = 20, label) => {
    const R = 11 * S_, H = h * S_; const prof = [[0, 0.03]]; for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 * i / 8; prof.push([R * Math.sin(a), R - R * Math.cos(a)]); } prof.push([R, H - 0.15], [R + 0.12, H]);
    const ic = y => (y < R ? Math.max(0.08, Math.sqrt(Math.max(0, R * R - (R - y) ** 2)) - 0.04) : R - 0.05);
    const o = kap3(prof, ic, { cx, base, x0: cx - 11, x1: cx + 11, ybot: base, ytop: base - h + 10, cap, H });
    o.mouth = [cx, base - h]; if (label) { const e = K.etiket(label, 1.05); e.position.set(0, H + 1.3, 0); o.V.g.add(e); } return o; };
  S3.cylinder = (cx, base = 520, cap = 50, h = 190) => {
    const R = 15 * S_, H = h * S_; const prof = [[0, 0.6], [R, 0.6], [R, H - 0.2], [R + 0.22, H]];
    const o = kap3(prof, () => R - 0.05, { cx, base, x0: cx - 15, x1: cx + 15, ybot: base - 9, ytop: base - h + 10, cap, H });
    const ayak = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.7, 0.7, 6), new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.4, transparent: true, opacity: 0.85 })); ayak.position.y = 0.35; o.V.g.add(ayak);
    for (let i = 1; i <= 10; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(i % 5 ? 0.5 : 0.9, 0.05, 0.04), K.M.koyu); t.position.set(0, 0.7 + (H - 1.4) * i / 10, R + 0.02); o.V.g.add(t); }
    const e = K.etiket(`mezür (${cap} mL)`, 1.0); e.position.set(0, H + 1.4, 0); o.V.g.add(e); return o; };
  S3.trough = (x0, x1, ytop = 420) => { const w = x1 - x0, h = 520 - ytop; const R = Math.min(w, 140) / 2 * S_;
    const prof = [[0, 0], [R - 0.3, 0], [R, 0.3], [R, h * S_]]; const o = kap3(prof, () => R - 0.05, { cx: (x0 + x1) / 2, base: 520, x0, x1, ybot: 519, ytop: ytop + 6, cap: 100, H: h * S_ });
    o.set(70, 'rgba(190,225,255,.75)'); let kop = null; o.foam = v => { if (!kop) kop = kopuk3(X((x0 + x1) / 2), Y(520) + (h * S_) * 0.7, R * 0.9, 3, '#ffffff'); kop.oran = +v || 0; }; o.clearFoam = () => { if (kop) kop.temizle(); }; return o; };
  // --- aletler ---
  S3.rack = (x0, x1, y = 430) => { const w = (x1 - x0) * S_; const g = new THREE.Group(); g.position.set(X((x0 + x1) / 2), 0, 0); const ah = new THREE.MeshStandardMaterial({ color: '#8a5a32', roughness: 0.6 });
    const ust = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, 3.4), ah); ust.position.y = Y(y) - 0.3; const orta = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, 3.4), ah); orta.position.y = Y(y + 56); const taban = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 0.6, 4.2), ah); taban.position.y = 0.3;
    g.add(ust, orta, taban); [-1, 1].forEach(sg => { const a = new THREE.Mesh(new THREE.BoxGeometry(0.6, Y(y), 3.4), ah); a.position.set(sg * (w / 2 - 0.3), Y(y) / 2, 0); g.add(a); });
    g.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; } }); K.sc.add(g); return sar(g, {}); };
  S3.tileUnder = (cx, w = 150) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w * S_, 0.5, 9), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.3, clearcoat: 0.6 })); m.position.set(X(cx), 0.25, 0); m.receiveShadow = true; const g = new THREE.Group(); g.add(m); K.sc.add(g); return sar(g, {}); };
  S3.thermo = (x, yTop = 300, len = 200, tmin = 0, tmax = 110) => { const T = A.termometre(X(x), Y(yTop + len), 0.6, { min: tmin, max: tmax, boy: Math.max(8, len * S_) });
    const o = { set(t) { T.set(+t); return o; } }; return sar(T.g, o); };
  S3.heater = (cx, base = 524, w = 120) => { const g = new THREE.Group(); g.position.set(X(cx), Y(base), 0); const gov = new THREE.Mesh(new THREE.BoxGeometry(w * S_, 30 * S_, 10), new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.4 })); gov.position.y = 15 * S_; g.add(gov);
    const plM = new THREE.MeshStandardMaterial({ color: '#6b7280', roughness: 0.5, emissive: '#ff3b0a', emissiveIntensity: 0 }); const pl = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(w * S_ / 2 - 0.6, 4.6), Math.min(w * S_ / 2 - 0.6, 4.6), 0.5, 40), plM); pl.position.y = 30 * S_ + 0.25; g.add(pl);
    const ledM = new THREE.MeshStandardMaterial({ color: '#9ca3af', emissive: '#ef4444', emissiveIntensity: 0 }); const led = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), ledM); led.position.set(-w * S_ / 2 + 1.3, 15 * S_, 5.02); g.add(led);
    const dug = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), K.M.gri); dug.rotation.x = Math.PI / 2; dug.position.set(w * S_ / 2 - 1.3, 15 * S_, 5.1); g.add(dug);
    g.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); K.sc.add(g);
    const o = { top: base - 36, on(f) { f = +f || 0; plM.emissiveIntensity = f * 1.4; plM.color.set(f > 0 ? '#7f1d1d' : '#6b7280'); ledM.emissiveIntensity = f > 0 ? 2 : 0; return o; } }; return sar(g, o); };
  S3.stopwatch = (x, y) => { const k = A.kronometre(X(x), -9); const o = { set(s) { k.set(+s || 0); return o; } }; return sar(k.g, o); };
  S3.balance = (cx, base = 524) => { const t = A.terazi(X(cx), 0); t.g.position.y = Y(base); const o = { top: base - 44, set(s) { const v = parseFloat(String(s).replace(',', '.')); if (!isNaN(v)) t.set(v); return o; } }; return sar(t.g, o); };
  S3.stand = (x = 101, clampY = 240, armTo = 190) => { const g = A.spor(X(x), -3, { yukseklik: Y(26), kolY: Y(clampY), kolBoy: Math.max(2, (armTo - x + 20) * S_), tabanX: -4 }); return sar(g, {}); };
  S3.burette = (cx = 200, top = 38, len = 270, cap = 50) => { const B = A.buret(X(cx), 0, { hacim: cap, y0: Y(top + len) + 1, etiket: '', boy: len * S_ });
    const o = { used: 0, cap, tip: [cx, top + len + 46], open(a) { B.ac(!!+a); return o; }, set(u) { o.used = +u || 0; B.set(cap - o.used); return o; } }; o.set(0); return sar(B.g, o); };
  S3.dropBottle = (cx, base = 452, name = 'İNDİKATÖR', color) => { const g = A.damlalikSise(X(cx), 0, { etiket: name, renk: color ? hex(rgbaAyir(color).c) : '#a16207' }); g.position.y = Y(base); return sar(g, { mouth: [cx, base - 100], uc: [cx, base - 100], color }); };
  S3.bottle = (cx, base = 520, name = 'HCl', color) => { const g = A.sise(X(cx), 0, { etiket: name, renk: '#d9e7f5' }); g.position.y = Y(base); return sar(g, { mouth: [cx, base - 100] }); };
  S3.stopper = (cx, y, w = 16) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(w * S_, (w - 4) * S_, 18 * S_, 24), new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.8 })); m.castShadow = true; const g = new THREE.Group(); g.position.set(X(cx), Y(y) - 0.2, 0); g.add(m); K.sc.add(g); return sar(g, {}); };
  S3.balloon = (cx, y, color = '#ef4444') => { const sahte = { g: { position: new THREE.Vector3(X(cx), 0, 0) }, boyun: { r: 1.25, y: Y(y) + 0.5 } }; const B = A.balon(sahte, { renk: rgbaAyir(color) ? hex(rgbaAyir(color).c) : color });
    const o = { inflate(f) { B.set(Math.max(0, Math.min(1, +f || 0))); return o; } }; return sar(B.g, o); };
  const olcer = (x, y, title, col, px, py) => { const g = new THREE.Group(); g.position.set(X(x + 46), 0, -10); const kut = new THREE.Mesh(new THREE.BoxGeometry(7.4, 2.4, 5.2), new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5 })); kut.position.y = 1.2; g.add(kut);
    const ek = K.ekran(320, 170, (c, w, h, v) => { c.fillStyle = '#0b1f14'; c.fillRect(0, 0, w, h); c.fillStyle = col || '#4ade80'; c.font = '800 80px "Courier New",monospace'; c.textAlign = 'center'; c.fillText(v, w / 2, 100); c.fillStyle = '#9ca3af'; c.font = '700 26px Nunito,sans-serif'; c.fillText(title, w / 2, 152); });
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.3), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.rotation.x = -Math.PI / 2 + 0.5; ekr.position.set(0, 2.6, 0.4); g.add(ekr); ek.yaz('');
    const prob = new THREE.Group(); const sap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 6, 14), new THREE.MeshStandardMaterial({ color: '#111827' })); sap.position.y = 3; prob.add(sap); const uc = new THREE.Mesh(new THREE.SphereGeometry(0.45, 14, 10), K.M.camKenar); prob.add(uc); K.sc.add(prob);
    let kablo = null; const kabloM = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.5 });
    const yerles = (X2, Y2) => { prob.position.set(X(X2 + 4), Y(Y2 + 20), 0.6); if (kablo) { K.sc.remove(kablo); kablo.geometry.dispose(); } const a = g.position.clone().add(new THREE.Vector3(0, 2.4, -2.4)), b = prob.position.clone().add(new THREE.Vector3(0, 6, 0)); const o2 = a.clone().lerp(b, 0.5); o2.y = Math.max(a.y, b.y) + 6; kablo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, o2, b), 24, 0.18, 8), kabloM); K.sc.add(kablo); };
    g.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); K.sc.add(g); yerles(px, py);
    const grp = new THREE.Group(); // görünürlük için ortak kap
    const o = { px, py, set(s) { ek.yaz(String(s)); return o; }, move(a, b) { o.px = +a; o.py = +b; yerles(o.px, o.py); return o; } };
    o.glide = (a, b, ms = 900) => { const x0 = o.px, y0 = o.py; return LK.tween(ms, k => { const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; o.move(x0 + (a - x0) * e, y0 + (b - y0) * e - Math.sin(Math.PI * k) * 60); }); };
    const sg = new SahteG(g, o); const eskiSet = sg.setAttribute.bind(sg); sg.setAttribute = (k, v) => { eskiSet(k, v); if (k === 'opacity') { prob.visible = g.visible; if (kablo) kablo.visible = g.visible; } }; o.g = sg; return o; };
  S3.meter = (x, y, title = 'pH METRE', probeTo = [240, 470], col = '#4ade80') => olcer(x, y, title, col, probeTo[0], probeTo[1]);
  S3.probeMeter = (x, y, title = 'pH METRE', col = '#4ade80', px = 200, py = 500) => olcer(x, y, title, col, px, py);
  S3.burner = (cx, base = 524) => { const b = A.bek(X(cx), 0); b.position.y = Y(base); const o = { alev: [cx, base - 60], on(a) { b.yak(!!a); return o; } }; return sar(b, o); };
  S3.tripod = (cx, top = 396) => { const g = A.ucAyak(X(cx), 0, { yukseklik: Y(top) }); return sar(g, {}); };
  S3.wellPlate = (x, y, cols = 4, rows = 2, r = 13) => { const g = new THREE.Group(); const w = (cols * r * 2.6 + 8) * S_, d = rows * r * 2.6 * S_ + 2; g.position.set(X(x - 8 + (cols * r * 2.6 + 8) / 2), 0, 2);
    const plaka = new THREE.Mesh(new THREE.BoxGeometry(w, 1.2, d), new THREE.MeshPhysicalMaterial({ color: '#f8fafc', roughness: 0.2, clearcoat: 0.8, transparent: true, opacity: 0.95 })); plaka.position.y = 0.6; g.add(plaka);
    const W2 = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const kx = -w / 2 + (8 + r + i * r * 2.6) * S_ - 0.3, kz = -d / 2 + 1 + (r + j * r * 2.6) * S_; const rr = r * S_ * 0.85;
      const kuyu = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.1, 24), new THREE.MeshStandardMaterial({ color: '#e2e8f0' })); kuyu.position.set(kx, 1.21, kz); g.add(kuyu);
      const sM = new THREE.MeshPhysicalMaterial({ color: '#cfe2f6', transparent: true, opacity: 0.85, clearcoat: 1 }); const s = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.9, rr * 0.9, 0.12, 24), sM); s.position.set(kx, 1.27, kz); s.visible = false; g.add(s);
      const pM = new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.9 }); const p = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.6, rr * 0.6, 0.14, 20), pM); p.position.set(kx, 1.3, kz); p.visible = false; g.add(p);
      let gaz = 0; K.tick(() => { if (gaz > 0 && s.visible && Math.random() < gaz) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.08 + Math.random() * 0.1, 8, 6), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0.85 })); b.position.set(kx + (Math.random() - 0.5) * rr, 1.36, kz + (Math.random() - 0.5) * rr); g.add(b); setTimeout(() => g.remove(b), 450); } });
      W2.push({ cx: x + r + i * r * 2.6, cy: y + r + j * r * 2.6, set(c, f) { const q = rgbaAyir(c); if (q) sM.color.copy(q.c); s.visible = (+f || 0) > 0.02; s.scale.set(Math.sqrt(+f || 0), 1, Math.sqrt(+f || 0)); }, ppt(c, f) { const q = rgbaAyir(c); if (q) pM.color.copy(q.c); p.visible = (+f || 0) > 0.02; p.scale.set(Math.sqrt(+f || 0), 1, Math.sqrt(+f || 0)); }, bubbles(v) { gaz = +v || 0; } }); }
    g.traverse(m => { if (m.isMesh) m.receiveShadow = true; }); plaka.castShadow = true; K.sc.add(g); return sar(g, { W: W2 }); };
  // --- yazı (etiket) ---
  S3.txt = (g, x, y, s, size = 8, o = {}) => {
    if (g && g.__3d) { const e = K.etiket(String(s), Math.max(0.9, size * 0.13)); const yer = new THREE.Vector3(X(x), Y(y), 1.5); g.grup.worldToLocal(yer); e.position.copy(yer); g.grup.add(e);
      const t = { __3d: true, e, setAttribute(k, v) { if (k === 'opacity') e.visible = +v > 0.3; }, getAttribute() { return null; }, remove() { g.grup.remove(e); } };
      Object.defineProperty(t, 'textContent', { get: () => s, set: v => { s = v; e.yaz(String(v)); } }); t.g = t; return t; }
    return S2.txt(g || S2.layer, x, y, s, size, o); };
  // --- damla / akış / köpük / parça ---
  S3.drop = (x, y, yEnd, color = 'rgba(80,140,225,.9)') => { const p = rgbaAyir(color); K.damla(new THREE.Vector3(X(x), Y(y), 0), Y(yEnd), p ? hex(p.c) : '#9cc3ec'); };
  S3.stream = (x, y) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 10), new THREE.MeshPhysicalMaterial({ color: '#9cc3ec', transparent: true, opacity: 0.75, clearcoat: 1, depthWrite: false })); m.visible = false; K.sc.add(m);
    return { set(h, c) { h = +h || 0; m.visible = h > 0.5; const L = h * S_; m.scale.y = Math.max(0.01, L); m.position.set(X(x), Y(y) - L / 2, 0); if (c) { const q = rgbaAyir(c); if (q) m.material.color.copy(q.c); } } }; };
  function kopuk3(x, y, r, hMax, renk) { const g = new THREE.Group(); g.position.set(x, y, 0); K.sc.add(g); const n = 90, kb = [], mt = new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.4, clearcoat: 0.5 });
    for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), mt); m.userData = { a: Math.random() * 6.28, d: Math.sqrt(Math.random()), h: Math.random(), s: 0.25 + Math.random() * 0.45 }; m.visible = false; g.add(m); kb.push(m); }
    const o = { oran: 0, set(f) { kb.forEach(m => { const u = m.userData; const yy = u.h * hMax * f; m.visible = f > 0.01; const yay = r * (0.6 + yy / Math.max(1, hMax) * 0.5); m.position.set(Math.cos(u.a) * u.d * yay, yy, Math.sin(u.a) * u.d * yay); const sc = u.s * Math.min(1, f * 4); m.scale.set(sc, sc, sc); }); }, temizle() { o.set(0); } };
    K.tick(() => { if (o.oran > 0) { o._f = Math.min(1, (o._f || 0) + o.oran * 0.004); o.set(o._f); } }); return o; }
  S3.foam = (cx, yMouth, w = 30, hMax = 200, color = 'rgba(255,255,255,.95)') => { const p = rgbaAyir(color); const f = kopuk3(X(cx), Y(yMouth), w * S_ * 0.6, hMax * S_, p ? p.c : '#fff'); const o = { set(v) { f.set(+v || 0); return o; } }; return sar(new THREE.Group(), o); };
  S3.pieces = (V, n, color = '#9ca3af', kind = 'parca') => {
    if (!V || !V.__3d || !V.V) return S2.pieces(V, n, color, kind);
    const q = rgbaAyir(color); const mt = new THREE.MeshStandardMaterial({ color: q ? q.c : '#9ca3af', roughness: kind === 'folyo' ? 0.3 : 0.7, metalness: kind === 'folyo' ? 0.7 : 0.1 }); const L = []; const rr = V.V.ic(0.3) - 0.3;
    for (let i = 0; i < n; i++) { const geo = kind === 'toz' ? new THREE.SphereGeometry(0.12, 6, 5) : kind === 'folyo' ? new THREE.BoxGeometry(0.5, 0.05, 0.4) : new THREE.DodecahedronGeometry(0.28); const m = new THREE.Mesh(geo, mt); const a = (i * 2.399) % 6.283, d = Math.sqrt(((i * 37) % 100) / 100) * rr; m.position.set(Math.cos(a) * d, 0.3 + ((i * 53) % 9) * 0.02, Math.sin(a) * d); m.rotation.set(i, i * 2, i * 3); m.castShadow = true; V.V.g.add(m); L.push(m); }
    return { L, g: new SahteG(new THREE.Group(), {}), shrink(f) { f = Math.max(0, Math.min(1, +f || 0)); L.forEach(m => { const s = Math.max(0.001, 1 - f); m.scale.set(s, s, s); m.visible = s > 0.02; }); } }; };
  S3.pour = (from, to, ms, vol) => { const v0 = from.vol, t0 = to.vol; return LK.tween(ms, k => { from.set(v0 - vol * k); to.set(t0 + vol * k); }); };
  // S2'deki diğer her şey (yedek: 2B panoya çizilir)
  for (const k of Object.keys(S2)) if (!(k in S3) && typeof S2[k] === 'function') S3[k] = (...a) => S2[k](...a);
  // Atölye kataloğu (S.A.*): 3B karşılığı olanlar 3B, diğerleri 2B panoya
  S3.A = new Proxy({}, { get: (_, ad) => A3[ad] || (S2.A && S2.A[ad] ? (...a) => S2.A[ad](...a) : undefined) });
  const A3 = {}; // Deney Atölyesi aletlerinin 3B karşılıkları (atölye koordinatı: x merkez, y taban)
  A3.beher = (x, y, o = {}) => S3.beaker(x, y, 90 * (o.boyut || 1), 110 * (o.boyut || 1), o.hacim || 250, o.ad);
  A3.erlen = (x, y, o = {}) => S3.erlen(x, y, o.hacim || 250, o.boyut || 1, o.ad);
  A3.tup = (x, y, o = {}) => S3.tube(x, y, 150, o.hacim || 20, o.ad);
  A3.mezur = (x, y, o = {}) => S3.cylinder(x, y, o.hacim || 100, 190);
  A3.termometre = (x, y) => S3.thermo(x, y - 230, 220);
  A3.kronometre = (x, y) => S3.stopwatch(x, y);
  A3.terazi = (x, y) => S3.balance(x, y);

  LK.T.abort = false; const M = DO.kur(S3, D);
  const eskiYok = K.yok; K.yok = () => { svg2.remove(); eskiYok(); };
  return { M, S3, S2 };
}
