/* Kimya Koçum · Deney Atölyesi oynatıcısı (deneyoynatici.js)
   Deney Atölyesi'nde kurulan deneyi (JSON) sahneye kurar ve adım adım oynatır.
   labkit.js ve aletler.js'ten SONRA yüklenir. Hem Deney Atölyesi hem de dışa aktarılan lab sayfası bunu kullanır. */
(function(){
'use strict';
const {sleep,tween}=LK;
/* ---------- Renkler ---------- */
const RENK={su:'rgba(196,226,255,.82)',mavi:'rgba(59,130,246,.55)',acikmavi:'rgba(147,197,253,.6)',pembe:'rgba(236,72,153,.55)',kirmizi:'rgba(220,38,38,.6)',turuncu:'rgba(249,115,22,.6)',
  sari:'rgba(234,179,8,.55)',yesil:'rgba(34,197,94,.55)',mor:'rgba(147,51,234,.5)',kahve:'rgba(146,64,14,.6)',siyah:'rgba(30,30,30,.8)',beyaz:'rgba(245,245,245,.95)',gri:'rgba(156,163,175,.8)',
  yag:'rgba(234,179,8,.45)',renksiz:'rgba(225,238,252,.5)'};
const RENK_AD={su:'Su (renksiz)',mavi:'Mavi (CuSO₄)',acikmavi:'Açık mavi',pembe:'Pembe (fenolftalein)',kirmizi:'Kırmızı',turuncu:'Turuncu',sari:'Sarı',yesil:'Yeşil',mor:'Mor',kahve:'Kahverengi',siyah:'Siyah',beyaz:'Beyaz (çökelek)',gri:'Gri',yag:'Yağ sarısı',renksiz:'Renksiz'};
const renk=c=>!c?c:RENK[c]||(/^#[0-9a-f]{6}$/i.test(c)?`rgba(${parseInt(c.slice(1,3),16)},${parseInt(c.slice(3,5),16)},${parseInt(c.slice(5,7),16)},.6)`:c);
const rgba=c=>{const m=String(renk(c)||'').match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null;};
const lerpYazi=(a,b,k)=>{const na=String(a).match(/-?\d+(\.\d+)?/g),nb=String(b).match(/-?\d+(\.\d+)?/g);if(!na||!nb||na.length!==nb.length||String(a).replace(/-?\d+(\.\d+)?/g,'#')!==String(b).replace(/-?\d+(\.\d+)?/g,'#'))return k<1?a:b;let i=0;return String(b).replace(/-?\d+(\.\d+)?/g,()=>{const v=+na[i]+(+nb[i]-+na[i])*k;i++;return Math.round(v*100)/100;});};
const karis=(a,b,k)=>{const x=rgba(a),y=rgba(b);if(!x||!y)return renk(k<.5?a:b);const z=x.map((v,i)=>v+(y[i]-v)*k);return `rgba(${Math.round(z[0])},${Math.round(z[1])},${Math.round(z[2])},${z[3].toFixed(2)})`;};

/* ---------- Alet kataloğu ----------
   [tür, ad, kategori, kur(S,x,y,o), ayarlar[[anahtar,etiket,tip,varsayılan]], yöntemler[[ad,etiket,argümanlar[[etiket,tip,varsayılan]],canlandırılır]] ] */
const KAP=[['set','Sıvı miktarı ve rengi',[['Miktar (mL)','sayi',100],['Renk','renk','su']],1],['ppt','Çökelek',[['Miktar (0–1)','sayi',.6],['Renk','renk','beyaz']],1],
  ['cloudy','Bulanıklık',[['Miktar (0–1)','sayi',.6],['Renk','renk','beyaz']],1],['bubbles','Gaz kabarcığı',[['Hız (0–1, 0 = dur)','sayi',.3]],0]];
const EKRAN=[['set','Göstergeye yaz',[['Değer','metin','7,00']],0]];
const AC=[['on','Aç / kapat',[['Açık','bool',true]],0]];
const ac1=o=>{o.g&&o.g.setAttribute&&o.g.setAttribute('opacity',1);return o;};
const ac1g=g=>{g.setAttribute('opacity',1);return {g};};
const AY_ETIKET=['ad','Etiket','metin',''];
const K=[
 // Cam malzemeler (kit)
 ['beaker','Beherglas','Cam malzemeler',(S,x,y,o)=>ac1(S.beaker(x,y,+o.w||90,+o.h||110,+o.cap||250,o.ad)),[['cap','Hacim (mL)','sayi',250],['w','Genişlik','sayi',90],['h','Yükseklik','sayi',110],AY_ETIKET],KAP],
 ['erlen','Erlenmayer','Cam malzemeler',(S,x,y,o)=>ac1(S.erlen(x,y,+o.cap||250,+o.olcek||1,o.ad)),[['cap','Hacim (mL)','sayi',250],['olcek','Boyut (0,5–1,5)','sayi',1],AY_ETIKET],KAP],
 ['tube','Deney tüpü','Cam malzemeler',(S,x,y,o)=>ac1(S.tube(x,y,+o.h||150,+o.cap||20,o.ad)),[['cap','Hacim (mL)','sayi',20],['h','Boy','sayi',150],AY_ETIKET],KAP],
 ['cylinder','Dereceli silindir (mezür)','Cam malzemeler',(S,x,y,o)=>ac1(S.cylinder(x,y,+o.cap||50,+o.h||190)),[['cap','Hacim (mL)','sayi',50],['h','Boy','sayi',190]],KAP],
 ['burette','Büret','Cam malzemeler',(S,x,y,o)=>{const B=S.burette(x,y-(+o.len||270)-60,+o.len||270,+o.cap||50);B.g.setAttribute('opacity',1);B.set(+o.dolu||0);return B;},[['cap','Hacim (mL)','sayi',50],['len','Boy','sayi',270]],
   [['set','Harcanan hacim (mL)',[['mL','sayi',10]],1],['open','Musluk',[['Açık','bool',true]],0]]],
 ['pipet','Dereceli pipet','Cam malzemeler',(S,x,y,o)=>S.A.pipet(x,y,{cap:+o.cap||10}),[['cap','Hacim (mL)','sayi',10]],[['set','Sıvı miktarı ve rengi',[['mL','sayi',5],['Renk','renk','su']],1]]],
 ['tamPipet','Tam pipet','Cam malzemeler',(S,x,y,o)=>S.A.tamPipet(x,y,{cap:+o.cap||10}),[['cap','Hacim (mL)','sayi',10]],[['set','Sıvı miktarı ve rengi',[['mL','sayi',10],['Renk','renk','su']],1]]],
 ['puar','Puar','Cam malzemeler',(S,x,y)=>S.A.puar(x,y),[],[]],
 ['damlalik','Damlalık','Cam malzemeler',(S,x,y,o)=>S.A.damlalik(x,y,{renk:renk(o.renk)}),[['renk','Sıvı rengi','renk','su']],[['set','Doluluk ve renk',[['Doluluk (0–1)','sayi',.6],['Renk','renk','su']],1]]],
 ['dropBottle','Damlalıklı şişe','Cam malzemeler',(S,x,y,o)=>ac1g(S.dropBottle(x,y,o.ad||'İNDİKATÖR',renk(o.renk||'kahve'))),[['ad','Etiket','metin','FENOLFTALEİN'],['renk','Renk','renk','renksiz']],[]],
 ['bottle','Reaktif şişesi','Cam malzemeler',(S,x,y,o)=>ac1g(S.bottle(x,y,o.ad||'HCl',renk(o.renk||'su'))),[['ad','Etiket','metin','HCl'],['renk','Renk','renk','su']],[]],
 ['piset','Piset','Cam malzemeler',(S,x,y,o)=>S.A.piset(x,y,{ad:o.ad}),[['ad','Etiket','metin','SAF SU']],KAP.slice(0,1)],
 ['balonJoje','Balon joje','Cam malzemeler',(S,x,y,o)=>S.A.balonJoje(x,y,{cap:+o.cap||100,ad:o.ad}),[['cap','Hacim (mL)','sayi',100],AY_ETIKET],KAP],
 ['yuvarlakBalon','Dibi yuvarlak balon','Cam malzemeler',(S,x,y,o)=>S.A.yuvarlakBalon(x,y,{cap:+o.cap||250,ad:o.ad}),[['cap','Hacim (mL)','sayi',250],AY_ETIKET],KAP],
 ['nuce','Nuçe erlenmayeri','Cam malzemeler',(S,x,y,o)=>S.A.nuce(x,y,{cap:+o.cap||250,olcek:+o.olcek||1,ad:o.ad}),[['cap','Hacim (mL)','sayi',250],['olcek','Boyut','sayi',1],AY_ETIKET],KAP],
 ['huni','Huni','Cam malzemeler',(S,x,y)=>S.A.huni(x,y),[],KAP.slice(0,1)],
 ['ayirmaHunisi','Ayırma hunisi','Cam malzemeler',(S,x,y)=>S.A.ayirmaHunisi(x,y),[],[KAP[0],['katman','Alt katman',[['Alt katman (mL)','sayi',80],['Renk','renk','mavi']],0]]],
 ['baget','Cam baget','Cam malzemeler',(S,x,y,o)=>S.A.baget(x,y,{aci:(+o.aci||0)*Math.PI/180}),[['aci','Eğim (°)','sayi',15]],[['karistir','Karıştır',[['Karıştırıyor','bool',true]],0]]],
 ['saatCami','Saat camı','Cam malzemeler',(S,x,y)=>S.A.saatCami(x,y),[],[['koy','Üstüne madde koy',[['Boyut','sayi',14],['Renk','renk','beyaz']],1]]],
 ['petri','Petri kabı','Cam malzemeler',(S,x,y)=>S.A.petri(x,y),[],KAP.slice(0,3)],
 ['camBoru','Cam boru','Cam malzemeler',(S,x,y,o)=>S.A.camBoru(x,y,{L:+o.L||260,yatay:o.yatay!=='dikey'}),[['L','Uzunluk','sayi',260],['yatay','Yön','secim:yatay|dikey','yatay']],[['halka','Halka oluştur',[['Konum (x)','sayi',0],['Renk','renk','beyaz']],0]]],
 ['uBorusu','U borusu','Cam malzemeler',(S,x,y)=>S.A.uBorusu(x,y),[],[['set','Sıvı seviyeleri',[['Sol kol','sayi',80],['Sağ kol','sayi',80],['Renk','renk','mavi']],1]]],
 ['kilcal','Kılcal borular','Cam malzemeler',(S,x,y)=>S.A.kilcal(x,y),[],[['yuksel','Sıvı yükselmesi',[['Miktar (0–1)','sayi',1]],1]]],
 ['kristalizuar','Kristalizuar','Cam malzemeler',(S,x,y)=>S.A.kristalizuar(x,y),[],KAP],
 ['desikator','Desikatör','Cam malzemeler',(S,x,y)=>S.A.desikator(x,y),[],[]],
 ['tersTup','Ters tüp (gaz toplama)','Cam malzemeler',(S,x,y)=>S.A.tersTup(x,y),[],[['gaz','Toplanan gaz (mL)',[['mL','sayi',25]],1]]],
 ['eudiometre','Eudiometre','Cam malzemeler',(S,x,y)=>S.A.eudiometre(x,y),[],[['gaz','Toplanan gaz (mL)',[['mL','sayi',25]],1]]],
 ['dumas','Dumas balonu','Cam malzemeler',(S,x,y)=>S.A.dumas(x,y),[],KAP.slice(0,1)],
 ['kuvet','Küvet','Cam malzemeler',(S,x,y)=>S.A.kuvet(x,y),[],KAP.slice(0,1)],
 ['lam','Lam ve lamel','Cam malzemeler',(S,x,y)=>S.A.lam(x,y),[],[['damla','Damla',[['Boyut','sayi',5],['Renk','renk','su']],0]]],
 ['sogutucu','Liebig soğutucu','Cam malzemeler',(S,x,y,o)=>S.A.sogutucu(x,y,{aci:+o.aci||20}),[['aci','Eğim (°)','sayi',20]],[['su','Soğutma suyu',[['Akıyor','bool',true]],0]]],
 ['destilasyon','Destilasyon düzeneği','Cam malzemeler',(S,x,y)=>S.A.destilasyon(x,y),[],[['calis','Çalıştır',[['Çalışıyor','bool',true]],0]]],
 ['geriSogutucu','Geri soğutucu','Cam malzemeler',(S,x,y)=>S.A.geriSogutucu(x,y),[],[]],
 ['wellPlate','Kuyu plaka','Cam malzemeler',(S,x,y,o)=>{const W=S.wellPlate(x-60,y-70,+o.sutun||4,+o.satir||2);W.g.setAttribute('opacity',1);return W;},[['sutun','Sütun','sayi',4],['satir','Satır','sayi',2]],[]],
 ['trough','Su küveti (gaz toplama)','Cam malzemeler',(S,x,y,o)=>{const V=S.trough(x-(+o.w||140)/2,x+(+o.w||140)/2,y-100);V.g.setAttribute('opacity',1);return V;},[['w','Genişlik','sayi',140]],KAP.slice(0,1)],
 // Porselen, metal
 ['kapsul','Porselen kapsül','Porselen ve metal',(S,x,y)=>S.A.kapsul(x,y),[],KAP],
 ['kroze','Kroze','Porselen ve metal',(S,x,y)=>S.A.kroze(x,y),[],[['doldur','İçindeki madde',[['Doluluk (0–1)','sayi',.4],['Renk','renk','gri']],1],['kapak','Kapak',[['Kapalı','bool',true]],0]]],
 ['havan','Havan ve havaneli','Porselen ve metal',(S,x,y)=>S.A.havan(x,y),[],[['ez','Ez',[['Eziyor','bool',true]],0],['toz','Toz',[['Miktar','sayi',18],['Renk','renk','gri']],1]]],
 ['buchner','Büchner hunisi','Porselen ve metal',(S,x,y)=>S.A.buchner(x,y),[],[['kek','Süzüntü kalıntısı',[['Kalınlık','sayi',6],['Renk','renk','beyaz']],1]]],
 ['spatul','Spatül','Porselen ve metal',(S,x,y)=>S.A.spatul(x,y),[],[['yukle','Ucuna madde al',[['Miktar','sayi',5],['Renk','renk','beyaz']],0]]],
 ['tupMasasi','Tüp maşası','Porselen ve metal',(S,x,y)=>S.A.tupMasasi(x,y),[],[]],
 ['krozeMasasi','Kroze maşası','Porselen ve metal',(S,x,y)=>S.A.krozeMasasi(x,y),[],[]],
 ['pens','Pens','Porselen ve metal',(S,x,y)=>S.A.pens(x,y),[],[]],
 ['stand','Spor ve kıskaç','Porselen ve metal',(S,x,y,o)=>{const g=S.stand(x,+o.kiskac||240,x+(+o.kol||90));g.setAttribute('opacity',1);return {g};},[['kiskac','Kıskaç yüksekliği (y)','sayi',240],['kol','Kol uzunluğu','sayi',90]],[]],
 ['halka','Bağlama halkası','Porselen ve metal',(S,x,y)=>S.A.halka(x,y),[],[]],
 ['tripod','Üç ayak + tel kafes','Porselen ve metal',(S,x,y,o)=>{const g=S.tripod(x,y-128);g.setAttribute('opacity',1);return {g};},[],[]],
 ['kilUcgen','Kil üçgen','Porselen ve metal',(S,x,y)=>S.A.kilUcgen(x,y),[],[]],
 ['rack','Tüplük','Porselen ve metal',(S,x,y,o)=>ac1g(S.rack(x-(+o.w||120)/2,x+(+o.w||120)/2,y-94)),[['w','Genişlik','sayi',120]],[]],
 ['tupFircasi','Tüp fırçası','Porselen ve metal',(S,x,y)=>S.A.tupFircasi(x,y),[],[]],
 ['makas','Makas','Porselen ve metal',(S,x,y)=>S.A.makas(x,y),[],[]],
 ['cetvel','Cetvel','Porselen ve metal',(S,x,y,o)=>S.A.cetvel(x,y,{L:+o.L||200}),[['L','Uzunluk','sayi',200]],[]],
 ['bilye','Çelik bilye','Porselen ve metal',(S,x,y)=>S.A.bilye(x,y),[],[]],
 ['egikDuzlem','Eğik düzlem','Porselen ve metal',(S,x,y)=>S.A.egikDuzlem(x,y),[],[]],
 ['kiskac','Üniversal / çift büret kıskacı','Porselen ve metal',(S,x,y,o)=>S.A.kiskac(x,y,{cift:o.cift==='çift'}),[['cift','Tür','secim:tek|çift','tek']],[]],
 ['kriko','Ayarlı platform (kriko)','Porselen ve metal',(S,x,y)=>S.A.kriko(x,y),[],[['set','Yükseklik',[['Yükseklik','sayi',60]],1]]],
 ['alevTeli','Alev testi teli','Porselen ve metal',(S,x,y)=>S.A.alevTeli(x,y),[],[['renk','Alev rengi',[['Renk','renk','#a855f7']],0]]],
 // Isıtıcılar
 ['burner','Bünzen beki','Isıtıcılar',(S,x,y)=>ac1(S.burner(x,y)),[],AC],
 ['ispirto','İspirto ocağı','Isıtıcılar',(S,x,y)=>S.A.ispirto(x,y),[],AC],
 ['heater','Elektrikli ısıtıcı','Isıtıcılar',(S,x,y)=>ac1(S.heater(x,y)),[],[['on','Isıtma gücü',[['0–1','sayi',1]],1]]],
 ['isiticiTabla','Isıtıcı tabla + manyetik karıştırıcı','Isıtıcılar',(S,x,y)=>S.A.isiticiTabla(x,y),[],[['on','Isıt',[['Sıcaklık (°C, 0 = kapalı)','sayi',60]],0],['karistir','Manyetik karıştırıcı',[['Açık','bool',true]],0]]],
 ['suBanyosu','Su banyosu','Isıtıcılar',(S,x,y)=>S.A.suBanyosu(x,y),[],[['sicaklik','Sıcaklık',[['°C','sayi',60]],0]]],
 ['etuv','Etüv','Isıtıcılar',(S,x,y)=>S.A.etuv(x,y),[],[['on','Sıcaklık',[['°C (0 = kapalı)','sayi',105]],0]]],
 ['kibrit','Kibrit / tahta kıymık','Isıtıcılar',(S,x,y)=>S.A.kibrit(x,y),[],[['durum','Kıymık',[['Durum','secim:söndü|kor|alev','alev']],0],['git','Kıymığı taşı',[['x kayması','sayi',0],['y kayması','sayi',-100]],1]]],
 ['buzBanyosu','Buz banyosu','Isıtıcılar',(S,x,y)=>S.A.buzBanyosu(x,y),[],[]],
 ['santrifuj','Santrifüj','Isıtıcılar',(S,x,y)=>S.A.santrifuj(x,y),[],AC],
 ['vakum','Vakum pompası','Isıtıcılar',(S,x,y)=>S.A.vakum(x,y),[],AC],
 // Ölçü cihazları
 ['thermo','Cam termometre','Ölçü cihazları',(S,x,y,o)=>{const T=S.thermo(x,y-(+o.L||200)-14,+o.L||200,+o.min||0,+o.max||110);T.g.setAttribute('opacity',1);return T;},[['L','Boy','sayi',200],['min','En düşük','sayi',0],['max','En yüksek','sayi',110]],[['set','Sıcaklık',[['°C','sayi',25]],1]]],
 ['dijitalTermometre','Dijital termometre','Ölçü cihazları',(S,x,y)=>S.A.dijitalTermometre(x,y-120),[],[['set','Sıcaklık',[['°C','sayi',25]],0]]],
 ['probeMeter','pH metre (problu)','Ölçü cihazları',(S,x,y,o)=>{const M=S.probeMeter(x-46,y-66,o.ad||'pH METRE','#4ade80',x+60,y+40);M.g.setAttribute('opacity',1);return M;},[['ad','Başlık','metin','pH METRE']],[['set','Göstergeye yaz',[['Değer','metin','7,00']],0],['glide','Probu götür',[['x','sayi',300],['y','sayi',500]],0]]],
 ['meter','Ölçüm cihazı (kondüktometre, pH metre)','Ölçü cihazları',(S,x,y,o)=>ac1(S.meter(x-46,y-66,o.ad||'İLETKENLİK',[x+60,y+60],'#4ade80')),[['ad','Başlık','metin','İLETKENLİK']],EKRAN],
 ['balance','Hassas terazi','Ölçü cihazları',(S,x,y)=>ac1(S.balance(x,y)),[],EKRAN],
 ['stopwatch','Kronometre','Ölçü cihazları',(S,x,y)=>ac1(S.stopwatch(x,y-30)),[],[['set','Süre (s)',[['s','sayi',30]],1]]],
 ['manometre','Manometre','Ölçü cihazları',(S,x,y)=>S.A.manometre(x,y),[],[['fark','Seviye farkı',[['mm','sayi',40]],1]]],
 ['barometre','Barometre','Ölçü cihazları',(S,x,y)=>S.A.barometre(x,y-60),[],[['set','Basınç (mmHg)',[['mmHg','sayi',760]],1]]],
 ['sirınga','Gaz şırıngası','Ölçü cihazları',(S,x,y,o)=>S.A.sirınga(x,y,{cap:+o.cap||60}),[['cap','Hacim (mL)','sayi',60]],[['set','Piston (mL)',[['mL','sayi',30]],1]]],
 ['kalorimetre','Kalorimetre','Ölçü cihazları',(S,x,y)=>S.A.kalorimetre(x,y),[],KAP.slice(0,1)],
 ['bombaKalorimetre','Bomba kalorimetresi','Ölçü cihazları',(S,x,y)=>S.A.bombaKalorimetre(x,y),[],KAP.slice(0,1)],
 ['termosKalorimetre','Termos kalorimetre','Ölçü cihazları',(S,x,y)=>S.A.termosKalorimetre(x,y),[],KAP.slice(0,1)],
 ['voltmetre','Voltmetre','Ölçü cihazları',(S,x,y)=>S.A.voltmetre(x,y),[],EKRAN],
 ['ampermetre','Ampermetre','Ölçü cihazları',(S,x,y)=>S.A.ampermetre(x,y),[],EKRAN],
 ['multimetre','Multimetre','Ölçü cihazları',(S,x,y)=>S.A.multimetre(x,y),[],[['set','Göstergeye yaz',[['Değer','metin','1,50'],['Mod','secim:V|A|Ω','V']],0]]],
 ['kolorimetre','Kolorimetre','Ölçü cihazları',(S,x,y)=>S.A.kolorimetre(x,y),[],EKRAN],
 ['lazer','Lazer (Tyndall)','Ölçü cihazları',(S,x,y)=>S.A.lazer(x,y),[],[['on','Işın',[['Işının bittiği x (0 = kapalı)','sayi',500],['Görünür','bool',true]],0]]],
 ['mikroskop','Mikroskop','Ölçü cihazları',(S,x,y)=>S.A.mikroskop(x,y),[],[]],
 ['dansimetre','Dansimetre','Ölçü cihazları',(S,x,y)=>S.A.dansimetre(x,y),[],[['yogunluk','Yoğunluk (g/mL)',[['g/mL','sayi',1]],1]]],
 ['veriToplayici','Veri toplayıcı','Ölçü cihazları',(S,x,y)=>S.A.veriToplayici(x,y),[],[['ekle','Nokta ekle',[['Zaman','sayi',10],['Değer','sayi',50]],0],['temizle','Temizle',[],0]]],
 ['buyutec','Büyüteç','Ölçü cihazları',(S,x,y)=>S.A.buyutec(x,y),[],[]],
 ['geiger','Geiger sayacı','Ölçü cihazları',(S,x,y)=>S.A.geiger(x,y),[],EKRAN],
 // Elektrokimya
 ['gucKaynagi','DC güç kaynağı','Elektrokimya',(S,x,y)=>S.A.gucKaynagi(x,y),[],[['set','Gerilim (V, 0 = kapalı)',[['V','sayi',6]],0]]],
 ['pil','Pil (1,5 V)','Elektrokimya',(S,x,y,o)=>S.A.pil(x,y,{yatay:o.yon!=='dik'}),[['yon','Duruş','secim:yatay|dik','yatay']],[]],
 ['pil9V','Pil (9 V)','Elektrokimya',(S,x,y)=>S.A.pil9V(x,y),[],[]],
 ['pilYuvasi','Pil yuvası','Elektrokimya',(S,x,y,o)=>S.A.pilYuvasi(x,y,{n:+o.n||2}),[['n','Pil sayısı','sayi',2]],[]],
 ['elektrot','Elektrot','Elektrokimya',(S,x,y,o)=>S.A.elektrot(x,y-(+o.h||170),{tur:o.tur||'Cu',h:+o.h||170}),[['tur','Metal','secim:Cu|Zn|C|Pt|Fe|Ag|Pb|Mg','Cu'],['h','Boy','sayi',170]],
   [['kapla','Üstü kaplansın',[['Kalınlık','sayi',2],['Renk','renk','#b87333']],1],['asin','Aşınsın (çözünsün)',[['Miktar (0–1)','sayi',.4]],1],['gaz','Gaz çıkışı',[['Hız (0–1)','sayi',.3]],0]]],
 ['tuzKopru','Tuz köprüsü','Elektrokimya',(S,x,y,o)=>S.A.tuzKopru(x-(+o.w||74),x+(+o.w||74),y-110,{derin:60}),[['w','Yarı genişlik','sayi',74]],[['on','İyon akışı',[['Açık','bool',true]],0]]],
 ['gozenekliKap','Gözenekli kap','Elektrokimya',(S,x,y)=>S.A.gozenekliKap(x,y),[],KAP.slice(0,1)],
 ['hofmann','Hofmann voltametresi','Elektrokimya',(S,x,y)=>S.A.hofmann(x,y),[],[['set','Toplanan gazlar',[['H₂ (mL)','sayi',40],['O₂ (mL)','sayi',20]],1],['calis','Elektroliz',[['Çalışıyor','bool',true]],0]]],
 ['elektrolizKabi','Elektroliz kabı','Elektrokimya',(S,x,y,o)=>S.A.elektrolizKabi(x,y,{anot:o.anot||'C',katot:o.katot||'C',renk:renk(o.renk||'mavi')}),[['anot','Anot','secim:C|Cu|Pt|Zn|Fe','C'],['katot','Katot','secim:C|Cu|Pt|Zn|Fe','C'],['renk','Çözelti rengi','renk','mavi']],KAP.slice(0,1)],
 ['daniell','Daniell pili (hazır düzenek)','Elektrokimya',(S,x,y)=>S.A.daniell(x,y),[],[['calis','Devre',[['Kapalı (çalışıyor)','bool',true]],0]]],
 ['ampul','Ampul','Elektrokimya',(S,x,y)=>S.A.ampul(x,y),[],[['yak','Parlaklık',[['0–1','sayi',1]],1]]],
 ['led','LED','Elektrokimya',(S,x,y,o)=>S.A.led(x,y,{renk:o.renk}),[['renk','Renk','renk','#ef4444']],[['yak','Yanıyor',[['Açık','bool',true]],0]]],
 ['anahtar','Anahtar','Elektrokimya',(S,x,y)=>S.A.anahtar(x,y),[],[['kapat','Devre',[['Kapalı','bool',true]],0]]],
 ['kablo','Bağlantı kablosu','Elektrokimya',null,[['a','1. uç (alet.uç)','uc',''],['b','2. uç (alet.uç)','uc',''],['renk','Renk','secim:kırmızı|siyah','kırmızı'],['sarkma','Sarkma','sayi',40]],[['elektron','Elektron akışı',[['Hız (0 = dur)','sayi',1]],0]]],
 // Gaz düzenekleri
 ['stopper','Lastik tıpa','Gaz düzenekleri',(S,x,y,o)=>ac1g(S.stopper(x,y,+o.w||16)),[['w','Genişlik','sayi',16]],[]],
 ['hose','Lastik hortum','Gaz düzenekleri',(S,x,y,o)=>{const g=S.hose(o.d||`M${x} ${y} q 60 -80 120 0`);g.setAttribute('opacity',1);return {g};},[['d','Yol (SVG, boş = kısa kavis)','metin','']],[]],
 ['balloon','Elastik balon','Gaz düzenekleri',(S,x,y,o)=>{const B=S.balloon(x,y,renk(o.renk)||'#ef4444');B.g.setAttribute('opacity',1);return B;},[['renk','Renk','renk','#ef4444']],[['inflate','Şişme',[['0–1','sayi',.8]],1]]],
 ['kipp','Kipp aparatı','Gaz düzenekleri',(S,x,y)=>S.A.kipp(x,y),[],[]],
 ['gazYikama','Gaz yıkama şişesi','Gaz düzenekleri',(S,x,y)=>S.A.gazYikama(x,y),[],[['kabarcik','Kabarcık',[['Hız (0–1)','sayi',.3]],0]]],
 // Kâğıt, sarf
 ['phStrip','pH kâğıdı (pensle)','Kâğıt ve sarf',(S,x,y)=>{const P=S.phStrip(x,y);P.g.setAttribute('opacity',1);return P;},[],[['color','Renk al',[['Renk','renk','#ef4444']],0],['to','Götür',[['x','sayi',300],['y','sayi',460]],0]]],
 ['phScale','pH renk skalası','Kâğıt ve sarf',(S,x,y,o)=>({g:S.phScale(x-150,y-40,300)}),[],[]],
 ['turnusol','Turnusol kâğıdı','Kâğıt ve sarf',(S,x,y,o)=>S.A.turnusol(x,y,{renk:o.renk}),[['renk','Başlangıç','secim:kirmizi|mavi','kirmizi']],[['renk','Renk değiştir',[['Renk','secim:mavi|kirmizi','mavi']],0]]],
 ['suzgecKagidi','Süzgeç kâğıdı (huniye)','Kâğıt ve sarf',(S,x,y)=>S.A.suzgecKagidi(x,y),[],[['kalinti','Kalıntı',[['Miktar (0–1)','sayi',.5],['Renk','renk','beyaz']],1]]],
 ['kromatografi','Kâğıt kromatografisi','Kâğıt ve sarf',(S,x,y)=>S.A.kromatografi(x,y),[],[['ilerle','Çözücü ilerlesin',[['Miktar (0–1)','sayi',.8]],1]]],
 ['folyo','Alüminyum folyo','Kâğıt ve sarf',(S,x,y,o)=>S.A.folyo(x,y,{mat:o.yuz==='mat'}),[['yuz','Yüz','secim:parlak|mat','parlak']],[]],
 ['etiket','Etiket','Kâğıt ve sarf',(S,x,y,o)=>S.A.etiket(x,y,{yazi:o.yazi||'ETİKET'}),[['yazi','Yazı','metin','ETİKET']],[]],
 ['pamuk','Pamuk','Kâğıt ve sarf',(S,x,y)=>S.A.pamuk(x,y),[],[]],
 // Güvenlik
 ['gozluk','Koruyucu gözlük','Güvenlik',(S,x,y)=>S.A.gozluk(x,y),[],[]],
 ['eldiven','Eldiven','Güvenlik',(S,x,y)=>S.A.eldiven(x,y),[],[]],
 ['onluk','Önlük','Güvenlik',(S,x,y)=>S.A.onluk(x,y),[],[]],
 ['cekerOcak','Çeker ocak','Güvenlik',(S,x,y)=>S.A.cekerOcak(x,y),[],[['cam','Cam kapak açıklığı',[['0–1','sayi',.6]],1]]],
 ['yanginSondurucu','Yangın söndürücü','Güvenlik',(S,x,y)=>S.A.yanginSondurucu(x,y),[],[]],
 ['gozDusu','Göz duşu','Güvenlik',(S,x,y)=>S.A.gozDusu(x,y-120),[],[]],
];
const KAT={};K.forEach(r=>KAT[r[0]]={tur:r[0],ad:r[1],kat:r[2],kur:r[3],ayar:r[4],yontem:r[5]});
// Hazır lablardan çevrilen aletler: labkit fonksiyonu ham ayarlarıyla çağrılır (tur:'kit', o:{f,args,gorunur}); x,y = kaydırma
const KITMAP={beaker:'beaker',erlen:'erlen',tube:'tube',cylinder:'cylinder',burette:'burette',dropBottle:'dropBottle',bottle:'bottle',meter:'meter',probeMeter:'probeMeter',thermo:'thermo',
  burner:'burner',tripod:'tripod',balloon:'balloon',stopwatch:'stopwatch',balance:'balance',heater:'heater',phStrip:'phStrip',phScale:'phScale',wellPlate:'wellPlate',trough:'trough',hose:'hose',stopper:'stopper',stand:'stand',rack:'rack',foam:'',pieces:'',stream:''};
const ADX={__svg:'Özel çizim',__defs:'Çizim tanımları',txt:'Yazı',foam:'Köpük',pieces:'Katı parçalar',stream:'Akış',tileUnder:'Altlık'};
const coz=(v,M)=>typeof v==='string'&&v[0]==='@'&&M?(v==='@ust'?M.__S.top:v==='@katman'?M.__S.layer:M[v.slice(1)]):Array.isArray(v)?v.map(x=>coz(x,M)):v;
function yolBul(o,y){return String(y).split('.').reduce((x,k)=>x&&x[k],o);}
function normal(o){if(!o)return o;if(o instanceof Element)return {g:o};return o;}
function kitKur(S,x,y,o,M){if(o.f==='__defs'){S.defs.insertAdjacentHTML('beforeend',(o.args||[])[0]||'');return {};}
  if(o.f==='__svg'){const g=LK.el('g',{},(o.args||[])[0]==='ust'?S.top:S.layer);g.innerHTML=(o.args||[])[1]||'';if(x||y)g.setAttribute('transform',`translate(${x} ${y})`);return {g,__html(h){g.innerHTML=h;}};}
  const f=S[o.f];if(typeof f!=='function')return null;const ar=coz(o.args||[],M);if(o.f==='txt'&&ar[0]&&!(ar[0] instanceof Element))ar[0]=ar[0].g;if(o.f==='txt'&&!ar[0])return null;const r=normal(f(...ar));if(!r)return r;
  if(r.g&&r.g.setAttribute){r.g.setAttribute('opacity',o.gorunur==null?1:o.gorunur);if(x||y){const t0=r.g.getAttribute('transform')||'';r.g.setAttribute('transform',`translate(${x||0} ${y||0}) ${t0}`);
    ['mouth','tip','uc','bag'].forEach(n=>{if(Array.isArray(r[n]))r[n]=[r[n][0]+x,r[n][1]+y];});}}return r;}
function katOf(a){if(!a)return null;if(a.tur!=='kit')return KAT[a.tur];const f=a.o&&a.o.f;const b=KAT[KITMAP[f]];
  return {tur:'kit',ad:(b?b.ad:(ADX[f]||f||'Hazır alet')),kat:'Hazır lab',kur:kitKur,ayar:[],yontem:b?b.yontem:[]};}
// Genel işlemler (alet gerektirmeyen)
const GENEL=[
 ['bekle','Bekle',[['Süre (s)','sayi',1]]],
 ['dok','Dök (kaptan kaba)',[['Kaynak','alet',''],['Hedef','alet',''],['Miktar (mL)','sayi',20],['Hedefin yeni rengi (boş = aynı)','renk','']]],
 ['damlat','Damlat',[['Kaynak (damlalık, büret, şişe…)','alet',''],['Hedef kap','alet',''],['Damla sayısı','sayi',3],['Hedefin yeni rengi (boş = aynı)','renk','']]],
 ['parca','Katı parça ekle',[['Hedef kap','alet',''],['Parça sayısı','sayi',4],['Renk','renk','gri'],['Tür','secim:parca|toz|serit','parca']]],
 ['erit','Katı parçalar küçülsün',[['Hedef kap','alet',''],['Ne kadar (0–1)','sayi',1]]],
 ['kopuk','Köpük taşsın',[['Hedef kap','alet',''],['Yükseklik (0–1)','sayi',.8],['Renk','renk','beyaz']]],
 ['tasi','Aleti taşı',[['Alet','alet',''],['x kayması','sayi',0],['y kayması','sayi',-60]]],
 ['buhar','Buhar çıksın',[['Alet (ağzından)','alet',''],['Hız (0 = dur)','sayi',.25]]],
 ['duman','Duman çıksın',[['Alet (ağzından)','alet',''],['Hız (0 = dur)','sayi',.25]]],
 ['alev','Alev',[['Alet (üstünde)','alet',''],['Açık','bool',true]]],
 ['parlama','Parlama (flaş)',[['Alet','alet','']]],
 ['kristal','Kristal büyüsün',[['Alet','alet',''],['Miktar (0–1)','sayi',1],['Renk','renk','#e2e8f0']]],
 ['yazi','Sahneye yazı yaz',[['Yazı','metin','CO₂ ↑'],['x','sayi',400],['y','sayi',120]]],
 ['ok','Ok çiz',[['x1','sayi',300],['y1','sayi',200],['x2','sayi',360],['y2','sayi',260]]],
];
const GEN={};GENEL.forEach(r=>GEN[r[0]]={ad:r[1],arg:r[2]});

/* ---------- Kurulum ---------- */
const nok=(o,yedek)=>o&&(o.mouth||o.tip||o.uc||o.bag||o.alev||o.cikis)||yedek;
function kur(S,D){
  const M={__S:S};const son=a=>a.tur==='kablo'?2:(a.tur==='kit'&&a.o&&a.o.f==='txt'&&String((a.o.args||[])[0]).startsWith('@k'))?1:0;const sira=(D.aletler||[]).slice().sort((a,b)=>son(a)-son(b));
  sira.forEach(a=>{try{
    if(a.tur==='kablo'){const uc=s=>{const [id,k]=String(s||'').split('.');const o=M[id];if(!o)return null;const v=k?o[k]:nok(o);return Array.isArray(v)&&typeof v[0]==='number'?v:null;};
      const p1=uc(a.o&&a.o.a),p2=uc(a.o&&a.o.b);if(p1&&p2)M[a.id]=S.A.kablo(p1,p2,{renk:(a.o.renk==='siyah')?'#111827':'#dc2626',sarkma:a.o.sarkma==null?40:+a.o.sarkma});return;}
    const k=katOf(a);if(!k||!k.kur)return;const o=k.kur(S,+a.x||0,+a.y||0,a.o||{},M);if(!o)return;o.__x=a.tur==='kit'?(o.mouth?o.mouth[0]:(+a.x||0)):+a.x;o.__y=a.tur==='kit'?(o.ybot||(o.mouth?o.mouth[1]+100:+a.y||0)):+a.y;o.__tur=a.tur;o.__k=k;M[a.id]=o;
    (a.bas||[]).forEach(c=>cagir(c.yol?yolBul(o,c.yol):o,c.ad,c.arg,M));
  }catch(e){console.error('Alet kurulamadı',a,e);}});
  M.__S=S;M.__son={};return M;}
function arg(v,t){if(t==='renk')return renk(v);if(t==='sayi')return v===''||v==null?0:+v;if(t==='bool')return v===true||v==='true'||v===1||v==='1';return v;}
function argTipleri(o,ad){const k=o.__k||KAT[o.__tur];const y=k&&k.yontem.find(x=>x[0]===ad);return y?y[2].map(a=>a[1]):[];}
function cagir(o,ad,args,M){if(!o)return;if(ad==='__op'){o.g&&o.g.setAttribute('opacity',args[0]);return;}if(ad==='__tr'){o.g&&o.g.setAttribute('transform',args[0]);return;}if(typeof o[ad]!=='function')return;const t=argTipleri(o,ad);const a=(args||[]).map((v,i)=>t[i]?arg(v,t[i]):coz(v,M));
  if(ad==='durum'&&a[0]==='söndü')a[0]='';return o[ad](...a);}
/* ---------- Adım oynatma ---------- */
async function islem(M,I){const S=M.__S;if(+I.gecikme>0)await sleep(+I.gecikme*1000);const ms=Math.max(0,(+I.sure||0)*1000);const A=I.arg||[];const al=id=>{if(!id)return undefined;const [k,...y]=String(id).split('.');return y.length?yolBul(M[k],y.join('.')):M[k];};
  if(I.tip==='yontem'){const o=al(I.hedef);if(!o)return;const key=I.hedef+'.'+I.ad;const t=argTipleri(o,I.ad);const k=o.__k||KAT[o.__tur],y=k&&k.yontem.find(x=>x[0]===I.ad);
    if(!y||I.ilk){// genel: sayılar ve renkler ilk→son arası canlandırılır
      const son=A.map(v=>coz(v,M)),ilk=(I.ilk||A).map(v=>coz(v,M));const uygula=a=>{if(I.ad==='__op'){o.g&&o.g.setAttribute('opacity',a[0]);return;}if(I.ad==='__tr'){o.g&&o.g.setAttribute('transform',a[0]);return;}if(typeof o[I.ad]==='function')try{o[I.ad](...a);}catch(e){}};
      if(ms>0)await tween(ms,q=>uygula(son.map((v,i)=>typeof v==='number'&&typeof ilk[i]==='number'?ilk[i]+(v-ilk[i])*q:typeof v==='string'&&/^rgba?\(/.test(v)&&typeof ilk[i]==='string'&&/^rgba?\(/.test(ilk[i])?karis(ilk[i],v,q):typeof v==='string'&&typeof ilk[i]==='string'?lerpYazi(ilk[i],v,q):v)));
      uygula(son);M.__son[key]=son;return;}
    const yeni=A.map((v,i)=>arg(v,t[i]));
    if(ms>0&&y&&y[3]){let eski=M.__son[key];if(!eski){eski=yeni.map((v,i)=>t[i]==='sayi'?(I.ad==='set'&&o.vol!=null&&i===0?o.vol:(o.used!=null&&i===0?o.used:0)):t[i]==='renk'?(o.color||v):v);}
      await tween(ms,k2=>{const a=yeni.map((v,i)=>t[i]==='sayi'?eski[i]+(v-eski[i])*k2:t[i]==='renk'&&v?karis(eski[i]||v,v,k2):v);try{o[I.ad](...a);}catch(e){}});}
    else cagir(o,I.ad,A);M.__son[key]=yeni;if(ms>0&&!(y&&y[3]))await sleep(ms);return;}
  if(I.tip==='sahne'){const f=S[I.ad];if(typeof f!=='function')return;const n=Math.max(1,+I.tekrar||1);for(let i=0;i<n;i++){f(...coz(A,M));if(i<n-1||ms)await sleep(i<n-1?(+I.aralik||400):ms);}return;}
  if(I.tip==='olustur'){const r=kitKur(S,0,0,{f:I.ad,args:A,gorunur:I.gorunur},M);if(r){r.__k=katOf({tur:'kit',o:{f:I.ad}});M[I.id]=r;}return;}
  const G=GEN[I.tip];const t=G?G.arg.map(a=>a[1]):[];const a=A.map((v,i)=>arg(v,t[i]));
  switch(I.tip){
   case 'bekle':return sleep((+a[0]||0)*1000);
   case 'dok':{const K1=al(A[0]),K2=al(A[1]);if(!K2||!K2.set)return;const v=+a[2]||0,yr=a[3];const c0=K2.color,ak=K1&&nok(K1),hk=nok(K2,[K2.__x,K2.__y-100]);let st=null;
     if(ak){st=S.stream(hk[0],ak[1]);}const k1v=K1&&K1.vol!=null?K1.vol:null,k2v=K2.vol||0;const sure=ms||1500;
     await tween(sure,k=>{if(K1&&K1.set&&k1v!=null)K1.set(Math.max(0,k1v-v*k));K2.set(k2v+v*k,yr?karis(c0,yr,k):undefined);if(st)st.set(k<.95?(hk[1]-ak[1]):0,K1&&K1.color);});if(st)st.set(0);return;}
   case 'damlat':{const K1=al(A[0]),K2=al(A[1]);if(!K2)return;const n=Math.max(1,+a[2]||1),yr=a[3];const p=nok(K1,[K2.__x,K2.__y-200]);const yh=K2.level?K2.level(K2.vol||0):K2.__y-20;const c0=K2.color;
     if(K1&&K1.open)K1.open(1);for(let i=0;i<n;i++){S.drop(p[0],p[1],yh,K1&&K1.color||'rgba(80,140,225,.9)');await sleep(420);if(yr&&K2.set)K2.set(K2.vol,karis(c0,yr,(i+1)/n));}if(K1&&K1.open)K1.open(0);if(ms)await sleep(ms);return;}
   case 'parca':{const V=al(A[0]);if(!V||!V.g)return;V.__parca=S.pieces(V,+a[1]||4,renk(A[2])||'#9ca3af',A[3]||'parca');return ms?sleep(ms):0;}
   case 'erit':{const V=al(A[0]);if(!V||!V.__parca)return;const f=+a[1]||1;return tween(ms||1500,k=>V.__parca.shrink(f*k));}
   case 'kopuk':{const V=al(A[0]);if(!V)return;const p=nok(V,[V.__x,V.__y-120]);if(!V.__kopuk)V.__kopuk=S.foam(p[0],p[1],24,200,renk(A[2])||'rgba(255,255,255,.95)');const h=+a[1]||.8;return tween(ms||2000,k=>V.__kopuk.set(h*k));}
   case 'tasi':{const o=al(A[0]);if(!o||!o.g)return;const dx=+a[1]||0,dy=+a[2]||0;const t0=o.__t||[0,0];await tween(ms||800,k=>{o.g.setAttribute('transform',`translate(${t0[0]+dx*k} ${t0[1]+dy*k})`);});o.__t=[t0[0]+dx,t0[1]+dy];
     ['mouth','tip','uc','bag'].forEach(n=>{if(Array.isArray(o[n]))o[n]=[o[n][0]+dx,o[n][1]+dy];});o.__x+=dx;o.__y+=dy;return;}
   case 'buhar':case 'duman':{const o=al(A[0]);const key='__'+I.tip;const p=nok(o,o?[o.__x,o.__y-120]:[400,300]);if(o&&o[key])o[key].hiz(+a[1]||0);else{const e=S.A[I.tip](p[0],p[1]-6,{hiz:+a[1]||0});if(o)o[key]=e;}return ms?sleep(ms):0;}
   case 'alev':{const o=al(A[0]);const p=o?(o.alev||[o.__x,o.__y-60]):[400,300];if(o&&o.__alev)o.__alev.on(a[1]);else{const e=S.A.alev(p[0],p[1]);e.on(a[1]);if(o)o.__alev=e;}return ms?sleep(ms):0;}
   case 'parlama':{const o=al(A[0]);const p=nok(o,o?[o.__x,o.__y-60]:[400,300]);S.A.parlama(p[0],p[1]).flas(ms||500);return sleep(ms||500);}
   case 'kristal':{const o=al(A[0]);const p=o?(o.bag?[o.bag[0],o.__y-40]:[o.__x,o.__y-20]):[400,400];if(!o||!o.__kristal){const e=S.A.kristal(p[0],p[1],{renk:A[2]||'#e2e8f0'});if(o)o.__kristal=e;else return tween(ms||2000,k=>e.buyu(k*(+a[1]||1)));}return tween(ms||2000,k=>o.__kristal.buyu(k*(+a[1]||1)));}
   case 'yazi':{S.A.yazi(+a[1]||400,+a[2]||120,A[0]||'');return ms?sleep(ms):0;}
   case 'ok':{S.A.ok(+a[0],+a[1],+a[2],+a[3]);return ms?sleep(ms):0;}
  }}
async function adim(M,A){const L=A.islemler||[];let grup=[];
  for(const I of L){if(I.birlikte&&grup.length){grup.push(islem(M,I));continue;}if(grup.length)await Promise.all(grup);grup=[islem(M,I)];}
  if(grup.length)await Promise.all(grup);}
async function oynat(M,D,cb={}){const L=D.adimlar||[];for(let i=cb.bas||0;i<L.length;i++){if(cb.adim)cb.adim(i,L[i]);await adim(M,L[i]);if(cb.sonra)await cb.sonra(i);}}

/* ---------- Dışa aktarılan lab sayfası ---------- */
function malzemeler(D){if(D.malzemeler&&D.malzemeler.length)return D.malzemeler;const s=[];(D.aletler||[]).forEach(a=>{const k=KAT[a.tur];if(!k||a.tur==='kablo')return;const n=k.ad+(a.o&&a.o.ad?` (${a.o.ad})`:'');if(!s.includes(n))s.push(n);});return s;}
function sayfa(D){
  return LK.page({ad:D.ad,baslik:D.baslik||'Deney',alt:D.alt||'',W:D.W||800,malzemeler:malzemeler(D),guvenlik:D.guvenlik,
    adimlar:(D.adimlar||[]).map(a=>[a.baslik||'Adım',a.aciklama||'']),olcumler:[],
    kur:async(P)=>{P.M=kur(P.S,D);},
    calistir:async(P)=>{P.stepUI(0);await oynat(P.M,D,{adim:i=>P.stepUI(i),sonra:()=>sleep(500)});P.done(D.sonuc||'Deney tamamlandı.');},
    rapor:P=>[['Deneyin Adı',D.baslik||''],['Deneyin Amacı',D.amac||''],['Tarih',new Date().toLocaleDateString('tr-TR')],['Malzemeler',malzemeler(D).join(', ')],
      ['Deneyin Yapılışı',(D.adimlar||[]).map((a,i)=>`${i+1}) ${a.baslik}: ${a.aciklama||''}`).join('<br>')],['Sonuç',D.sonuc||'']],
    sorular:(D.sorular&&D.sorular.length)?D.sorular:undefined});}
window.DO={katOf,KITMAP,KAT,K,GEN,GENEL,RENK,RENK_AD,renk,kur,adim,oynat,islem,sayfa,malzemeler,nok};
})();
