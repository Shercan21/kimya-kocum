/* 3B lab sayfa kabuğu: başlık, sahne, adımlar, kontroller, ölçümler, sonuç. */
import { Sahne } from './kit3b.js';

const css = `
:root{--ink:#1d2433;--mut:#5b6476;--acc:#2563eb;--bg:#f4f6fb;--kart:#fff}
*{box-sizing:border-box}body{margin:0;font-family:Nunito,system-ui,sans-serif;color:var(--ink);background:var(--bg)}
header{padding:14px 18px 4px;max-width:1240px;margin:auto}h1{font-size:20px;margin:0}h1 small{display:block;font-size:13px;color:var(--mut);font-weight:600;margin-top:2px}
main{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px;padding:10px 18px 18px;max-width:1240px;margin:auto}
@media(max-width:900px){main{grid-template-columns:1fr}}
.sahne{position:relative;border-radius:16px;overflow:hidden;background:#dde5ef;box-shadow:0 6px 24px #1d243322;aspect-ratio:16/10;max-height:74vh;width:100%}
.sahne canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.yuk{position:absolute;inset:0;display:grid;place-items:center;color:var(--mut);font-weight:700}
.ipucu{position:absolute;left:12px;bottom:10px;background:#0009;color:#fff;font-size:12px;padding:5px 10px;border-radius:8px;pointer-events:none;transition:opacity .6s}
.alt{position:absolute;left:12px;right:12px;top:12px;display:flex;justify-content:center;pointer-events:none}
.alt div{background:#ffffffeb;border-radius:12px;padding:8px 14px;font-weight:700;font-size:14px;box-shadow:0 2px 10px #0002;max-width:640px;text-align:center}
.alt div b{color:var(--acc)}
.kart{background:var(--kart);border-radius:14px;padding:12px 14px;box-shadow:0 1px 4px #0001;margin-bottom:12px}
.kart h3{margin:0 0 8px;font-size:14px;color:var(--mut);text-transform:uppercase;letter-spacing:.04em}
.adimlar{list-style:none;margin:0;padding:0;counter-reset:a}.adimlar li{counter-increment:a;padding:7px 8px 7px 34px;border-radius:9px;position:relative;font-size:14px;line-height:1.35}
.adimlar li::before{content:counter(a);position:absolute;left:8px;top:7px;width:19px;height:19px;border-radius:50%;background:#e4e8f1;color:var(--mut);font-size:12px;font-weight:800;display:grid;place-items:center}
.adimlar li.su{background:#eaf1ff}.adimlar li.su::before{background:var(--acc);color:#fff}.adimlar li.ok{color:var(--mut)}.adimlar li.ok::before{content:'✓';background:#16a34a;color:#fff}
.adimlar li small{display:block;color:var(--mut);font-weight:600}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px}
.bar button{border:0;border-radius:10px;padding:10px 16px;font:800 14px Nunito,sans-serif;cursor:pointer;background:#fff;color:var(--ink);box-shadow:0 1px 3px #0002}
.bar button.ana{background:var(--acc);color:#fff}.bar .hiz{display:flex;gap:4px;margin-left:auto;align-items:center;color:var(--mut);font-weight:700;font-size:13px}
.bar .hiz button{padding:8px 10px}.bar .hiz button.on{background:#1d2433;color:#fff}
.olc{display:flex;flex-wrap:wrap;gap:8px}.olc span{background:#f1f4f9;border-radius:10px;padding:7px 11px;font-weight:800;font-size:14px}.olc span b{color:var(--mut);font-weight:700;margin-right:5px}
.cips{display:flex;flex-wrap:wrap;gap:6px}.cips span{background:#f1f4f9;border-radius:8px;padding:4px 9px;font-size:13px;font-weight:700}
.cips.uyari span{background:#fff7ed;color:#9a3412}
.mod{display:inline-flex;background:#e4e8f1;border-radius:12px;padding:4px;margin-bottom:10px}.mod button{border:0;background:none;padding:8px 14px;border-radius:9px;font:800 13px Nunito,sans-serif;color:var(--mut);cursor:pointer}.mod button.on{background:#fff;color:var(--ink);box-shadow:0 1px 4px #0002}
.isaret{position:absolute;pointer-events:none;transform:translate(-50%,-100%);font-size:30px;animation:zip .9s infinite;filter:drop-shadow(0 2px 3px #0005)}@keyframes zip{50%{transform:translate(-50%,-125%)}}
.sonuc{background:#ecfdf3;border:1px solid #bbf7d0;color:#14532d;border-radius:12px;padding:10px 12px;font-weight:700;margin-top:10px;display:none;line-height:1.45}
body.gomulu header{display:none}body.gomulu{background:transparent}
`;

