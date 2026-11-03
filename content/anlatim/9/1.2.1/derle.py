# 9. sınıf 1.2.1 Atom Teorileri ve Atomun Yapısı — kısa / orta / uzun anlatım.
# Metinler özgün yazılmıştır; MEB 9. sınıf kitabı ve öğretmen notları yalnızca kapsam için başvuru olarak kullanıldı.
import json, sys
from _figurler import *

def model_kart(svg, ad, yil, var, yok):
    return f'''<div class="ka-model">
<div class="ka-model-sekil">{svg}</div>
<div><h4>{ad} <span>{yil}</span></h4>
<ul class="ka-arti">{''.join(f'<li>{x}</li>' for x in var)}</ul>
<ul class="ka-eksi">{''.join(f'<li>{x}</li>' for x in yok)}</ul></div></div>'''

MODELLER = [
    (DALTON, 'Dalton', '1803',
     ['Madde, bölünemeyen çok küçük taneciklerden (atomlardan) oluşur.',
      'Atomlar içi dolu, yüksüz kürelerdir.',
      'Bir elementin bütün atomları aynıdır; farklı elementlerin atomları farklıdır.',
      'Kimyasal tepkimelerde atomlar yok olmaz, yoktan var olmaz; yalnızca yeniden düzenlenir.'],
     ['Atomun içinde daha küçük tanecikler (e, p, n) vardır.',
      'Aynı elementin kütlesi farklı atomları (izotoplar) vardır.',
      'Atom içi dolu değildir, büyük kısmı boşluktur.']),
    (THOMSON, 'Thomson', '1897',
     ['Katot ışını deneyleriyle negatif yüklü elektronu buldu.',
      'Atom, pozitif yüklü bir küredir; elektronlar bu kürenin içine dağılmıştır (üzümlü kek).',
      'Pozitif ve negatif yük sayıları eşittir; atom nötrdür.'],
     ['Çekirdekten söz etmez.',
      'Atomun boşluklu yapısını açıklayamaz (Rutherford deneyi).']),
    (RUTHERFORD, 'Rutherford', '1911',
     ['Pozitif yükün ve kütlenin neredeyse tamamı çok küçük bir çekirdekte toplanmıştır.',
      'Atomun hacminin çok büyük kısmı boşluktur; elektronlar çekirdeğin çevresindedir.',
      'Çekirdekte protonlardan başka yüksüz tanecikler olmalıdır (öngördü).'],
     ['Elektronların çekirdek çevresindeki hareketini açıklayamaz.',
      'Atomların belirli renkte ışık yaymasını (spektrum) açıklayamaz.',
      'Nötronun varlığını kanıtlayamamıştır (1932, Chadwick).']),
    (BOHR, 'Bohr', '1913',
     ['Elektronlar çekirdekten belirli uzaklıktaki dairesel yörüngelerde (enerji katmanlarında) bulunur: n = 1, 2, 3… ya da K, L, M…',
      'Çekirdekten uzaklaştıkça katmanın enerjisi artar.',
      'Elektron enerji alınca üst katmana çıkar (absorbsiyon), geri dönerken aradaki farkı ışık olarak yayar (emisyon).'],
     ['Yalnızca tek elektronlu tanecikleri (H, He⁺, Li²⁺) açıklayabilir.',
      'Elektronun yerini kesin bir çizgi gibi gösterir; belirsizlik ilkesiyle çelişir.']),
    (MODERN, 'Modern atom teorisi', '1926',
     ['Elektronun yeri ve hızı aynı anda kesin olarak bilinemez (Heisenberg).',
      'Elektronun bulunma olasılığının yüksek olduğu bölgelere orbital denir.',
      'Elektron hem parçacık hem dalga özelliği gösterir.'],
     ['Bugün kabul edilen modeldir; yeni kanıtlarla gelişmeye açıktır.']),
]

