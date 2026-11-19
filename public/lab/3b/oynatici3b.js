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
  const olcSay = {}; const olcKayit = (tur, ad, birim) => { olcSay[tur] = (olcSay[tur] || 0) + 1; const id = tur + olcSay[tur]; const isim = (olcSay[tur] > 1 ? ad + ' ' + olcSay[tur] : ad).replace(/^ph\b/i, 'pH'); if (olcSay[tur] === 2) document.dispatchEvent(new CustomEvent('lab-olcum-ad', { detail: { id: tur + '1', ad: ad + ' 1' } }));
    return v => document.dispatchEvent(new CustomEvent('lab-olcum', { detail: { id, ad: isim, birim, v } })); };
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
    const bil = olcKayit('sic', 'Sıcaklık', '°C'); const o = { set(t) { T.set(+t); bil((+t).toFixed(1).replace('.', ',')); return o; } }; return sar(T.g, o); };
  S3.heater = (cx, base = 524, w = 120) => { const g = new THREE.Group(); g.position.set(X(cx), Y(base), 0); const gov = new THREE.Mesh(new THREE.BoxGeometry(w * S_, 30 * S_, 10), new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.4 })); gov.position.y = 15 * S_; g.add(gov);
    const plM = new THREE.MeshStandardMaterial({ color: '#6b7280', roughness: 0.5, emissive: '#ff3b0a', emissiveIntensity: 0 }); const pl = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(w * S_ / 2 - 0.6, 4.6), Math.min(w * S_ / 2 - 0.6, 4.6), 0.5, 40), plM); pl.position.y = 30 * S_ + 0.25; g.add(pl);
    const ledM = new THREE.MeshStandardMaterial({ color: '#9ca3af', emissive: '#ef4444', emissiveIntensity: 0 }); const led = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), ledM); led.position.set(-w * S_ / 2 + 1.3, 15 * S_, 5.02); g.add(led);
    const dug = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 20), K.M.gri); dug.rotation.x = Math.PI / 2; dug.position.set(w * S_ / 2 - 1.3, 15 * S_, 5.1); g.add(dug);
    g.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; }); K.sc.add(g);
    const o = { top: base - 36, on(f) { f = +f || 0; plM.emissiveIntensity = f * 1.4; plM.color.set(f > 0 ? '#7f1d1d' : '#6b7280'); ledM.emissiveIntensity = f > 0 ? 2 : 0; return o; } }; return sar(g, o); };
  S3.stopwatch = (x, y) => { const k = A.kronometre(X(x), -9); const bil = olcKayit('sure', 'Süre', 's'); const o = { set(s) { k.set(+s || 0); bil((+s || 0).toFixed(1).replace('.', ',')); return o; } }; return sar(k.g, o); };
  S3.balance = (cx, base = 524) => { const t = A.terazi(X(cx), 0); t.g.position.y = Y(base); const bil = olcKayit('kutle', 'Kütle', ''); const o = { top: base - 44, set(s) { const v = parseFloat(String(s).replace(',', '.')); if (!isNaN(v)) t.set(v); bil(String(s)); return o; } }; return sar(t.g, o); };
  S3.stand = (x = 101, clampY = 240, armTo = 190) => { const g = A.spor(X(x), -3, { yukseklik: Y(26), kolY: Y(clampY), kolBoy: Math.max(2, (armTo - x + 20) * S_), tabanX: -4 }); return sar(g, {}); };
  S3.burette = (cx = 200, top = 38, len = 270, cap = 50) => { const B = A.buret(X(cx), 0, { hacim: cap, y0: Y(top + len) + 1, etiket: '', boy: len * S_ });
    const o = { used: 0, cap, tip: [cx, top + len + 46], open(a) { B.ac(!!+a); return o; }, set(u) { o.used = +u || 0; B.set(cap - o.used); return o; } }; o.set(0); return sar(B.g, o); };
  S3.dropBottle = (cx, base = 452, name = 'İNDİKATÖR', color) => { const g = A.damlalikSise(X(cx), 0, { etiket: name, renk: color ? hex(rgbaAyir(color).c) : '#a16207' }); g.position.y = Y(base); const sg = new SahteG(g, {}); sg.g = sg; Object.assign(sg, { mouth: [cx, base - 100], uc: [cx, base - 100], color }); return sg; };
  S3.bottle = (cx, base = 520, name = 'HCl', color) => { const g = A.sise(X(cx), 0, { etiket: name, renk: '#d9e7f5' }); g.position.y = Y(base); const sg = new SahteG(g, {}); sg.g = sg; sg.mouth = [cx, base - 100]; return sg; };
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
    const bil = olcKayit('olc_' + title, title.charAt(0) + title.slice(1).toLocaleLowerCase('tr'), ''); const o = { px, py, set(s) { ek.yaz(String(s)); bil(String(s)); return o; }, move(a, b) { o.px = +a; o.py = +b; yerles(o.px, o.py); return o; } };
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
  const A3 = {}; // Deney Atölyesi aletlerinin (aletler.js) 3B karşılıkları; 2B koordinat ve yöntem adları aynen korunur
  const p3 = pt => new THREE.Vector3(X(pt[0]), Y(pt[1]), 0.6);
  const grupKur = (x, y) => { const g = new THREE.Group(); g.position.set(X(x), Y(y), 0); K.sc.add(g); return g; };
  const golgele = g => { g.traverse(m => { if (m.isMesh && m.material !== K.M.cam && m.material !== K.M.camKenar) { m.castShadow = m.receiveShadow = true; } }); return g; };
  const etk = (g, metin, y, boy = 1.1) => { if (!metin) return; const e = K.etiket(String(metin), boy); e.position.set(0, y, 0); g.add(e); };
  // küre gövdeli kaplar
  const kureKap = (x, y, r2, boyunH, cap, ad, duz) => { const R = r2 * S_, bn = 8 * S_, bh = boyunH * S_; const prof = [[0, 0]];
    for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + Math.PI * 0.92 * i / 16; prof.push([Math.max(0.02, R * Math.cos(a)), R + R * Math.sin(a)]); } prof.push([bn, 2 * R + 0.3], [bn, 2 * R + bh], [bn + 0.15, 2 * R + bh + 0.2]);
    if (duz) prof.splice(1, 3, [R * 0.55, 0], [R * 0.75, 0.15]);
    const ic = yy => (yy < 2 * R - 0.2 ? Math.max(0.1, Math.sqrt(Math.max(0, R * R - (yy - R) ** 2)) - 0.08) : bn - 0.05);
    const o = kap3(prof, ic, { cx: x, base: y, x0: x - r2, x1: x + r2, ybot: y - 1, ytop: y - 2 * r2 - boyunH * 0.6, cap, H: 2 * R + bh, shape: f => Math.min(1, f * 0.9) });
    o.mouth = [x, y - 2 * r2 - boyunH]; etk(o.V.g, ad, -1.2); return o; };
  A3.balonJoje = (x, y = 520, o = {}) => { const k = kureKap(x, y, 34, 120, o.cap || 100, o.ad, true); const c = new THREE.Mesh(new THREE.TorusGeometry(8 * S_ + 0.02, 0.03, 6, 32), K.M.koyu); c.rotation.x = Math.PI / 2; c.position.y = 68 * S_ + 60 * S_; k.V.g.add(c); return k; };
  A3.yuvarlakBalon = (x, y = 470, o = {}) => kureKap(x, y, o.r || 36, 50, o.cap || 250, o.ad, false);
  const canak = (x, y, w, h, cap, ad, mat) => { const R = w * S_, H = h * S_; const prof = []; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 * i / 10; prof.push([Math.max(0.01, R * Math.sin(a)), H - H * Math.cos(a)]); }
    const ic = yy => Math.max(0.1, R * Math.sin(Math.acos(Math.max(-1, Math.min(1, 1 - yy / H)))) - 0.08);
    const o = kap3(prof, ic, { cx: x, base: y, x0: x - w, x1: x + w, ybot: y - 1, ytop: y - h + 3, cap, H });
    if (mat) o.V.g.children.forEach(c => { if (c.material === K.M.cam) c.material = mat; }); etk(o.V.g, ad, -1.1); return o; };
  A3.kapsul = (x, y = 520, o = {}) => canak(x, y, o.w || 40, 24, o.cap || 30, o.ad, (() => { const m = K.M.porselen.clone(); m.side = THREE.DoubleSide; return m; })());
  A3.saatCami = (x, y = 520, o = {}) => { const k = canak(x, y, o.w || 46, 12, 5, o.ad); k.koy = (r, c) => { k.set(Math.min(5, (+r || 0) / 4), c); }; return k; };
  A3.petri = (x, y = 520, o = {}) => { const R = (o.w || 50) * S_; const prof = [[0, 0], [R - 0.1, 0], [R, 0.1], [R, 1.2]]; const k = kap3(prof, () => R - 0.05, { cx: x, base: y, x0: x - (o.w || 50), x1: x + (o.w || 50), ybot: y - 1, ytop: y - 14, cap: o.cap || 20, H: 1.2 }); etk(k.V.g, o.ad, -1.1); return k; };
  A3.huni = (x, y = 380, o = {}) => { const w = o.w || 40; const prof = [[0.3, 0], [0.3, 4], [w * S_, 4 + 50 * S_ * 0.9], [w * S_ + 0.15, 4 + 50 * S_]];
    const k = kap3(prof, yy => (yy < 4 ? 0.25 : 0.25 + (yy - 4) / (50 * S_ * 0.9) * (w * S_ - 0.3)), { cx: x, base: y + 50, x0: x - w, x1: x + w, ybot: y, ytop: y - 46, cap: o.cap || 50, H: 4 + 50 * S_ }); k.mouth = [x, y - 50]; return k; };
  A3.pipet = (x, y = 470, o = {}) => { const h = o.h || 230, R = 3.2 * S_ * 1.6; const prof = [[0.05, 0], [R, 1.2], [R, h * S_ - 0.2], [R + 0.05, h * S_]];
    const k = kap3(prof, yy => (yy < 1.2 ? 0.05 + yy / 1.2 * (R - 0.1) : R - 0.04), { cx: x, base: y, x0: x - 3, x1: x + 3, ybot: y - 18, ytop: y - h + 30, cap: o.cap || 10, H: h * S_ }); k.tip = [x, y]; k.mouth = [x, y - h]; return k; };
  A3.damlalik = (x, y = 420, o = {}) => { const g = grupKur(x, y); const boru = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.08, 70 * S_, 16, 1, true), K.M.cam); boru.position.y = 35 * S_; boru.renderOrder = 3; g.add(boru);
    const sM = new THREE.MeshPhysicalMaterial({ color: '#cfe2f6', transparent: true, opacity: 0.8, depthWrite: false }); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.1, 1, 12), sM); s.renderOrder = 1; g.add(s);
    const puar = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 12), K.M.kirmizi); puar.scale.y = 1.6; puar.position.y = 70 * S_ + 0.8; g.add(puar); golgele(g);
    const o2 = { tip: [x, y], color: o.renk, set(f, c) { f = Math.max(0, Math.min(1, +f || 0)); const h = Math.max(0.01, f * 40 * S_); s.scale.y = h; s.position.y = 14 * S_ + h / 2; s.visible = f > 0.01; if (c) { o2.color = c; const q = rgbaAyir(c); if (q) sM.color.copy(q.c); } return o2; } }; o2.set(0.6, o.renk); return sar(g, o2); };
  A3.baget = (x, y = 470, o = {}) => { const h = o.h || 170, a = o.aci || 0; const g = grupKur(x, y); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, h * S_, 12), K.M.camKenar); m.position.y = h * S_ / 2; m.renderOrder = 3; g.add(m); g.rotation.z = -a;
    let k = 0; K.tick(() => { if (k) { g.rotation.z = -a + Math.sin(K.zaman * 8) * 0.12; g.rotation.x = Math.cos(K.zaman * 8) * 0.12; } }); return sar(g, { karistir(on) { k = on ? 1 : 0; if (!k) { g.rotation.z = -a; g.rotation.x = 0; } } }); };
  A3.ispirto = (x, y = 524) => { const g = grupKur(x, y); const gov = new THREE.Mesh(new THREE.SphereGeometry(2.6, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), K.M.cam); gov.rotation.x = Math.PI; gov.position.y = 2.6 * 0.95; gov.renderOrder = 3; g.add(gov);
    const sM = new THREE.MeshPhysicalMaterial({ color: '#dbeafe', transparent: true, opacity: 0.6, depthWrite: false }); const s = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 14, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45), sM); s.position.y = 2.5; g.add(s);
    const fitil = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 1, 14), K.M.metal); fitil.position.y = 3.4; g.add(fitil);
    const alM = new THREE.MeshBasicMaterial({ color: '#f59e0b', transparent: true, opacity: 0.8, depthWrite: false }); const alev = new THREE.Mesh(new THREE.ConeGeometry(0.55, 3, 16, 1, true), alM); alev.position.y = 5.4; alev.visible = false; g.add(alev);
    const isik = new THREE.PointLight('#ffb547', 0, 25); isik.position.y = 6; g.add(isik); K.tick(() => { if (alev.visible) alev.scale.set(1, 1 + Math.sin(K.zaman * 25) * 0.08, 1); }); golgele(g);
    return sar(g, { alev: [x, y - 80], on(v) { alev.visible = !!v; isik.intensity = v ? 30 : 0; } }); };
  A3.isiticiTabla = (x, y = 524, o = {}) => { const h = S3.heater(x, y, o.w || 110); const ek = K.ekran(200, 80, (c, w2, h2, v) => { c.fillStyle = '#0b1f14'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#4ade80'; c.font = '800 46px "Courier New",monospace'; c.textAlign = 'center'; c.fillText(v, w2 / 2, 56); }); ek.yaz('');
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.05), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.position.set(0, 15 * S_, 5.03); h.g.grup.add(ekr);
    const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1, 4, 8), new THREE.MeshStandardMaterial({ color: '#f8fafc' })); bar.rotation.z = Math.PI / 2; bar.visible = false; K.sc.add(bar); let dn = 0;
    K.tick(() => { if (dn) bar.rotation.y += 0.25; });
    const eskiOn = h.on; return Object.assign(h, { ust: y - 40, on(v) { eskiOn(v ? 1 : 0); ek.yaz(v ? (typeof v === 'number' ? v + '°C' : 'ON') : ''); return h; }, karistir(v, yb) { dn = v ? 1 : 0; bar.visible = !!v; bar.position.set(X(x), Y(yb || y - 46) + 0.3, 0); } }); };
  A3.pil = (x, y = 520, o = {}) => { const g = grupKur(x, y); const yat = o.yatay !== false; const gov = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 5.4, 24), new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.4 })); const bant = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 2, 24), new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.4 }));
    const uc = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 12), K.M.metal); if (yat) { [gov, bant].forEach(m => { m.rotation.z = Math.PI / 2; m.position.y = 1.1; }); bant.position.x = -1.2; uc.rotation.z = Math.PI / 2; uc.position.set(-2.9, 1.1, 0); } else { gov.position.y = 2.7; bant.position.y = 3.8; uc.position.y = 5.6; }
    g.add(gov, bant, uc); etk(g, o.v || '1,5 V', yat ? 3.2 : 7.6, 1.0); golgele(g); return sar(g, { arti: [x - 8, y - 88], eksi: [x + 8, y - 88] }); };
  A3.gucKaynagi = (x, y = 524, o = {}) => { const g = grupKur(x, y); const gov = new THREE.Mesh(new THREE.BoxGeometry(140 * S_, 80 * S_, 8), new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.4 })); gov.position.y = 40 * S_; g.add(gov);
    const ek = K.ekran(240, 90, (c, w2, h2, v) => { c.fillStyle = '#0b1f14'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#4ade80'; c.font = '800 54px "Courier New",monospace'; c.textAlign = 'center'; c.fillText(v, w2 / 2, 64); }); ek.yaz('');
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.65), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.position.set(0, 56 * S_, 4.02); g.add(ekr);
    [[-40, '#dc2626'], [40, '#111827']].forEach(([dx, c]) => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.8, 16), new THREE.MeshStandardMaterial({ color: c })); k.rotation.x = Math.PI / 2; k.position.set(dx * S_, 18 * S_, 4.3); g.add(k); });
    golgele(g); return sar(g, { arti: [x - 40, y - 18], eksi: [x + 40, y - 18], set(V) { ek.yaz(V ? (+V).toFixed(1) + ' V' : ''); } }); };
  const olcum = (ad, birim) => (x, y = 300, o = {}) => { const g = grupKur(x, y); const gov = new THREE.Mesh(new THREE.BoxGeometry(96 * S_, 66 * S_, 3), new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.5 })); gov.position.y = 33 * S_; g.add(gov);
    const ek = K.ekran(260, 110, (c, w2, h2, v) => { c.fillStyle = '#1f2937'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#e5e7eb'; c.font = '800 56px "Courier New",monospace'; c.textAlign = 'center'; c.fillText(v === '' ? '— ' + birim : v + ' ' + birim, w2 / 2, 62); c.font = '700 20px Nunito,sans-serif'; c.fillText(o.ad || ad, w2 / 2, 98); }); ek.yaz('');
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 2.7), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.position.set(0, 42 * S_, 1.52); g.add(ekr); golgele(g);
    return sar(g, { arti: [x - 20, y + 6], eksi: [x + 20, y + 6], set(v) { ek.yaz(v == null ? '' : String(v)); } }); };
  A3.voltmetre = olcum('VOLTMETRE', 'V'); A3.ampermetre = olcum('AMPERMETRE', 'A'); A3.multimetre = olcum('MULTİMETRE', '');
  A3.ampul = (x, y = 300) => { const g = grupKur(x, y); const duy = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 1.6, 18), K.M.gri); duy.position.y = 0.8; g.add(duy);
    const cM = new THREE.MeshPhysicalMaterial({ color: '#fffbe6', transparent: true, opacity: 0.35, roughness: 0.05, clearcoat: 1, emissive: '#fde047', emissiveIntensity: 0 }); const cam = new THREE.Mesh(new THREE.SphereGeometry(1.75, 24, 18), cM); cam.position.y = 2.4 + 0.4; g.add(cam);
    const isik = new THREE.PointLight('#fde68a', 0, 35); isik.position.y = 2.8; g.add(isik); golgele(g);
    return sar(g, { u1: [x - 8, y + 6], u2: [x + 8, y + 6], uclar: [[x - 8, y + 6], [x + 8, y + 6]], yak(f) { f = +f || 0; cM.emissiveIntensity = 2.4 * f; cM.opacity = 0.35 + 0.5 * f; isik.intensity = 55 * f; } }); };
  A3.led = (x, y = 300, o = {}) => { const g = grupKur(x, y); const c = new THREE.Color(o.renk || '#ef4444'); const mM = new THREE.MeshPhysicalMaterial({ color: c, transparent: true, opacity: 0.75, emissive: c, emissiveIntensity: 0, clearcoat: 1 });
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 0.9, 6, 14), mM); b.position.y = 1.6; g.add(b); [-0.25, 0.25].forEach(dx => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), K.M.metal); l.position.set(dx, 0.5, 0); g.add(l); });
    const isik = new THREE.PointLight(c, 0, 18); isik.position.y = 1.8; g.add(isik); return sar(g, { u1: [x - 4, y + 14], u2: [x + 4, y + 10], uclar: [[x - 4, y + 14], [x + 4, y + 10]], yak(v) { mM.emissiveIntensity = v ? 3 : 0; isik.intensity = v ? 20 : 0; } }); };
  A3.anahtar = (x, y = 520) => { const g = grupKur(x, y); const ah = new THREE.Mesh(new THREE.BoxGeometry(80 * S_, 1, 3), new THREE.MeshStandardMaterial({ color: '#7c5a3a', roughness: 0.6 })); ah.position.y = 0.5; g.add(ah);
    const mil = new THREE.Group(); mil.position.set(-26 * S_, 1.2, 0); const kol = new THREE.Mesh(new THREE.BoxGeometry(52 * S_, 0.18, 0.5), K.M.bakir); kol.position.x = 26 * S_; mil.add(kol); g.add(mil); mil.rotation.z = 0.6;
    [-26, 26].forEach(dx => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.4, 12), K.M.metal); k.position.set(dx * S_, 1.15, 0); g.add(k); }); golgele(g);
    return sar(g, { u1: [x - 26, y - 14], u2: [x + 26, y - 14], uclar: [[x - 26, y - 14], [x + 26, y - 14]], kapat(v) { mil.rotation.z = v ? 0 : 0.6; } }); };
  A3.elektrot = (x, ust = 260, o = {}) => { const tur = o.tur || 'Cu', h = o.h || 170, w = o.w || 16; const renkler = { Cu: '#c46d3b', Zn: '#a1a1aa', C: '#27272a', Fe: '#6b7280', Ag: '#e5e7eb', Pt: '#d4d4d8', Pb: '#64748b', Mg: '#d4d4d8', Al: '#cbd5e1', Ni: '#a8a29e' };
    const g = grupKur(x, ust + h); const mM = new THREE.MeshStandardMaterial({ color: renkler[tur] || '#9ca3af', metalness: tur === 'C' ? 0 : 0.85, roughness: tur === 'C' ? 0.8 : 0.3 });
    const lev = new THREE.Mesh(new THREE.BoxGeometry(w * S_, h * S_, 0.3), mM); lev.position.y = h * S_ / 2; g.add(lev); const kM = new THREE.MeshStandardMaterial({ color: '#c46d3b', metalness: 0.7, roughness: 0.3 }); const kap = new THREE.Mesh(new THREE.BoxGeometry(w * S_, 0.01, 0.32), kM); kap.position.y = h * S_ / 2; kap.visible = false; g.add(kap);
    etk(g, o.ad || tur, h * S_ + 1.6, 1.0); golgele(g);
    return sar(g, { bag: [x, ust - 14], kapla(mm, renk) { const k = Math.max(0, +mm || 0) * S_; kap.visible = k > 0; kap.scale.set(1 + 2 * k / (w * S_), h * S_ * 100, 1 + k * 6); if (renk) { const q = rgbaAyir(renk); if (q) kM.color.copy(q.c); } }, asin(f) { lev.scale.x = Math.max(0.25, 1 - (+f || 0)); } }); };
  A3.kablo = (p1, p2, o = {}) => { if (!p1 || !p2) return null; const a = p3(p1), b = p3(p2); const sag = (o.sarkma == null ? 40 : +o.sarkma) * S_; const orta = a.clone().lerp(b, 0.5); orta.y = Math.max(0.4, Math.min(a.y, b.y) - sag); orta.z = 2.5;
    const egri = new THREE.CatmullRomCurve3([a, a.clone().lerp(orta, 0.55).setZ(1.6), orta, b.clone().lerp(orta, 0.55).setZ(1.6), b]); const g = new THREE.Group(); K.sc.add(g);
    const m = new THREE.Mesh(new THREE.TubeGeometry(egri, 48, 0.22, 8), new THREE.MeshStandardMaterial({ color: o.renk || '#dc2626', roughness: 0.5 })); m.castShadow = true; g.add(m);
    const nok = []; for (let i = 0; i < 8; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshBasicMaterial({ color: '#fde047' })); d.visible = false; g.add(d); nok.push(d); } let hiz = 0, u = 0;
    K.tick(dt => { if (!hiz) return; u = (u + dt * 0.25 * hiz) % 1; nok.forEach((d, i) => { d.visible = true; d.position.copy(egri.getPointAt((u + i / nok.length) % 1)); }); });
    return sar(g, { elektron(v) { hiz = +v || 0; if (!hiz) nok.forEach(d => d.visible = false); } }); };
  // --- silindir ve geniş kaplar ---
  const silindirKap = (x, y, w, h, cap, ad, ops = {}) => { const R = w * S_, H = h * S_; const prof = [[0, 0], [R - 0.3, 0], [R, 0.3], [R, H - 0.1], [R + (ops.dudak || 0.2), H]];
    const k = kap3(prof, () => R - 0.05, { cx: x, base: y, x0: x - w, x1: x + w, ybot: y - 2, ytop: y - h + 6, cap, H }); if (ops.mat) k.V.g.children.forEach(c => { if (c.material === K.M.cam) c.material = ops.mat; }); etk(k.V.g, ad, -1.1); return k; };
  A3.kristalizuar = (x, y = 520, o = {}) => silindirKap(x, y, o.w || 60, 40, o.cap || 150, o.ad);
  A3.suBanyosu = (x, y = 524, o = {}) => { const k = silindirKap(x, y, o.w || 75, 70, 400, o.ad || 'su banyosu', { mat: new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.6, roughness: 0.35, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }) }); k.set(280, 'rgba(160,200,240,.6)'); return k; };
  A3.buzBanyosu = (x, y = 520, o = {}) => { const k = silindirKap(x, y, o.w || 70, 60, 300, o.ad || 'buz banyosu'); k.set(200, 'rgba(200,225,250,.6)');
    for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), new THREE.MeshPhysicalMaterial({ color: '#f0f9ff', transparent: true, opacity: 0.75, roughness: 0.1, clearcoat: 1 })); const a = i * 2.4, r = Math.sqrt((i % 7) / 7) * (o.w || 70) * S_ * 0.8; b.position.set(Math.cos(a) * r, 200 / 300 * 60 * S_ * 0.85 + (i % 3) * 0.2, Math.sin(a) * r); b.rotation.set(i, i * 1.3, i * 0.7); k.V.g.add(b); } return k; };
  A3.kalorimetre = (x, y = 524, o = {}) => { const k = silindirKap(x, y, o.w || 46, 110, o.cap || 200, o.ad || 'kalorimetre', { mat: new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.4, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }) });
    const kap = new THREE.Mesh(new THREE.CylinderGeometry((o.w || 46) * S_ + 0.25, (o.w || 46) * S_ + 0.25, 0.6, 32), K.M.koyu); kap.position.y = 110 * S_ + 0.3; k.V.g.add(kap); return k; };
  A3.bombaKalorimetre = A3.kalorimetre;
  A3.gozenekliKap = (x, y = 520, o = {}) => silindirKap(x, y, o.w || 26, 120, o.cap || 80, o.ad, { mat: new THREE.MeshStandardMaterial({ color: '#d6c2a8', roughness: 0.95, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }) });
  A3.kuvet = (x, y = 520, o = {}) => { const w = 14, h = 50; const g = grupKur(x, y); const kut = new THREE.Mesh(new THREE.BoxGeometry(w * S_ * 2, h * S_, w * S_ * 2), K.M.cam); kut.position.y = h * S_ / 2; kut.renderOrder = 3; g.add(kut);
    const sM = new THREE.MeshPhysicalMaterial({ color: '#cfe2f6', transparent: true, opacity: 0.75, depthWrite: false }); const s = new THREE.Mesh(new THREE.BoxGeometry(w * S_ * 1.9, 1, w * S_ * 1.9), sM); s.renderOrder = 1; g.add(s); const cap = o.cap || 3;
    const V = { vol: 0, cap, color: 'rgba(196,226,255,.82)', mouth: [x, y - h], x0: x - w, x1: x + w, ybot: y - 1, ytop: y - h + 4, level: v => y - 1 - (h - 5) * Math.min(1, v / cap), set(v, c) { V.vol = +v || 0; const hh = Math.max(0.01, (h - 5) * S_ * Math.min(1, V.vol / cap)); s.scale.y = hh; s.position.y = hh / 2 + 0.05; s.visible = V.vol > 0; if (c) { V.color = c; const q = rgbaAyir(c); if (q) sM.color.copy(q.c); } return V; }, bubbles() { }, cloudy() { }, ppt() { } }; return sar(g, V); };
  A3.piset = (x, y = 520, o = {}) => { const k = silindirKap(x, y, 26, 120, 250, o.ad || 'SAF SU', { mat: new THREE.MeshPhysicalMaterial({ color: '#f8fafc', roughness: 0.3, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }) }); k.set(170);
    const kapak = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 1, 16), new THREE.MeshStandardMaterial({ color: '#dc2626' })); kapak.position.y = 120 * S_ + 0.5; k.V.g.add(kapak);
    const bo = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 120 * S_ + 1, 0), new THREE.Vector3(0.3, 120 * S_ + 3, 0), new THREE.Vector3(2.2, 120 * S_ + 3.4, 0), new THREE.Vector3(3, 120 * S_ + 2.4, 0)]), 16, 0.12, 6), K.M.camKenar); k.V.g.add(bo); k.tip = [x + 38, y - 150]; return k; };
  A3.nuce = (x, y = 524, o = {}) => { const k = S3.erlen(x, y, o.cap || 250, o.olcek || 1, o.ad); const yan = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.4, 12), K.M.camKenar); yan.rotation.z = Math.PI / 2.4; const s = o.olcek || 1; yan.position.set(15 * s * S_ + 1, 120 * s * S_ - 2, 0); k.V.g.add(yan); k.cikis = [x + 40, y - 95]; return k; };
  A3.ayirmaHunisi = (x, y = 360, o = {}) => { const prof = [[0.25, 0], [0.25, 3], [2.4, 5.5], [3.2, 8.5], [2.2, 11.5], [0.8, 12.6], [0.85, 13.6], [1.0, 13.8]]; const ic = yy => (yy < 3 ? 0.2 : yy < 8.5 ? K.lerp(0.25, 3.1, (yy - 3) / 5.5) : K.lerp(3.1, 0.8, (yy - 8.5) / 4));
    const k = kap3(prof, ic, { cx: x, base: y + 40, x0: x - 40, x1: x + 40, ybot: y + 2, ytop: y - 120, cap: o.cap || 250, H: 13.8 });
    const mus = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.4), K.M.mavi); mus.position.y = 2.2; k.V.g.add(mus);
    const altM = new THREE.MeshPhysicalMaterial({ color: '#3b82f6', transparent: true, opacity: 0.7, depthWrite: false }); let alt = null;
    k.katman = (mL, c) => { if (alt) { k.V.g.remove(alt); alt.geometry.dispose(); alt = null; } const q = rgbaAyir(c); if (q) altM.color.copy(q.c); const h = Math.max(0, k.V.ic ? 0 : 0); const yy = Math.min(13, 3 + (+mL || 0) / (o.cap || 250) * 9);
      const pts = []; for (let i = 0; i <= 12; i++) { const y2 = 3 + (yy - 3) * i / 12; pts.push(V2(Math.max(0.05, ic(y2) - 0.1), y2)); } alt = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), altM); alt.renderOrder = 2; k.V.g.add(alt); };
    k.tip = [x, y + 40]; return k; };
  const V2 = (a, b) => new THREE.Vector2(a, b);
  A3.tersTup = (x, y = 470, o = {}) => { const h = o.h || 150, R = 12 * S_, cap = o.cap || 50; const g = grupKur(x, y); const cam = new THREE.Mesh(new THREE.CylinderGeometry(R, R, h * S_, 28, 1, true), K.M.cam); cam.position.y = h * S_ / 2; cam.renderOrder = 3; g.add(cam);
    const kub = new THREE.Mesh(new THREE.SphereGeometry(R, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), K.M.cam); kub.position.y = h * S_; kub.renderOrder = 3; g.add(kub);
    const suM = new THREE.MeshPhysicalMaterial({ color: '#a9cdf2', transparent: true, opacity: 0.8, depthWrite: false }); const su = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.06, R - 0.06, 1, 24), suM); su.renderOrder = 1; g.add(su);
    const T = { cap, gaz(v) { const f = Math.max(0, Math.min(1, (+v || 0) / cap)); const hh = Math.max(0.01, h * S_ * (1 - f)); su.scale.y = hh; su.position.y = hh / 2; } }; T.gaz(0); return sar(g, T); };
  A3.kroze = (x, y = 520, o = {}) => { const g = grupKur(x, y); const m = new THREE.Mesh(new THREE.LatheGeometry([[0.01, 0], [1.6, 0], [2.3, 2.6], [2.4, 2.7]].map(p => V2(...p)), 32), (() => { const q = K.M.porselen.clone(); q.side = THREE.DoubleSide; return q; })()); g.add(m);
    const icM = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.9 }); const ic = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.5, 1, 28), icM); ic.visible = false; g.add(ic);
    const kap = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.25, 32), K.M.porselen); kap.position.y = 2.85; kap.visible = false; g.add(kap); golgele(g);
    return sar(g, { doldur(f, c) { f = Math.max(0, Math.min(1, +f || 0)); ic.visible = f > 0.02; ic.scale.y = Math.max(0.01, f * 2.2); ic.position.y = f * 1.1 + 0.05; const q = rgbaAyir(c); if (q) icM.color.copy(q.c); }, kapak(v) { kap.visible = !!v; } }); };
  A3.havan = (x, y = 520) => { const g = grupKur(x, y); const m = new THREE.Mesh(new THREE.LatheGeometry([[0.01, 0], [2.2, 0], [3.4, 1], [3.6, 3], [3.0, 3.2], [2.6, 1.2], [0.01, 0.9]].map(p => V2(...p)), 36), K.M.porselen); g.add(m);
    const el2 = new THREE.Group(); el2.position.set(0.6, 1.5, 0); const sap = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 6, 16), K.M.porselen); sap.position.y = 3; el2.add(sap); el2.rotation.z = -0.4; g.add(el2);
    const tM = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 1 }); const toz = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 24), tM); toz.position.y = 1.15; toz.visible = false; g.add(toz); let on = 0; K.tick(() => { if (on) el2.rotation.y += 0.15; }); golgele(g);
    return sar(g, { ez(v) { on = v ? 1 : 0; }, toz(r, c) { const s = Math.max(0, +r || 0) * S_; toz.visible = s > 0.05; toz.scale.set(s, 1, s); const q = rgbaAyir(c); if (q) tM.color.copy(q.c); } }); };
  A3.spatul = (x, y = 520, o = {}) => { const g = grupKur(x, y); const m = new THREE.Mesh(new THREE.BoxGeometry(124 * S_, 0.12, 0.6), K.M.metal); m.position.set(0, 0.4, 0); m.rotation.z = 0.05; g.add(m);
    const yM = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 1 }); const yk = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), yM); yk.position.set(62 * S_ - 0.4, 0.55, 0); yk.scale.set(0.01, 0.01, 0.01); g.add(yk); golgele(g);
    return sar(g, { uc: [x + 62, y - 6], yukle(r, c) { const s = Math.max(0.01, (+r || 0) * S_ * 0.8); yk.scale.set(s, s * 0.5, s); const q = rgbaAyir(c); if (q) yM.color.copy(q.c); } }); };
  A3.pens = (x, y = 520) => { const g = grupKur(x, y); [-0.15, 0.15].forEach(dz => { const m = new THREE.Mesh(new THREE.BoxGeometry(100 * S_, 0.12, 0.35), K.M.metal); m.position.set(0, 0.25, dz); m.rotation.y = dz; g.add(m); }); golgele(g); return sar(g, { uc: [x + 50, y - 2] }); };
  A3.kibrit = (x, y = 520) => { const g = grupKur(x, y); const ky = new THREE.Mesh(new THREE.BoxGeometry(120 * S_, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: '#d4a373', roughness: 0.8 })); ky.position.set(60 * S_, 30 * S_, 0); ky.rotation.z = 0.25; g.add(ky);
    const uM = new THREE.MeshStandardMaterial({ color: '#f97316', emissive: '#f97316', emissiveIntensity: 0 }); const uc = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), uM); uc.position.set(120 * S_ - 0.2, 30 * S_ + 1.4, 0); uc.visible = false; g.add(uc);
    const alM = new THREE.MeshBasicMaterial({ color: '#f59e0b', transparent: true, opacity: 0.8, depthWrite: false }); const alev = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.8, 14, 1, true), alM); alev.position.set(120 * S_, 30 * S_ + 2.4, 0); alev.visible = false; g.add(alev);
    const kut = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 2.2), new THREE.MeshStandardMaterial({ color: '#b91c1c' })); kut.position.set(-1, 0.45, 1.5); g.add(kut); golgele(g);
    return sar(g, { uc: [x + 120, y - 30], durum(s) { const m = s === 'alev' ? 2 : s === 'kor' ? 1 : 0; uc.visible = m === 1; uM.emissiveIntensity = m === 1 ? 2 : 0; alev.visible = m === 2; } }); };
  A3.dijitalTermometre = (x, y = 300, o = {}) => { const L = o.L || 120; const g = grupKur(x, y); const gov = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.4, 1.2), new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.5 })); gov.position.y = 2.2; g.add(gov);
    const prob = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, L * S_, 10), K.M.metal); prob.position.y = -L * S_ / 2; g.add(prob);
    const ek = K.ekran(200, 90, (c, w2, h2, v) => { c.fillStyle = '#d9f99d'; c.fillRect(0, 0, w2, h2); c.fillStyle = '#1f2937'; c.font = '800 50px "Courier New",monospace'; c.textAlign = 'center'; c.fillText(v, w2 / 2, 62); }); ek.yaz('');
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.15), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.position.set(0, 3, 0.62); g.add(ekr); golgele(g);
    return sar(g, { uc: [x, y + L], set(T) { ek.yaz((typeof T === 'number' ? T.toFixed(1) : T) + '°'); } }); };
  A3.hofmann = (x, y = 520, o = {}) => { const g = grupKur(x, y); const ayak = new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 6), K.M.koyu); ayak.position.y = 0.4; g.add(ayak);
    const kolon = (dx, ad) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 22, 24, 1, true), K.M.cam); c.position.set(dx, 13, 0); c.renderOrder = 3; g.add(c); const su = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 1, 20), new THREE.MeshPhysicalMaterial({ color: '#a9cdf2', transparent: true, opacity: 0.8, depthWrite: false })); su.renderOrder = 1; g.add(su);
      const mus = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.4), K.M.mavi); mus.position.set(dx, 24.4, 0); g.add(mus); const e = K.etiket(ad, 1); e.position.set(dx, 26.2, 0); g.add(e); const el3 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.4, 10), K.M.metal); el3.position.set(dx, 2.6, 0); g.add(el3);
      return { set(h) { const hh = Math.max(0.01, 21.5 - h); su.scale.y = hh; su.position.set(dx, 2 + hh / 2, 0); } }; };
    const orta = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 26, 20, 1, true), K.M.cam); orta.position.set(0, 15, -0.5); orta.renderOrder = 3; g.add(orta); const hz = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 14), K.M.cam); hz.position.set(0, 29, -0.5); hz.renderOrder = 3; g.add(hz);
    const a = kolon(-4, 'H₂'), b = kolon(4, 'O₂'); a.set(0); b.set(0); golgele(g);
    const kb = []; const bM = new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0.85 }); let on = 0; K.tick(dt => { if (on && Math.random() < 0.5) { const m = kb.find(q => !q.visible) || (() => { const q = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), bM); g.add(q); kb.push(q); return q; })(); m.position.set(Math.random() < 0.66 ? -4 : 4, 3, 0); m.visible = true; } kb.forEach(q => { if (q.visible) { q.position.y += 6 * dt; if (q.position.y > 20) q.visible = false; } }); });
    return sar(g, { katot: [x - 50, y], anot: [x + 50, y], set(vH2, vO2) { a.set(Math.max(0, +vH2 || 0) * 2.6 * S_); b.set(Math.max(0, +vO2 || 0) * 2.6 * S_); }, calis(v) { on = v ? 1 : 0; } }); };
  A3.turnusol = (x, y = 520, o = {}) => { const g = grupKur(x, y); const kM = new THREE.MeshStandardMaterial({ color: o.renk === 'kirmizi' ? '#ef4444' : '#3b82f6', roughness: 0.9 }); const k = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4, 0.05), kM); k.position.y = 2; k.rotation.x = -1.35; k.position.y = 0.2; g.add(k); golgele(g);
    return sar(g, { renk(c) { kM.color.set(c === 'mavi' ? '#3b82f6' : c === 'kirmizi' ? '#ef4444' : (rgbaAyir(c) ? '#' + rgbaAyir(c).c.getHexString() : '#ddd')); } }); };
  A3.gozluk = (x, y = 520) => sar(A.gozluk(X(x), 6), {});
  // --- efektler (GENEL işlemler: buhar, duman, alev, parlama, kristal) ---
  const parcacik = (x, y, renk, buyu) => { const g = new THREE.Group(); g.position.set(X(x), Y(y), 0.5); K.sc.add(g); const L = []; let hiz = 0;
    const mt = new THREE.SpriteMaterial({ color: renk, transparent: true, opacity: 0.5, depthWrite: false });
    K.tick(dt => { if (hiz > 0 && Math.random() < hiz * 1.6) { const s = L.find(q => !q.visible) || (() => { const q = new THREE.Sprite(mt.clone()); g.add(q); L.push(q); return q; })(); s.position.set((Math.random() - 0.5) * 0.8, 0, (Math.random() - 0.5) * 0.8); s.userData.t = 0; s.visible = true; }
      L.forEach(s => { if (!s.visible) return; s.userData.t += dt; const u = s.userData.t; s.position.y += dt * 3.5; s.position.x += Math.sin(u * 3 + s.id) * dt * 0.6; const sc = 0.8 + u * buyu; s.scale.set(sc, sc, 1); s.material.opacity = Math.max(0, 0.55 - u * 0.25); if (u > 2.2) s.visible = false; }); });
    return { g, hiz(v) { hiz = +v || 0; } }; };
  A3.buhar = (x, y, o = {}) => { const p = parcacik(x, y, '#ffffff', 1.4); p.hiz(o.hiz || 0); return p; };
  A3.duman = (x, y, o = {}) => { const p = parcacik(x, y, '#9ca3af', 2); p.hiz(o.hiz || 0); return p; };
  A3.alev = (x, y, o = {}) => { const g = grupKur(x, y); g.position.z = 0.5; const mt = new THREE.MeshBasicMaterial({ color: '#f97316', transparent: true, opacity: 0.8, depthWrite: false }); const mt2 = new THREE.MeshBasicMaterial({ color: '#facc15', transparent: true, opacity: 0.9, depthWrite: false });
    const a1 = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4, 18, 1, true), mt); a1.position.y = 2; const a2 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.2, 14, 1, true), mt2); a2.position.y = 1.1; g.add(a1, a2); g.visible = false; const isik = new THREE.PointLight('#ff9b3d', 0, 30); isik.position.y = 2; g.add(isik); let boy = 1;
    K.tick(() => { if (g.visible) { const s = boy * (1 + Math.sin(K.zaman * 22) * 0.07 + Math.random() * 0.05); g.scale.set(1, s, 1); } }); return { g, on(v) { g.visible = !!v; isik.intensity = v ? 35 : 0; }, boy(v) { boy = Math.max(0.2, (+v || 40) / 40); } }; };
  A3.parlama = (x, y) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshBasicMaterial({ color: '#fffbe6', transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })); m.position.set(X(x), Y(y), 0.5); K.sc.add(m); const isik = new THREE.PointLight('#fff7d6', 120, 60); isik.position.copy(m.position); K.sc.add(isik);
    return { flas(ms = 500) { const bas = performance.now(); const f = () => { const t = Math.min(1, (performance.now() - bas) / ms); m.scale.setScalar(1 + 5 * t); m.material.opacity = 1 - t; isik.intensity = 120 * (1 - t); if (t < 1) requestAnimationFrame(f); else { K.sc.remove(m); K.sc.remove(isik); } }; f(); } }; };
  A3.kristal = (x, y, o = {}) => { const g = grupKur(x, y); g.position.z = 0.3; const q = rgbaAyir(o.renk || '#e2e8f0'); const mt = new THREE.MeshPhysicalMaterial({ color: q ? q.c : '#e2e8f0', roughness: 0.15, metalness: 0.3, clearcoat: 1 }); const dal = [];
    for (let i = 0; i < 18; i++) { const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), mt); const a = i * 2.39, e = (i % 5) * 0.3; m.userData = { d: new THREE.Vector3(Math.cos(a) * Math.cos(e), Math.sin(e) + 0.2, Math.sin(a) * Math.cos(e)), s: 0.4 + (i % 4) * 0.25 }; m.scale.setScalar(0.001); m.rotation.set(i, i * 2, 0); m.castShadow = true; g.add(m); dal.push(m); }
    return { g, buyu(f) { f = Math.max(0, +f || 0); dal.forEach(m => { const u = m.userData; m.position.copy(u.d).multiplyScalar(f * 2.4); m.scale.setScalar(Math.max(0.001, u.s * f)); }); } }; };
  // pH kâğıdı ve renk skalası (kit)
  S3.phStrip = (x, y) => { const g = grupKur(x, y); g.position.z = 1.5; const pens = new THREE.Mesh(new THREE.BoxGeometry(0.4, 46 * S_, 0.2), K.M.metal); pens.position.y = 47 * S_; g.add(pens);
    const kM = new THREE.MeshStandardMaterial({ color: '#f2e29b', roughness: 0.9 }); const k = new THREE.Mesh(new THREE.BoxGeometry(0.8, 34 * S_, 0.06), kM); k.position.y = 9 * S_; g.add(k); golgele(g); const taban = g.position.clone();
    const o = { x, y, color(c) { const q = rgbaAyir(c); if (q) kM.color.copy(q.c); }, to(Xp, Yp) { g.position.set(taban.x + (Xp - x) * S_, taban.y - (Yp - y) * S_, taban.z); } }; const sg = sar(g, o); g.visible = false; sg.g.op = '0'; return sg; };
  S3.phScale = (x, y, w = 360) => { const ek = K.ekran(1024, 128, (c, w2, h2) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w2, h2); for (let i = 0; i <= 14; i++) { const col = LK.CH && LK.CH.scaleColor ? LK.CH.scaleColor(i, 'evrensel').rgb : `hsl(${i * 20},70%,55%)`; c.fillStyle = col; c.fillRect(8 + i * (w2 - 16) / 15, 8, (w2 - 16) / 15 - 3, 64); c.fillStyle = '#1f2937'; c.font = '700 30px Nunito,sans-serif'; c.textAlign = 'center'; c.fillText(i, 8 + (i + 0.5) * (w2 - 16) / 15, 110); } }); ek.yaz();
    const g = grupKur(x + w / 2, y + 30); g.position.z = -5; const m = new THREE.Mesh(new THREE.BoxGeometry(w * S_, w * S_ / 8, 0.2), [K.M.beyaz, K.M.beyaz, K.M.beyaz, K.M.beyaz, new THREE.MeshStandardMaterial({ map: ek.t, roughness: 0.7 }), K.M.beyaz]); m.position.y = w * S_ / 16; m.rotation.x = -0.15; g.add(m); golgele(g); return sar(g, {}); };
  S3.hose = d => { const n = String(d).match(/-?\d+(\.\d+)?/g); if (!n || n.length < 4) return S2.hose(d); const pts = []; for (let i = 0; i + 1 < n.length; i += 2) pts.push(new THREE.Vector3(X(+n[i]), Y(+n[i + 1]), 0.6));
    const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(16, pts.length * 8), 0.3, 8), new THREE.MeshStandardMaterial({ color: '#f4b46e', roughness: 0.6, transparent: true, opacity: 0.9 })); m.castShadow = true; g.add(m); K.sc.add(g); return sar(g, {}); };

  LK.T.abort = false; const M = DO.kur(S3, D);
  const eskiYok = K.yok; K.yok = () => { svg2.remove(); eskiYok(); };
  return { M, S3, S2 };
}
