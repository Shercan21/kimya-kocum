/* Kimya Koçum · Sanal Laboratuvar Kiti (labkit.js)
   Ortak parçalar: sayfa iskeleti, cam/metal aletler (SVG), kimya hesapları,
   "Kitaptaki deney" oynatıcısı (Başlat), "Kendin dene" değişken paneli,
   grafik, sonuç soruları, deney raporu, gömülü (Kimya Koçum) ve video modu. */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
const $=(s,r=document)=>r.querySelector(s);
const fmt=(x,d=2)=>Number(x).toFixed(d).replace('.',',');
const tr=x=>String(x).replace('.',',');
function el(t,a,p){const e=document.createElementNS(NS,t);for(const k in (a||{}))e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function hx(t,a,p){const e=document.createElement(t);for(const k in (a||{}))k==='html'?e.innerHTML=a[k]:k==='text'?e.textContent=a[k]:e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}

/* ---------------- CSS ---------------- */
const CSS=`:root{--bg:#f3f6fb;--card:#fff;--ink:#1d2b44;--mut:#64748b;--line:#dfe6f0;--blue:#2563eb;--org:#ea7a1a;--grn:#1f9d55;--red:#c62828}
*{box-sizing:border-box}body{margin:0;font-family:Nunito,system-ui,sans-serif;background:var(--bg);color:var(--ink)}
header{background:linear-gradient(120deg,#1e3a8a,#2563eb);color:#fff;padding:16px 20px}header h1{margin:0;font-size:22px;font-weight:800}header p{margin:4px 0 0;opacity:.9;font-size:14px}
.tabs{display:flex;gap:8px;padding:12px 20px 0;flex-wrap:wrap}.tab{border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 18px;font:inherit;font-weight:700;cursor:pointer;color:var(--ink)}.tab.on{background:var(--blue);border-color:var(--blue);color:#fff}
main{display:grid;grid-template-columns:minmax(300px,420px) 1fr;gap:16px;padding:14px 20px 28px;max-width:1280px;margin:0 auto}@media(max-width:860px){main{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}.card h2{margin:0 0 8px;font-size:16px}
.lk-svg{width:100%;height:auto;display:block;border-radius:10px;user-select:none}
.readouts{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:8px;margin-top:10px}.ro{background:#f7f9fc;border:1px solid var(--line);border-radius:10px;padding:7px 8px}.ro small{display:block;color:var(--mut);font-size:11px;font-weight:700}.ro b{font-size:18px}
.caption{min-height:64px;background:#fff8ec;border:1px solid #f6d7a8;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:15px;line-height:1.45}.caption .n{display:inline-block;background:var(--org);color:#fff;border-radius:999px;font-size:12px;padding:1px 9px;margin-right:6px;font-weight:800}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
button.b{border:1px solid var(--line);background:#fff;border-radius:10px;padding:9px 14px;font:inherit;font-weight:700;cursor:pointer;color:var(--ink)}button.b:disabled{opacity:.45;cursor:default}button.p{background:var(--blue);border-color:var(--blue);color:#fff}button.g{background:var(--grn);border-color:var(--grn);color:#fff}button.o{background:var(--org);border-color:var(--org);color:#fff}
.steps{margin:10px 0 0;padding-left:20px;font-size:14px;color:var(--mut)}.steps li{margin:3px 0}.steps li.on{color:var(--ink);font-weight:800}.steps li.ok{color:var(--grn)}
canvas.lk-cv{width:100%;height:240px;display:block;background:#fbfcfe;border:1px solid var(--line);border-radius:10px}
.calc{background:#eefaf2;border:1px solid #bfe7cc;border-radius:10px;padding:10px 12px;font-size:15px;margin-top:10px;display:none}.calc.show{display:block}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){.grid2{grid-template-columns:1fr}}
label.f{display:block;font-size:13px;font-weight:700;color:var(--mut);margin-bottom:3px}select,input[type=number]{width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:9px;font:inherit;background:#fff}
.vars{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px}@media(max-width:560px){.vars{grid-template-columns:1fr}}.vbox{border-radius:10px;padding:8px 10px;font-size:13px}.vbox h4{margin:0 0 4px;font-size:12px;letter-spacing:.03em}.v1{background:#e8efff}.v2{background:#fff1d6}.v3{background:#eef2f7}
.warn{color:var(--red);font-weight:700;font-size:13px;margin-top:6px;min-height:18px}
table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}th,td{border-bottom:1px solid var(--line);padding:6px 5px;text-align:left}th{color:var(--mut);font-size:12px}
.hidden{display:none!important}.tip{font-size:13px;color:var(--mut);margin:6px 0 0}.chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.chip{font-size:12px;background:#f1f5f9;border:1px solid var(--line);border-radius:999px;padding:3px 9px}
.safety{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.safety span{font-size:12px;border:2px solid #f59e0b;border-radius:8px;padding:2px 7px;background:#fffbeb;font-weight:700}
.rep table{font-size:14px}.rep th{width:30%;color:#1d2b44;font-size:13px;vertical-align:top}.rep td{vertical-align:top}
.q{border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:8px 0}.q p{margin:0 0 6px;font-weight:700}.q button{display:block;width:100%;text-align:left;margin:4px 0;border:1px solid var(--line);background:#fff;border-radius:8px;padding:8px 10px;font:inherit;cursor:pointer}.q button.ok{background:#e7f8ee;border-color:#34a853}.q button.no{background:#fdecec;border-color:#e57373}.q .ex{font-size:13px;color:#475569;margin-top:4px}
body.gomulu{background:transparent}body.gomulu header{display:none}body.gomulu main{padding:10px 0 12px}body.gomulu .tabs{padding:4px 0 0}
body.video header,body.video .tabs,body.video #mKitap,body.video #mDene,body.video .safety,body.video #quizCard,body.video #repCard,body.video .tip{display:none!important}
body.video main{grid-template-columns:480px 1fr;max-width:none;padding:16px;align-items:start}body.video canvas.lk-cv{height:420px}`;

/* ---------------- Kimya ---------------- */
const CH={
  KW:1e-14,
  // H+ fazlası (mol/L, eksi ise OH- fazlası) → pH
  pHex(ex){if(Math.abs(ex)<1e-13)return 7;if(ex>0){return -Math.log10(ex/2+Math.sqrt(ex*ex/4+1e-14));}const o=-ex;return 14+Math.log10(o/2+Math.sqrt(o*o/4+1e-14));},
  // zayıf asit HA (C, Ka) pH
  pHweakA(C,Ka){const h=(-Ka+Math.sqrt(Ka*Ka+4*Ka*C))/2;return -Math.log10(Math.max(h,1e-7));},
  pHweakB(C,Kb){const o=(-Kb+Math.sqrt(Kb*Kb+4*Kb*C))/2;return 14+Math.log10(Math.max(o,1e-7));},
  IND:{
    fenol:{ad:'Fenolftalein',lo:8.2,hi:11.5,c1:[255,255,255,0],c2:[231,86,154,.85],n1:'renksiz',n2:'pembe',nm:'açık pembe'},
    metil:{ad:'Metil oranj',lo:3.1,hi:4.4,c1:[214,48,49,.8],c2:[244,180,20,.8],n1:'kırmızı',n2:'sarı',nm:'turuncu'},
    brom:{ad:'Bromtimol mavisi',lo:6.0,hi:7.6,c1:[230,200,40,.75],c2:[40,90,200,.8],n1:'sarı',n2:'mavi',nm:'yeşil'},
    turnusol:{ad:'Turnusol',lo:4.5,hi:8.3,c1:[220,40,60,.7],c2:[60,80,200,.7],n1:'kırmızı',n2:'mavi',nm:'mor'}},
  base:[196,226,255,.82],
  indColor(ind,pH){
    if(!ind||ind==='yok')return {rgba:'rgba(196,226,255,.82)',name:'renksiz'};
    if(ind==='lahana'||ind==='evrensel')return CH.scaleColor(pH,ind);
    const I=CH.IND[ind];let t=(pH-I.lo)/(I.hi-I.lo);t=Math.max(0,Math.min(1,t));
    const m=I.c1.map((v,i)=>v+(I.c2[i]-v)*t),a=m[3],b=CH.base;
    const mix=b.map((v,i)=>i<3?Math.round(v*(1-a)+m[i]*a):Math.max(.82,a));
    return {rgba:`rgba(${mix[0]},${mix[1]},${mix[2]},${mix[3]})`,name:t<.08?I.n1:t>.75?I.n2:I.nm};
  },
  // pH kâğıdı (evrensel indikatör) ve kırmızı lahana renk ölçekleri
  SCALE:{evrensel:[[0,[200,20,30]],[2,[235,70,40]],[4,[245,160,40]],[6,[230,220,60]],[7,[120,190,70]],[8,[60,160,90]],[10,[40,100,180]],[12,[70,50,150]],[14,[90,30,110]]],
         lahana:[[1,[220,30,60]],[3,[210,60,120]],[5,[150,70,160]],[7,[110,80,170]],[8,[60,90,180]],[10,[40,150,140]],[12,[120,190,60]],[14,[230,220,60]]]},
  SNAME:{evrensel:[[3,'kırmızı'],[5,'turuncu'],[6.5,'sarı'],[7.5,'yeşil'],[9.5,'yeşil-mavi'],[11.5,'mavi'],[15,'mor']],lahana:[[2.5,'kırmızı'],[4.5,'pembe'],[6.5,'mor'],[7.5,'mor-mavi'],[9,'mavi'],[11,'yeşil-mavi'],[13,'yeşil'],[15,'sarı']]},
  scaleColor(pH,k){const S=CH.SCALE[k];let a=S[0],b=S[S.length-1];for(let i=0;i<S.length-1;i++)if(pH>=S[i][0]&&pH<=S[i+1][0]){a=S[i];b=S[i+1];break;}
    const t=b[0]===a[0]?0:Math.max(0,Math.min(1,(pH-a[0])/(b[0]-a[0])));const c=a[1].map((v,i)=>Math.round(v+(b[1][i]-v)*t));
    const nm=CH.SNAME[k].find(([x])=>pH<x)[1];return {rgba:`rgba(${c[0]},${c[1]},${c[2]},.85)`,rgb:`rgb(${c[0]},${c[1]},${c[2]})`,name:nm};},
  LAM:{H:350,OH:198,Na:50,K:74,Cl:76,NO3:71,NH4:74,Ac:41}
};

/* ---------------- Zamanlama (Başlat oynatıcısı) ---------------- */
const T={paused:false,abort:false,speed:()=>1};
function clock(ms,cb){return new Promise((r,j)=>{let t=0,last=performance.now();const f=()=>{if(T.abort)return j('abort');const now=performance.now();if(!T.paused)t+=(now-last)*T.speed();last=now;const k=Math.min(1,t/ms);cb&&cb(k);k<1?setTimeout(f,16):r();};f();});}
const sleep=ms=>clock(ms),tween=(ms,cb)=>clock(ms,cb);
const fade=(e,to,ms=500)=>{const from=+(e.getAttribute('opacity')||0);return tween(ms,k=>e.setAttribute('opacity',from+(to-from)*k));};

/* ---------------- SVG aletler ---------------- */
function Scene(svg){
  const S={svg,anim:[],ticks:[]};
  svg.setAttribute('viewBox','0 0 400 560');svg.classList.add('lk-svg');
  const defs=el('defs',{},svg);S.defs=defs;let uid=0;S.uid=p=>p+(++uid);
  const lg=(id,stops,x2=1,y2=0)=>{const g=el('linearGradient',{id,x1:0,y1:0,x2,y2},defs);stops.forEach(([o,c])=>el('stop',{offset:o,'stop-color':c},g));};
  lg('glass',[[0,'rgba(120,150,190,.55)'],[.12,'rgba(255,255,255,.55)'],[.22,'rgba(235,244,255,.18)'],[.75,'rgba(225,238,252,.12)'],[.9,'rgba(255,255,255,.45)'],[1,'rgba(110,140,180,.55)']]);
  lg('metal',[[0,'#6b7280'],[.35,'#e5e7eb'],[.55,'#f9fafb'],[1,'#4b5563']]);lg('metalV',[[0,'#9ca3af'],[.5,'#d1d5db'],[1,'#6b7280']],0,1);
  lg('base',[[0,'#1f2937'],[.5,'#374151'],[1,'#111827']],0,1);lg('wood',[[0,'#e2c9a0'],[1,'#c9a878']],0,1);lg('tile',[[0,'#ffffff'],[1,'#e5e7eb']],0,1);
  lg('teflon',[[0,'#1e3a8a'],[.5,'#3b82f6'],[1,'#1e3a8a']],0,1);lg('meter',[[0,'#374151'],[1,'#111827']],0,1);lg('flame',[[0,'#fde68a'],[.5,'#f97316'],[1,'rgba(239,68,68,0)']],0,1);
  lg('blueflame',[[0,'#93c5fd'],[.6,'#3b82f6'],[1,'rgba(59,130,246,0)']],0,1);
  const sh=el('filter',{id:'sh',x:'-20%',y:'-20%',width:'140%',height:'140%'},defs);el('feDropShadow',{dx:0,dy:3,stdDeviation:3,'flood-color':'#000','flood-opacity':.18},sh);
  el('rect',{x:0,y:0,width:400,height:462,fill:'#eef3f9'},svg);for(let i=0;i<8;i++)el('line',{x1:0,y1:60*i+20,x2:400,y2:60*i+20,stroke:'#e3eaf3'},svg);
  el('rect',{x:0,y:462,width:400,height:98,fill:'url(#wood)'},svg);el('rect',{x:0,y:460,width:400,height:4,fill:'#b8946a'},svg);
  S.layer=el('g',{},svg);S.top=el('g',{},svg);
  const G=(o=0,f)=>el('g',f?{opacity:o,filter:'url(#sh)'}:{opacity:o},S.layer);
  const glass={fill:'url(#glass)',stroke:'rgba(90,115,150,.85)','stroke-width':1.4};
  const txt=(g,x,y,s,size=8,o={})=>{const t=el('text',Object.assign({x,y,'font-size':size,fill:'#334155','font-family':'Nunito','font-weight':700,'text-anchor':'middle'},o),g);t.textContent=s;return t;};
  S.txt=txt;S.G=G;S.glass=glass;

  // Sıvı tutan kap (genel): yol + iç dolgu yüksekliği (mL→y)
  function vessel(g,path,{x0,x1,ybot,ytop,cap,shape}){
    const id=S.uid('cl');const cp=el('clipPath',{id},defs);el('path',{d:path},cp);
    const liq=el('rect',{x:x0,y:ybot,width:x1-x0,height:0,fill:'rgba(196,226,255,.82)','clip-path':`url(#${id})`},g);
    const prc=el('rect',{x:x0,y:ybot,width:x1-x0,height:0,fill:'rgba(255,255,255,0)','clip-path':`url(#${id})`},g);
    const bub=el('g',{'clip-path':`url(#${id})`},g);const cloud=el('circle',{cx:(x0+x1)/2,cy:ybot,r:0,fill:'rgba(0,0,0,0)','clip-path':`url(#${id})`},g);
    el('path',Object.assign({d:path},glass),g);
    const V={g,liq,prc,bub,cloud,vol:0,cap,ybot,ytop,x0,x1,color:'rgba(196,226,255,.82)',gas:0,
      level(v){const f=shape?shape(Math.max(0,Math.min(1,v/cap))):Math.max(0,Math.min(1,v/cap));return ybot-(ybot-ytop)*f;},
      set(v,color){V.vol=v;if(color)V.color=color;const y=V.level(v);liq.setAttribute('y',y);liq.setAttribute('height',ybot-y);liq.setAttribute('fill',V.color);return V;},
      ppt(f,color='rgba(240,240,240,.95)'){const h=Math.max(0,f)*(ybot-ytop)*.22;prc.setAttribute('y',ybot-h);prc.setAttribute('height',h);prc.setAttribute('fill',color);return V;},
      cloudy(f,color){if(color)cloud.setAttribute('fill',color);cloud.setAttribute('cy',(V.level(V.vol)+ybot)/2);cloud.setAttribute('r',f*(x1-x0)*.7);return V;},
      bubbles(rate){V.gas=rate;return V;}};
    S.ticks.push(()=>{if(V.gas>0&&Math.random()<V.gas){const top=V.level(V.vol);if(ybot-top<6)return;const x=x0+(x1-x0)*(.25+Math.random()*.5);const c=el('circle',{cx:x,cy:ybot-3,r:1.4+Math.random()*2.2,fill:'rgba(255,255,255,.75)',stroke:'rgba(120,150,190,.7)','stroke-width':.6},bub);S.anim.push({e:c,y:ybot-3,vy:-.6-Math.random()*.8,stop:top+2,kind:'up'});}});
    return V;
  }
  S.vessel=vessel;
  // Beherglas
  S.beaker=(cx,base=520,w=90,h=110,cap=250,label)=>{const g=G(0,1);const x0=cx-w/2,x1=cx+w/2,y0=base-h;
    const p=`M${x0-4} ${y0} L${x0} ${y0+4} L${x0} ${base-6} Q${x0} ${base} ${x0+6} ${base} L${x1-6} ${base} Q${x1} ${base} ${x1} ${base-6} L${x1} ${y0}`;
    const V=vessel(g,p+' Z',{x0,x1,ybot:base-1,ytop:y0+8,cap});
    for(let k=1;k<=4;k++){const y=base-(h-12)*k/5;el('line',{x1:x0+6,y1:y,x2:x0+18,y2:y,stroke:'#334155','stroke-width':.8},g);txt(g,x0+26,y+3,Math.round(cap*k/5),6.5,{'text-anchor':'start'});}
    if(label)V.lbl=txt(g,cx,base+16,label,10);el('path',{d:`M${x0+8} ${y0+14} L${x0+8} ${base-14}`,stroke:'rgba(255,255,255,.7)','stroke-width':3,'stroke-linecap':'round'},g);return V;};
  // Erlenmayer
  S.erlen=(cx,base=524,cap=100,scale=1,label)=>{const g=G(0,1);const s=scale;const nw=15*s,bw=70*s,h=120*s,neck=42*s;
    const p=`M${cx-nw} ${base-h} L${cx+nw} ${base-h} L${cx+nw} ${base-h+neck} C${cx+nw} ${base-h+neck+6} ${cx+nw+3} ${base-h+neck+10} ${cx+nw+7} ${base-h+neck+16} L${cx+bw-6} ${base-14} C${cx+bw+2} ${base-6} ${cx+bw-2} ${base} ${cx+bw-12} ${base} L${cx-bw+12} ${base} C${cx-bw+2} ${base} ${cx-bw-2} ${base-6} ${cx-bw+6} ${base-14} L${cx-nw-7} ${base-h+neck+16} C${cx-nw-3} ${base-h+neck+10} ${cx-nw} ${base-h+neck+6} ${cx-nw} ${base-h+neck} Z`;
    const V=vessel(g,p,{x0:cx-bw,x1:cx+bw,ybot:base-1,ytop:base-h+neck,cap,shape:f=>Math.min(1,Math.sqrt(f)*.95)});
    el('rect',{x:cx-nw-2,y:base-h-4,width:2*nw+4,height:6,rx:3,fill:'rgba(255,255,255,.55)',stroke:'rgba(90,115,150,.85)'},g);
    el('path',{d:`M${cx-bw+16} ${base-18} Q${cx-bw/2} ${base-50*s} ${cx-nw-8} ${base-h+neck+22}`,fill:'none',stroke:'rgba(255,255,255,.7)','stroke-width':3,'stroke-linecap':'round'},g);
    txt(g,cx,base-h+neck-12,cap+' mL',7,{'font-weight':500});if(label)V.lbl=txt(g,cx,base+16,label,10);V.mouth=[cx,base-h];return V;};
  // Deney tüpü (+ tüplük)
  S.tube=(cx,base=470,h=150,cap=20,label)=>{const g=G(0,1);const w=11;const p=`M${cx-w} ${base-h} L${cx-w} ${base-w} A${w} ${w} 0 0 0 ${cx+w} ${base-w} L${cx+w} ${base-h} Z`;
    const V=vessel(g,p,{x0:cx-w,x1:cx+w,ybot:base,ytop:base-h+10,cap});el('ellipse',{cx,cy:base-h,rx:w+1.5,ry:2.4,fill:'rgba(255,255,255,.6)',stroke:'rgba(90,115,150,.85)'},g);
    if(label)V.lbl=txt(g,cx,base+16,label,9);V.mouth=[cx,base-h];return V;};
  S.rack=(x0,x1,y=430)=>{const g=G(1,1);el('rect',{x:x0,y,width:x1-x0,height:10,rx:3,fill:'#7c5a3a'},g);el('rect',{x:x0,y:y+56,width:x1-x0,height:10,rx:3,fill:'#7c5a3a'},g);
    el('rect',{x:x0+4,y,width:8,height:90,fill:'#6b4a2e'},g);el('rect',{x:x1-12,y,width:8,height:90,fill:'#6b4a2e'},g);el('rect',{x:x0-6,y:516,width:x1-x0+12,height:8,rx:3,fill:'#5b3b22'},g);return g;};
  // Spor + kıskaç (yükseklik y'de)
  S.stand=(x=101,clampY=240,armTo=190)=>{const g=G(0,1);el('rect',{x:x-45,y:524,width:212,height:18,rx:5,fill:'url(#base)'},g);el('rect',{x:x-5,y:26,width:10,height:500,rx:5,fill:'url(#metal)'},g);
    el('rect',{x:x-11,y:clampY-10,width:22,height:20,rx:4,fill:'#374151'},g);el('rect',{x:x+11,y:clampY-4,width:armTo-x-11,height:8,rx:3,fill:'url(#metalV)'},g);
    el('path',{d:`M${armTo-2} ${clampY-6} Q${armTo+10} ${clampY-10} ${armTo+22} ${clampY-6} L${armTo+22} ${clampY+6} Q${armTo+10} ${clampY+10} ${armTo-2} ${clampY+6} Z`,fill:'none',stroke:'#1f2937','stroke-width':3.5},g);return g;};
  S.tileUnder=(cx,w=150)=>{const g=G(1);el('rect',{x:cx-w/2,y:516,width:w,height:10,rx:2,fill:'url(#tile)',stroke:'#cbd5e1'},g);return g;};
  // Büret
  S.burette=(cx=200,top=38,len=270,cap=50)=>{const g=G(0);const id=S.uid('bu');const cp=el('clipPath',{id},defs);el('rect',{x:cx-6.5,y:top+6,width:13,height:len-8},cp);
    const liq=el('rect',{x:cx-6.5,y:top+len,width:13,height:0,fill:'rgba(80,140,225,.55)','clip-path':`url(#${id})`},g);
    el('rect',Object.assign({x:cx-8,y:top,width:16,height:len,rx:2},glass),g);const y0=top+22,px=(len-30)/cap;
    for(let v=0;v<=cap;v++){const y=y0+v*px;const big=v%(cap>=50?10:5)===0,mid=v%5===0;if(!mid&&cap>50)continue;el('line',{x1:big?cx-7.5:mid?cx-4:cx-1,y1:y,x2:cx+5,y2:y,stroke:'#0f172a','stroke-width':big?1:.55,opacity:big?.9:.6},g);if(big)txt(g,cx+12,y+3,v,8,{'text-anchor':'start'});}
    el('path',Object.assign({d:`M${cx-8} ${top+len} L${cx+8} ${top+len} L${cx+5} ${top+len+10} L${cx-5} ${top+len+10} Z`},glass),g);el('ellipse',{cx,cy:top+len+15,rx:9,ry:5,fill:'url(#teflon)'},g);
    const cock=el('g',{},g);el('rect',{x:cx+4,y:top+len+12,width:20,height:6,rx:3,fill:'#1e40af'},cock);el('circle',{cx:cx+25,cy:top+len+15,r:4,fill:'#1e3a8a'},cock);
    el('path',Object.assign({d:`M${cx-3.5} ${top+len+20} L${cx+3.5} ${top+len+20} L${cx+1.2} ${top+len+44} L${cx-1.2} ${top+len+44} Z`},glass),g);
    const lab=txt(g,cx-30,top,'',10,{fill:'#1e3a8a','font-weight':800,'text-anchor':'end'});
    const B={g,tip:[cx,top+len+46],used:0,cap,open(o){cock.setAttribute('transform',o?`rotate(90 ${cx} ${top+len+15})`:'');},
      set(used){B.used=used;const y=y0+used*px;liq.setAttribute('y',y);liq.setAttribute('height',Math.max(0,top+len-y));lab.setAttribute('y',y+4);lab.textContent='▸ '+fmt(used,2)+' mL';}};
    return B;};
  // Mezür
  S.cylinder=(cx,base=520,cap=50,h=190)=>{const g=G(0,1);const x0=cx-15,x1=cx+15;const p=`M${x0} ${base-h} L${x1} ${base-h} L${x1+6} ${base-h-6} L${x1+6} ${base-h} L${x1} ${base-h+4} L${x1} ${base-8} L${x0} ${base-8} Z`;
    const V=vessel(g,p,{x0,x1,ybot:base-9,ytop:base-h+10,cap});el('path',{d:`M${cx-29} ${base-8} L${cx+29} ${base-8} L${cx+33} ${base+2} L${cx-33} ${base+2} Z`,fill:'rgba(59,130,246,.8)'},g);
    for(let v=0;v<=cap;v+=cap/25){const y=V.level(v);const big=Math.round(v)%(cap/5)===0;el('line',{x1:big?cx-1:cx+4,y1:y,x2:x1-1,y2:y,stroke:'#0f172a','stroke-width':big?.9:.5},g);if(big)txt(g,x0+5,y+3,Math.round(v),6.5);}
    txt(g,cx,base-h-12,`mezür (${cap} mL)`,8);return V;};
  // Damlalıklı şişe
  S.dropBottle=(cx,base=452,name='İNDİKATÖR',color='rgba(120,70,30,.65)')=>{const g=G(0,1);el('rect',{x:cx-17,y:base-52,width:34,height:52,rx:6,fill:color,stroke:'#5b3a1a'},g);el('rect',{x:cx-9,y:base-64,width:18,height:14,rx:3,fill:'#1f2937'},g);
    el('path',{d:`M${cx-5} ${base-64} L${cx-5} ${base-92} Q${cx} ${base-102} ${cx+5} ${base-92} L${cx+5} ${base-64} Z`,fill:'#e11d48'},g);el('rect',{x:cx-14,y:base-34,width:28,height:18,rx:2,fill:'#fff'},g);txt(g,cx,base-22,name,5.6,{'font-weight':800,fill:'#111827'});return g;};
  // Reaktif şişesi
  S.bottle=(cx,base=520,name='HCl',color='rgba(196,226,255,.6)')=>{const g=G(0,1);el('path',Object.assign({d:`M${cx-22} ${base} L${cx-22} ${base-62} Q${cx-22} ${base-74} ${cx-10} ${base-78} L${cx-10} ${base-92} L${cx+10} ${base-92} L${cx+10} ${base-78} Q${cx+22} ${base-74} ${cx+22} ${base-62} L${cx+22} ${base} Z`},glass),g);
    el('rect',{x:cx-20,y:base-50,width:40,height:48,rx:3,fill:color},g);el('rect',{x:cx-11,y:base-100,width:22,height:10,rx:3,fill:'#1f2937'},g);el('rect',{x:cx-17,y:base-44,width:34,height:20,rx:2,fill:'#fff'},g);txt(g,cx,base-30,name,8,{'font-weight':800,fill:'#111827'});return g;};
  // Ölçüm aleti (pH metre / kondüktometre / termometre dijital)
  S.meter=(x,y,title='pH METRE',probeTo=[240,470],col='#4ade80')=>{const g=G(0,1);el('rect',{x,y,width:92,height:66,rx:9,fill:'url(#meter)'},g);el('rect',{x:x+8,y:y+8,width:76,height:30,rx:4,fill:'#0b1f14'},g);
    const v=el('text',{x:x+46,y:y+30,'font-size':18,fill:col,'text-anchor':'middle','font-family':'monospace','font-weight':700},g);txt(g,x+46,y+56,title,7.5,{fill:'#9ca3af'});
    const [px,py]=probeTo;el('path',{d:`M${x+46} ${y+66} C${x+46} ${y+120} ${px+10} ${py-80} ${px+4} ${py-44}`,fill:'none',stroke:'#111827','stroke-width':2.2},g);
    el('rect',Object.assign({x:px,y:py-46,width:9,height:72,rx:4},glass),g);el('rect',{x:px,y:py-46,width:9,height:14,rx:3,fill:'#111827'},g);
    return {g,set(s){v.textContent=s;}};};
  // Cam termometre
  S.thermo=(x,yTop=300,len=200,tmin=0,tmax=110)=>{const g=G(0,1);el('rect',Object.assign({x:x-5,y:yTop,width:10,height:len,rx:5},glass),g);el('circle',{cx:x,cy:yTop+len+6,r:8,fill:'#dc2626',stroke:'rgba(90,115,150,.85)'},g);
    const col=el('rect',{x:x-2,y:yTop+len,width:4,height:0,fill:'#dc2626'},g);for(let t=tmin;t<=tmax;t+=10){const y=yTop+len-8-(len-16)*(t-tmin)/(tmax-tmin);el('line',{x1:x+5,y1:y,x2:x+9,y2:y,stroke:'#334155','stroke-width':.7},g);if(t%20===0)txt(g,x+18,y+3,t,6.5);}
    return {g,set(T){const y=yTop+len-8-(len-16)*(Math.max(tmin,Math.min(tmax,T))-tmin)/(tmax-tmin);col.setAttribute('y',y);col.setAttribute('height',yTop+len+2-y);}};};
  // İspirto ocağı / bek alevi + üç ayak + tel
  S.burner=(cx,base=524)=>{const g=G(0,1);el('ellipse',{cx,cy:base-22,rx:26,ry:22,fill:'rgba(196,226,255,.5)',stroke:'rgba(90,115,150,.85)'},g);el('rect',{x:cx-6,y:base-52,width:12,height:12,fill:'#9ca3af'},g);
    const fl=el('path',{d:`M${cx-7} ${base-52} Q${cx} ${base-100} ${cx+7} ${base-52} Z`,fill:'url(#flame)',opacity:0},g);
    let on=false;S.ticks.push(()=>{if(on){const h=44+Math.sin(performance.now()/90)*5;fl.setAttribute('d',`M${cx-7} ${base-52} Q${cx+Math.sin(performance.now()/130)*2} ${base-52-h} ${cx+7} ${base-52} Z`);}});
    return {g,on(o){on=o;fl.setAttribute('opacity',o?1:0);}};};
  S.tripod=(cx,top=396)=>{const g=G(0,1);el('rect',{x:cx-50,y:top,width:100,height:6,rx:2,fill:'#6b7280'},g);el('line',{x1:cx-44,y1:top+6,x2:cx-56,y2:524,stroke:'#4b5563','stroke-width':5},g);el('line',{x1:cx+44,y1:top+6,x2:cx+56,y2:524,stroke:'#4b5563','stroke-width':5},g);
    el('rect',{x:cx-46,y:top-4,width:92,height:4,fill:'#9ca3af'},g);el('rect',{x:cx-26,y:top-4,width:52,height:4,fill:'#f3f4f6'},g);return g;};
  // Balon (erlen ağzında)
  S.balloon=(cx,y,color='#ef4444')=>{const g=G(0);const b=el('ellipse',{cx,cy:y-6,rx:6,ry:6,fill:color,opacity:.85},g);el('rect',{x:cx-6,y:y-4,width:12,height:6,rx:2,fill:color},g);
    return {g,inflate(f){const r=6+f*34;b.setAttribute('rx',r*.86);b.setAttribute('ry',r);b.setAttribute('cy',y-2-r);}};};
  // Kronometre
  S.stopwatch=(x,y)=>{const g=G(0,1);el('circle',{cx:x,cy:y,r:26,fill:'#fff',stroke:'#1f2937','stroke-width':4},g);el('rect',{x:x-5,y:y-36,width:10,height:8,rx:2,fill:'#1f2937'},g);
    const h=el('line',{x1:x,y1:y,x2:x,y2:y-20,stroke:'#dc2626','stroke-width':2.4,'stroke-linecap':'round'},g);const t=txt(g,x,y+14,'0,0 s',8);
    return {g,set(s){const a=(s%60)/60*2*Math.PI;h.setAttribute('x2',x+20*Math.sin(a));h.setAttribute('y2',y-20*Math.cos(a));t.textContent=fmt(s,1)+' s';}};};
  // Hassas terazi
  S.balance=(cx,base=524)=>{const g=G(0,1);el('rect',{x:cx-60,y:base-34,width:120,height:34,rx:6,fill:'#e5e7eb',stroke:'#9ca3af'},g);el('rect',{x:cx-44,y:base-44,width:88,height:8,rx:3,fill:'#cbd5e1'},g);
    el('rect',{x:cx-30,y:base-26,width:60,height:16,rx:3,fill:'#0b1f14'},g);const v=el('text',{x:cx,y:base-14,'font-size':11,fill:'#4ade80','text-anchor':'middle','font-family':'monospace'},g);
    return {g,top:base-44,set(s){v.textContent=s;}};};
  // Damla / akış / döküş
  S.drop=(x,y,yEnd,color='rgba(80,140,225,.9)')=>{const c=el('circle',{cx:x,cy:y,r:2.4,fill:color},S.top);S.anim.push({e:c,y,vy:0,stop:yEnd,kind:'down'});};
  S.stream=(x,y)=>{const r=el('rect',{x:x-.8,y,width:1.6,height:0,fill:'rgba(80,140,225,.75)'},S.top);return {set(h,c){r.setAttribute('height',Math.max(0,h));if(c)r.setAttribute('fill',c);}};};
  S.pour=(from,to,ms,vol)=>{// basit döküş: kaptan kaba aktarım
    const v0=from.vol,t0=to.vol;return tween(ms,k=>{from.set(v0-vol*k);to.set(t0+vol*k);});};
  // Sabit kutulu, probu hareket ettirilebilen ölçer
  S.probeMeter=(x,y,title='pH METRE',col='#4ade80',px=200,py=500)=>{const g=G(0,1);el('rect',{x,y,width:92,height:66,rx:9,fill:'url(#meter)'},g);el('rect',{x:x+8,y:y+8,width:76,height:30,rx:4,fill:'#0b1f14'},g);
    const v=el('text',{x:x+46,y:y+30,'font-size':18,fill:col,'text-anchor':'middle','font-family':'monospace','font-weight':700},g);txt(g,x+46,y+56,title,7.5,{fill:'#9ca3af'});
    const cab=el('path',{fill:'none',stroke:'#111827','stroke-width':2.2},g);const pr=el('g',{},g);el('rect',Object.assign({x:0,y:-46,width:9,height:72,rx:4},glass),pr);el('rect',{x:0,y:-46,width:9,height:14,rx:3,fill:'#111827'},pr);
    const M={g,px,py,set(s){v.textContent=s;},move(X,Y){M.px=X;M.py=Y;pr.setAttribute('transform',`translate(${X} ${Y})`);cab.setAttribute('d',`M${x+46} ${y+66} C${x+46} ${y+130} ${X+10} ${Y-100} ${X+4} ${Y-44}`);},
      glide(X,Y,ms=900){const x0=M.px,y0=M.py;return tween(ms,k=>{const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const lift=Math.sin(Math.PI*k)*60;M.move(x0+(X-x0)*e,y0+(Y-y0)*e-lift);});}};
    M.move(px,py);return M;};
  // pH kâğıdı şeridi (pens ile tutulan)
  S.phStrip=(x,y)=>{const g=el('g',{opacity:0},S.top);el('rect',{x:x-3,y:y-70,width:6,height:46,rx:2,fill:'#9ca3af'},g);const r=el('rect',{x:x-5,y:y-26,width:10,height:34,rx:1.5,fill:'#f2e29b',stroke:'#cbb860'},g);
    const P2={g,x,y,color(c){r.setAttribute('fill',c);},to(X,Y){g.setAttribute('transform',`translate(${X-x} ${Y-y})`);}};return P2;};
  // pH renk skalası kartı
  S.phScale=(x,y,w=360)=>{const g=G(1,1);el('rect',{x:x-4,y:y-4,width:w+8,height:34,rx:5,fill:'#fff',stroke:'#cbd5e1'},g);for(let i=0;i<=14;i++){const c=CH.scaleColor(i,'evrensel');el('rect',{x:x+i*w/15,y,width:w/15-1,height:14,fill:c.rgb},g);txt(g,x+i*w/15+w/30,y+24,i,7);}return g;};
  S.tick=()=>{S.ticks.forEach(f=>f());S.anim=S.anim.filter(a=>{a.vy+=a.kind==='down'?.6:-.02;a.y+=a.vy;a.e.setAttribute('cy',a.y);if((a.kind==='down'&&a.y>=a.stop)||(a.kind==='up'&&a.y<=a.stop)){a.e.remove();return false;}return true;});requestAnimationFrame(S.tick);};
  requestAnimationFrame(S.tick);
  return S;
}

/* ---------------- Grafik ---------------- */
function Graph(cv,o){const cx=cv.getContext('2d');const G={series:[],o};
  G.draw=()=>{const W=cv.width,H=cv.height,L=50,R=14,Tp=14,B=36;cx.clearRect(0,0,W,H);const {xmax,ymax,ymin=0,xl,yl}=G.o;
    cx.strokeStyle='#e2e8f0';cx.fillStyle='#64748b';cx.font='13px Nunito';cx.lineWidth=1;
    for(let i=0;i<=5;i++){const v=ymin+(ymax-ymin)*i/5,y=Tp+(H-Tp-B)*(1-i/5);cx.beginPath();cx.moveTo(L,y);cx.lineTo(W-R,y);cx.stroke();cx.fillText(+v.toFixed(2)+'',L-34,y+4);}
    for(let i=0;i<=5;i++){const v=xmax*i/5,x=L+(W-L-R)*i/5;cx.fillText(+v.toFixed(1)+'',x-6,H-14);}
    cx.fillText(yl,6,Tp+24);cx.fillText(xl,W-R-160,H-1);
    G.series.forEach(s=>{if(s.pts.length<1)return;cx.strokeStyle=s.c;cx.fillStyle=s.c;cx.lineWidth=s.w||3;cx.beginPath();s.pts.forEach(([x,y],i)=>{const X=L+(W-L-R)*Math.min(x,xmax)/xmax,Y=Tp+(H-Tp-B)*(1-(y-ymin)/(ymax-ymin));i?cx.lineTo(X,Y):cx.moveTo(X,Y);});if(!s.dots)cx.stroke();
      if(s.dots)s.pts.forEach(([x,y])=>{const X=L+(W-L-R)*Math.min(x,xmax)/xmax,Y=Tp+(H-Tp-B)*(1-(y-ymin)/(ymax-ymin));cx.beginPath();cx.arc(X,Y,5,0,7);cx.fill();});});};
  G.add=(c,w,dots)=>{const s={c,w,dots,pts:[]};G.series.push(s);return s;};G.clear=()=>{G.series=[];G.draw();};return G;}

/* ---------------- Sayfa iskeleti ---------------- */
function page(cfg){
  const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
  const fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&display=swap';document.head.appendChild(fl);
  document.title=`Sanal Lab · ${cfg.baslik}`;
  const b=document.body;
  b.innerHTML=`<header><h1>🧪 Sanal Laboratuvar · ${cfg.baslik}</h1><p>${cfg.alt||''}</p></header>
  <div class="tabs"><button class="tab on" data-m="kitap">📘 Kitaptaki deney</button><button class="tab" data-m="dene">🧑‍🔬 Kendin dene</button></div>
  <main><section class="card"><svg id="svg"></svg><div class="readouts" id="ro"></div><div class="safety">${(cfg.guvenlik||['⚠ Koruyucu gözlük','🧤 Eldiven','🧪 Cam malzeme']).map(s=>`<span>${s}</span>`).join('')}</div></section>
  <section><div id="mKitap" class="card"><h2>📘 Kitaptaki deney · Başlat'a bas, izle</h2><div class="caption" id="cap"></div>
   <div class="row"><button class="b p" id="kStart">▶ Başlat</button><button class="b" id="kPause" disabled>⏸ Duraklat</button><button class="b" id="kReset">⟲ Baştan</button><label class="row" style="gap:6px;font-weight:700;font-size:14px">Hız <select id="kSpeed" style="width:auto"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div>
   <div class="chips">${(cfg.malzemeler||[]).map(m=>`<span class="chip">${m}</span>`).join('')}</div><ol class="steps" id="stepList"></ol><div class="calc" id="kCalc"></div></div>
   <div id="mDene" class="card hidden"><h2>🧑‍🔬 Kendin dene · Deneyini tasarla</h2><div id="deneForm"></div>
    <h2 style="margin-top:12px">Değişkenlerin</h2><div class="grid2"><div><label class="f">Bağımsız değişken (ben değiştiriyorum)</label><select id="vInd"></select></div><div><label class="f">Bağımlı değişken (ölçüyorum)</label><select id="vDep"></select></div></div>
    <div class="vars"><div class="vbox v1"><h4>BAĞIMSIZ</h4><div id="vbI"></div></div><div class="vbox v2"><h4>BAĞIMLI</h4><div id="vbD"></div></div><div class="vbox v3"><h4>KONTROL (sabit tut)</h4><div id="vbK"></div></div></div>
    <div class="warn" id="dWarn"></div><div class="row" id="deneBtns" style="margin-top:8px"></div><p class="tip" id="dTip"></p>
    <table id="dTable"><thead></thead><tbody></tbody></table><div class="calc" id="dCalc"></div></div>
   <div class="card${cfg.grafik?'':' hidden'}" style="margin-top:14px" id="gCard"><h2>📈 ${cfg.grafik?cfg.grafik.baslik:''}</h2><canvas class="lk-cv" id="cv" width="760" height="300"></canvas><p class="tip">${cfg.grafik?cfg.grafik.not||'':''}</p></div>
   <div class="card hidden" id="quizCard" style="margin-top:14px"><h2>❓ Sonuç soruları</h2><div id="quiz"></div></div>
   <div class="card hidden" id="repCard" style="margin-top:14px"><h2>📝 Deney raporu</h2><div id="rep" class="rep"></div><div class="row" style="margin-top:8px"><button class="b" id="repCopy">📋 Raporu kopyala</button><span class="tip" id="repMsg"></span></div></div>
  </section></main>`;
  const P={cfg,mode:'kitap'};
  P.S=Scene($('#svg'));T.speed=()=>P.mode==='kitap'?+$('#kSpeed').value:1;
  // ölçüm kutuları
  P.ro={};(cfg.olcumler||[]).forEach(([id,ad,birim])=>{const d=hx('div',{class:'ro',html:`<small>${ad}</small><b id="ro_${id}">–</b> ${birim||''}`},$('#ro'));P.ro[id]=$('#ro_'+id,d);});
  P.set=(id,v)=>{if(P.ro[id])P.ro[id].textContent=v;};
  if(cfg.grafik){P.graph=Graph($('#cv'),cfg.grafik);P.graph.draw();}
  // adımlar
  const STEPS=cfg.adimlar||[];
  P.stepUI=i=>{window.__step=i;$('#stepList').innerHTML=STEPS.map((s,k)=>`<li class="${k<i?'ok':k===i?'on':''}">${s[0]}</li>`).join('');
    if(i>=0&&i<STEPS.length)$('#cap').innerHTML=`<span class="n">${i+1}/${STEPS.length}</span><b>${STEPS[i][0]}.</b> ${STEPS[i][1]}`;};
  P.idle=()=>{P.stepUI(-1);$('#cap').innerHTML='<span class="n">Hazır</span>Malzemeler tezgâhta. <b>Başlat</b>’a basınca kitaptaki deney adım adım yapılır.';$('#kStart').disabled=false;$('#kPause').disabled=true;$('#kPause').textContent='⏸ Duraklat';};
  P.hideEnd=()=>{$('#quizCard').classList.add('hidden');$('#repCard').classList.add('hidden');$('#kCalc').classList.remove('show');$('#dCalc').classList.remove('show');};
  P.reset=async()=>{T.abort=true;await new Promise(r=>setTimeout(r,40));T.abort=false;T.paused=false;P.hideEnd();
    // sahneyi baştan kur
    const svg=$('#svg');svg.innerHTML='';P.S=Scene(svg);Object.keys(P.ro).forEach(k=>P.set(k,'–'));if(P.graph)P.graph.clear();
    await (P.mode==='kitap'?cfg.kur(P,'kitap'):cfg.kur(P,'dene'));};
  P.calc=html=>{$('#kCalc').innerHTML=html;$('#kCalc').classList.add('show');};
  P.done=msg=>{$('#cap').innerHTML='<span class="n">Bitti</span>'+msg;$('#stepList').querySelectorAll('li').forEach(l=>l.className='ok');};
  $('#kStart').onclick=async()=>{await P.reset();$('#kStart').disabled=true;$('#kPause').disabled=false;try{await cfg.calistir(P);if(cfg.rapor)report(P,cfg.rapor(P));if(cfg.sorular)quiz(cfg.sorular);}catch(e){if(e!=='abort')console.error(e);}$('#kStart').disabled=false;$('#kPause').disabled=true;};
  $('#kPause').onclick=()=>{T.paused=!T.paused;$('#kPause').textContent=T.paused?'▶ Devam':'⏸ Duraklat';};
  $('#kReset').onclick=async()=>{await P.reset();P.idle();};
  document.querySelectorAll('.tab').forEach(t=>t.onclick=async()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===t));P.mode=t.dataset.m;
    $('#mKitap').classList.toggle('hidden',P.mode!=='kitap');$('#mDene').classList.toggle('hidden',P.mode!=='dene');await P.reset();if(P.mode==='kitap')P.idle();else dene(P);});
  // gömülü / video
  if(location.hash==='#video'){b.classList.add('video');const rc=$('#ro');$('#gCard').prepend(rc);}
  else if(location.hash==='#gomulu'||window.self!==window.top){b.classList.add('gomulu');const ad=cfg.ad;const bildir=()=>{try{parent.postMessage({tur:'kk-lab-yukseklik',ad,h:document.documentElement.scrollHeight},'*')}catch{}};try{new ResizeObserver(bildir).observe(b)}catch{setInterval(bildir,800)};bildir();}
  $('#repCopy').onclick=async()=>{try{await navigator.clipboard.writeText(P.repText||'');$('#repMsg').textContent='Kopyalandı.';}catch{$('#repMsg').textContent='Kopyalanamadı; metni seçip kopyalayabilirsin.';}};
  (async()=>{await cfg.kur(P,'kitap');P.idle();})();
  window.LAB=P;return P;
}