TANECIK_TABLO = '''<table class="ka-tablo"><thead><tr><th>Tanecik</th><th>Sembol</th><th>Bağıl yük</th><th>Yeri</th><th>Bağıl kütle</th></tr></thead><tbody>
<tr><td><span class="ka-nokta p"></span>Proton</td><td>p⁺</td><td>+1</td><td>Çekirdek</td><td>≈ 1</td></tr>
<tr><td><span class="ka-nokta n"></span>Nötron</td><td>n⁰</td><td>0</td><td>Çekirdek</td><td>≈ 1</td></tr>
<tr><td><span class="ka-nokta e"></span>Elektron</td><td>e⁻</td><td>−1</td><td>Çekirdeğin çevresi</td><td>≈ 1/1836</td></tr>
</tbody></table>'''

TANECIK_TABLO_UZUN = '''<table class="ka-tablo"><thead><tr><th>Tanecik</th><th>Kütle (g)</th><th>Yük (C)</th><th>Keşfeden</th></tr></thead><tbody>
<tr><td>Elektron</td><td>9,11 × 10⁻²⁸</td><td>−1,60 × 10⁻¹⁹</td><td>J. J. Thomson, 1897</td></tr>
<tr><td>Proton</td><td>1,673 × 10⁻²⁴</td><td>+1,60 × 10⁻¹⁹</td><td>E. Goldstein (1886) / E. Rutherford (1919)</td></tr>
<tr><td>Nötron</td><td>1,675 × 10⁻²⁴</td><td>0</td><td>J. Chadwick, 1932</td></tr>
</tbody></table>'''

FORMUL = '''<div class="ka-formul">
<div><b>Atom numarası</b><span>Z = p</span></div>
<div><b>Kütle numarası</b><span>A = p + n</span></div>
<div><b>Nötr atomda</b><span>e = p</span></div>
<div><b>İyonda</b><span>yük = p − e</span></div>
</div>'''

def ornek(soru, cozum, baslik='Çözümlü örnek'):
    return f'<details class="ka-ornek"><summary><b>{baslik}</b> {soru}</summary><div>{cozum}</div></details>'

def soru(metin, cevap):
    return f'<details class="ka-soru"><summary>{metin}</summary><div>{cevap}</div></details>'

DIKKAT = lambda t: f'<div class="ka-dikkat"><b>Dikkat</b>{t}</div>'
TANIM = lambda b, t: f'<div class="ka-tanim"><b>{b}</b>{t}</div>'
UNUTMA = lambda items: '<div class="ka-unutma"><b>Unutma</b><ul>' + ''.join(f'<li>{i}</li>' for i in items) + '</ul></div>'

# ---------- KISA ----------
kisa = f'''
<p class="ka-giris">Atomu kimse doğrudan göremez. Bu yüzden bilim insanları deney sonuçlarını açıklayan <b>modeller</b> kurdu. Yeni bir deney eski modelin açıklayamadığı bir sonuç verince model değişti. Bu, bilimsel bilginin <b>kanıta dayalı ve değişebilir</b> olduğunu gösterir.</p>
{ZAMAN_SERIDI}
<h3>Atomun yapısı</h3>
{TANECIK_TABLO}
{GOSTERIM}
{FORMUL}
{UNUTMA(['Elektronu Thomson buldu; çekirdeği Rutherford keşfetti; enerji katmanlarını Bohr önerdi.',
         'Atomun kütlesinin neredeyse tamamı çekirdektedir; hacminin neredeyse tamamı boşluktur.',
         'Proton sayısı aynı, nötron sayısı farklı atomlara <b>izotop</b> denir (¹²C ve ¹⁴C).'])}
'''

