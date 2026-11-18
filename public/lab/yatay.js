/* Kimya Koçum · Sanal Lab · Telefonda yatay ekran.
   Telefonda lab dikey açıldıysa: ilk dokunuşta (Başlat, sekme ya da "Yatay ekranda aç") tam ekrana geçer ve
   ekranı yataya kilitler (Android / uygulama). Kilit desteklenmezse (iPhone) "telefonunu yan çevir" der.
   Yatay telefonda sahne solda, kontroller sağda olacak şekilde sıkışık düzen kullanılır. */
(function(){
if(window.__lkYatay)return;window.__lkYatay=1;
const tel=()=>{try{return matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<=600;}catch(e){return false;}};
const CSS=`
#lkYatay{display:none;margin:10px 12px 0;padding:10px 12px;border-radius:12px;background:#fef3c7;border:1.5px solid #f59e0b;color:#78350f;font-size:14px;font-weight:700;align-items:center;gap:10px;flex-wrap:wrap}
#lkYatay button{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-weight:800;cursor:pointer}
#lkYatayBtn{background:#2563eb;color:#fff}#lkYatayKapat{background:transparent;color:#92400e;text-decoration:underline;padding:8px 4px!important}
body.lk-tel #lkYatay{display:flex}body.lk-tel.lk-gizle #lkYatay,body.video #lkYatay{display:none!important}
#lkCik{display:none;position:fixed;top:6px;right:6px;z-index:99;border:0;border-radius:999px;background:rgba(15,23,42,.75);color:#fff;font:inherit;font-weight:800;font-size:13px;padding:6px 12px}
body.lk-tam #lkCik{display:block}
@media (orientation:landscape) and (max-height:520px){
 body.lk-tel #lkYatay{display:none}
 body:not(.video) header{padding:4px 12px}body:not(.video) header h1{font-size:15px}body:not(.video) header p{display:none}
 body:not(.video) .tabs{padding:4px 10px 0;gap:6px}body:not(.video) .tab{padding:5px 12px;font-size:14px}
 body:not(.video) main{grid-template-columns:max-content minmax(0,1fr)!important;gap:10px;padding:6px 8px 16px;max-width:none}
 body:not(.video) main>section:first-child{position:sticky;top:4px;align-self:start;padding:6px;max-width:46vw}
 body:not(.video) #svg{height:calc(100vh - 150px);width:auto;max-width:100%;margin:0 auto}
 body:not(.video) .readouts{gap:4px;margin-top:4px}body:not(.video) .ro{padding:2px 6px;font-size:12px;line-height:1.2}body:not(.video) .ro b{font-size:15px}body:not(.video) .ro small{font-size:11px}body:not(.video) .safety{display:none}
}`;
function kur(){
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  const ban=document.createElement('div');ban.id='lkYatay';
  ban.innerHTML='<span>📱 Deney yatay ekranda daha rahat görünür.</span><button id="lkYatayBtn">🔄 Yatay ekranda aç</button><button id="lkYatayKapat">Dikey devam et</button>';
  const h=document.querySelector('header');if(h&&h.parentNode)h.parentNode.insertBefore(ban,h.nextSibling);else document.body.prepend(ban);
  const cik=document.createElement('button');cik.id='lkCik';cik.textContent='✕ Tam ekrandan çık';document.body.appendChild(cik);
  const B=document.body;if(tel())B.classList.add('lk-tel');
  let vazgecti=false;
  const dikey=()=>{try{return matchMedia('(orientation:portrait)').matches;}catch(e){return innerHeight>innerWidth;}};
  const tamMi=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  async function yatay(){
    if(!tel()||tamMi())return;
    const el=document.documentElement;
    try{if(el.requestFullscreen)await el.requestFullscreen({navigationUI:'hide'});else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();}catch(e){}
    let ok=false;
    try{if(screen.orientation&&screen.orientation.lock){await screen.orientation.lock('landscape');ok=true;}}catch(e){}
    if(!ok&&dikey()){const s=ban.querySelector('span');s.textContent='🔄 Telefonunu yan çevir; deney yatay ekrana sığacak şekilde açılır.';ban.querySelector('#lkYatayBtn').style.display='none';}
  }
  document.addEventListener('click',e=>{
    if(vazgecti||!B.classList.contains('lk-tel')||!dikey()||tamMi())return;
    const t=e.target.closest&&e.target.closest('#kStart,.tab,#lkYatayBtn');if(t)yatay();
  },true);
  ban.querySelector('#lkYatayKapat').onclick=()=>{vazgecti=true;B.classList.add('lk-gizle');};
  cik.onclick=()=>{try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock();}catch(e){}
    try{document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();}catch(e){}};
  const deg=()=>{B.classList.toggle('lk-tam',tamMi());if(!tamMi()){try{screen.orientation&&screen.orientation.unlock&&screen.orientation.unlock();}catch(e){}}};
  document.addEventListener('fullscreenchange',deg);document.addEventListener('webkitfullscreenchange',deg);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(kur,0));else setTimeout(kur,0);
})();
