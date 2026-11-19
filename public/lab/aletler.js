/* Kimya Koçum · Sanal Lab · Ek aletler (aletler.js)
   labkit.js'teki sahneye (Scene) yeni araç-gereç ve cihazlar ekler. Envanter: claude/lab-envanteri.md
   Her alet: S.A.<ad>(x, taban_y, seçenekler) → {g, ...yöntemler}. x = orta, taban_y = aletin dayandığı çizgi.
   Bu dosya labkit.js'ten SONRA yüklenmeli; yalnızca bu dosyayı yükleyen sayfalarda (Deney Atölyesi vb.) etkindir. */
(function(){
'use strict';
window.LK_EXT=window.LK_EXT||[];
window.LK_EXT.push(function(S,el){
const A=S.A={};
const G=()=>el('g',{filter:'url(#sh)'},S.layer);
const glass=S.glass,txt=S.txt;
const P=(g,d,o)=>el('path',Object.assign({d},o||{}),g);
const R=(g,x,y,w,h,o)=>el('rect',Object.assign({x,y,width:w,height:h},o||{}),g);
const C=(g,cx,cy,r,o)=>el('circle',Object.assign({cx,cy,r},o||{}),g);
const E=(g,cx,cy,rx,ry,o)=>el('ellipse',Object.assign({cx,cy,rx,ry},o||{}),g);
const Lin=(g,x1,y1,x2,y2,o)=>el('line',Object.assign({x1,y1,x2,y2,stroke:'#334155','stroke-width':1},o||{}),g);
const now=()=>performance.now();
const hl=(g,d)=>P(g,d,{fill:'none',stroke:'rgba(255,255,255,.7)','stroke-width':2.5,'stroke-linecap':'round'});
const lbl=(g,V,x,y,s)=>{if(s)V.lbl=txt(g,x,y,s,9);};
// sıvı tutan dikdörtgen sütun (pipet, küvet vb.)
function sutun(g,x0,x1,ybot,ytop,cap){const id=S.uid('sc');const cp=el('clipPath',{id},S.defs);R(cp,x0,ytop,x1-x0,ybot-ytop);
  const liq=R(g,x0,ybot,x1-x0,0,{fill:'rgba(196,226,255,.82)','clip-path':`url(#${id})`});
  const V={liq,vol:0,cap,set(v,c){V.vol=v;const y=ybot-(ybot-ytop)*Math.max(0,Math.min(1,v/cap));liq.setAttribute('y',y);liq.setAttribute('height',ybot-y);if(c)liq.setAttribute('fill',c);return V;}};return V;}

/* ================= CAM MALZEMELER ================= */
A.pipet=(x,y=470,o={})=>{const g=G(),cap=o.cap||10,h=o.h||230,top=y-h;
  const V=sutun(g,x-3,x+3,y-18,top+30,cap);R(g,x-4,top,8,h-20,Object.assign({rx:3},glass));P(g,`M${x-4} ${y-20} L${x+4} ${y-20} L${x+1} ${y} L${x-1} ${y} Z`,glass);
  for(let k=0;k<=cap;k++){const yy=y-18-(h-48)*k/cap;Lin(g,x-4,yy,x+(k%5?0:4),yy,{'stroke-width':.6});}txt(g,x+16,top+16,cap+' mL',7);
  return Object.assign(V,{g,tip:[x,y],mouth:[x,top]});};
A.tamPipet=(x,y=470,o={})=>{const g=G(),h=o.h||230,top=y-h,cap=o.cap||10;
  const id=S.uid('tp');const cp=el('clipPath',{id},S.defs);const d=`M${x-3} ${top} L${x+3} ${top} L${x+3} ${top+70} C${x+14} ${top+78} ${x+14} ${top+130} ${x+3} ${top+138} L${x+3} ${y-16} L${x+1} ${y} L${x-1} ${y} L${x-3} ${y-16} L${x-3} ${top+138} C${x-14} ${top+130} ${x-14} ${top+78} ${x-3} ${top+70} Z`;
  P(cp,d);const liq=R(g,x-14,y,28,0,{fill:'rgba(196,226,255,.82)','clip-path':`url(#${id})`});P(g,d,glass);Lin(g,x-5,top+40,x+5,top+40,{'stroke-width':1});txt(g,x+18,top+104,cap+' mL',7);
  return {g,tip:[x,y],mouth:[x,top],vol:0,cap,set(v,c){this.vol=v;const f=Math.max(0,Math.min(1,v/cap));const yy=y-(y-top-40)*f;liq.setAttribute('y',yy);liq.setAttribute('height',y-yy);if(c)liq.setAttribute('fill',c);return this;}};};
A.puar=(x,y=300)=>{const g=G();E(g,x,y-18,13,18,{fill:'#dc2626',stroke:'#7f1d1d'});[[-7,-30],[7,-30],[0,-4]].forEach(([dx,dy])=>C(g,x+dx,y+dy,3.2,{fill:'#991b1b'}));R(g,x-3,y-2,6,10,{fill:'#7f1d1d',rx:1});return {g};};
A.damlalik=(x,y=420,o={})=>{const g=G();P(g,`M${x-4} ${y-70} L${x+4} ${y-70} L${x+4} ${y-14} L${x+1} ${y} L${x-1} ${y} L${x-4} ${y-14} Z`,glass);
  const liq=R(g,x-3,y-14,6,0,{fill:o.renk||'rgba(196,226,255,.85)'});P(g,`M${x-6} ${y-70} L${x+6} ${y-70} L${x+6} ${y-84} Q${x} ${y-104} ${x-6} ${y-84} Z`,{fill:'#dc2626',stroke:'#7f1d1d'});
  return {g,tip:[x,y],set(f,c){liq.setAttribute('y',y-14-40*f);liq.setAttribute('height',40*f);if(c)liq.setAttribute('fill',c);}};};
A.piset=(x,y=520,o={})=>{const g=G();const V=S.vessel(g,`M${x-22} ${y-80} Q${x-26} ${y-80} ${x-26} ${y-74} L${x-26} ${y-6} Q${x-26} ${y} ${x-20} ${y} L${x+20} ${y} Q${x+26} ${y} ${x+26} ${y-6} L${x+26} ${y-74} Q${x+26} ${y-80} ${x+22} ${y-80} Z`,{x0:x-26,x1:x+26,ybot:y-1,ytop:y-74,cap:250});
  V.set(170,'rgba(225,240,255,.6)');R(g,x-10,y-92,20,12,{fill:'#e5e7eb',stroke:'#9ca3af',rx:2});P(g,`M${x} ${y-92} L${x} ${y-110} Q${x} ${y-118} ${x+10} ${y-118} L${x+38} ${y-112}`,{fill:'none',stroke:'#cbd5e1','stroke-width':4,'stroke-linecap':'round'});
  txt(g,x,y-36,o.ad||'SAF SU',7,{'font-weight':800,fill:'#1e3a8a'});V.tip=[x+38,y-112];return V;};
A.balonJoje=(x,y=520,o={})=>{const g=G(),cap=o.cap||100,r=34;const d=`M${x-6} ${y-170} L${x+6} ${y-170} L${x+6} ${y-2*r+4} C${x+r} ${y-2*r+10} ${x+r+4} ${y-6} ${x+16} ${y} L${x-16} ${y} C${x-r-4} ${y-6} ${x-r} ${y-2*r+10} ${x-6} ${y-2*r+4} Z`;
  const V=S.vessel(g,d,{x0:x-r-4,x1:x+r+4,ybot:y-1,ytop:y-160,cap:cap*1.3,shape:f=>f<.77?Math.sqrt(f/.77)*.42:.42+(f-.77)/.23*.58});E(g,x,y-170,7.5,2,{fill:'rgba(255,255,255,.6)',stroke:'rgba(90,115,150,.85)'});
  Lin(g,x-6,y-130,x+6,y-130,{stroke:'#0f172a','stroke-width':1.2});txt(g,x,y-40,cap+' mL',7);lbl(g,V,x,y+16,o.ad);V.mouth=[x,y-170];return V;};
A.yuvarlakBalon=(x,y=470,o={})=>{const g=G(),r=o.r||36,cap=o.cap||250;const d=`M${x-8} ${y-2*r-50} L${x+8} ${y-2*r-50} L${x+8} ${y-2*r+3} A${r} ${r} 0 1 1 ${x-8} ${y-2*r+3} Z`;
  const V=S.vessel(g,d,{x0:x-r,x1:x+r,ybot:y-1,ytop:y-2*r-40,cap,shape:f=>f<.85?(1-Math.cos(Math.PI*f/.85))/2*.95:.95+(f-.85)/.15*.05});hl(g,`M${x-r+10} ${y-r-6} Q${x-r+8} ${y-r-20} ${x-r+18} ${y-2*r+12}`);lbl(g,V,x,y+16,o.ad);V.mouth=[x,y-2*r-50];V.r=r;return V;};
A.nuce=(x,y=524,o={})=>{const V=S.erlen(x,y,o.cap||250,o.olcek||1,o.ad);V.g.setAttribute('opacity',1);const s=o.olcek||1;const yy=y-120*s+22*s;P(V.g,`M${x+15*s} ${yy} L${x+42*s} ${yy-6*s} L${x+42*s} ${yy+4*s} L${x+15*s} ${yy+10*s} Z`,glass);V.kol=[x+42*s,yy-1*s];return V;};
A.huni=(x,y=380,o={})=>{const g=G(),w=o.w||40;const d=`M${x-w} ${y-50} L${x+w} ${y-50} L${x+5} ${y} L${x+4} ${y+46} L${x-4} ${y+46} L${x-5} ${y} Z`;const V=S.vessel(g,d,{x0:x-w,x1:x+w,ybot:y+45,ytop:y-48,cap:60,shape:f=>Math.cbrt(f)});E(g,x,y-50,w,3,{fill:'rgba(255,255,255,.55)',stroke:'rgba(90,115,150,.85)'});V.tip=[x,y+46];V.mouth=[x,y-50];return V;};
A.ayirmaHunisi=(x,y=360,o={})=>{const g=G();const d=`M${x-6} ${y-150} L${x+6} ${y-150} L${x+6} ${y-136} C${x+40} ${y-110} ${x+36} ${y-40} ${x+6} ${y-14} L${x+5} ${y} L${x-5} ${y} L${x-6} ${y-14} C${x-36} ${y-40} ${x-40} ${y-110} ${x-6} ${y-136} Z`;
  const V=S.vessel(g,d,{x0:x-40,x1:x+40,ybot:y-1,ytop:y-140,cap:250});const alt=R(g,x-40,y,80,0,{fill:'rgba(0,0,0,0)','clip-path':V.liq.getAttribute('clip-path')});V.g.insertBefore(alt,V.g.children[3]);
  R(g,x-8,y-158,16,9,{fill:'#1e3a8a',rx:2});R(g,x-12,y+4,24,6,{fill:'#1e40af',rx:3});C(g,x+13,y+7,4,{fill:'#1e3a8a'});P(g,`M${x-3} ${y+10} L${x+3} ${y+10} L${x+1} ${y+40} L${x-1} ${y+40} Z`,glass);
  V.tip=[x,y+40];V.katman=(alttaki,renk)=>{const yb=y-1,top=V.level(alttaki);alt.setAttribute('y',top);alt.setAttribute('height',yb-top);alt.setAttribute('fill',renk);};return V;};
A.baget=(x,y=470,o={})=>{const g=G(),h=o.h||170,a=o.aci||0;const r=Lin(g,x,y,x+Math.sin(a)*h,y-Math.cos(a)*h,{stroke:'rgba(160,190,220,.9)','stroke-width':5,'stroke-linecap':'round'});
  let k=0;S.ticks.push(()=>{if(k){const t=now()/220,aa=a+Math.sin(t)*.18;r.setAttribute('x2',x+Math.sin(aa)*h);r.setAttribute('y2',y-Math.cos(aa)*h);r.setAttribute('x1',x+Math.sin(t)*6);}});return {g,karistir(on){k=on?1:0;}};};
A.saatCami=(x,y=520,o={})=>{const g=G(),w=o.w||46;P(g,`M${x-w} ${y-12} Q${x} ${y+6} ${x+w} ${y-12}`,{fill:'rgba(225,238,252,.4)',stroke:'rgba(90,115,150,.85)','stroke-width':1.4});const ic=E(g,x,y-4,0,0,{fill:'#f8fafc'});return {g,koy(r,c){ic.setAttribute('rx',r);ic.setAttribute('ry',r*.3);if(c)ic.setAttribute('fill',c);}};};
A.petri=(x,y=520,o={})=>{const g=G(),w=o.w||50;const V=S.vessel(g,`M${x-w} ${y-16} L${x-w} ${y-2} Q${x-w} ${y} ${x-w+3} ${y} L${x+w-3} ${y} Q${x+w} ${y} ${x+w} ${y-2} L${x+w} ${y-16}`,{x0:x-w,x1:x+w,ybot:y-1,ytop:y-14,cap:20});
  if(o.kapak!==false)R(g,x-w-3,y-20,2*w+6,5,Object.assign({rx:2},glass));return V;};
A.camBoru=(x,y=300,o={})=>{const g=G(),L=o.L||260,yat=o.yatay!==false;const r=yat?R(g,x-L/2,y-8,L,16,Object.assign({rx:7},glass)):R(g,x-8,y-L,16,L,Object.assign({rx:7},glass));
  const ic=R(g,yat?x-L/2:x-6,yat?y-6:y,0,0,{fill:'rgba(255,255,255,.95)'});return {g,uclar:yat?[[x-L/2,y],[x+L/2,y]]:[[x,y-L],[x,y]],halka(px,c='#f8fafc'){C(g,px,y,7,{fill:c,opacity:.95});}};};
A.uBorusu=(x,y=470,o={})=>{const g=G(),w=o.w||60,h=o.h||200;const dis=`M${x-w-9} ${y-h} L${x-w-9} ${y-20} Q${x-w-9} ${y+9} ${x} ${y+9} Q${x+w+9} ${y+9} ${x+w+9} ${y-20} L${x+w+9} ${y-h}`,ic=`M${x-w+9} ${y-h} L${x-w+9} ${y-20} Q${x-w+9} ${y-9} ${x} ${y-9} Q${x+w-9} ${y-9} ${x+w-9} ${y-20} L${x+w-9} ${y-h}`;
  const sol=R(g,x-w-8,y,16,0,{fill:'rgba(80,140,225,.6)'}),sag=R(g,x+w-8,y,16,0,{fill:'rgba(80,140,225,.6)'}),alt=P(g,`M${x-w-8} ${y-20} Q${x-w-8} ${y+8} ${x} ${y+8} Q${x+w+8} ${y+8} ${x+w+8} ${y-20} L${x+w-8} ${y-20} Q${x+w-8} ${y-8} ${x} ${y-8} Q${x-w+8} ${y-8} ${x-w+8} ${y-20} Z`,{fill:'rgba(80,140,225,.6)'});
  P(g,dis,{fill:'none',stroke:'rgba(90,115,150,.85)','stroke-width':1.4});P(g,ic,{fill:'none',stroke:'rgba(90,115,150,.85)','stroke-width':1.4});
  return {g,set(hSol,hSag,c){[[sol,hSol],[sag,hSag]].forEach(([r,hh])=>{r.setAttribute('y',y-20-hh);r.setAttribute('height',hh);if(c)r.setAttribute('fill',c);});if(c)alt.setAttribute('fill',c);}};};
A.kilcal=(x,y=520,o={})=>{const V=A.kristalizuar(x,y,{w:60});V.set(40);const t=[];[[-30,6],[-10,4],[10,2.6],[30,1.6]].forEach(([dx,r],i)=>{R(V.g,x+dx-r-1,y-130,2*r+2,120,Object.assign({rx:1},glass));t.push(R(V.g,x+dx-r,y-20,2*r,0,{fill:'rgba(80,140,225,.65)'}));});
  V.yuksel=f=>t.forEach((r,i)=>{const h=f*[14,22,36,56][i];r.setAttribute('y',y-20-h);r.setAttribute('height',h);});return V;};
A.sogutucu=(x,y=200,o={})=>{const g=G(),L=o.L||220,a=(o.aci==null?20:o.aci)*Math.PI/180;g.setAttribute('transform',`rotate(${o.aci==null?20:o.aci} ${x} ${y})`);
  R(g,x,y-14,L,28,Object.assign({rx:12},glass));R(g,x-20,y-5,L+40,10,Object.assign({rx:4},glass));const su=R(g,x+2,y-12,L-4,24,{fill:'rgba(120,180,255,.25)',rx:10});
  [[x+16,y+14,1],[x+L-16,y-14,-1]].forEach(([px,py,s])=>R(g,px-4,s>0?py:py-14,8,14,Object.assign({rx:2},glass)));txt(g,x+16,y+40,'su girişi',7);txt(g,x+L-16,y-28,'su çıkışı',7);
  return {g,giris:[x-20,y],cikis:[x+L+20,y],su(on){su.setAttribute('fill',on?'rgba(80,150,255,.45)':'rgba(120,180,255,.25)');}};};
A.kristalizuar=(x,y=520,o={})=>{const g=G(),w=o.w||70,h=o.h||46;const V=S.vessel(g,`M${x-w-3} ${y-h} L${x-w} ${y-h+3} L${x-w} ${y-5} Q${x-w} ${y} ${x-w+5} ${y} L${x+w-5} ${y} Q${x+w} ${y} ${x+w} ${y-5} L${x+w} ${y-h}`,{x0:x-w,x1:x+w,ybot:y-1,ytop:y-h+4,cap:o.cap||300});V.g=g;return V;};
A.desikator=(x,y=520)=>{const g=G();P(g,`M${x-70} ${y-70} Q${x-74} ${y-10} ${x-40} ${y} L${x+40} ${y} Q${x+74} ${y-10} ${x+70} ${y-70} Z`,glass);R(g,x-64,y-52,128,4,{fill:'#cbd5e1'});
  for(let i=0;i<14;i++)C(g,x-40+((i*29)%80),y-14-((i*7)%22),4,{fill:i%3?'#60a5fa':'#f472b6',opacity:.8});P(g,`M${x-78} ${y-70} Q${x} ${y-120} ${x+78} ${y-70} Z`,glass);E(g,x,y-104,10,7,Object.assign({},glass));txt(g,x,y+16,'desikatör',8);return {g};};
A.tersTup=(x,y=470,o={})=>{const g=G(),h=o.h||170,w=13,cap=o.cap||50;const id=S.uid('tt');const cp=el('clipPath',{id},S.defs);const d=`M${x-w} ${y} L${x-w} ${y-h+w} A${w} ${w} 0 0 1 ${x+w} ${y-h+w} L${x+w} ${y} Z`;P(cp,d);
  const su=R(g,x-w,y-h,2*w,h,{fill:'rgba(190,225,255,.8)','clip-path':`url(#${id})`});P(g,d,glass);if(o.olcekli)for(let k=0;k<=10;k++){const yy=y-h+10+(h-20)*k/10;Lin(g,x-w,yy,x-w+(k%5?4:8),yy,{'stroke-width':.6});if(k%5===0)txt(g,x+w+10,yy+3,Math.round(cap*k/10),6.5);}
  return {g,cap,gaz(v){const f=Math.max(0,Math.min(1,v/cap)),yy=y-h+(h-10)*f;su.setAttribute('y',yy);su.setAttribute('height',y-yy);}};};
A.eudiometre=(x,y=470,o={})=>A.tersTup(x,y,Object.assign({h:220,olcekli:true,cap:50},o));
A.dumas=(x,y=470)=>{const g=G();const V=S.vessel(g,`M${x-2} ${y-150} L${x+2} ${y-150} L${x+2} ${y-80} C${x+40} ${y-80} ${x+44} ${y} ${x} ${y} C${x-44} ${y} ${x-40} ${y-80} ${x-2} ${y-80} Z`,{x0:x-44,x1:x+44,ybot:y-1,ytop:y-80,cap:250,shape:f=>(1-Math.cos(Math.PI*f))/2});txt(g,x,y+16,'Dumas balonu',8);V.mouth=[x,y-150];return V;};
A.kuvet=(x,y=520,o={})=>{const g=G();const V=S.vessel(g,`M${x-10} ${y-46} L${x-10} ${y} L${x+10} ${y} L${x+10} ${y-46} Z`,{x0:x-10,x1:x+10,ybot:y-1,ytop:y-40,cap:4});R(g,x-10,y-46,20,6,{fill:'rgba(0,0,0,.08)'});V.mouth=[x,y-46];return V;};
A.lam=(x,y=520,o={})=>{const g=G();R(g,x-46,y-5,92,5,Object.assign({rx:1},glass));const n=C(g,x,y-6,o.damla?5:0,{fill:o.renk||'rgba(196,226,255,.9)'});R(g,x-12,y-7,24,2,{fill:'rgba(225,238,252,.7)',stroke:'rgba(90,115,150,.6)','stroke-width':.6});return {g,damla(r,c){n.setAttribute('r',r);if(c)n.setAttribute('fill',c);}};};
A.destilasyon=(x,y=524,o={})=>{const isi=A.isiticiTabla(x,y,{});const B=A.yuvarlakBalon(x,y-44,{r:34,cap:250});A.halka(x,y-110,{r:30});
  const g=G();P(g,`M${x-8} ${y-162} L${x-8} ${y-200} L${x+8} ${y-200} L${x+8} ${y-162}`,glass);P(g,`M${x+8} ${y-190} L${x+40} ${y-190} L${x+40} ${y-180} L${x+8} ${y-180}`,glass);const T=S.thermo(x,y-260,60,0,120);T.g.setAttribute('opacity',1);
  const K=A.sogutucu(x+42,y-185,{L:170,aci:22});const er=S.erlen(x+250,y,100,.7);er.g.setAttribute('opacity',1);const dam=el('g',{},S.top);
  let on=0;S.ticks.push(()=>{if(on&&Math.random()<.04){const c=C(dam,x+228,y-112,2.3,{fill:'rgba(80,140,225,.9)'});S.anim.push({e:c,y:y-112,vy:0,stop:y-60,kind:'down'});}});
  return {g,balon:B,toplama:er,soğutucu:K,termometre:T,isitici:isi,calis(v){on=v?1:0;isi.on(v);K.su(v);}};};
A.geriSogutucu=(x,y=524,o={})=>{const B=A.yuvarlakBalon(x,y-40,{r:32});const g=G();R(g,x-12,y-320,24,210,Object.assign({rx:10},glass));R(g,x-5,y-330,10,230,Object.assign({rx:4},glass));txt(g,x+30,y-220,'geri soğutucu',7,{'text-anchor':'start'});return {g,balon:B};};

/* ================= PORSELEN VE METAL ================= */
A.kapsul=(x,y=520,o={})=>{const g=G(),w=o.w||40;const V=S.vessel(g,`M${x-w} ${y-24} Q${x-w} ${y} ${x} ${y} Q${x+w} ${y} ${x+w} ${y-24} Z`,{x0:x-w,x1:x+w,ybot:y-1,ytop:y-20,cap:40,shape:f=>Math.sqrt(f)});
  P(g,`M${x-w} ${y-24} Q${x-w} ${y} ${x} ${y} Q${x+w} ${y} ${x+w} ${y-24}`,{fill:'none',stroke:'#cbd5e1','stroke-width':3});P(g,`M${x+w} ${y-24} l8 -3`,{stroke:'#cbd5e1','stroke-width':3});V.g=g;return V;};
A.kroze=(x,y=520,o={})=>{const g=G();P(g,`M${x-18} ${y-36} L${x+18} ${y-36} L${x+12} ${y} L${x-12} ${y} Z`,{fill:'#f8fafc',stroke:'#94a3b8','stroke-width':1.4});const ic=R(g,x-12,y-6,24,0,{fill:'#9ca3af'});
  const kap=P(g,`M${x-21} ${y-36} L${x+21} ${y-36} L${x+16} ${y-42} L${x-16} ${y-42} Z M${x-4} ${y-42} L${x+4} ${y-42} L${x+4} ${y-48} L${x-4} ${y-48} Z`,{fill:'#f1f5f9',stroke:'#94a3b8'});if(o.kapak===false)kap.setAttribute('opacity',0);
  return {g,doldur(f,c){ic.setAttribute('y',y-4-26*f);ic.setAttribute('height',26*f+2);if(c)ic.setAttribute('fill',c);},kapak(v){kap.setAttribute('opacity',v?1:0);}};};
A.havan=(x,y=520)=>{const g=G();P(g,`M${x-40} ${y-40} Q${x-40} ${y} ${x} ${y} Q${x+40} ${y} ${x+40} ${y-40} Z`,{fill:'#f8fafc',stroke:'#94a3b8','stroke-width':1.5});R(g,x-22,y-4,44,6,{fill:'#e2e8f0',rx:2});
  const tz=E(g,x,y-14,0,0,{fill:'#d1d5db'});const sap=el('g',{},g);R(sap,x-6,y-100,12,70,{fill:'#f1f5f9',stroke:'#94a3b8',rx:6});E(sap,x,y-30,9,7,{fill:'#f1f5f9',stroke:'#94a3b8'});
  let on=0;S.ticks.push(()=>{if(on)sap.setAttribute('transform',`rotate(${Math.sin(now()/140)*14} ${x} ${y-24})`);});return {g,ez(v){on=v?1:0;},toz(r,c){tz.setAttribute('rx',r);tz.setAttribute('ry',r*.35);if(c)tz.setAttribute('fill',c);}};};
A.buchner=(x,y=430,o={})=>{const g=G();P(g,`M${x-40} ${y-46} L${x+40} ${y-46} L${x+36} ${y-6} L${x+8} ${y} L${x+6} ${y+40} L${x-6} ${y+40} L${x-8} ${y} L${x-36} ${y-6} Z`,{fill:'#f8fafc',stroke:'#94a3b8','stroke-width':1.4});
  for(let i=-3;i<=3;i++)C(g,x+i*9,y-10,2,{fill:'#cbd5e1'});const kek=R(g,x-34,y-14,68,0,{fill:'#e5e7eb'});return {g,tip:[x,y+40],kek(h,c){kek.setAttribute('y',y-12-h);kek.setAttribute('height',h);if(c)kek.setAttribute('fill',c);}};};
A.spatul=(x,y=520,o={})=>{const g=G();R(g,x-70,y-4,120,4,{fill:'url(#metalV)',rx:2});P(g,`M${x+50} ${y-6} Q${x+70} ${y-9} ${x+74} ${y-2} Q${x+70} ${y+4} ${x+50} ${y+2} Z`,{fill:'url(#metalV)',stroke:'#6b7280','stroke-width':.6});const yk=E(g,x+62,y-6,0,0,{fill:'#f8fafc'});
  return {g,uc:[x+62,y-6],yukle(r,c){yk.setAttribute('rx',r);yk.setAttribute('ry',r*.6);if(c)yk.setAttribute('fill',c);}};};
A.tupMasasi=(x,y=300,o={})=>{const g=G();R(g,x-70,y-5,90,10,{fill:'#b45309',rx:4});P(g,`M${x+20} ${y-5} L${x+60} ${y-12} L${x+62} ${y-6} L${x+20} ${y} Z M${x+20} ${y+5} L${x+60} ${y+12} L${x+62} ${y+6} L${x+20} ${y} Z`,{fill:'#9ca3af',stroke:'#4b5563','stroke-width':.8});return {g,uc:[x+58,y]};};
A.krozeMasasi=(x,y=300)=>{const g=G();P(g,`M${x-80} ${y-6} L${x+40} ${y-2} Q${x+56} ${y-10} ${x+62} ${y-2} M${x-80} ${y+6} L${x+40} ${y+2} Q${x+56} ${y+10} ${x+62} ${y+2}`,{fill:'none',stroke:'#6b7280','stroke-width':3.5,'stroke-linecap':'round'});return {g,uc:[x+60,y]};};
A.pens=(x,y=520)=>{const g=G();P(g,`M${x-50} ${y-2} L${x+50} ${y-7} M${x-50} ${y-2} L${x+50} ${y+3}`,{stroke:'#9ca3af','stroke-width':3,'stroke-linecap':'round'});return {g,uc:[x+50,y-2]};};
A.halka=(x,y=380,o={})=>{const g=G(),r=o.r||40;E(g,x,y,r,r*.22,{fill:'none',stroke:'#4b5563','stroke-width':4});R(g,x-r-60,y-3,60,6,{fill:'url(#metalV)'});return {g};};
A.kilUcgen=(x,y=380,o={})=>{const g=G(),r=o.r||34;P(g,`M${x-r} ${y} L${x+r} ${y}`,{stroke:'#6b7280','stroke-width':2});[[-r*.55,0],[r*.55,0]].forEach(([dx])=>R(g,x+dx-12,y-3.5,24,7,{fill:'#f5f5f4',stroke:'#a8a29e',rx:3}));E(g,x,y,r,r*.24,{fill:'none',stroke:'#6b7280','stroke-width':1.5});return {g};};
A.tupFircasi=(x,y=520)=>{const g=G();Lin(g,x-70,y-4,x+70,y-4,{stroke:'#6b7280','stroke-width':2});for(let i=0;i<22;i++)Lin(g,x+20+i*2.4,y-12,x+20+i*2.4,y+4,{stroke:'#e5e7eb','stroke-width':1.6});return {g};};
A.makas=(x,y=520)=>{const g=G();C(g,x-30,y-8,8,{fill:'none',stroke:'#dc2626','stroke-width':3.5});C(g,x-30,y+6,8,{fill:'none',stroke:'#dc2626','stroke-width':3.5});P(g,`M${x-22} ${y-6} L${x+30} ${y+2} M${x-22} ${y+4} L${x+30} ${y-4}`,{stroke:'#9ca3af','stroke-width':3,'stroke-linecap':'round'});return {g};};
A.cetvel=(x,y=520,o={})=>{const g=G(),L=o.L||200;R(g,x-L/2,y-14,L,14,{fill:'#fde68a',stroke:'#b45309',rx:2});for(let i=0;i<=L/5;i++)Lin(g,x-L/2+i*5,y-14,x-L/2+i*5,y-14+(i%2?4:7),{'stroke-width':.6});return {g};};
A.bilye=(x,y=300,o={})=>{const g=el('g',{},S.top);const r=o.r||6;const b=C(g,x,y,r,{fill:'#9ca3af',stroke:'#4b5563'});C(g,x-r/3,y-r/3,r/3,{fill:'#f9fafb'});return {g,git(nx,ny){g.setAttribute('transform',`translate(${nx-x} ${ny-y})`);}};};
A.egikDuzlem=(x,y=520,o={})=>{const g=G(),L=o.L||240,h=o.h||90;P(g,`M${x-L/2} ${y} L${x+L/2} ${y} L${x-L/2} ${y-h} Z`,{fill:'#d6b88a',stroke:'#8b6b3e'});return {g,ust:[x-L/2,y-h],alt:[x+L/2,y]};};
A.kiskac=(x,y=240,o={})=>{const g=G();R(g,x-11,y-10,22,20,{fill:'#374151',rx:4});R(g,x+11,y-4,60,8,{fill:'url(#metalV)',rx:3});if(o.cift){R(g,x-71,y-4,60,8,{fill:'url(#metalV)',rx:3});P(g,`M${x-74} ${y-8} l-12 0 l0 16 l12 0`,{fill:'none',stroke:'#1f2937','stroke-width':3.5});}
  P(g,`M${x+71} ${y-8} l12 0 l0 16 l-12 0`,{fill:'none',stroke:'#1f2937','stroke-width':3.5});return {g};};
A.kriko=(x,y=524,o={})=>{const g=G();const ust=R(g,x-50,y-60,100,8,{fill:'#9ca3af',rx:2});R(g,x-50,y-8,100,8,{fill:'#6b7280',rx:2});const kol=P(g,'',{fill:'none',stroke:'#4b5563','stroke-width':4});
  const set=h=>{ust.setAttribute('y',y-8-h);kol.setAttribute('d',`M${x-36} ${y-8} L${x+36} ${y-h} M${x+36} ${y-8} L${x-36} ${y-h}`);};set(o.h||52);return {g,set,ust:()=>+ust.getAttribute('y')};};
A.alevTeli=(x,y=360,o={})=>{const g=G();R(g,x-80,y-5,50,10,{fill:'#1f2937',rx:3});Lin(g,x-30,y,x+24,y,{stroke:'#9ca3af','stroke-width':1.8});C(g,x+28,y,4,{fill:'none',stroke:'#9ca3af','stroke-width':1.8});const uc=C(g,x+28,y,0,{fill:'#fde047',opacity:.8});return {g,uc:[x+28,y],renk(c){uc.setAttribute('r',c?10:0);if(c)uc.setAttribute('fill',c);}};};

/* ================= ISITICILAR ================= */
A.ispirto=(x,y=524)=>{const g=G();P(g,`M${x-30} ${y} Q${x-36} ${y-30} ${x-12} ${y-42} L${x+12} ${y-42} Q${x+36} ${y-30} ${x+30} ${y} Z`,glass);R(g,x-28,y-22,56,20,{fill:'rgba(150,200,255,.35)'});R(g,x-8,y-52,16,12,{fill:'#9ca3af',rx:2});R(g,x-2,y-58,4,7,{fill:'#f5f5f4'});
  const fl=P(g,'',{fill:'url(#flame)',opacity:0});let on=0;S.ticks.push(()=>{if(on){const h=34+Math.sin(now()/90)*4;fl.setAttribute('d',`M${x-6} ${y-58} Q${x+Math.sin(now()/120)*2} ${y-58-h} ${x+6} ${y-58} Z`);}});return {g,alev:[x,y-80],on(v){on=v?1:0;fl.setAttribute('opacity',v?1:0);}};};
A.isiticiTabla=(x,y=524,o={})=>{const g=G(),w=o.w||110;R(g,x-w/2,y-34,w,34,{fill:'#e5e7eb',stroke:'#9ca3af',rx:6});const pl=R(g,x-w/2+8,y-40,w-16,7,{fill:'#6b7280',rx:2});R(g,x-w/2+10,y-24,34,14,{fill:'#0b1f14',rx:2});const d=txt(g,x-w/2+27,y-13,'',8,{fill:'#4ade80','font-family':'monospace'});
  const kn=C(g,x+w/2-22,y-17,8,{fill:'#374151'});const kn2=C(g,x+w/2-46,y-17,7,{fill:'#374151'});let on=0,dn=0;const bar=R(g,0,0,0,0,{fill:'#f1f5f9',stroke:'#334155','stroke-width':.6,rx:2});const hb=el('g',{},S.top);
  S.ticks.push(()=>{if(dn&&bar.getAttribute('width')>0){const a=now()/80;bar.setAttribute('transform',`rotate(${(a*30)%360} ${x} ${+bar.getAttribute('y')+2})`);}});
  return {g,ust:y-40,on(v){on=v?1:0;pl.setAttribute('fill',v?'#ef4444':'#6b7280');d.textContent=v?(typeof v==='number'?v+'°C':'ON'):'';},karistir(v,yb){dn=v?1:0;if(v){bar.setAttribute('x',x-10);bar.setAttribute('y',(yb||y-46)-4);bar.setAttribute('width',20);bar.setAttribute('height',4);}else bar.setAttribute('width',0);kn2.setAttribute('fill',v?'#2563eb':'#374151');}};};
A.manyetik=(x,y=524,o={})=>A.isiticiTabla(x,y,o);
A.suBanyosu=(x,y=524,o={})=>{const g=G(),w=o.w||150;R(g,x-w/2,y-70,w,70,{fill:'#cbd5e1',stroke:'#64748b',rx:6});const V=S.vessel(g,`M${x-w/2+8} ${y-64} L${x-w/2+8} ${y-8} L${x+w/2-8} ${y-8} L${x+w/2-8} ${y-64}`,{x0:x-w/2+8,x1:x+w/2-8,ybot:y-9,ytop:y-60,cap:100});V.set(75,'rgba(190,225,255,.75)');
  R(g,x+w/2-46,y-24,38,14,{fill:'#0b1f14',rx:2});const d=txt(g,x+w/2-27,y-13,'',8,{fill:'#4ade80','font-family':'monospace'});V.g=g;V.sicaklik=T=>{d.textContent=T+'°C';V.bubbles(T>=90?.25:T>=60?.05:0);};return V;};
A.etuv=(x,y=524)=>{const g=G();R(g,x-80,y-140,160,140,{fill:'#e5e7eb',stroke:'#6b7280',rx:8});const pen=R(g,x-62,y-122,96,90,{fill:'#1f2937',rx:4});R(g,x+42,y-120,28,14,{fill:'#0b1f14',rx:2});const d=txt(g,x+56,y-109,'',7,{fill:'#4ade80','font-family':'monospace'});
  return {g,on(T){pen.setAttribute('fill',T?'#7c2d12':'#1f2937');d.textContent=T?T+'°':'';}};};
A.kibrit=(x,y=520)=>{const g=G();R(g,x-30,y-14,60,14,{fill:'#dc2626',stroke:'#7f1d1d',rx:2});txt(g,x,y-4,'KİBRİT',6.5,{fill:'#fff'});const ky=el('g',{},S.top);Lin(ky,x+40,y-6,x+120,y-30,{stroke:'#d6b88a','stroke-width':4,'stroke-linecap':'round'});
  const uc=C(ky,x+120,y-30,0,{fill:'#f97316'});const fl=P(ky,'',{fill:'url(#flame)',opacity:0});let m=0;S.ticks.push(()=>{if(m===2){const h=18+Math.sin(now()/70)*3;fl.setAttribute('d',`M${x+115} ${y-30} Q${x+120} ${y-30-h} ${x+125} ${y-30} Z`);}});
  return {g,kiymik:ky,uc:[x+120,y-30],durum(s){m=s==='alev'?2:s==='kor'?1:0;uc.setAttribute('r',m===1?4:0);uc.setAttribute('fill','#f97316');fl.setAttribute('opacity',m===2?1:0);},git(dx,dy){ky.setAttribute('transform',`translate(${dx} ${dy})`);}};};
A.buzBanyosu=(x,y=520,o={})=>{const V=A.kristalizuar(x,y,{w:o.w||80,h:60});V.set(220,'rgba(210,235,255,.85)');for(let i=0;i<9;i++)R(V.g,x-64+i*15,y-52+((i*13)%10),12,12,{fill:'rgba(255,255,255,.9)',stroke:'#93c5fd',rx:2,transform:`rotate(${(i*23)%40-20} ${x-58+i*15} ${y-46})`});return V;};
A.santrifuj=(x,y=524)=>{const g=G();R(g,x-70,y-70,140,70,{fill:'#f1f5f9',stroke:'#94a3b8',rx:12});E(g,x,y-70,56,10,{fill:'#cbd5e1',stroke:'#94a3b8'});const r=el('g',{},g);for(let i=0;i<6;i++){const a=i*Math.PI/3;R(r,x+Math.cos(a)*34-4,y-73+Math.sin(a)*6,8,6,{fill:'#60a5fa',rx:1});}
  R(g,x-56,y-30,30,14,{fill:'#0b1f14',rx:2});const d=txt(g,x-41,y-19,'',7,{fill:'#4ade80','font-family':'monospace'});let on=0;S.ticks.push(()=>{if(on)r.setAttribute('transform',`translate(${Math.sin(now()/30)*2} 0)`);});return {g,on(v){on=v?1:0;d.textContent=v?'3000':'';}};};
A.vakum=(x,y=524)=>{const g=G();R(g,x-46,y-50,92,50,{fill:'#1e3a8a',rx:8});C(g,x+26,y-30,10,{fill:'#e5e7eb',stroke:'#334155'});const ib=Lin(g,x+26,y-30,x+26,y-38,{stroke:'#dc2626','stroke-width':1.6});txt(g,x-10,y-20,'VAKUM',8,{fill:'#fff'});
  return {g,cikis:[x-46,y-36],on(v){ib.setAttribute('x2',v?x+33:x+26);ib.setAttribute('y2',v?y-34:y-38);}};};

/* ================= ÖLÇÜ CİHAZLARI ================= */
A.manometre=(x,y=470,o={})=>{const U=A.uBorusu(x,y,{w:o.w||22,h:o.h||200});U.set(70,70,'rgba(220,38,38,.6)');R(U.g,x+40,y-200,22,200,{fill:'#fff',stroke:'#cbd5e1'});for(let i=0;i<=18;i++)Lin(U.g,x+40,y-10-i*10,x+46+(i%5?0:6),y-10-i*10,{'stroke-width':.6});
  return Object.assign(U,{fark(dh){U.set(70-dh/2,70+dh/2);}});};
A.barometre=(x,y=300)=>{const g=G();C(g,x,y,40,{fill:'#fff',stroke:'#b45309','stroke-width':5});for(let i=0;i<=10;i++){const a=(-140+28*i)*Math.PI/180;Lin(g,x+Math.sin(a)*30,y-Math.cos(a)*30,x+Math.sin(a)*36,y-Math.cos(a)*36,{'stroke-width':1});}
  const ib=Lin(g,x,y,x,y-30,{stroke:'#dc2626','stroke-width':2});txt(g,x,y+20,'mmHg',7);const d=txt(g,x,y+30,'',7);return {g,set(p){const a=(-140+280*Math.max(0,Math.min(1,(p-700)/100)))*Math.PI/180;ib.setAttribute('x2',x+Math.sin(a)*30);ib.setAttribute('y2',y-Math.cos(a)*30);d.textContent=p;}};};
A.sirınga=(x,y=300,o={})=>{const g=G(),L=o.L||160,cap=o.cap||60;R(g,x-L/2,y-14,L,28,Object.assign({rx:3},glass));for(let k=0;k<=6;k++)Lin(g,x-L/2+10+(L-20)*k/6,y-14,x-L/2+10+(L-20)*k/6,y-6,{'stroke-width':.7});
  R(g,x-L/2-14,y-4,14,8,glass);const pis=el('g',{},g);R(pis,0,y-12,6,24,{fill:'#374151'});R(pis,6,y-3,L-10,6,{fill:'#9ca3af'});R(pis,L-4,y-14,8,28,{fill:'#374151',rx:2});
  const set=v=>{const px=x-L/2+10+(L-20)*Math.max(0,Math.min(1,v/cap));pis.setAttribute('transform',`translate(${px} 0)`);};set(o.v||0);return {g,uc:[x-L/2-14,y],cap,set};};
A.kalorimetre=(x,y=524,o={})=>{const g=G();R(g,x-56,y-120,112,120,{fill:'#e2e8f0',stroke:'#64748b',rx:8});const V=S.vessel(g,`M${x-40} ${y-110} L${x-40} ${y-10} L${x+40} ${y-10} L${x+40} ${y-110}`,{x0:x-40,x1:x+40,ybot:y-11,ytop:y-104,cap:200});V.set(o.v||120);
  R(g,x-60,y-126,120,10,{fill:'#475569',rx:3});const T=S.thermo(x-14,y-230,170,0,100);T.g.setAttribute('opacity',1);Lin(g,x+18,y-160,x+18,y-30,{stroke:'#9ca3af','stroke-width':2.5});txt(g,x,y+16,o.ad||'kalorimetre',9);V.g=g;V.termometre=T;return V;};
A.bombaKalorimetre=(x,y=524)=>{const V=A.kalorimetre(x,y,{ad:'bomba kalorimetresi'});R(V.g,x-16,y-80,32,56,{fill:'#6b7280',rx:6});P(V.g,`M${x-8} ${y-80} L${x-8} ${y-140} M${x+8} ${y-80} L${x+8} ${y-140}`,{stroke:'#dc2626','stroke-width':1.5});return V;};
A.termosKalorimetre=(x,y=524)=>{const g=G();P(g,`M${x-40} ${y-110} L${x-32} ${y} L${x+32} ${y} L${x+40} ${y-110} Z`,{fill:'#f8fafc',stroke:'#cbd5e1','stroke-width':2});const V=S.vessel(g,`M${x-33} ${y-100} L${x-27} ${y-8} L${x+27} ${y-8} L${x+33} ${y-100}`,{x0:x-33,x1:x+33,ybot:y-9,ytop:y-96,cap:150});
  R(g,x-44,y-118,88,10,{fill:'#e2e8f0',stroke:'#cbd5e1',rx:3});const T=S.thermo(x-10,y-220,150,0,100);T.g.setAttribute('opacity',1);txt(g,x,y+16,'termos kalorimetre',8);V.g=g;V.termometre=T;return V;};
const ekran=(g,x,y,w,ad,birim)=>{R(g,x,y,w,66,{fill:'url(#meter)',rx:9});R(g,x+8,y+8,w-16,30,{fill:'#0b1f14',rx:4});const v=el('text',{x:x+w/2,y:y+30,'font-size':17,fill:'#4ade80','text-anchor':'middle','font-family':'monospace','font-weight':700},g);txt(g,x+w/2,y+56,ad,7.5,{fill:'#9ca3af'});return s=>{v.textContent=s+(birim?' '+birim:'');};};
const uclar=(g,x,y)=>{C(g,x,y,5,{fill:'#dc2626'});C(g,x+22,y,5,{fill:'#111827'});return [[x,y],[x+22,y]];};
A.voltmetre=(x,y=300,o={})=>{const g=G();const s=ekran(g,x-48,y-66,96,o.ad||'VOLTMETRE','V');const u=uclar(g,x-11,y+8);s('0,00');return {g,set:s,arti:u[0],eksi:u[1]};};
A.ampermetre=(x,y=300,o={})=>{const g=G();const s=ekran(g,x-48,y-66,96,o.ad||'AMPERMETRE','A');const u=uclar(g,x-11,y+8);s('0,00');return {g,set:s,arti:u[0],eksi:u[1]};};
A.multimetre=(x,y=320)=>{const g=G();R(g,x-40,y-110,80,120,{fill:'#facc15',stroke:'#a16207',rx:10});R(g,x-30,y-100,60,28,{fill:'#0b1f14',rx:3});const v=el('text',{x,y:y-80,'font-size':13,fill:'#4ade80','text-anchor':'middle','font-family':'monospace'},g);
  C(g,x,y-40,16,{fill:'#1f2937'});const ib=Lin(g,x,y-40,x,y-52,{stroke:'#facc15','stroke-width':2});const u=uclar(g,x-11,y-6);return {g,arti:u[0],eksi:u[1],set(s,mod){v.textContent=s;ib.setAttribute('x2',mod==='A'?x+10:mod==='Ω'?x-10:x);}};};
A.kolorimetre=(x,y=524)=>{const g=G();R(g,x-80,y-60,160,60,{fill:'#e5e7eb',stroke:'#6b7280',rx:8});R(g,x+20,y-74,30,18,{fill:'#374151',rx:3});R(g,x-70,y-48,70,26,{fill:'#0b1f14',rx:3});const v=el('text',{x:x-35,y:y-30,'font-size':12,fill:'#4ade80','text-anchor':'middle','font-family':'monospace'},g);txt(g,x,y-6,'KOLORİMETRE',7,{fill:'#475569'});return {g,yuva:[x+35,y-74],set(s){v.textContent=s;}};};
A.lazer=(x,y=420,o={})=>{const g=G();R(g,x-40,y-7,50,14,{fill:'#111827',rx:6});C(g,x+10,y,3,{fill:'#ef4444'});const isin=Lin(el('g',{},S.top),x+12,y,x+12,y,{stroke:o.renk||'#ef4444','stroke-width':2,opacity:.85});
  return {g,on(xEnd,gorunur){isin.setAttribute('x2',xEnd||x+12);isin.setAttribute('stroke-dasharray',gorunur===false?'2 10':'');}};};
A.mikroskop=(x,y=524)=>{const g=G();R(g,x-46,y-14,92,14,{fill:'#1f2937',rx:4});P(g,`M${x+20} ${y-14} Q${x+40} ${y-80} ${x+14} ${y-160}`,{fill:'none',stroke:'#1f2937','stroke-width':14,'stroke-linecap':'round'});R(g,x-40,y-80,70,8,{fill:'#374151',rx:2});
  R(g,x-16,y-210,18,90,{fill:'#e5e7eb',stroke:'#6b7280',rx:4,transform:`rotate(-14 ${x-7} ${y-165})`});R(g,x-12,y-120,10,30,{fill:'#9ca3af',rx:2});C(g,x+22,y-60,8,{fill:'#6b7280'});return {g,tabla:[x-5,y-84]};};
A.dansimetre=(x,y=520,o={})=>{const V=S.cylinder(x,y,250,220);V.g.setAttribute('opacity',1);V.set(200);const d=el('g',{},V.g);R(d,x-3,y-260,6,90,Object.assign({rx:3},glass));E(d,x,y-158,9,22,glass);C(d,x,y-140,6,{fill:'#9ca3af'});
  V.yogunluk=r=>d.setAttribute('transform',`translate(0 ${Math.max(-30,Math.min(40,(1-r)*90))})`);return V;};
A.veriToplayici=(x,y=300)=>{const g=G();R(g,x-60,y-80,120,80,{fill:'#1e293b',rx:8});R(g,x-50,y-70,100,50,{fill:'#0b1f14',rx:3});const pl=el('polyline',{points:'',fill:'none',stroke:'#4ade80','stroke-width':1.5},g);txt(g,x,y-8,'VERİ TOPLAYICI',6.5,{fill:'#94a3b8'});
  const pts=[];return {g,ekle(t,v,tmax=100,vmax=100){pts.push([x-48+96*Math.min(1,t/tmax),y-22-46*Math.min(1,v/vmax)]);pl.setAttribute('points',pts.map(p=>p.join(',')).join(' '));},temizle(){pts.length=0;pl.setAttribute('points','');}};};
A.buyutec=(x,y=300)=>{const g=el('g',{},S.top);C(g,x,y,26,{fill:'rgba(200,230,255,.25)',stroke:'#1f2937','stroke-width':5});Lin(g,x+18,y+18,x+50,y+50,{stroke:'#1f2937','stroke-width':8,'stroke-linecap':'round'});return {g,git(nx,ny){g.setAttribute('transform',`translate(${nx-x} ${ny-y})`);}};};
A.geiger=(x,y=524)=>{const g=G();R(g,x-46,y-74,92,74,{fill:'#facc15',stroke:'#a16207',rx:8});const s=ekran(g,x-40,y-70,80,'GEIGER','cpm');P(g,`M${x+46} ${y-30} C${x+80} ${y-30} ${x+80} ${y-90} ${x+100} ${y-90}`,{fill:'none',stroke:'#111827','stroke-width':2.5});R(g,x+96,y-100,40,18,{fill:'#374151',rx:6});s('0');return {g,set:s};};
A.dijitalTermometre=(x,y=300,o={})=>{const g=G();R(g,x-24,y-50,48,50,{fill:'#1f2937',rx:6});R(g,x-18,y-44,36,18,{fill:'#0b1f14',rx:2});const v=el('text',{x,y:y-31,'font-size':10,fill:'#4ade80','text-anchor':'middle','font-family':'monospace'},g);
  Lin(g,x,y,x,y+(o.L||120),{stroke:'#9ca3af','stroke-width':3,'stroke-linecap':'round'});return {g,uc:[x,y+(o.L||120)],set(T){v.textContent=(typeof T==='number'?T.toFixed(1):T)+'°';}};};

/* ================= ELEKTROKİMYA ================= */
A.gucKaynagi=(x,y=524,o={})=>{const g=G();R(g,x-70,y-80,140,80,{fill:'#e5e7eb',stroke:'#6b7280',rx:8});R(g,x-58,y-70,64,28,{fill:'#0b1f14',rx:3});const v=el('text',{x:x-26,y:y-50,'font-size':13,fill:'#4ade80','text-anchor':'middle','font-family':'monospace'},g);
  C(g,x+34,y-56,12,{fill:'#374151'});C(g,x-40,y-18,6,{fill:'#dc2626'});C(g,x+40,y-18,6,{fill:'#111827'});txt(g,x-40,y-28,'+',9,{fill:'#dc2626'});txt(g,x+40,y-28,'−',9);txt(g,x,y-8,'DC GÜÇ KAYNAĞI',6.5,{fill:'#475569'});
  const led=C(g,x+56,y-74,3,{fill:'#4b5563'});return {g,arti:[x-40,y-18],eksi:[x+40,y-18],set(V){v.textContent=V?(+V).toFixed(1)+' V':'';led.setAttribute('fill',V?'#22c55e':'#4b5563');}};};
A.pil=(x,y=520,o={})=>{const g=G(),v=o.v||'1,5 V',yat=o.yatay!==false;if(yat){R(g,x-36,y-30,72,30,{fill:'#111827',rx:4});R(g,x-36,y-30,28,30,{fill:'#f59e0b',rx:4});R(g,x+36,y-21,6,12,{fill:'#9ca3af',rx:1});txt(g,x+8,y-11,v,8,{fill:'#fff'});return {g,arti:[x+42,y-15],eksi:[x-36,y-15]};}
  R(g,x-15,y-70,30,70,{fill:'#111827',rx:4});R(g,x-15,y-70,30,26,{fill:'#f59e0b',rx:4});R(g,x-5,y-76,10,6,{fill:'#9ca3af'});txt(g,x,y-24,v,7,{fill:'#fff'});return {g,arti:[x,y-76],eksi:[x,y]};};
A.pil9V=(x,y=520)=>{const g=G();R(g,x-20,y-80,40,80,{fill:'#111827',rx:5});R(g,x-20,y-40,40,40,{fill:'#2563eb',rx:5});C(g,x-8,y-86,4,{fill:'#9ca3af'});R(g,x+4,y-90,8,8,{fill:'#9ca3af'});txt(g,x,y-16,'9 V',9,{fill:'#fff'});return {g,arti:[x-8,y-88],eksi:[x+8,y-88]};};
A.pilYuvasi=(x,y=520,o={})=>{const g=G(),n=o.n||2;R(g,x-n*40,y-36,n*80,36,{fill:'#1f2937',rx:4});for(let i=0;i<n;i++)R(g,x-n*40+8+i*80,y-30,64,24,{fill:'#f59e0b',rx:3});txt(g,x,y+14,(1.5*n).toString().replace('.',',')+' V',8);return {g,arti:[x+n*40,y-18],eksi:[x-n*40,y-18]};};
const ELR={Cu:['#b87333','#8b4513','Cu'],Zn:['#c0c7cf','#7b8794','Zn'],C:['#374151','#111827','C'],Pt:['#e5e7eb','#9ca3af','Pt'],Fe:['#8b8f94','#4b5563','Fe'],Ag:['#e2e8f0','#94a3b8','Ag'],Pb:['#6b7280','#374151','Pb'],Mg:['#d1d5db','#9ca3af','Mg']};
A.elektrot=(x,ust=260,o={})=>{const g=G(),[c1,c2,ad]=ELR[o.tur||'Cu']||ELR.Cu,h=o.h||170,w=o.w||16;const lev=R(g,x-w/2,ust,w,h,{fill:c1,stroke:c2,'stroke-width':1});const kap=R(g,x-w/2-1,ust+h,w+2,0,{fill:c1,opacity:.95});
  R(g,x-3,ust-14,6,16,{fill:'#9ca3af'});txt(g,x,ust+16,ad,7,{fill:o.tur==='C'?'#fff':'#1f2937'});const kab=el('g',{},S.top);let gaz=0;
  S.ticks.push(()=>{if(gaz>0&&Math.random()<gaz){const c=C(kab,x+(Math.random()-.5)*w,ust+h-10-Math.random()*h*.6,1.4+Math.random()*1.6,{fill:'rgba(255,255,255,.85)',stroke:'#94a3b8','stroke-width':.4});S.anim.push({e:c,y:+c.getAttribute('cy'),vy:-.5,stop:o.yuzey||ust+20,kind:'up'});}});
  return {g,bag:[x,ust-14],kapla(mm,renk){const k=Math.max(0,mm);lev.setAttribute('x',x-w/2-k);lev.setAttribute('width',w+2*k);if(renk)lev.setAttribute('fill',renk);},asin(f){lev.setAttribute('width',Math.max(4,w*(1-f)));lev.setAttribute('x',x-Math.max(4,w*(1-f))/2);},gaz(r){gaz=r;}};};
A.tuzKopru=(x1,x2,yUst=320,o={})=>{const g=G(),d=o.derin||90;P(g,`M${x1} ${yUst+d} L${x1} ${yUst} Q${x1} ${yUst-26} ${(x1+x2)/2} ${yUst-26} Q${x2} ${yUst-26} ${x2} ${yUst} L${x2} ${yUst+d}`,{fill:'none',stroke:'rgba(90,115,150,.85)','stroke-width':16,'stroke-linecap':'round'});
  P(g,`M${x1} ${yUst+d} L${x1} ${yUst} Q${x1} ${yUst-26} ${(x1+x2)/2} ${yUst-26} Q${x2} ${yUst-26} ${x2} ${yUst} L${x2} ${yUst+d}`,{fill:'none',stroke:'rgba(235,242,250,.95)','stroke-width':12});[x1,x2].forEach(x=>R(g,x-6,yUst+d-6,12,10,{fill:'#f8fafc',stroke:'#cbd5e1',rx:3}));txt(g,(x1+x2)/2,yUst-32,'tuz köprüsü (KNO₃)',7);
  const iy=el('g',{},S.top);let on=0;S.ticks.push(()=>{if(on&&Math.random()<.06){const sol=Math.random()<.5;const c=C(iy,sol?x1:x2,yUst+20,2.4,{fill:sol?'#2563eb':'#dc2626'});setTimeout(()=>c.remove(),900);}});return {g,on(v){on=v?1:0;}};};
A.gozenekliKap=(x,y=520,o={})=>{const g=G();const V=S.vessel(g,`M${x-22} ${y-130} L${x-22} ${y-4} Q${x-22} ${y} ${x-18} ${y} L${x+18} ${y} Q${x+22} ${y} ${x+22} ${y-4} L${x+22} ${y-130}`,{x0:x-22,x1:x+22,ybot:y-1,ytop:y-124,cap:60});
  for(let i=0;i<40;i++)C(g,x-18+((i*13)%36),y-120+((i*29)%116),.9,{fill:'#a8a29e'});P(g,`M${x-22} ${y-130} L${x-22} ${y-4} Q${x-22} ${y} ${x-18} ${y} L${x+18} ${y} Q${x+22} ${y} ${x+22} ${y-4} L${x+22} ${y-130}`,{fill:'none',stroke:'#a8a29e','stroke-width':3});V.g=g;return V;};
A.hofmann=(x,y=520,o={})=>{const g=G();R(g,x-80,y-10,160,10,{fill:'url(#base)',rx:3});const tup=dx=>{R(g,x+dx-11,y-300,22,280,Object.assign({rx:6},glass));const gz=R(g,x+dx-9,y-296,18,0,{fill:'rgba(255,255,255,.95)'});R(g,x+dx-9,y-296,18,276,{fill:'rgba(190,225,255,.55)'});g.appendChild(gz);
  for(let k=0;k<=10;k++)Lin(g,x+dx-11,y-290+k*24,x+dx-11+(k%5?4:8),y-290+k*24,{'stroke-width':.6});R(g,x+dx-6,y-316,12,14,{fill:'#1e40af',rx:2});return gz;};
  const h=tup(-50),o2=tup(50);R(g,x-11,y-380,22,360,Object.assign({rx:6},glass));E(g,x,y-386,26,14,glass);R(g,x-9,y-376,18,356,{fill:'rgba(190,225,255,.55)'});
  const e1=A.elektrot(x-50,y-60,{tur:'Pt',h:40,w:8,yuzey:y-290}),e2=A.elektrot(x+50,y-60,{tur:'Pt',h:40,w:8,yuzey:y-290});txt(g,x-50,y-320,'H₂ (katot)',7);txt(g,x+50,y-320,'O₂ (anot)',7);
  return {g,katot:[x-50,y],anot:[x+50,y],set(vH2,vO2){h.setAttribute('height',Math.max(0,vH2)*2.6);o2.setAttribute('height',Math.max(0,vO2)*2.6);},calis(v){e1.gaz(v?.35:0);e2.gaz(v?.18:0);}};};
A.elektrolizKabi=(x,y=520,o={})=>{const V=S.beaker(x,y,130,120,400);V.g.setAttribute('opacity',1);V.set(o.v||300,o.renk);const t1=o.anot||'C',t2=o.katot||'C';
  const a=A.elektrot(x-34,y-190,{tur:t1,h:150,yuzey:V.level(o.v||300)}),k=A.elektrot(x+34,y-190,{tur:t2,h:150,yuzey:V.level(o.v||300)});R(V.g,x-70,y-128,140,8,{fill:'#475569',rx:3});txt(V.g,x-34,y-204,'anot (+)',7);txt(V.g,x+34,y-204,'katot (−)',7);return Object.assign(V,{anot:a,katot:k});};
A.kablo=(p1,p2,o={})=>{const g=el('g',{},S.top),renk=o.renk||'#dc2626';const sag=o.sarkma==null?40:o.sarkma;const mx=(p1[0]+p2[0])/2,my=Math.max(p1[1],p2[1])+sag;const d=`M${p1[0]} ${p1[1]} Q${mx} ${my} ${p2[0]} ${p2[1]}`;
  const yol=P(g,d,{fill:'none',stroke:renk,'stroke-width':3,'stroke-linecap':'round'});[p1,p2].forEach(([px,py])=>R(g,px-5,py-3,10,6,{fill:renk==='#111827'?'#374151':'#ef4444',rx:2}));const el2=el('g',{},g);const L=yol.getTotalLength?yol.getTotalLength():200;let hiz=0,t0=now();
  const noktalar=[];for(let i=0;i<8;i++)noktalar.push(C(el2,p1[0],p1[1],0,{fill:'#facc15',stroke:'#a16207','stroke-width':.5}));
  S.ticks.push(()=>{if(!hiz)return;const t=(now()-t0)/1000*hiz;noktalar.forEach((c,i)=>{let f=((t/ (L/60))+i/8)%1;if(o.ters)f=1-f;const p=yol.getPointAtLength(f*L);c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',2.2);});});
  return {g,elektron(v){hiz=v||0;if(!hiz)noktalar.forEach(c=>c.setAttribute('r',0));}};};
A.ampul=(x,y=300)=>{const g=G();const cam=C(g,x,y-30,22,{fill:'rgba(240,240,220,.5)',stroke:'#94a3b8'});P(g,`M${x-6} ${y-14} L${x-6} ${y-30} L${x} ${y-36} L${x+6} ${y-30} L${x+6} ${y-14}`,{fill:'none',stroke:'#92400e','stroke-width':1.2});R(g,x-11,y-10,22,16,{fill:'#9ca3af',rx:2});
  const isik=C(el('g',{},S.layer),x,y-30,0,{fill:'rgba(253,224,71,.45)'});S.layer.insertBefore(isik.parentNode,g);return {g,u1:[x-8,y+6],u2:[x+8,y+6],uclar:[[x-8,y+6],[x+8,y+6]],yak(f){cam.setAttribute('fill',f>0?`rgba(253,224,71,${.4+.5*f})`:'rgba(240,240,220,.5)');isik.setAttribute('r',f>0?30+30*f:0);}};};
A.led=(x,y=300,o={})=>{const g=G(),c=o.renk||'#ef4444';const b=P(g,`M${x-8} ${y-10} L${x-8} ${y-26} Q${x} ${y-38} ${x+8} ${y-26} L${x+8} ${y-10} Z`,{fill:c,opacity:.45,stroke:'#7f1d1d'});Lin(g,x-4,y-10,x-4,y+14,{stroke:'#9ca3af','stroke-width':1.5});Lin(g,x+4,y-10,x+4,y+10,{stroke:'#9ca3af','stroke-width':1.5});
  return {g,u1:[x-4,y+14],u2:[x+4,y+10],uclar:[[x-4,y+14],[x+4,y+10]],yak(v){b.setAttribute('opacity',v?1:.45);b.setAttribute('filter',v?'url(#sh)':'');}};};
A.anahtar=(x,y=520)=>{const g=G();R(g,x-40,y-12,80,12,{fill:'#7c5a3a',rx:3});C(g,x-26,y-14,4,{fill:'#9ca3af'});C(g,x+26,y-14,4,{fill:'#9ca3af'});const kol=Lin(g,x-26,y-14,x+20,y-40,{stroke:'#6b7280','stroke-width':3.5,'stroke-linecap':'round'});
  return {g,u1:[x-26,y-14],u2:[x+26,y-14],uclar:[[x-26,y-14],[x+26,y-14]],kapat(v){kol.setAttribute('x2',v?x+26:x+20);kol.setAttribute('y2',v?y-16:y-40);}};};
A.daniell=(x,y=520,o={})=>{const b1=S.beaker(x-90,y,100,110,250,'ZnSO₄'),b2=S.beaker(x+90,y,100,110,250,'CuSO₄');[b1,b2].forEach(b=>b.g.setAttribute('opacity',1));b1.set(180,'rgba(225,235,245,.7)');b2.set(180,'rgba(59,130,246,.55)');
  const zn=A.elektrot(x-100,y-160,{tur:'Zn',h:130,yuzey:b1.level(180)}),cu=A.elektrot(x+100,y-160,{tur:'Cu',h:130,yuzey:b2.level(180)});const kp=A.tuzKopru(x-74,x+74,y-110,{derin:60});const vm=A.voltmetre(x,y-260,{});
  const k1=A.kablo(zn.bag,vm.eksi,{renk:'#111827',sarkma:-20}),k2=A.kablo(vm.arti,cu.bag,{sarkma:-20});
  return {g:b1.g,b1,b2,zn,cu,kopru:kp,voltmetre:vm,calis(v){vm.set(v?'1,10':'0,00');k1.elektron(v?1:0);k2.elektron(v?1:0);kp.on(v);}};};

/* ================= GAZ DÜZENEKLERİ ================= */
A.kipp=(x,y=524)=>{const g=G();E(g,x,y-40,60,40,glass);E(g,x,y-130,46,40,glass);R(g,x-10,y-210,20,80,Object.assign({rx:6},glass));E(g,x,y-226,30,20,glass);R(g,x+46,y-136,40,8,glass);R(g,x+82,y-142,10,20,{fill:'#1e40af',rx:2});
  for(let i=0;i<10;i++)R(g,x-30+((i*17)%60),y-140+((i*7)%14),10,8,{fill:'#9ca3af',rx:2});txt(g,x,y+14,'Kipp aparatı',8);return {g,cikis:[x+92,y-132]};};
A.gazYikama=(x,y=520,o={})=>{const bg=S.bottle(x,y,o.ad||'su','rgba(196,226,255,.6)');bg.setAttribute('opacity',1);const g=G();Lin(g,x-6,y-100,x-6,y-18,{stroke:'rgba(90,115,150,.85)','stroke-width':4});Lin(g,x+8,y-100,x+8,y-70,{stroke:'rgba(90,115,150,.85)','stroke-width':4});
  const bb=el('g',{},S.top);let r=0;S.ticks.push(()=>{if(r&&Math.random()<r){const c=C(bb,x-6+(Math.random()-.5)*6,y-16,2,{fill:'rgba(255,255,255,.9)',stroke:'#94a3b8','stroke-width':.4});S.anim.push({e:c,y:y-16,vy:-.7,stop:y-48,kind:'up'});}});return {g,giris:[x-6,y-100],cikis:[x+8,y-100],kabarcik(v){r=v;}};};

/* ================= KÂĞIT VE SARF ================= */
A.turnusol=(x,y=520,o={})=>{const g=G();const r=R(g,x-30,y-8,60,8,{fill:o.renk==='mavi'?'#60a5fa':'#f87171',stroke:'#9ca3af','stroke-width':.5,rx:1});return {g,renk(c){r.setAttribute('fill',c==='mavi'?'#3b82f6':c==='kirmizi'?'#ef4444':c);}};};
A.suzgecKagidi=(x,y=380,o={})=>{const g=el('g',{},S.top),w=o.w||34;P(g,`M${x-w} ${y-46} L${x+w} ${y-46} L${x} ${y-4} Z`,{fill:'rgba(255,255,255,.92)',stroke:'#cbd5e1'});const kalinti=P(g,'',{fill:'#9ca3af',opacity:.9});
  return {g,kalinti(f,c){const h=34*f;kalinti.setAttribute('d',f?`M${x-h*.7} ${y-6-h} L${x+h*.7} ${y-6-h} L${x} ${y-6} Z`:'');if(c)kalinti.setAttribute('fill',c);}};};
A.kromatografi=(x,y=520,o={})=>{const V=S.beaker(x,y,90,150,250);V.g.setAttribute('opacity',1);V.set(25);const g=G();R(g,x-20,y-170,40,160,{fill:'#fafaf9',stroke:'#d6d3d1'});Lin(g,x-30,y-170,x+30,y-170,{stroke:'#6b7280','stroke-width':3});
  const cizgi=Lin(g,x-20,y-22,x+20,y-22,{stroke:'rgba(80,140,225,.6)','stroke-width':1});const renk=o.renkler||['#ef4444','#eab308','#3b82f6'];const lek=renk.map((c,i)=>E(g,x,y-28,6,4,{fill:c,opacity:.85}));const rf=o.rf||[.3,.55,.8];
  return Object.assign(V,{ilerle(f){const top=y-22-130*f;cizgi.setAttribute('y1',top);cizgi.setAttribute('y2',top);lek.forEach((e,i)=>e.setAttribute('cy',y-28-(y-28-top)*rf[i]*Math.min(1,f*1.05)));}});};
A.folyo=(x,y=520,o={})=>{const g=G(),w=o.w||80;R(g,x-w/2,y-6,w,6,{fill:o.mat?'#cbd5e1':'url(#metal)',stroke:'#94a3b8','stroke-width':.6});return {g};};
A.etiket=(x,y=300,o={})=>{const g=el('g',{},S.top);const s=o.yazi||'ETİKET';R(g,x-s.length*3.4-6,y-11,s.length*6.8+12,16,{fill:'#fff',stroke:'#94a3b8',rx:3});txt(g,x,y+1,s,8,{'font-weight':800});return {g};};
A.pamuk=(x,y=300)=>{const g=G();[[0,0,9],[-8,3,7],[8,3,7],[0,6,7]].forEach(([dx,dy,r])=>C(g,x+dx,y+dy,r,{fill:'#fafafa',stroke:'#e5e7eb'}));return {g};};

/* ================= GÜVENLİK ================= */
A.gozluk=(x,y=520)=>{const g=G();E(g,x-18,y-12,16,11,{fill:'rgba(186,230,253,.6)',stroke:'#0f172a','stroke-width':2.5});E(g,x+18,y-12,16,11,{fill:'rgba(186,230,253,.6)',stroke:'#0f172a','stroke-width':2.5});Lin(g,x-2,y-14,x+2,y-14,{'stroke-width':2.5});return {g};};
A.eldiven=(x,y=520,o={})=>{const g=G(),c=o.renk||'#60a5fa';P(g,`M${x-16} ${y} L${x-16} ${y-40} Q${x-22} ${y-48} ${x-16} ${y-56} L${x-12} ${y-50} L${x-10} ${y-72} Q${x-6} ${y-76} ${x-3} ${y-72} L${x-2} ${y-54} L${x} ${y-76} Q${x+4} ${y-80} ${x+7} ${y-76} L${x+7} ${y-54} L${x+10} ${y-72} Q${x+14} ${y-74} ${x+16} ${y-70} L${x+16} ${y} Z`,{fill:c,stroke:'#1e3a8a','stroke-width':1});return {g};};
A.onluk=(x,y=520)=>{const g=G();P(g,`M${x-30} ${y} L${x-36} ${y-120} L${x-14} ${y-140} L${x} ${y-120} L${x+14} ${y-140} L${x+36} ${y-120} L${x+30} ${y} Z`,{fill:'#fff',stroke:'#94a3b8','stroke-width':1.5});Lin(g,x,y-120,x,y,{stroke:'#cbd5e1'});return {g};};
A.cekerOcak=(x,y=524,o={})=>{const g=el('g',{},S.layer),w=o.w||300;S.layer.insertBefore(g,S.layer.firstChild);R(g,x-w/2,y-300,w,300,{fill:'#e2e8f0',stroke:'#64748b','stroke-width':2,rx:6});R(g,x-w/2+12,y-288,w-24,190,{fill:'rgba(186,230,253,.25)',stroke:'#94a3b8'});
  const cam=R(g,x-w/2+12,y-288,w-24,90,{fill:'rgba(255,255,255,.45)',stroke:'#94a3b8'});txt(g,x,y-292,'ÇEKER OCAK',8,{fill:'#475569'});return {g,cam(f){cam.setAttribute('y',y-288+100*(1-f));}};};
A.yanginSondurucu=(x,y=520)=>{const g=G();R(g,x-16,y-90,32,90,{fill:'#dc2626',rx:12});R(g,x-8,y-104,16,14,{fill:'#111827'});P(g,`M${x+8} ${y-100} L${x+30} ${y-96} L${x+30} ${y-60}`,{fill:'none',stroke:'#111827','stroke-width':3});R(g,x-12,y-60,24,18,{fill:'#fff',rx:2});return {g};};
A.gozDusu=(x,y=300)=>{const g=G();R(g,x-4,y,8,120,{fill:'#16a34a'});P(g,`M${x-30} ${y} Q${x} ${y-24} ${x+30} ${y} Z`,{fill:'#22c55e',stroke:'#166534'});return {g};};

/* ================= EFEKTLER ================= */
const fx=el('g',{},S.top);
A.buhar=(x,y,o={})=>{let r=o.hiz==null?.25:o.hiz,renk=o.renk||'rgba(255,255,255,.85)';S.ticks.push(()=>{if(r&&Math.random()<r){const c=C(fx,x+(Math.random()-.5)*(o.w||20),y,3+Math.random()*3,{fill:renk,opacity:.8});const t0=now(),vx=(Math.random()-.5)*.4;const f=()=>{const t=(now()-t0)/1000;if(t>1.8){c.remove();return;}c.setAttribute('cy',y-t*50);c.setAttribute('cx',+c.getAttribute('cx')+vx);c.setAttribute('r',4+t*7);c.setAttribute('opacity',.8*(1-t/1.8));requestAnimationFrame(f);};f();}});return {hiz(v){r=v;}};};
A.duman=(x,y,o={})=>A.buhar(x,y,Object.assign({renk:'rgba(120,120,130,.55)'},o));
A.alev=(x,y,o={})=>{const g=el('g',{},S.top);const f=P(g,'',{fill:o.mavi?'url(#blueflame)':'url(#flame)'});let h=o.h||40,on=1;S.ticks.push(()=>{if(!on){f.setAttribute('d','');return;}const hh=h+Math.sin(now()/80)*h*.12;f.setAttribute('d',`M${x-h*.2} ${y} Q${x+Math.sin(now()/110)*3} ${y-hh*2} ${x+h*.2} ${y} Z`);});return {g,on(v){on=v?1:0;},boy(v){h=v;}};};
A.parlama=(x,y,o={})=>{const c=C(fx,x,y,0,{fill:o.renk||'rgba(255,255,255,.95)'});return {flas(ms=400){const t0=now();const f=()=>{const t=(now()-t0)/ms;if(t>1){c.setAttribute('r',0);return;}c.setAttribute('r',10+50*t);c.setAttribute('opacity',1-t);requestAnimationFrame(f);};f();}};};
A.kristal=(x,y,o={})=>{const g=el('g',{},S.top),renk=o.renk||'#e2e8f0';const dal=[];for(let i=0;i<(o.n||14);i++){const a=-Math.PI/2+(Math.random()-.5)*2.2,L=10+Math.random()*30;dal.push([a,L,P(g,'',{stroke:renk,'stroke-width':2,fill:'none','stroke-linecap':'round'})]);}
  return {g,buyu(f){dal.forEach(([a,L,p])=>{const l=L*f;p.setAttribute('d',`M${x} ${y} L${x+Math.cos(a)*l} ${y+Math.sin(a)*l} M${x+Math.cos(a)*l*.6} ${y+Math.sin(a)*l*.6} l${Math.cos(a+.7)*l*.3} ${Math.sin(a+.7)*l*.3}`);});}};};
A.yazi=(x,y,s,o={})=>{const t=txt(fx,x,y,s,o.boy||11,{fill:o.renk||'#0f172a','font-weight':800});return {t,set(v){t.textContent=v;},sil(){t.remove();}};};
A.ok=(x1,y1,x2,y2,o={})=>{const g=el('g',{},S.top);const a=Math.atan2(y2-y1,x2-x1);Lin(g,x1,y1,x2,y2,{stroke:o.renk||'#dc2626','stroke-width':2.5});P(g,`M${x2} ${y2} L${x2-10*Math.cos(a-.4)} ${y2-10*Math.sin(a-.4)} L${x2-10*Math.cos(a+.4)} ${y2-10*Math.sin(a+.4)} Z`,{fill:o.renk||'#dc2626'});return {g};};
});
})();