# ---------- ORTA ----------
modeller_html = ''.join(model_kart(*m) for m in MODELLER)
orta = f'''
<p class="ka-giris">Bu konuda atomun nasıl "keşfedildiğini" adım adım izleyeceğiz. Her model, kendinden önceki modelin açıklayamadığı bir deney sonucunu açıklamak için ortaya çıktı.</p>
{TANIM('Teori', 'Bir olayı gözlem ve deneylere dayanarak açıklayan kapsamlı ve sistemli düşünce.')}
{TANIM('Model', 'Doğrudan göremediğimiz bir yapıyı anlamamızı kolaylaştıran çizim, maket ya da benzetme. Atom modelleri, atom teorilerinin "resmi"dir.')}
{ZAMAN_SERIDI}
<h3>Modeller: ne söylediler, neyi açıklayamadılar?</h3>
<div class="ka-modeller">{modeller_html}</div>
<h3>Rutherford deneyi: Atomun içi boş!</h3>
{RUTHERFORD_DENEY}
<table class="ka-tablo"><thead><tr><th>Gözlem</th><th>Sonuç</th></tr></thead><tbody>
<tr><td>Alfa parçacıklarının çoğu levhadan sapmadan geçti.</td><td>Atomun büyük kısmı boşluktur.</td></tr>
<tr><td>Bir kısmı sapma gösterdi.</td><td>Atomda pozitif yüklü bir bölge vardır (alfa da pozitiftir, itilir).</td></tr>
<tr><td>Çok azı geri döndü.</td><td>Bu bölge çok küçük ve kütlesi büyüktür: <b>çekirdek</b>.</td></tr>
</tbody></table>
<h3>Bohr: enerji katmanları</h3>
{BOHR_ENERJI}
{DIKKAT('Uyarılmış atom kararsızdır. Elektron temel hâle dönerken aldığı enerjiyi ışık ya da ısı olarak geri verir. Yayılan ışığın enerjisi iki katman arasındaki enerji farkına eşittir.')}
<h3>Atomun yapısı</h3>
{TANECIK_TABLO}
{GOSTERIM}
{FORMUL}
{IZOTOP}
{ornek('Rutherford deneyinde alfa parçacıklarının çok azı geri döndü. Bu gözlem atom hakkında ne söyler?',
       'Geri dönen parçacıklar pozitif yüklü ve kütlesi büyük bir yapıya çarpmıştır. Bu çarpışma çok seyrek olduğuna göre o yapı çok küçüktür. <b>Sonuç:</b> Atomun pozitif yükü ve kütlesinin neredeyse tamamı küçük bir çekirdekte toplanmıştır.')}
{ornek('<sup>27</sup><sub>13</sub>Al atomunda kaç proton, nötron ve elektron vardır? Al³⁺ iyonunda elektron sayısı kaçtır?',
       'p = Z = 13 · n = A − Z = 27 − 13 = 14 · nötr atomda e = 13. Al³⁺ iyonu 3 elektron vermiştir: e = 13 − 3 = <b>10</b>.')}
<h3>Kendini dene</h3>
{soru('Dalton modelinin günümüzde hâlâ geçerli olan bir varsayımı hangisidir?', 'Kimyasal tepkimelerde atomlar yok olmaz, yoktan var olmaz; yalnızca yeniden düzenlenir. (Farklı elementlerin atomlarının farklı olması da geçerlidir.)')}
{soru('Elektronun varlığını ilk kanıtlayan bilim insanı kimdir?', 'J. J. Thomson (katot ışını deneyleri, 1897).')}
{soru('<sup>35</sup>Cl ve <sup>37</sup>Cl atomları için hangisi aynıdır: proton sayısı mı, nötron sayısı mı?', 'Proton sayısı aynıdır (17). Nötron sayıları farklıdır (18 ve 20); bu atomlar izotoptur.')}
{UNUTMA(['Her yeni model, eskisinin açıklayamadığı bir deney sonucunu açıkladı: bilimsel bilgi değişebilir.',
         'Z = p, A = p + n, nötr atomda e = p.',
         'Absorbsiyon: enerji alıp üst katmana çıkma. Emisyon: alt katmana inip ışık yayma.'])}
'''

# ---------- UZUN ----------
karsilastirma = '''<table class="ka-tablo ka-kar"><thead><tr><th>Özellik</th><th>Dalton</th><th>Thomson</th><th>Rutherford</th><th>Bohr</th><th>Modern</th></tr></thead><tbody>
''' + ''.join('<tr><td>' + ad + '</td>' + ''.join(f'<td class="{"ev" if c=="+" else "hy"}">{"✓" if c=="+" else "✗"}</td>' for c in s) + '</tr>' for ad, s in [
    ('Atom bölünebilir (atom altı tanecik)', '-++++'),
    ('Elektron', '-++++'),
    ('Çekirdek', '--+++'),
    ('Atomun büyük kısmı boşluk', '--+++'),
    ('Enerji katmanları', '---++'),
    ('Orbital (elektron bulutu)', '----+'),
]) + '</tbody></table>'