/* ---------------- Kendin dene: değişkenler ---------------- */
function dene(P){
  const D=P.cfg.dene;if(!D)return;P.trials=[];
  const F=$('#deneForm');F.innerHTML='<div class="grid2" id="dFields"></div><div class="row" id="dChecks" style="margin-top:8px"></div>';
  D.alanlar.forEach(a=>{const w=hx('div',{},$('#dFields'));hx('label',{class:'f',text:a.ad},w);const s=hx('select',{id:'f_'+a.id},w);
    a.secenek.forEach(([v,t])=>{const o=hx('option',{value:v,text:t},s);if(String(v)===String(a.deger))o.selected=true;});s.onchange=varsUI;});
  const vI=$('#vInd'),vD=$('#vDep');vI.innerHTML=D.alanlar.filter(a=>a.bagimsiz!==false).map(a=>`<option value="${a.id}">${a.ad}</option>`).join('');
  vD.innerHTML=D.bagimli.map(([id,ad])=>`<option value="${id}">${ad}</option>`).join('');vI.onchange=varsUI;vD.onchange=varsUI;
  if(D.varsayilanBagimsiz)vI.value=D.varsayilanBagimsiz;
  const B=$('#deneBtns');B.innerHTML='';P.btn={};
  (D.dugmeler||[]).forEach(([id,ad,cls])=>{const x=hx('button',{class:'b '+(cls||''),id:'db_'+id,text:ad},B);x.onclick=()=>D.on(id,P);P.btn[id]=x;});
  P.cfgNow=()=>{const c={};D.alanlar.forEach(a=>c[a.id]=$('#f_'+a.id).value);return c;};
  P.label=(id,v)=>{const a=D.alanlar.find(x=>x.id===id);const o=a.secenek.find(([x])=>String(x)===String(v));return o?o[1]:v;};
  $('#dTable thead').innerHTML='<tr><th>#</th><th id="thInd"></th>'+D.tablo.map(([,h])=>`<th>${h}</th>`).join('')+'</tr>';
  P.enable=(ids,on)=>ids.forEach(i=>P.btn[i]&&(P.btn[i].disabled=!on));
  P.tip=t=>$('#dTip').textContent=t;
  P.record=row=>{const vi=$('#vInd').value;P.trials.push({cfg:P.cfgNow(),row});
    $('#dTable tbody').innerHTML=P.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${P.label(vi,t.cfg[vi])}</td>${D.tablo.map(([k])=>`<td>${t.row[k]}</td>`).join('')}</tr>`).join('');
    if(P.trials.length>=2&&D.sorular)quiz(D.sorular);
    report(P,[['Deneyin Adı',P.cfg.baslik+' (kendi tasarımım)'],['Bağımsız değişken',$('#vInd').selectedOptions[0].text],['Bağımlı değişken',$('#vDep').selectedOptions[0].text],
      ['Kontrol değişkenleri',$('#vbK').innerHTML.replace(/• /g,'')],['Ölçümler',P.trials.map((t,i)=>`${i+1}) ${$('#vInd').selectedOptions[0].text}: ${P.label(vi,t.cfg[vi])} → `+D.tablo.map(([k,h])=>`${h}: ${t.row[k]}`).join(', ')).join('<br>')],['Sonuç (sen yaz)','Tablodaki değerlere bakarak bağımsız değişken ile bağımlı değişken arasındaki ilişkiyi bir cümleyle yaz.']]);
    varsUI();};
  P.say=h=>{$('#dCalc').innerHTML=h;$('#dCalc').classList.add('show');};
  function varsUI(){const c=P.cfgNow(),vi=vI.value;$('#thInd').textContent=vI.selectedOptions[0]?vI.selectedOptions[0].text:'';
    $('#vbI').textContent=`${vI.selectedOptions[0].text}: ${P.label(vi,c[vi])}`;$('#vbD').textContent=vD.selectedOptions[0].text;
    $('#vbK').innerHTML=D.alanlar.filter(a=>a.id!==vi).map(a=>`• ${a.ad}: ${P.label(a.id,c[a.id])}`).join('<br>')+(D.sabitler?'<br>'+D.sabitler.map(s=>'• '+s).join('<br>'):'');
    let w=D.kontrol?D.kontrol(c)||'':'';
    if(!w&&P.trials.length){const t0=P.trials[0].cfg;const bad=D.alanlar.filter(a=>a.id!==vi&&String(t0[a.id])!==String(c[a.id]));if(bad.length)w='Dikkat: sadece bağımsız değişkeni değiştirmelisin. Şunlar da değişti: '+bad.map(a=>a.ad.toLowerCase()).join(', ')+'.';}
    $('#dWarn').textContent=w;P.blocked=!!(D.kontrol&&D.kontrol(c));}
  P.varsUI=varsUI;varsUI();P.tip(D.ipucu||'');P.enable(Object.keys(P.btn),true);if(D.baslangic)D.baslangic(P);
}

/* ---------------- Sorular ve rapor ---------------- */
function quiz(list){const box=$('#quiz');box.innerHTML='';
  list.forEach((it,i)=>{const d=hx('div',{class:'q',html:`<p>${i+1}. ${it.q}</p>`},box);
    it.o.forEach((o,k)=>{const b=hx('button',{text:String.fromCharCode(65+k)+') '+o},d);b.onclick=()=>{if(d.dataset.done)return;d.dataset.done=1;b.classList.add(k===it.a?'ok':'no');d.querySelectorAll('button')[it.a].classList.add('ok');
      hx('div',{class:'ex',text:(k===it.a?'✅ Doğru. ':'❌ Doğru cevap '+String.fromCharCode(65+it.a)+'. ')+it.e},d);};});});
  $('#quizCard').classList.remove('hidden');}
function report(P,rows){$('#rep').innerHTML='<table>'+rows.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('')+'</table>';$('#repCard').classList.remove('hidden');
  P.repText=rows.map(([k,v])=>k+': '+String(v).replace(/<br>/g,'\n  ').replace(/<[^>]+>/g,'')).join('\n');}

window.LK={page,CH,el,hx,fmt,tr,sleep,tween,fade,clock,T,quiz,report};
})();
