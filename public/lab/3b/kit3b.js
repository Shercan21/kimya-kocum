/* Kimya Koçum · 3B Sanal Lab Kiti (three.js)
   Birim: 1 = 1 cm. Tezgâh üstü y=0. Sahne(kutu) → K; aletler K.A.<ad>(x, z, seçenekler) ile kurulur. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };
const V2 = (x, y) => new THREE.Vector2(x, y);
const renkC = c => (c instanceof THREE.Color ? c : new THREE.Color(c));

export async function Sahne(kutu, o = {}) {
  const mobil = matchMedia('(pointer:coarse)').matches;
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: !!o.kare });
  r.setPixelRatio(Math.min(mobil ? 1.5 : 2, devicePixelRatio));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05; r.outputColorSpace = THREE.SRGBColorSpace;
  kutu.append(r.domElement); r.domElement.style.touchAction = 'none';
  const sc = new THREE.Scene(); sc.background = new THREE.Color('#dde5ef');
  const pm = new THREE.PMREMGenerator(r); sc.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(36, 1, 1, 2000);
  const hedef = o.hedef || [0, 14, 0], uzak = o.uzak || 95;
  const evPos = [hedef[0] + uzak * 0.2, hedef[1] + uzak * 0.36, hedef[2] + uzak * 0.9]; cam.position.set(...evPos);
  const ctl = new OrbitControls(cam, r.domElement); ctl.target.set(...hedef); ctl.enableDamping = true; ctl.enablePan = false;
  ctl.minDistance = uzak * 0.4; ctl.maxDistance = uzak * 1.8; ctl.maxPolarAngle = Math.PI * 0.48; ctl.minAzimuthAngle = -1.0; ctl.maxAzimuthAngle = 1.0;
  const gun = new THREE.DirectionalLight(0xffffff, 2.3); gun.position.set(60, 120, 80); gun.castShadow = true;
  gun.shadow.mapSize.set(mobil ? 1024 : 2048, mobil ? 1024 : 2048);
  Object.assign(gun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -60, near: 20, far: 400 }); gun.shadow.bias = -0.0004; gun.shadow.radius = 4;
  sc.add(gun, new THREE.HemisphereLight(0xffffff, 0xb08a60, 0.45));

  // tezgâh + duvar
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const x = cv.getContext('2d');
  x.fillStyle = '#c9a171'; x.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 160; i++) { x.strokeStyle = `rgba(${105 + Math.random() * 40 | 0},${68 + Math.random() * 30 | 0},36,${0.07 + Math.random() * 0.12})`; x.lineWidth = 1 + Math.random() * 3; x.beginPath(); const yy = Math.random() * 512; x.moveTo(0, yy); for (let k = 0; k <= 1024; k += 64) x.lineTo(k, yy + Math.sin(k / 90 + i) * 6); x.stroke(); }
  const ahsap = new THREE.CanvasTexture(cv); ahsap.colorSpace = THREE.SRGBColorSpace; ahsap.anisotropy = 8;
  const tez = new THREE.Mesh(new THREE.BoxGeometry(260, 4, 110), new THREE.MeshStandardMaterial({ map: ahsap, roughness: 0.55 }));
  tez.position.y = -2; tez.receiveShadow = true; sc.add(tez);
  const dc = document.createElement('canvas'); dc.width = 512; dc.height = 512; const dx = dc.getContext('2d');
  dx.fillStyle = '#eef2f7'; dx.fillRect(0, 0, 512, 512); dx.strokeStyle = '#d4dce7'; dx.lineWidth = 3;
  for (let i = 0; i <= 512; i += 64) { dx.beginPath(); dx.moveTo(0, i); dx.lineTo(512, i); dx.stroke(); dx.beginPath(); dx.moveTo(i, 0); dx.lineTo(i, 512); dx.stroke(); }
  const fay = new THREE.CanvasTexture(dc); fay.wrapS = fay.wrapT = THREE.RepeatWrapping; fay.repeat.set(8, 3); fay.colorSpace = THREE.SRGBColorSpace;
  const duvar = new THREE.Mesh(new THREE.PlaneGeometry(600, 220), new THREE.MeshStandardMaterial({ map: fay, roughness: 0.85 }));
  duvar.position.set(0, 100, -55); duvar.receiveShadow = true; sc.add(duvar);

  // ortak malzemeler
  const M = {
    cam: new THREE.MeshPhysicalMaterial({ color: '#e8f1fb', roughness: 0.04, transparent: true, opacity: 0.26, side: THREE.DoubleSide, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false }),
    camKenar: new THREE.MeshPhysicalMaterial({ color: '#dfeaf6', roughness: 0.05, transparent: true, opacity: 0.55, envMapIntensity: 2, clearcoat: 1, depthWrite: false }),
    metal: new THREE.MeshStandardMaterial({ color: '#b9bfc9', metalness: 0.9, roughness: 0.25 }),
    koyu: new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.5 }),
    gri: new THREE.MeshStandardMaterial({ color: '#4b5563', roughness: 0.45 }),
    beyaz: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.6 }),
    porselen: new THREE.MeshPhysicalMaterial({ color: '#fbfbf9', roughness: 0.25, clearcoat: 0.8 }),
    kirmizi: new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 }),
    mavi: new THREE.MeshStandardMaterial({ color: '#2563eb', roughness: 0.4 }),
    bakir: new THREE.MeshStandardMaterial({ color: '#c46d3b', metalness: 0.85, roughness: 0.3 }),
  };
  const golge = m => { m.traverse(c => { if (c.isMesh && c.material !== M.cam && c.material !== M.camKenar) { c.castShadow = true; c.receiveShadow = true; } }); return m; };

  // zaman: duraklatma ve hız
  const K = { evPos, evHedef: hedef, THREE, r, sc, cam, ctl, M, kutu, hiz: 1, durdu: false, zaman: 0, ticks: [], A: {}, aletler: [] };
  const bekleyen = [];
  K.tick = f => { K.ticks.push(f); return f; };
  K.bekle = sn => new Promise(res => { const bitis = K.zaman + sn; bekleyen.push({ bitis, res }); });
  K.tween = (sn, f, kol = t => t * t * (3 - 2 * t)) => new Promise(res => { const bas = K.zaman; const fn = () => { const t = Math.min(1, (K.zaman - bas) / sn); f(kol(t)); if (t >= 1) { K.ticks.splice(K.ticks.indexOf(fn), 1); res(); } }; K.ticks.push(fn); fn(); });
  K.lerp = (a, b, t) => a + (b - a) * t;

  // etiket (her zaman okunur)
  K.etiket = (metin, boy = 1.6, renk = '#1f2937', zemin = 'rgba(255,255,255,.88)') => {
    const c = document.createElement('canvas'), g = c.getContext('2d'); const f = 64; g.font = `800 ${f}px Nunito,system-ui,sans-serif`;
    const w = Math.ceil(g.measureText(metin).width) + 40; c.width = w; c.height = f + 30; g.font = `800 ${f}px Nunito,system-ui,sans-serif`;
    if (zemin) { g.fillStyle = zemin; const rr = 22; g.beginPath(); g.roundRect(0, 0, w, c.height, rr); g.fill(); }
    g.fillStyle = renk; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(metin, w / 2, c.height / 2 + 3);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.renderOrder = 10;
    s.scale.set(boy * w / c.height, boy, 1); s.yaz = m => { s.material.map.dispose(); const y = K.etiket(m, boy, renk, zemin); s.material.map = y.material.map; s.scale.copy(y.scale); }; return s;
  };
  // kanvas ekran (pH metre, terazi, kronometre)
  K.ekran = (w, h, ciz) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const yaz = (...a) => { g.clearRect(0, 0, w, h); ciz(g, w, h, ...a); t.needsUpdate = true; }; return { t, yaz }; };

  /* ---------- sıvı tutan kap ---------- */
  // prof: [[r,y],...] dış cam profili (alttan üste). ic(y): o yükseklikteki iç yarıçap. hacimY(mL)→y
  function kap(prof, { ic, ust, hacim, hacimY, x0 = 0, z0 = 0, ad }) {
    const g = new THREE.Group(); g.position.set(x0, 0, z0);
    const camMesh = new THREE.Mesh(new THREE.LatheGeometry(prof.map(p => V2(...p)), 64), M.cam); camMesh.renderOrder = 3; g.add(camMesh);
    const dudak = new THREE.Mesh(new THREE.TorusGeometry(prof[prof.length - 1][0], 0.12, 8, 48), M.camKenar); dudak.rotation.x = Math.PI / 2; dudak.position.y = prof[prof.length - 1][1]; dudak.renderOrder = 3; g.add(dudak);
    const dip = new THREE.Mesh(new THREE.CircleGeometry(prof[1][0], 48), M.camKenar); dip.rotation.x = -Math.PI / 2; dip.position.y = 0.05; dip.renderOrder = 3; g.add(dip);
    const siviM = new THREE.MeshPhysicalMaterial({ color: '#cfe2f6', roughness: 0.2, transparent: true, opacity: 0.62, clearcoat: 0.2, envMapIntensity: 0.45, depthWrite: false });
    const bulM = new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, roughness: 1 });
    const cokM = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.9 });
    let sivi = null, bul = null, cok = null, yuz = null;
    const V = { g, ad, vol: 0, cap: hacim, renk: new THREE.Color('#cfe2f6'), gaz: 0, ust, ic, agiz: () => g.localToWorld(new THREE.Vector3(0, ust, 0)) };
    const hacimdenY = v => (hacimY ? hacimY(v) : (v / hacim) * (ust * 0.85));
    V.seviye = () => (V.vol > 0 ? hacimdenY(V.vol) : 0);
    function yap(h) {
      [sivi, bul, yuz].forEach(m => { if (m) { g.remove(m); m.geometry.dispose(); } }); sivi = bul = yuz = null; if (h <= 0.05) return;
      const n = 24, pts = [V2(0, 0.12)]; for (let i = 0; i <= n; i++) { const y = 0.12 + (h - 0.12) * i / n; pts.push(V2(Math.max(0.05, ic(y) - 0.08), y)); }
      const geo = new THREE.LatheGeometry(pts, 48); sivi = new THREE.Mesh(geo, siviM); sivi.renderOrder = 1; g.add(sivi);
      bul = new THREE.Mesh(geo, bulM); bul.renderOrder = 2; bul.scale.set(0.995, 0.995, 0.995); g.add(bul);
      yuz = new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.05, ic(h) - 0.08), 48), new THREE.MeshPhysicalMaterial({ color: siviM.color.clone(), transparent: true, opacity: 0.7, roughness: 0.05, clearcoat: 0.6, envMapIntensity: 0.9, depthWrite: false }));
      yuz.rotation.x = -Math.PI / 2; yuz.position.y = h; yuz.renderOrder = 2; g.add(yuz);
    }
    V.set = (v, renk) => { V.vol = Math.max(0, Math.min(hacim * 1.05, v)); if (renk) V.renkle(renk); yap(V.seviye()); if (yuz) yuz.material.color.copy(V.renk); return V; };
    V.renkle = (c, saydam) => { V.renk.copy(renkC(c)); siviM.color.copy(V.renk); if (saydam != null) siviM.opacity = saydam; if (yuz) yuz.material.color.copy(V.renk); return V; };
    V.bulanik = (f, c) => { if (c) bulM.color.copy(renkC(c)); bulM.opacity = Math.max(0, Math.min(0.92, f)); return V; };
    V.cokelti = (f, c = '#f1f5f9') => { cokM.color.copy(renkC(c)); if (cok) { g.remove(cok); cok.geometry.dispose(); cok = null; } if (f <= 0) return V; const rr = ic(0.3) - 0.2; cok = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.95, rr, 0.15 + f * 0.9, 40), cokM); cok.position.y = 0.15 + (0.15 + f * 0.9) / 2; cok.receiveShadow = true; g.add(cok); return V; };
    V.kabarcik = h => { V.gaz = h; return V; };
    // kabarcıklar
    const kG = new THREE.SphereGeometry(1, 10, 8), kM = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.7, roughness: 0, clearcoat: 1, depthWrite: false }), kab = [];
    K.tick(dt => {
      const top = V.seviye();
      if (V.gaz > 0 && top > 0.6 && Math.random() < V.gaz * dt * 60) { const m = kab.find(b => !b.visible) || (() => { const b = new THREE.Mesh(kG, kM); b.renderOrder = 2; g.add(b); kab.push(b); return b; })(); const a = Math.random() * 6.28, rr = Math.random() * (ic(0.5) - 0.6); const s = 0.08 + Math.random() * 0.14; m.scale.set(s, s, s); m.position.set(Math.cos(a) * rr, 0.4, Math.sin(a) * rr); m.userData.v = 2 + Math.random() * 3; m.visible = true; }
      kab.forEach(b => { if (!b.visible) return; b.position.y += b.userData.v * dt; const ri = ic(b.position.y) - 0.4; const d = Math.hypot(b.position.x, b.position.z); if (d > ri && d > 0) { b.position.x *= ri / d; b.position.z *= ri / d; } if (b.position.y >= top - 0.1) b.visible = false; });
    });
    K.sc.add(golge(g)); K.aletler.push(V); return V;
  }
  K.kap = kap;

  /* ---------- aletler ---------- */
  const A = K.A;
  const grup = (x, z, ad) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.name = ad || ''; K.sc.add(g); return g; };
  const etiketle = (V, g, metin, y) => { if (!metin) return; const e = K.etiket(metin, 1.5); e.position.set(0, y, 0); g.add(e); V.etiket = e; };

  A.beher = (x, z, { hacim = 250, etiket } = {}) => {
    const k = Math.cbrt(hacim / 250), R = 3.6 * k, H = 9.6 * k;
    const prof = [[0, 0], [R - 0.4, 0], [R, 0.4], [R, H - 0.3], [R + 0.35, H]];
    const V = kap(prof, { ic: () => R - 0.05, ust: H, hacim, hacimY: v => 0.15 + (v / hacim) * (H * 0.88), x0: x, z0: z, ad: 'beher' });
    for (let i = 1; i <= 4; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.05), M.koyu); const y = 0.15 + H * 0.88 * i / 5; t.position.set(-0.3, y, R + 0.02); V.g.add(t); }
    etiketle(V, V.g, etiket, H + 2.2); return V;
  };
  A.erlen = (x, z, { hacim = 250, etiket } = {}) => {
    const k = Math.cbrt(hacim / 250), Rb = 4.6 * k, Hb = 7.4 * k, Rn = 1.5 * k, H = 13 * k;
    const prof = [[0, 0], [Rb - 0.5, 0], [Rb, 0.5], [Rb - 0.15, 1.2], [Rn + 0.2, Hb], [Rn, Hb + 0.8], [Rn, H - 0.3], [Rn + 0.3, H]];
    const ic = y => (y < 1.2 ? Rb - 0.2 : y < Hb ? K.lerp(Rb - 0.2, Rn + 0.1, (y - 1.2) / (Hb - 1.2)) : Rn - 0.05);
    // hacim→yükseklik: kesik koni integrali (sayısal)
    const tablo = []; let v = 0; for (let y = 0.15; y <= H; y += 0.05) { v += Math.PI * ic(y) ** 2 * 0.05; tablo.push([v, y]); }
    const hacimY = mL => { for (const [vv, yy] of tablo) if (vv >= mL) return yy; return H - 0.5; };
    const V = kap(prof, { ic, ust: H, hacim, hacimY, x0: x, z0: z, ad: 'erlen' });
    V.boyun = { r: Rn, y: H }; etiketle(V, V.g, etiket, H + 2.4); return V;
  };
  A.tup = (x, z, { etiket, hacim = 20, yukseklik = 15 } = {}) => {
    const R = 1.05, H = yukseklik, prof = [[0, 0.05]]; for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 * i / 8; prof.push([R * Math.sin(a), R - R * Math.cos(a)]); } prof.push([R, H - 0.2], [R + 0.18, H]);
    const ic = y => (y < R ? Math.max(0.1, Math.sqrt(Math.max(0, R * R - (R - y) ** 2)) - 0.05) : R - 0.06);
    const V = kap(prof, { ic, ust: H, hacim, hacimY: v => 0.1 + (v / hacim) * (H * 0.82), x0: x, z0: z, ad: 'tup' });
    etiketle(V, V.g, etiket, H + 2); return V;
  };
  A.tupluk = (x, z, { delik = 4, ara = 4.2 } = {}) => {
    const g = grup(x, z, 'tupluk'); const w = delik * ara + 2; const ah = new THREE.MeshStandardMaterial({ color: '#8a5a32', roughness: 0.6 });
    const ust = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, 5), ah); ust.position.y = 7.5; const alt = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, 5), ah); alt.position.y = 2.2;
    const taban = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 0.8, 6), ah); taban.position.y = 0.4; g.add(ust, alt, taban);
    [-1, 1].forEach(s => { const a = new THREE.Mesh(new THREE.BoxGeometry(0.8, 7.5, 5), ah); a.position.set(s * (w / 2 - 0.4), 4.1, 0); g.add(a); });
    golge(g); g.yuva = i => new THREE.Vector3(x - w / 2 + 1 + ara / 2 + i * ara, 2.6, z); return g;
  };
  A.spor = (x, z, { yukseklik = 55, kolY = 34, kolBoy = 14, tabanX = -3 } = {}) => {
    const g = grup(x, z, 'spor');
    const taban = new THREE.Mesh(new THREE.BoxGeometry(18, 1.4, 12), M.koyu); taban.position.set(tabanX, 0.7, 0); g.add(taban);
    const cubuk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, yukseklik, 24), M.metal); cubuk.position.set(0, yukseklik / 2, 0); g.add(cubuk);
    const mafsal = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), M.gri); mafsal.position.set(0, kolY, 0); g.add(mafsal);
    const kol = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, kolBoy, 16), M.metal); kol.rotation.z = Math.PI / 2; kol.position.set(kolBoy / 2, kolY, 0); g.add(kol);
    const kiskac = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.35, 10, 24), M.koyu); kiskac.rotation.x = Math.PI / 2; kiskac.position.set(kolBoy, kolY, 0); g.add(kiskac);
    golge(g); g.uc = new THREE.Vector3(x + kolBoy, kolY, z); return g;
  };
  A.buret = (x, z, { hacim = 50, y0 = 26, etiket = 'NaOH', renk = '#9cc3ec', boy = 40 } = {}) => {
    const g = grup(x, z, 'buret'); const L = boy, R = 0.75;
    const boru = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 32, 1, true), M.cam); boru.position.y = y0 + L / 2; boru.renderOrder = 3; g.add(boru);
    const uc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.12, 3.5, 20, 1, true), M.cam); uc.position.y = y0 - 1.9; uc.renderOrder = 3; g.add(uc);
    const musluk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.8), M.mavi); musluk.position.set(0.9, y0 - 0.2, 0); g.add(musluk);
    const kol = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 2.6), M.mavi); kol.position.set(2.2, y0 - 0.2, 0); g.add(kol);
    for (let i = 0; i <= 10; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(i % 5 ? 0.45 : 0.8, 0.06, 0.05), M.koyu); t.position.set(0.3, y0 + 2 + i * (L - 4) / 10, R); g.add(t); }
    const sM = new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.1, transparent: true, opacity: 0.85, depthWrite: false }); const s = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.08, R - 0.08, 1, 24), sM); s.renderOrder = 1; g.add(s);
    const B = { g, vol: hacim, cap: hacim, uc: new THREE.Vector3(x, y0 - 3.7, z), musluk: kol };
    B.set = v => { B.vol = Math.max(0, v); const h = Math.max(0.01, (B.vol / hacim) * (L - 4)); s.scale.y = h; s.position.y = y0 + 1 + h / 2; return B; }; B.set(hacim);
    B.ac = (acik = true) => { kol.rotation.y = acik ? Math.PI / 2 : 0; };
    if (etiket) { const e = K.etiket(etiket, 1.5); e.position.set(0, y0 + L + 2, 0); g.add(e); }
    golge(g); return B;
  };
  A.mezur = (x, z, { hacim = 100, etiket } = {}) => {
    const H = 22, R = 1.7; const prof = [[0, 0.8], [R, 0.8], [R, H - 0.3], [R + 0.25, H]];
    const V = kap(prof, { ic: () => R - 0.05, ust: H, hacim, hacimY: v => 1 + (v / hacim) * (H - 2.5), x0: x, z0: z, ad: 'mezur' });
    const ayak = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.8, 6), M.camKenar); ayak.position.y = 0.4; V.g.add(ayak);
    for (let i = 1; i <= 10; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(i % 5 ? 0.6 : 1.1, 0.06, 0.05), M.koyu); t.position.set(0, 1 + (H - 2.5) * i / 10, R + 0.02); V.g.add(t); }
    etiketle(V, V.g, etiket, H + 2); return V;
  };
  A.balonJoje = (x, z, { hacim = 250, etiket } = {}) => {
    const Rb = 4.4, prof = [[0, 0]]; for (let i = 0; i <= 14; i++) { const a = -Math.PI / 2 + Math.PI * 0.9 * i / 14; prof.push([Math.max(0.01, Rb * Math.cos(a)), Rb + Rb * Math.sin(a)]); } prof.push([0.85, 2 * Rb + 0.6], [0.85, 2 * Rb + 9], [1.05, 2 * Rb + 9.3]);
    const ic = y => (y < 2 * Rb - 0.3 ? Math.max(0.1, Math.sqrt(Math.max(0, Rb * Rb - (y - Rb) ** 2)) - 0.1) : 0.78);
    const V = kap(prof, { ic, ust: 2 * Rb + 9.3, hacim, hacimY: v => 0.2 + (v / hacim) * (2 * Rb + 5), x0: x, z0: z, ad: 'balonjoje' });
    const ciz = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.04, 6, 32), M.koyu); ciz.rotation.x = Math.PI / 2; ciz.position.y = 2 * Rb + 5.2; V.g.add(ciz);
    etiketle(V, V.g, etiket, 2 * Rb + 11.5); return V;
  };
  A.sise = (x, z, { etiket = '', renk = '#7c3a12', sivi } = {}) => {
    const g = grup(x, z, 'sise');
    const prof = [[0, 0], [3.4, 0], [3.7, 0.8], [3.7, 11], [1.4, 14], [1.4, 15.6], [0, 15.6]].map(p => V2(...p));
    const camM = new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.12, transparent: true, opacity: 0.88, clearcoat: 1, envMapIntensity: 1.6 });
    const govde = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), camM); g.add(govde);
    const kapak = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 2.4, 24), M.koyu); kapak.position.y = 16.6; g.add(kapak);
    if (etiket) { const ek = K.ekran(256, 160, (c, w, h) => { c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d6c7a8'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#1f2937'; c.textAlign = 'center'; c.font = `800 ${etiket.length > 6 ? 46 : 58}px Nunito,sans-serif`; c.fillText(etiket, w / 2, h / 2 + 10); if (sivi) { c.font = '700 26px Nunito,sans-serif'; c.fillStyle = '#64748b'; c.fillText(sivi, w / 2, h - 22); } }); ek.yaz();
      const et = new THREE.Mesh(new THREE.CylinderGeometry(3.72, 3.72, 5, 48, 1, true, -1.0, 2.0), new THREE.MeshStandardMaterial({ map: ek.t, roughness: 0.8 })); et.position.y = 5.6; g.add(et); }
    golge(g); g.agiz = new THREE.Vector3(x, 17.8, z); return g;
  };
  A.damlalikSise = (x, z, { etiket = '', renk = '#f5f5f4' } = {}) => {
    const g = grup(x, z, 'damlalik');
    const gov = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 5.5, 32), new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.15, transparent: true, opacity: 0.85, clearcoat: 1 })); gov.position.y = 2.75; g.add(gov);
    const boyun = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 20), M.koyu); boyun.position.y = 6.3; g.add(boyun);
    const puar = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), M.kirmizi); puar.scale.y = 1.3; puar.position.y = 8; g.add(puar);
    if (etiket) { const e = K.etiket(etiket, 1.2); e.position.set(0, 11, 0); g.add(e); }
    golge(g); return g;
  };
  A.damlalik = (x, y, z) => {
    const g = new THREE.Group(); g.position.set(x, y, z); const boru = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.1, 6, 16, 1, true), M.cam); boru.position.y = 3; boru.renderOrder = 3; g.add(boru);
    const puar = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), M.kirmizi); puar.scale.y = 1.6; puar.position.y = 7; g.add(puar); K.sc.add(golge(g)); g.uc = () => g.localToWorld(new THREE.Vector3(0, 0, 0)); return g;
  };
  A.huni = (x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z); const m = new THREE.Mesh(new THREE.LatheGeometry([[0.35, 0], [0.35, 3], [3.4, 6.5], [3.6, 6.7]].map(p => V2(...p)), 40), M.cam); m.renderOrder = 3; g.add(m); K.sc.add(g); return g; };
  A.kapsul = (x, z, { etiket } = {}) => {
    const prof = []; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 * i / 10; prof.push([5 * Math.sin(a), 2.2 - 2.2 * Math.cos(a)]); }
    const g = grup(x, z, 'kapsul'); const m = new THREE.Mesh(new THREE.LatheGeometry(prof.map(p => V2(...p)), 48), M.porselen); m.material.side = THREE.DoubleSide; g.add(m);
    const ic = y => Math.max(0.1, 5 * Math.sin(Math.acos(Math.max(-1, Math.min(1, 1 - y / 2.2)))) - 0.15);
    const V = { g, vol: 0 }; const sM = new THREE.MeshPhysicalMaterial({ color: '#cfe2f6', transparent: true, opacity: 0.8, clearcoat: 1 }); let s;
    V.set = (h, c) => { if (c) sM.color.copy(renkC(c)); if (s) { g.remove(s); s.geometry.dispose(); s = null; } if (h <= 0.02) return V; s = new THREE.Mesh(new THREE.CircleGeometry(ic(h), 40), sM); s.rotation.x = -Math.PI / 2; s.position.y = h; g.add(s); return V; };
    V.kristal = (n, c = '#ffffff') => { for (let i = 0; i < n; i++) { const k = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.35), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.2, clearcoat: 1 })); const a = Math.random() * 6.28, rr = Math.random() * 3.2; k.position.set(Math.cos(a) * rr, 0.3 + (rr / 5) * 0.8, Math.sin(a) * rr); k.rotation.y = Math.random() * 3; g.add(k); } };
    if (etiket) etiketle(V, g, etiket, 5); golge(g); return V;
  };
  A.saatCami = (x, y, z) => { const prof = []; for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 * i / 10; prof.push([4 * Math.sin(a), 0.8 - 0.8 * Math.cos(a)]); } const m = new THREE.Mesh(new THREE.LatheGeometry(prof.map(p => V2(...p)), 40), M.cam); m.position.set(x, y, z); m.renderOrder = 3; K.sc.add(m); return m; };
  A.ucAyak = (x, z, { yukseklik = 14 } = {}) => {
    const g = grup(x, z, 'ucayak'); const halka = new THREE.Mesh(new THREE.TorusGeometry(5, 0.35, 10, 40), M.koyu); halka.rotation.x = Math.PI / 2; halka.position.y = yukseklik; g.add(halka);
    for (let i = 0; i < 3; i++) { const a = i * 2.094; const ayak = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, yukseklik + 1, 10), M.koyu); ayak.position.set(Math.cos(a) * 5.6, yukseklik / 2, Math.sin(a) * 5.6); ayak.rotation.z = Math.cos(a) * 0.08; ayak.rotation.x = -Math.sin(a) * 0.08; g.add(ayak); }
    const tel = new THREE.Mesh(new THREE.BoxGeometry(11, 0.2, 11), new THREE.MeshStandardMaterial({ color: '#9ca3af', metalness: 0.7, roughness: 0.5 })); tel.position.y = yukseklik + 0.45; g.add(tel);
    const seramik = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.25, 32), new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.9 })); seramik.position.y = yukseklik + 0.6; g.add(seramik);
    golge(g); g.ust = yukseklik + 0.75; return g;
  };
  A.bek = (x, z) => {
    const g = grup(x, z, 'bek'); const taban = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.4, 1, 32), M.koyu); taban.position.y = 0.5; g.add(taban);
    const boru = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 10, 24), M.metal); boru.position.y = 6; g.add(boru);
    const ayar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.2, 24), M.gri); ayar.position.y = 2.5; g.add(ayar);
    const hortum = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.8, 2.3, 0), new THREE.Vector3(4, 1.5, 1), new THREE.Vector3(8, 0.6, 4), new THREE.Vector3(14, 0.6, 2)]), 24, 0.45, 10), new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.6 })); g.add(hortum);
    const alevM = new THREE.MeshBasicMaterial({ color: '#60a5fa', transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
    const alevIcM = new THREE.MeshBasicMaterial({ color: '#93c5fd', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    const alev = new THREE.Group(); const dis = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.5, 20, 1, true), alevM); dis.position.y = 2.25; const ic2 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 16, 1, true), alevIcM); ic2.position.y = 1; alev.add(dis, ic2); alev.position.y = 11; alev.visible = false; g.add(alev);
    const isik = new THREE.PointLight('#7fb2ff', 0, 30); isik.position.y = 13; g.add(isik);
    K.tick(() => { if (alev.visible) { const s = 1 + Math.sin(K.zaman * 30) * 0.06 + Math.random() * 0.04; alev.scale.set(1, s, 1); } });
    g.yak = (on = true) => { alev.visible = on; isik.intensity = on ? 40 : 0; };
    golge(g); g.alevUcu = new THREE.Vector3(x, 15.5, z); return g;
  };
  A.termometre = (x, y, z, { min = -10, max = 110, egim = 0, boy = 26 } = {}) => {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.z = egim; const L = boy;
    const cubuk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, L, 16), M.camKenar); cubuk.position.y = L / 2; cubuk.renderOrder = 3; g.add(cubuk);
    const hazne = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), M.kirmizi); hazne.scale.y = 1.8; hazne.position.y = 0.4; g.add(hazne);
    const kolon = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1, 8), M.kirmizi); g.add(kolon);
    for (let i = 0; i <= 12; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(i % 2 ? 0.35 : 0.6, 0.04, 0.04), M.koyu); t.position.set(0.25, 2 + (L - 4) * i / 12, 0.38); g.add(t); }
    const e = K.etiket('20 °C', 1.4, '#b91c1c'); e.position.set(0, L + 1.8, 0); g.add(e);
    const T = { g, deger: 20 }; T.set = c => { T.deger = c; const f = Math.max(0, Math.min(1, (c - min) / (max - min))); const h = 0.5 + f * (L - 4); kolon.scale.y = h; kolon.position.y = 1 + h / 2; e.yaz(c.toFixed(1).replace('.', ',') + ' °C'); return T; }; T.set(20);
    K.sc.add(golge(g)); return T;
  };
  A.phMetre = (x, z, { probX = 0, probY = 6, probZ = 0 } = {}) => {
    const g = grup(x, z, 'phmetre'); const kutu = new THREE.Mesh(new THREE.BoxGeometry(9, 2.6, 6.5), new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5 })); kutu.position.y = 1.3; kutu.rotation.x = -0.12; g.add(kutu);
    const ek = K.ekran(320, 160, (c, w, h, v) => { c.fillStyle = '#0f2a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#4ade80'; c.font = '800 92px "Courier New",monospace'; c.textAlign = 'right'; c.fillText(v, w - 20, 110); c.font = '700 30px Nunito,sans-serif'; c.textAlign = 'left'; c.fillText('pH', 16, 40); });
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 3.3), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.rotation.x = -Math.PI / 2 + 0.12 - 0.12; ekr.rotation.x = -Math.PI / 2 + 0.28; ekr.position.set(0, 2.75, -0.4); g.add(ekr); ek.yaz('7.00');
    const p = new THREE.Group(); p.position.set(probX - x, probY, probZ - z); const sap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 12, 16), new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.4 })); sap.position.y = 6; p.add(sap);
    const uc = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), M.camKenar); p.add(uc); g.add(p);
    const kab = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 2.6, -3), new THREE.Vector3(0, 8, -8), new THREE.Vector3(p.position.x * 0.6, probY + 16, p.position.z - 4), new THREE.Vector3(p.position.x, probY + 12, p.position.z)]), 30, 0.22, 8), M.koyu); g.add(kab);
    golge(g); return { g, prob: p, set: v => ek.yaz(v.toFixed(2)) };
  };
  A.terazi = (x, z) => {
    const g = grup(x, z, 'terazi'); const gov = new THREE.Mesh(new THREE.BoxGeometry(12, 2.4, 13), new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.4 })); gov.position.y = 1.2; g.add(gov);
    const kefe = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.4, 40), M.metal); kefe.position.set(0, 2.7, -1); g.add(kefe);
    const ek = K.ekran(320, 110, (c, w, h, v) => { c.fillStyle = '#1e293b'; c.fillRect(0, 0, w, h); c.fillStyle = '#7dd3fc'; c.font = '800 70px "Courier New",monospace'; c.textAlign = 'right'; c.fillText(v + ' g', w - 16, 80); });
    const ekr = new THREE.Mesh(new THREE.PlaneGeometry(6, 2), new THREE.MeshBasicMaterial({ map: ek.t })); ekr.position.set(0, 1.4, 6.52); g.add(ekr); ek.yaz('0.00');
    golge(g); return { g, ust: 2.9, kefe: new THREE.Vector3(x, 2.9, z - 1), set: v => ek.yaz(v.toFixed(2)) };
  };
  A.kronometre = (x, z) => {
    const g = grup(x, z, 'kronometre'); const gov = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 1.2, 40), M.koyu); gov.rotation.x = Math.PI / 2 - 0.35; gov.position.y = 3.6; g.add(gov);
    const ek = K.ekran(256, 256, (c, w, h, s) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(128, 128, 124, 0, 7); c.fill(); c.strokeStyle = '#1f2937'; for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283; c.lineWidth = i % 5 ? 2 : 5; c.beginPath(); c.moveTo(128 + Math.sin(a) * 112, 128 - Math.cos(a) * 112); c.lineTo(128 + Math.sin(a) * (i % 5 ? 104 : 96), 128 - Math.cos(a) * (i % 5 ? 104 : 96)); c.stroke(); }
      const a = (s % 60) / 60 * 6.283; c.strokeStyle = '#dc2626'; c.lineWidth = 6; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); c.stroke(); c.fillStyle = '#1f2937'; c.font = '800 34px Nunito,sans-serif'; c.textAlign = 'center'; c.fillText(s.toFixed(1).replace('.', ',') + ' s', 128, 186); });
    const yuz = new THREE.Mesh(new THREE.CircleGeometry(2.8, 40), new THREE.MeshBasicMaterial({ map: ek.t })); yuz.position.set(0, 3.6 + Math.sin(0.35) * 0.62, Math.cos(0.35) * 0.62); yuz.rotation.x = -0.35; g.add(yuz); ek.yaz(0);
    const dugme = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 12), M.gri); dugme.position.y = 7.2; g.add(dugme);
    const ayak = new THREE.Mesh(new THREE.BoxGeometry(3, 0.6, 2.5), M.koyu); ayak.position.y = 0.3; g.add(ayak);
    golge(g); return { g, set: s => ek.yaz(s) };
  };
  A.pil = (x, z, { etiket = '9 V' } = {}) => {
    const g = grup(x, z, 'pil'); const gov = new THREE.Mesh(new THREE.BoxGeometry(5, 7, 3), new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.4 })); gov.position.y = 3.5; g.add(gov);
    const bant = new THREE.Mesh(new THREE.BoxGeometry(5.05, 2.4, 3.05), new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.4 })); bant.position.y = 5; g.add(bant);
    const art = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.8, 12), M.metal); art.position.set(-1.2, 7.4, 0); const eks = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 6), M.metal); eks.position.set(1.2, 7.4, 0); g.add(art, eks);
    const e = K.etiket(etiket, 1.2); e.position.set(0, 10, 0); g.add(e);
    golge(g); return { g, arti: new THREE.Vector3(x - 1.2, 7.8, z), eksi: new THREE.Vector3(x + 1.2, 7.8, z) };
  };
  A.ampul = (x, z) => {
    const g = grup(x, z, 'ampul'); const duy = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 3, 20), M.gri); duy.position.y = 1.5; g.add(duy);
    const camM = new THREE.MeshPhysicalMaterial({ color: '#fffbe6', transparent: true, opacity: 0.35, roughness: 0.05, clearcoat: 1, emissive: '#fde047', emissiveIntensity: 0 });
    const cam = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 20), camM); cam.position.y = 5; g.add(cam);
    const isik = new THREE.PointLight('#fde68a', 0, 40); isik.position.y = 5; g.add(isik);
    golge(g); return { g, u1: new THREE.Vector3(x - 1, 1, z + 1.6), u2: new THREE.Vector3(x + 1, 1, z + 1.6), yak: (f = 1) => { camM.emissiveIntensity = 2.5 * f; camM.opacity = 0.35 + 0.5 * f; isik.intensity = 60 * f; } };
  };
  A.elektrot = (x, y, z, { boy = 9, malzeme = 'karbon', etiket } = {}) => {
    const mt = malzeme === 'bakir' ? M.bakir : malzeme === 'cinko' ? new THREE.MeshStandardMaterial({ color: '#9ca3af', metalness: 0.8, roughness: 0.4 }) : new THREE.MeshStandardMaterial({ color: '#27272a', roughness: 0.7 });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, boy, 16), mt); m.position.set(x, y + boy / 2, z); K.sc.add(golge(m));
    if (etiket) { const e = K.etiket(etiket, 1.2); e.position.set(x, y + boy + 1.6, z); K.sc.add(e); }
    return { m, ust: new THREE.Vector3(x, y + boy, z), alt: new THREE.Vector3(x, y, z) };
  };
  A.kablo = (a, b, { renk = '#dc2626', sarkma = 6 } = {}) => {
    const orta = a.clone().add(b).multiplyScalar(0.5); orta.y = Math.min(a.y, b.y) - sarkma; orta.y = Math.max(0.5, orta.y);
    const egri = new THREE.CatmullRomCurve3([a, a.clone().lerp(orta, 0.5).setY((a.y + orta.y) / 2), orta, b.clone().lerp(orta, 0.5).setY((b.y + orta.y) / 2), b]);
    const m = new THREE.Mesh(new THREE.TubeGeometry(egri, 40, 0.28, 8), new THREE.MeshStandardMaterial({ color: renk, roughness: 0.5 })); K.sc.add(golge(m));
    [a, b].forEach(p => { const k = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 10), M.metal); k.position.copy(p); K.sc.add(k); }); return m;
  };
  A.balon = (erlen, { renk = '#ef4444' } = {}) => {
    const g = new THREE.Group(); const p = erlen.g.position; g.position.set(p.x, erlen.boyun.y - 0.6, p.z);
    const mt = new THREE.MeshPhysicalMaterial({ color: renk, roughness: 0.35, clearcoat: 0.6, transparent: true, opacity: 0.9 });
    const boyun = new THREE.Mesh(new THREE.CylinderGeometry(erlen.boyun.r + 0.15, erlen.boyun.r + 0.15, 1.6, 24), mt); boyun.position.y = 0.6; g.add(boyun);
    const kese = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), mt); g.add(kese); K.sc.add(golge(g));
    const B = { g, f: 0 }; B.set = f => { B.f = f; const r = 0.9 + f * 4.6; kese.scale.set(r * 0.95, r * (1.1 - f * 0.15) + 0.6 * (1 - f), r * 0.95); kese.position.y = 1.2 + kese.scale.y * 0.95; kese.rotation.z = (1 - f) * 0.6; return B; }; B.set(0); return B;
  };
  A.kati = (x, y, z, { tur = 'serit', renk = '#cbd5e1', boyut = 1 } = {}) => {
    let geo; if (tur === 'serit') geo = new THREE.BoxGeometry(3 * boyut, 0.08, 0.5 * boyut); else if (tur === 'toz') geo = new THREE.ConeGeometry(1.2 * boyut, 0.7 * boyut, 24); else geo = new THREE.DodecahedronGeometry(0.6 * boyut);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: renk, metalness: tur === 'serit' ? 0.8 : 0.1, roughness: tur === 'serit' ? 0.3 : 0.8 })); m.position.set(x, y, z); K.sc.add(golge(m)); return m;
  };
  A.bagetCubuk = (x, y, z) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 18, 12), M.camKenar); m.position.set(x, y, z); m.renderOrder = 3; K.sc.add(m); return m; };
  A.gozluk = (x, z) => { const g = grup(x, z, 'gozluk'); const mt = new THREE.MeshPhysicalMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.45, roughness: 0.05, clearcoat: 1 }); [-1.9, 1.9].forEach(s => { const c = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.3, 10, 24), M.koyu); c.position.set(s, 1.6, 0); const l = new THREE.Mesh(new THREE.CircleGeometry(1.5, 24), mt); l.position.set(s, 1.6, 0); g.add(c, l); }); g.rotation.x = -1.2; g.position.y = 0.3; golge(g); return g; };

  /* ---------- damla ve dökme ---------- */
  const dG = new THREE.SphereGeometry(0.32, 12, 10);
  K.damla = (bas, hedefY, renk = '#9cc3ec') => new Promise(res => { const m = new THREE.Mesh(dG, new THREE.MeshPhysicalMaterial({ color: renk, transparent: true, opacity: 0.9, roughness: 0, clearcoat: 1 })); m.scale.y = 1.4; m.position.copy(bas); K.sc.add(m); let v = 0; const f = dt => { v += 980 * 0.25 * dt; m.position.y -= v * dt; if (m.position.y <= hedefY) { K.ticks.splice(K.ticks.indexOf(f), 1); K.sc.remove(m); m.material.dispose(); res(); } }; K.tick(f); });
  // akış çizgisi (dökme): a→b arası ince sıvı
  K.akis = (renk = '#cfe2f6') => { const mt = new THREE.MeshPhysicalMaterial({ color: renk, transparent: true, opacity: 0.75, roughness: 0, clearcoat: 1, depthWrite: false }); let m = null; return { ciz(a, b, kal = 0.25) { if (m) { K.sc.remove(m); m.geometry.dispose(); } const o = a.clone().lerp(b, 0.5); o.y = Math.max(b.y, o.y) + 0.5; m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, o, b), 16, kal, 8), mt); m.renderOrder = 2; K.sc.add(m); }, sil() { if (m) { K.sc.remove(m); m.geometry.dispose(); m = null; } } }; };
  // bir nesneyi yörüngeyle taşı
  K.tasi = async (obj, hedef, sn = 1, yay = 6) => { const a = obj.position.clone(), b = hedef.clone(); await K.tween(sn, t => { obj.position.lerpVectors(a, b, t); obj.position.y += Math.sin(t * Math.PI) * yay; }); };
  K.egik = (obj, aci, sn = 0.6, eksen = 'z') => { const a = obj.rotation[eksen]; return K.tween(sn, t => { obj.rotation[eksen] = K.lerp(a, aci, t); }); };

  /* ---------- döngü ---------- */
  const boyut = () => { const w = kutu.clientWidth, h = kutu.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  boyut(); const ro = new ResizeObserver(boyut); ro.observe(kutu);
  let onc = performance.now(), calis = true;
  const dongu = t => { if (!calis) return; const gercek = Math.min(0.05, (t - onc) / 1000); onc = t; const dt = K.durdu ? 0 : gercek * K.hiz; K.zaman += dt;
    for (let i = bekleyen.length - 1; i >= 0; i--) if (bekleyen[i].bitis <= K.zaman) { bekleyen[i].res(); bekleyen.splice(i, 1); }
    [...K.ticks].forEach(f => f(dt)); ctl.update(); r.render(sc, cam); requestAnimationFrame(dongu); };
  requestAnimationFrame(dongu);
  K.yok = () => { calis = false; ro.disconnect(); sc.traverse(o => { if (o.geometry) o.geometry.dispose(); }); r.dispose(); r.domElement.remove(); };
  K.kamera = (pos, hedef2, sn = 1.2) => { const a = cam.position.clone(), b = new THREE.Vector3(...pos), ta = ctl.target.clone(), tb = new THREE.Vector3(...hedef2); return K.tween(sn, t => { cam.position.lerpVectors(a, b, t); ctl.target.lerpVectors(ta, tb, t); }); };
  return K;
}
