/* Tepkime hızı deneyleri için ortak kurucu (labkit.js üstüne). HZ.page(o) */
(()=>{const {CH,el,fmt,tr,sleep,tween,fade}=LK;
const MF={Mg:4,Al:1.4,Zn:1,Fe:.35,Cu:0,H2O2:.04,CaCO3:1.2};
const YF={serit:1,parca:1.8,toz:6,folyo:1.3,tablet:1,ezilmis:4};
const RENK={Mg:'#e5e7eb',Al:'#cbd5e1',Zn:'#94a3b8',Fe:'#57534e',Cu:'#c2410c',CaCO3:'#fafaf9'};
// varsayılan hız modeli: 1/dk
function rate(p){if(p.r!=null)return p.r;let r=(MF[p.metal]||0)*Math.pow(p.M??1,1)*(YF[p.yuzey||'parca']||1)*Math.pow(2,((p.T??25)-25)/10);if(p.kat)r*=p.kat;if(p.hal==='buhar')r*=6;return r;}
function tend(p){const r=rate(p);return r<=0?Infinity:Math.min(900,60/r);} // saniye
function page(o){
 let V=[],TH=[],SW,PC=[],GLOW=[],STK;
 const n=o.kaplar.length,XS=n===1?[200]:n===2?[130,280]:n===3?[90,200,310]:[60,150,250,340];
 const ol=o.kaplar.map((k,i)=>['k'+i,k.ad,'s']);
 const cfg={ad:o.ad,baslik:o.baslik,alt:o.alt,malzemeler:o.malzemeler,guvenlik:o.guvenlik,olcumler:[...ol.slice(0,3),['g','Gözlem','']],
  grafik:{baslik:`Tepkimenin ilerleyişi – zaman`,xmax:o.tmax||300,ymax:100,xl:'Zaman (s)',yl:'Tepkime (%)',not:o.grafikNot||'Her eğri bir kabı gösterir. Eğri ne kadar dikse tepkime o kadar hızlıdır.'},
  adimlar:o.adimlar,
  async kur(P,m){const S=P.S;V=[];TH=[];PC=[];GLOW=[];
   if(o.rack!==false&&!o.kaplar.some(k=>k.tip==='banyo'))S.rack(XS[0]-40,XS[n-1]+40,440);
   o.kaplar.forEach((k,i)=>{const x=XS[i];let v;
    if(k.tip==='banyo'){const b=S.beaker(x,520,92,120,250,'');b.set(200,k.T<20?'rgba(200,225,255,.85)':'rgba(205,225,250,.8)');b.g.setAttribute('opacity',1);
      if(k.T<20)for(let j=0;j<6;j++)el('rect',{x:x-36+(j*17)%66,y:440+(j*23)%50,width:11,height:9,rx:2,fill:'rgba(255,255,255,.9)',stroke:'#93c5fd'},b.g);
      if(k.T>40){const h=S.heater(x,556,110);h.g.setAttribute('opacity',1);h.on(1);}
      v=S.tube(x,500,150,20,'');TH[i]=S.thermo(x+30,300,190,0,100);TH[i].g.setAttribute('opacity',1);TH[i].set(k.T);}
    else if(k.tip==='beher'){v=S.beaker(x,520,96,110,250,'');}
    else v=S.tube(x,500,150,20,'');
    v.l=S.txt(v.g,x,k.tip==='banyo'?318:330,k.ad,9.5,{fill:'#1e293b'});v.g.setAttribute('opacity',1);V.push(v);});
   SW=S.stopwatch(200,70);SW.g.setAttribute('opacity',1);SW.set(0);
   if(o.kibrit){STK=o.kaplar.map((k,i)=>{const g=el('g',{opacity:0},S.top);el('rect',{x:XS[i]-2,y:250,width:4,height:90,fill:'#b45309'},g);const t=el('circle',{cx:XS[i],cy:342,r:4,fill:'#7f1d1d'},g);const f=el('path',{d:`M${XS[i]-5} 344 Q${XS[i]} 316 ${XS[i]+5} 344 Z`,fill:'url(#flame)',opacity:0},g);return {g,t,f};});}
   if(o.kur)o.kur(P,S,V,XS);},
  async run(P,ps,durMs,graph){const T=ps.map(tend),tmax=o.tmax||300;const G=graph?ps.map((p,i)=>P.graph.add(['#dc2626','#2563eb','#16a34a','#7c3aed'][i],3)):null;
   ps.forEach((p,i)=>{if(p.metal&&p.metal!=='H2O2'){PC[i]&&PC[i].g.remove();PC[i]=P.S.pieces(V[i],p.yuzey==='toz'?36:p.yuzey==='serit'?2:6,RENK[p.metal]||'#9ca3af',p.yuzey==='toz'?'toz':p.yuzey==='serit'||p.yuzey==='folyo'?'folyo':'parca');}else if(p.kat){PC[i]&&PC[i].g.remove();PC[i]=P.S.pieces(V[i],20,'#1c1917','toz');}});
   const rmax=Math.max(...ps.map(rate),.01);const done=ps.map(()=>false);
   await tween(durMs,kk=>{const t=kk*tmax;SW.set(t);ps.forEach((p,i)=>{const f=Math.min(1,t/T[i]);const r=rate(p);
     V[i].bubbles(f<1?Math.min(.9,.08+.8*r/rmax):0);if(PC[i]&&p.metal)PC[i].shrink(f*1.05);
     if(o.kibrit&&STK){const on=r>.5&&f<1&&t>3;STK[i].f.setAttribute('opacity',on?1:0);STK[i].t.setAttribute('fill',on?'#f97316':'#7f1d1d');}
     if(G){G[i].pts.push([t,f*100]);}P.set('k'+i,f>=1?fmt(T[i],0):isFinite(T[i])?'…':'tepkime yok');if(f>=1&&!done[i]){done[i]=true;if(o.bitince)o.bitince(P,i);}});if(G)P.graph.draw();});
   ps.forEach((p,i)=>V[i].bubbles(0));if(o.kibrit&&STK)STK.forEach(s=>s.f.setAttribute('opacity',0));return T;},
  async calistir(P){P.graph.clear();const ps=o.kaplar;P.rows=[];
   P.stepUI(0);P.set('g','hipotez');await sleep(3000);
   P.stepUI(1);for(let i=0;i<n;i++){const k=ps[i];await tween(700,kk=>V[i].set((k.tip==='beher'?150:10)*kk,k.renk||'rgba(196,226,255,.82)'));}P.set('g','tüpler hazır');await sleep(700);
   let st=2;if(o.adimlar.length>5){P.stepUI(st++);if(o.ara)await o.ara(P,V,TH);else await sleep(1500);}
   P.stepUI(st++);P.set('g',o.eklenen||'metal eklendi');if(o.kibrit)STK.forEach(s=>fade(s.g,1,400));await sleep(800);
   P.stepUI(st++);P.set('g','izleniyor');const T=await cfg.run(P,ps,o.sure||9000,true);
   ps.forEach((k,i)=>P.rows.push([k.ad,isFinite(T[i])?fmt(T[i],0)+' s':'tepkime yok',fmt(rate(k),2)]));
   P.stepUI(st);P.set('g',o.gozlem||'karşılaştır');await sleep(900);
   P.calc('<b>Ölçümler</b><table><tr><th>Kap</th><th>Tepkimenin bitme süresi</th><th>Bağıl hız</th></tr>'+P.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')+'</table>'+(o.denklem?`<p style="margin:.5em 0 0">${o.denklem}</p>`:''));
   P.done(o.sonucKisa);},
  rapor:P=>[['Deneyin Adı',o.baslik],['Deneyin Amacı',o.amac],['Tarih',new Date().toLocaleDateString('tr-TR')],['Malzemeler',o.malzemeler.join(', ')],['Değişkenler',o.degiskenler],
   ['Deneyin Yapılışı',o.adimlar.slice(1,-1).map((x,i)=>`${i+1}. ${x[1]}`).join('<br>')],['Gözlemler',P.rows.map(r=>`${r[0]}: ${r[1]}`).join('<br>')],['Sonuç',o.sonuc]],
  sorular:o.sorular,
  dene:{alanlar:o.dene.alanlar,bagimli:[['t','Tepkimenin bitme süresi'],['r','Gaz çıkış hızı']],sabitler:o.dene.sabitler,varsayilanBagimsiz:o.dene.bagimsiz,
   tablo:[['t','Bitme süresi'],['r','Bağıl hız']],dugmeler:[['go','▶ Başlat ve süre tut','p'],['kay','✔ Kaydet','g']],ipucu:o.dene.ipucu,
   baslangic(P){P.enable(['kay'],false);V.forEach((v,i)=>{if(i)v.g.setAttribute('opacity',0);});TH.forEach((t,i)=>{if(i&&t)t.g.setAttribute('opacity',0);});},
   async on(id,P){const c=P.cfgNow();
    if(id==='go'){const p=o.dene.kap(c);V[0].set(p.tip==='beher'?150:10,p.renk||'rgba(196,226,255,.82)');V[0].l.textContent=p.ad||'';if(TH[0]&&p.T!=null)TH[0].set(p.T);P.graph.clear();
      const T=await cfg.run(P,[p],5000,true);P.cur={t:isFinite(T[0])?fmt(T[0],0)+' s':'tepkime yok',r:fmt(rate(p),2)};P.set('g',isFinite(T[0])?'bitti':'tepkime yok');P.enable(['kay'],true);return;}
    if(id==='kay'&&P.cur){P.record(P.cur);P.say(o.dene.yorum);P.enable(['kay'],false);}},
   sorular:o.dene.sorular}};
 LK.page(cfg);return cfg;}
window.HZ={page,rate,tend,MF,YF};
})();