export async function Lab3B(L) {
  document.title = 'Sanal Lab 3B · ' + L.baslik;
  const st = document.createElement('style'); st.textContent = css; document.head.append(st);
  if (!document.querySelector('link[href*="Nunito"]')) document.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">');
  const gomulu = /(^#|&)gomulu\b/.test(location.hash); if (gomulu) document.body.classList.add('gomulu');
  document.body.insertAdjacentHTML('beforeend', `
<header><h1>🧪 ${L.baslik}<small>${L.alt || ''}</small></h1></header>
<main><section>
  ${L.kendin ? `<div class="mod"><button data-m="izle" class="on">📘 Kitaptaki deney · izle</button><button data-m="kendin">🧑‍🔬 Kendin yap</button></div>` : ''}
  <div class="sahne" id="sahne"><div class="alt"><div id="altyazi">Malzemeler tezgâhta. <b>Başlat</b>’a bas, deneyi izle.</div></div></div>
  <div class="bar"><button class="ana" id="basla">▶ Başlat</button><button id="bastan">⟲ Baştan</button><button id="gorus">🎥 Görünümü sıfırla</button>
   <div class="hiz">Hız <button data-h="1" class="on">1×</button><button data-h="2">2×</button><button data-h="4">4×</button></div></div>
  <div class="sonuc" id="sonuc"></div>
</section><aside>
  ${L.olcumler?.length ? `<div class="kart"><h3>Ölçümler</h3><div class="olc" id="olc">${L.olcumler.map(([id, ad, b]) => `<span><b>${ad}</b><i id="o_${id}">–</i>${b ? ' ' + b : ''}</span>`).join('')}</div></div>` : ''}
  <div class="kart" id="dinOlc" style="display:none"><h3>Ölçümler</h3><div class="olc"></div></div>
  <div class="kart"><h3>Adımlar</h3><ol class="adimlar" id="adimlar">${L.adimlar.map(([b, a]) => `<li>${b}<small>${a || ''}</small></li>`).join('')}</ol></div>
  <div class="kart"><h3>Malzemeler</h3><div class="cips">${(L.malzemeler || []).map(m => `<span>${m}</span>`).join('')}</div>
  ${L.guvenlik?.length ? `<h3 style="margin-top:10px">Güvenlik</h3><div class="cips uyari">${L.guvenlik.map(m => `<span>⚠ ${m}</span>`).join('')}</div>` : ''}</div>
</aside></main>`);
  const $ = s => document.querySelector(s), kutu = $('#sahne');
  let K = null, M = null, durum = 'hazir', oturum = 0;
  const P = {
    adim(i) { document.querySelectorAll('#adimlar li').forEach((li, k) => { li.className = k < i ? 'ok' : k === i ? 'su' : ''; }); const a = L.adimlar[i]; if (a) $('#altyazi').innerHTML = `<b>${i + 1}.</b> ${a[0]}`; },
    yaz(m) { $('#altyazi').innerHTML = m; },
    olc(id, v) { const e = $('#o_' + id); if (e) e.textContent = typeof v === 'number' ? v.toFixed(1).replace('.', ',') : v; },
    bitti(m) { document.querySelectorAll('#adimlar li').forEach(li => li.className = 'ok'); const s = $('#sonuc'); s.innerHTML = '✅ ' + (m || L.sonuc || 'Deney tamamlandı.'); s.style.display = 'block'; $('#altyazi').innerHTML = '<b>Deney tamamlandı.</b> Sahneyi döndürüp inceleyebilirsin.'; durum = 'bitti'; $('#basla').textContent = '▶ Yeniden'; },
  };
  const dinOlc = $('#dinOlc');
  document.addEventListener('lab-olcum', e => { const { id, ad, birim, v } = e.detail; let s = dinOlc.querySelector('[data-id="' + id + '"]'); if (!s) { s = document.createElement('span'); s.dataset.id = id; s.innerHTML = '<b></b><i></i>'; dinOlc.querySelector('.olc').append(s); } s.querySelector('b').textContent = ad; s.querySelector('i').textContent = v + (birim ? ' ' + birim : ''); dinOlc.style.display = ''; });
  document.addEventListener('lab-olcum-ad', e => { const s = dinOlc.querySelector('[data-id="' + e.detail.id + '"]'); if (s) s.querySelector('b').textContent = e.detail.ad; });
  async function kur() {
    oturum++; if (L.sifirla) await L.sifirla(); if (K) K.yok(); dinOlc.querySelector('.olc').innerHTML = ''; dinOlc.style.display = 'none'; kutu.querySelectorAll('.yuk,.ipucu').forEach(e => e.remove());
    const y = document.createElement('div'); y.className = 'yuk'; y.textContent = '3B laboratuvar hazırlanıyor…'; kutu.append(y);
    K = await Sahne(kutu, L.sahne || {}); y.remove(); K.hiz = +document.querySelector('.hiz .on').dataset.h;
    M = await L.kur(K); (L.olcumler || []).forEach(([id]) => P.olc(id, '–')); if (L.ilkOlcum) L.ilkOlcum(M, P);
    const ip = document.createElement('div'); ip.className = 'ipucu'; ip.textContent = 'Döndürmek için sürükle · yakınlaştırmak için kaydır / iki parmak'; kutu.append(ip); setTimeout(() => ip.style.opacity = 0, 6000);
    document.querySelectorAll('#adimlar li').forEach(li => li.className = ''); $('#sonuc').style.display = 'none'; P.yaz('Malzemeler tezgâhta. <b>Başlat</b>’a bas, deneyi izle.');
    durum = 'hazir'; $('#basla').textContent = '▶ Başlat';
    if (typeof mod !== 'undefined' && mod === 'kendin') { kAdim = 0; kMesgul = false; durum = 'kendin'; kendinHazirla(); }
  }
  let mod = 'izle', kAdim = 0, isaret = null, hedefler = [], kMesgul = false;
  const isaretKaldir = () => { if (isaret) { isaret.remove(); isaret = null; } };
  function kendinHazirla() { isaretKaldir(); hedefler = []; if (kAdim >= L.adimlar.length) { P.bitti(); return; }
    P.adim(kAdim); hedefler = (L.kendin.hedefler(M, kAdim) || []).filter(o => o && o.visible !== false);
    const a = L.adimlar[kAdim]; P.yaz(`<b>${kAdim + 1}.</b> ${a[0]} — ${hedefler.length ? '👆 işaretli alete <b>tıkla</b>' : '<b>Devam</b>’a bas'}`);
    $('#basla').textContent = hedefler.length ? '⏭ Bu adımı yap' : '▶ Devam';
    if (hedefler.length) { isaret = document.createElement('div'); isaret.className = 'isaret'; isaret.textContent = '👆'; kutu.append(isaret); } }
  async function kendinYap() { if (kMesgul) return; kMesgul = true; isaretKaldir(); $('#basla').textContent = '⏳ Yapılıyor…'; const o = oturum;
    try { await L.kendin.adim(M, kAdim); } catch (e) { } if (o !== oturum) return; kMesgul = false; kAdim++; kendinHazirla(); }
  document.querySelectorAll('.mod button').forEach(b => b.onclick = async () => { document.querySelectorAll('.mod button').forEach(x => x.classList.toggle('on', x === b)); mod = b.dataset.m; await kur(); });
  // tıklama: hedef aleti seçme
  let basXY = null; kutu.addEventListener('pointerdown', e => { basXY = [e.clientX, e.clientY]; });
  kutu.addEventListener('pointerup', e => { if (mod !== 'kendin' || !basXY || !hedefler.length || kMesgul) return; if (Math.hypot(e.clientX - basXY[0], e.clientY - basXY[1]) > 6) return;
    const r = K.r.domElement.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
    const icinde = h => { const b = new K.THREE.Box3(); h.traverse(c => { if (c.isMesh && c.visible) b.expandByObject(c); }); if (b.isEmpty()) return false; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { const p = new K.THREE.Vector3(x, y, z).project(K.cam); const sx = (p.x + 1) / 2 * r.width, sy = (1 - p.y) / 2 * r.height; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
      return mx >= x0 - 14 && mx <= x1 + 14 && my >= y0 - 14 && my <= y1 + 14; };
    if (hedefler.some(icinde)) kendinYap(); else P.yaz(`<b>${kAdim + 1}.</b> ${L.adimlar[kAdim][0]} — bu değil; <b>👆 işaretli</b> alete tıkla`); });
  function isaretTakip() { if (isaret && hedefler.length && K) { const b = new K.THREE.Box3(); hedefler.forEach(h => h.traverse(c => { if (c.isMesh && c.visible) b.expandByObject(c); })); const p = new K.THREE.Vector3((b.min.x + b.max.x) / 2, b.max.y + 0.3, (b.min.z + b.max.z) / 2).project(K.cam); const r = kutu.getBoundingClientRect();
      isaret.style.left = ((p.x + 1) / 2 * r.width) + 'px'; isaret.style.top = ((1 - p.y) / 2 * r.height) + 'px'; } requestAnimationFrame(isaretTakip); } isaretTakip();
  $('#basla').onclick = async () => {
    if (mod === 'kendin') { if (durum === 'bitti') { await kur(); return; } if (!hedefler.length && !kMesgul) kendinYap(); else if (hedefler.length) kendinYap(); return; }
    if (durum === 'bitti') { await kur(); }
    if (durum === 'hazir') { durum = 'calisiyor'; $('#basla').textContent = '⏸ Duraklat'; const o = oturum; try { await L.calistir(K, M, P); } catch (e) { console.error(e); } if (o === oturum && durum !== 'bitti') P.bitti(); return; }
    if (durum === 'calisiyor') { K.durdu = true; durum = 'durdu'; $('#basla').textContent = '▶ Devam'; return; }
    if (durum === 'durdu') { K.durdu = false; durum = 'calisiyor'; $('#basla').textContent = '⏸ Duraklat'; }
  };
  $('#bastan').onclick = () => kur();
  $('#gorus').onclick = () => { K.kamera(K.evPos, K.evHedef, 0.8); const d = K.durdu; K.durdu = false; setTimeout(() => K.durdu = d, 900); };
  document.querySelectorAll('.hiz button').forEach(b => b.onclick = () => { document.querySelectorAll('.hiz button').forEach(x => x.classList.toggle('on', x === b)); if (K) K.hiz = +b.dataset.h; });
  if (gomulu) { const bildir = () => { try { parent.postMessage({ tur: 'kk-lab-yukseklik', ad: L.ad, h: document.documentElement.scrollHeight }, '*'); } catch { } }; new ResizeObserver(bildir).observe(document.body); bildir(); }
  await kur();
  window.__lab = { get K() { return K; }, get M() { return M; }, P };
}