alev = '''<table class="ka-tablo"><thead><tr><th>Element</th><th>Alev rengi</th></tr></thead><tbody>
<tr><td>Lityum (Li)</td><td><span class="ka-renk" style="background:#d7263d"></span>Kırmızı</td></tr>
<tr><td>Sodyum (Na)</td><td><span class="ka-renk" style="background:#ffb400"></span>Sarı</td></tr>
<tr><td>Potasyum (K)</td><td><span class="ka-renk" style="background:#a06cd5"></span>Mor (lila)</td></tr>
<tr><td>Bakır (Cu)</td><td><span class="ka-renk" style="background:#2bb673"></span>Yeşil</td></tr>
</tbody></table>'''

kesif = '''<ol class="ka-kesif">
<li><b>MÖ 400 · Demokritos</b> Maddenin "bölünemez" (atomos) taneciklerden oluştuğunu düşündü. Deneye değil düşünceye dayandığı için felsefidir.</li>
<li><b>1803 · Dalton</b> İlk bilimsel atom teorisi: kütlenin korunumu ve sabit oranlar kanununu açıkladı.</li>
<li><b>1897 · Thomson</b> Katot ışınlarıyla elektronu buldu.</li>
<li><b>1886–1919 · Goldstein, Rutherford</b> Pozitif ışınlar ve proton.</li>
<li><b>1911 · Rutherford</b> Altın levha deneyi: çekirdek.</li>
<li><b>1913 · Bohr</b> Hidrojen spektrumunu enerji katmanlarıyla açıkladı.</li>
<li><b>1926 · Schrödinger, Heisenberg</b> Modern (kuantum) atom teorisi: orbital.</li>
<li><b>1932 · Chadwick</b> Nötronu kanıtladı.</li>
</ol>'''

uzun = f'''
<p class="ka-giris">Bugün atom hakkında bildiklerimiz yaklaşık 2400 yıllık bir merakın ve 130 yıllık yoğun deneysel çalışmanın ürünü. Bu konuda hem atom modellerinin nasıl değiştiğini hem de atomun yapısını ayrıntılı inceleyeceğiz. Asıl hedefimiz şu soruya cevap verebilmek: <b>"Bilimsel bilgi neden değişir?"</b></p>
{TANIM('Teori', 'Bir olay ya da olgu hakkında gözlem ve deneylere dayanan, olayları açıklayan ve öngörüde bulunmaya yarayan kapsamlı açıklama.')}
{TANIM('Model', 'Teoriyi temsil eden sembol, çizim, maket ya da matematiksel ifade. Gerçeğin kendisi değil, onu anlamamıza yardım eden bir araçtır; bu yüzden her modelin sınırları vardır.')}
<h3>Keşif zaman çizelgesi</h3>
{kesif}
{ZAMAN_SERIDI}
<h3>Modeller ayrıntılı</h3>
<div class="ka-modeller">{modeller_html}</div>
<h3>Hangi model neyi içeriyor?</h3>
{karsilastirma}
<h3>Rutherford deneyi</h3>
<p>Rutherford, radyoaktif bir kaynaktan çıkan pozitif yüklü alfa (α) parçacıklarını çok ince bir altın levhaya gönderdi. Levhanın arkasındaki çinko sülfür (ZnS) kaplı ekran, çarpan her parçacıkta küçük bir ışık çakması yaptı. Thomson modeli doğru olsaydı parçacıkların hepsi neredeyse hiç sapmadan geçmeliydi.</p>
{RUTHERFORD_DENEY}
<table class="ka-tablo"><thead><tr><th>Gözlem</th><th>Sonuç</th></tr></thead><tbody>
<tr><td>Parçacıkların çoğu sapmadan geçti.</td><td>Atomun büyük kısmı boşluktur.</td></tr>
<tr><td>Bir kısmı sapma gösterdi.</td><td>Atomda pozitif yüklü bir bölge vardır.</td></tr>
<tr><td>Çok azı geri döndü.</td><td>Bu bölge çok küçük, kütlesi büyüktür: çekirdek.</td></tr>
</tbody></table>
{DIKKAT('Atomun çapı yaklaşık 10⁻⁸ cm, çekirdeğin çapı ise 10⁻¹² – 10⁻¹³ cm kadardır. Atomu bir futbol stadyumu kadar büyütseydik çekirdek, orta noktadaki bir bilye kadar kalırdı.')}
<h3>Işık, spektrum ve Bohr</h3>
<p>Elementler ısıtıldığında ya da elektrikle uyarıldığında kendilerine özgü renkte ışık yayar. Bu ışık bir prizmadan geçirildiğinde sürekli bir gökkuşağı değil, belirli renkte ayrı çizgiler görülür. Her elementin çizgileri farklıdır; bu yüzden spektrum, elementin "parmak izi" gibidir.</p>
{SPEKTRUM}
{alev}
<p>Bohr, hidrojenin çizgili spektrumunu şöyle açıkladı: Elektron yalnızca belirli enerji katmanlarında bulunabilir. Enerji alınca üst katmana çıkar, geri inerken iki katman arasındaki enerji farkı kadar ışık yayar. Fark belirli olduğu için yayılan ışığın rengi de belirlidir.</p>
{BOHR_ENERJI}
{TANIM('Temel hâl', 'Atomun en düşük enerjili, kararlı hâli.')}
{TANIM('Uyarılmış hâl', 'Elektronun enerji alıp üst katmana çıktığı, yüksek enerjili ve kararsız hâl.')}
<p class="ka-formul-tek">Yayılan ışığın enerjisi: <b>ΔE = E<sub>üst katman</sub> − E<sub>alt katman</sub></b></p>
<h3>Bohr'dan modern teoriye</h3>
{ORBITAL}
<p>Bohr modeli tek elektronlu taneciklerde başarılıydı ama çok elektronlu atomlarda yetersiz kaldı. Heisenberg'in belirsizlik ilkesine göre elektronun hem yeri hem hızı aynı anda kesin olarak ölçülemez; bu yüzden elektronu belirli bir çizgi üzerinde düşünmek doğru değildir. Modern atom teorisi elektronun nerede <i>bulunabileceğini</i> olasılıklarla anlatır ve bu bölgelere <b>orbital</b> der. Orbitalleri bir sonraki konuda (1.2.2) ayrıntılı göreceksin.</p>
<h3>Atomun yapısı</h3>
<p>Bugün 300'den fazla atom altı parçacık biliniyor ama kimyada üç temel tanecik yeterlidir: proton, nötron ve elektron. Proton ve nötronlar çekirdekte, elektronlar çekirdeğin çevresindedir.</p>
{TANECIK_TABLO}
{TANECIK_TABLO_UZUN}
{GOSTERIM}
{FORMUL}
{DIKKAT('Bir atomun hangi elemente ait olduğunu <b>yalnızca proton sayısı</b> belirler. Elektron sayısı değişirse iyon, nötron sayısı değişirse izotop oluşur; element değişmez.')}
<h3>İzotoplar ve iyonlar</h3>
{IZOTOP}
<table class="ka-tablo"><thead><tr><th>Tanecik</th><th>p</th><th>n</th><th>e</th><th>Yük</th></tr></thead><tbody>
<tr><td><sup>23</sup><sub>11</sub>Na</td><td>11</td><td>12</td><td>11</td><td>0</td></tr>
<tr><td><sup>23</sup><sub>11</sub>Na⁺</td><td>11</td><td>12</td><td>10</td><td>+1</td></tr>
<tr><td><sup>35</sup><sub>17</sub>Cl⁻</td><td>17</td><td>18</td><td>18</td><td>−1</td></tr>
<tr><td><sup>16</sup><sub>8</sub>O²⁻</td><td>8</td><td>8</td><td>10</td><td>−2</td></tr>
</tbody></table>
<h3>Çözümlü örnekler</h3>
{ornek('Rutherford deneyinde alfa parçacıklarının büyük kısmının sapmadan geçmesi, Thomson modelinin hangi varsayımıyla çelişir?',
       'Thomson modeline göre atom, pozitif yükün her yere dağıldığı dolu bir küredir. Parçacıkların çoğunun hiçbir engele takılmadan geçmesi atomun büyük kısmının <b>boş</b> olduğunu gösterir; bu da "dolu küre" fikriyle çelişir.')}
{ornek('<sup>56</sup><sub>26</sub>Fe³⁺ iyonunda proton, nötron ve elektron sayılarını bulun.',
       'p = 26 · n = 56 − 26 = 30 · e = 26 − 3 = <b>23</b>.')}
{ornek('Bir elektron n = 1 katmanından n = 3 katmanına geçiyor. Bu olayın adı nedir, atom enerji alır mı verir mi?',
       'Elektron üst katmana çıkıyor: <b>absorbsiyon</b> (soğurma). Atom enerji <b>alır</b> ve uyarılmış hâle geçer. Geri dönerken aynı miktarda enerjiyi ışık olarak yayar (emisyon).')}
{ornek('X²⁻ iyonunun 18 elektronu ve 16 nötronu vardır. X atomunun kütle numarası kaçtır?',
       'İyon 2 elektron almış: p = 18 − 2 = 16. A = p + n = 16 + 16 = <b>32</b>. (Bu atom kükürttür.)')}
<h3>Bilimsel bilginin değişebilirliği</h3>
<div class="ka-tanim"><b>Çıkarım</b>Dalton'dan modern teoriye her model, kendi zamanındaki kanıtlarla en iyi açıklamaydı. Yeni deney ve araçlar (katot ışını tüpü, alfa parçacıkları, spektroskop) yeni kanıtlar getirdikçe modeller düzeltildi ya da değiştirildi. Bilimsel bilgi kesin ve değişmez değildir; <b>kanıta dayalıdır, sınanabilir ve gelişmeye açıktır.</b> Değişmesi bilimin zayıflığı değil, kendini düzelten bir yöntem olmasının sonucudur.</div>
<h3>Sık yapılan hatalar</h3>
<ul class="ka-hata">
<li><b>"Rutherford nötronu buldu."</b> Hayır; varlığını öngördü, nötronu 1932'de Chadwick kanıtladı.</li>
<li><b>"Bohr modelinde orbital vardır."</b> Hayır; Bohr'da yörünge (belirli çizgi), modern teoride orbital (olasılık bölgesi) vardır.</li>
<li><b>"Kütle numarası = proton sayısı."</b> Hayır; kütle numarası proton ve nötron sayılarının toplamıdır.</li>
<li><b>"İyon olunca proton sayısı değişir."</b> Hayır; iyonlaşmada yalnızca elektron sayısı değişir.</li>
</ul>
<h3>Kendini dene</h3>
{soru('Atomda pozitif yükün çok küçük bir bölgede toplandığını gösteren ilk model hangisidir?', 'Rutherford atom modeli.')}
{soru('Bohr modelinin açıklayamadığı tanecikler hangileridir? Bir örnek ver.', 'Çok elektronlu tanecikler; örneğin He atomu, O²⁻ iyonu.')}
{soru('<sup>40</sup><sub>20</sub>Ca²⁺ iyonunda kaç elektron vardır?', '20 − 2 = 18 elektron.')}
{soru('Spektrum neden elementler için ayırt edici bir özelliktir?', 'Her elementin enerji katmanları arasındaki farklar kendine özgüdür; bu yüzden yaydığı ışığın renkleri (çizgileri) de kendine özgüdür.')}
{UNUTMA(['Dalton → Thomson → Rutherford → Bohr → Modern: her biri öncekinin açıklayamadığını açıkladı.',
         'Z = p · A = p + n · nötr atomda e = p · iyonda yük = p − e.',
         'Absorbsiyon enerji alır (uyarılma), emisyon enerji verir (ışıma).',
         'Bilimsel bilgi kanıta dayalıdır ve yeni kanıtlarla değişebilir.'])}
'''

baslik = '<h2>1.2.1 Atom Teorileri ve Atomun Yapısı</h2>'
cikti = {'kisa': baslik + kisa, 'orta': baslik + orta, 'uzun': baslik + uzun}
json.dump(cikti, open(sys.argv[1], 'w'), ensure_ascii=False)
print({k: len(v) for k, v in cikti.items()})
