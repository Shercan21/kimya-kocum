from ortak import F, GOZLUK, ATIK, ISI, yaz

V = {}

V['1.1.1'] = [F(
    'Mutfaktaki ve Banyodaki Maddelerin pH Değerleri',
    'Günlük hayatta kullanılan bazı maddelerin asitlik ve bazlık durumlarını pH kâğıdıyla belirlemek ve suyla seyreltmenin etkisini gözlemlemek.',
    ['limon suyu', 'sirke', 'karbonat', 'sıvı sabun', 'diş macunu', 'gazlı içecek', 'pH kâğıdı', 'deney tüpleri ve tüplük', 'pens', 'saf su', 'etiket'],
    [GOZLUK, 'Maddeleri tatmayınız; temizlik ürünlerini birbirine karıştırmayınız.'],
    ['Tüpleri etiketleyip her birine az miktarda bir madde koyunuz; katıları birkaç damla saf suyla ıslatınız.', 'pH kâğıdını pensle tutup her tüpe dokundurunuz, renk skalasıyla karşılaştırarak pH değerini yazınız.', 'Her tüpe 5 mL saf su ekleyip karıştırınız ve pH değerini yeniden ölçünüz.'],
    [('Maddeleri asidik, nötr ve bazik olarak sınıflandırınız.', 'Limon suyu, sirke ve gazlı içecek asidik; sıvı sabun, karbonat ve diş macunu bazik çıkar.'),
     ('Su eklenince asidik ve bazik maddelerin pH değerleri nasıl değişti?', 'Asidik maddelerin pH değeri yükselir, bazik maddelerinki düşer; her ikisi de 7\'ye yaklaşır.'),
     ('Çaydanlıktaki kireci (kalsiyum karbonat) temizlemek için hangi maddeler kullanılabilir? Neden?', 'Limon tuzu ya da sirke gibi asidik maddeler; asitler karbonatla tepkimeye girerek kireci çözer.')],
    tablo=(['Madde', 'pH', 'Su eklendikten sonra pH', 'Asidik / Nötr / Bazik'], [['Limon suyu', '', '', ''], ['Sirke', '', '', ''], ['Gazlı içecek', '', '', ''], ['Karbonat', '', '', ''], ['Sıvı sabun', '', '', ''], ['Diş macunu', '', '', '']]),
    sure='30 dk')]

V['1.1.2'] = [F(
    'Bir Kimya Mühendisi Gibi Düşün: Folyonun Parlak Yüzü',
    'Alüminyum folyonun parlak ve mat yüzlerinin ısı korumasına etkisini kontrollü bir deneyle karşılaştırmak; kimyacıların günlük sorunlara bilimsel yöntemle nasıl yaklaştığını deneyimlemek.',
    ['alüminyum folyo', 'iki özdeş beher ya da kupa', 'sıcak su (≈ 70 °C)', 'iki termometre', 'kronometre', 'dereceli silindir'],
    [ISI],
    ['İki behere eşit miktarda (150 mL) aynı sıcaklıkta su koyunuz.', 'Birinci beheri folyonun parlak yüzü içe, ikincisini mat yüzü içe gelecek şekilde sarınız; ağızlarını da aynı şekilde kapatınız.', 'Termometreleri folyodaki küçük deliklerden suya daldırınız ve 3 dakikada bir sıcaklıkları kaydediniz (15 dakika).'],
    [('Hangi düzenekte su daha yavaş soğudu? Fark anlamlı mı?', 'Parlak yüzün içe baktığı düzenekte ısı ışıması daha çok geri yansır; fark genellikle küçüktür. Ölçümler tekrarlanarak karar verilmelidir.'),
     ('Bu deneyde hangi değişkenleri sabit tuttunuz? Neden önemlidir?', 'Su miktarı, başlangıç sıcaklığı, kap türü ve ortam; yalnızca folyo yüzünün etkisini görebilmek için.'),
     ('Bir gıda mühendisi ya da kimya mühendisi bu tür bir soruyu neden araştırır?', 'Ambalaj tasarımında enerji tasarrufu, gıdanın sıcaklığının korunması ve maliyet açısından en iyi çözümü bulmak için.')],
    tablo=(['Zaman (dk)', '0', '3', '6', '9', '12', '15'], [['Parlak yüz içte (°C)', '', '', '', '', '', ''], ['Mat yüz içte (°C)', '', '', '', '', '', '']]),
    sure='30 dk')]

V['1.1.4'] = [F(
    'Yangın Üçgeni ve Güvenli Söndürme',
    'Yanma için gerekli üç unsuru (yakıt, oksijen, ısı) gözlemlemek ve güvenlik işaretlerinin anlamlarını kavramak.',
    ['üç tealight mum', 'cam kavanoz', 'kum', 'metal tepsi', 'kibrit', 'güvenlik işaretleri kartları (yanıcı, aşındırıcı, zehirli, tahriş edici, çevreye zararlı)'],
    [GOZLUK, 'Deneyi metal tepsi üzerinde ve öğretmen gözetiminde yapınız; masada yangın battaniyesi bulunsun.', 'Saçınızı toplayınız, bol giysilerle çalışmayınız.'],
    ['Mumları tepsiye yerleştirip yakınız.', 'Birinci mumun üzerine kavanozu kapatıp sönme süresini ölçünüz.', 'İkinci mumun üzerine kum dökerek söndürünüz.', 'Üçüncü mumun fitilini mum söndürücü ya da ıslak bir kürdanla bastırarak söndürünüz.', 'Güvenlik işaretleri kartlarını laboratuvardaki şişelerin etiketleriyle eşleştiriniz.'],
    [('Her söndürme yönteminde yangın üçgeninin hangi unsuru ortadan kaldırıldı?', 'Kavanoz ve kum oksijeni keser; fitili bastırmak yakıtın buharlaşıp alevlenmesini ve ısıyı keser.'),
     ('Yanan yağ tavası neden suyla söndürülmez?', 'Su, kızgın yağın altında aniden buharlaşır ve yanan yağı etrafa sıçratır; kapak kapatılarak oksijen kesilmelidir.'),
     ('"Aşındırıcı" işareti olan bir maddeyle çalışırken hangi önlemleri alırsınız?', 'Koruyucu gözlük, eldiven ve önlük kullanır, maddeyi az miktarda ve dikkatle aktarır, dökülürse öğretmene haber veririm.')],
    sure='25 dk')]

V['1.2.1'] = [F(
    'Kara Kutu: Görmeden Şekil Bulmak',
    'Görünmeyen bir cismin şeklini, üzerine gönderilen bilyelerin sapmalarından tahmin ederek Rutherford\'un altın levha deneyinin mantığını modellemek.',
    ['karton kutu kapağı ya da büyük karton', 'kartonun altına yapıştırılacak gizli bir şekil (üçgen, daire, kare kesilmiş karton)', 'misket', 'kâğıt ve kalem'],
    [],
    ['Bir grup, şekli kartonun altına gizlice yapıştırsın; kartonu masaya koysun.', 'Diğer grup, misketleri kartonun dört kenarından altına doğru yuvarlasın.', 'Misketin giriş ve çıkış yönlerini kâğıda oklarla çiziniz.', 'Yeterli atış yaptıktan sonra gizli şeklin biçimini ve büyüklüğünü tahmin edip çiziniz; kartonu kaldırarak kontrol ediniz.'],
    [('Misketlerin çoğu sapmadan geçtiyse gizli şekil hakkında ne söylenebilir?', 'Şekil kartonun altındaki alana göre küçüktür; alanın büyük kısmı boştur.'),
     ('Rutherford\'un deneyinde alfa taneciklerinin çok azının geri dönmesi neyi gösterdi?', 'Atomun pozitif yükünün ve kütlesinin çok küçük, yoğun bir çekirdekte toplandığını; atomun büyük bölümünün boşluk olduğunu.'),
     ('Bu model hangi yönüyle gerçek deneyden farklıdır?', 'Misketler şekle çarparak sapar; alfa tanecikleri ise çekirdeğe çarpmadan, pozitif yükler arasındaki itme nedeniyle sapar.')],
    sure='30 dk')]

V['1.2.2'] = [F(
    'Alev Testi: Metallerin Renk İmzası',
    'Bazı metal tuzlarının aleve verdiği renkleri gözlemleyerek elektronların enerji düzeyleri arasındaki geçişlerle ilişkilendirmek.',
    ['lityum klorür, sodyum klorür, potasyum klorür, bakır(II) klorür, kalsiyum klorür (az miktarda)', 'tahta çubuklar (suda bekletilmiş) ya da tel öze', 'bunzen beki', 'saat camları', 'saf su'],
    [GOZLUK, 'Deneyi öğretmeniniz yapsın; siz güvenli uzaklıktan gözleyiniz.', ISI, 'Bakır klorür zararlıdır; elle dokunmayınız.'],
    ['Öğretmeniniz her tuzdan bir miktarı ayrı saat camlarına koysun.', 'Islatılmış tahta çubuğun ucunu tuza batırıp bunzen bekinin alevine tutsun.', 'Alevin rengini tabloya kaydediniz; her tuz için yeni çubuk kullanılsın.'],
    [('Metal tuzları neden aleve farklı renkler verir?', 'Isı enerjisiyle uyarılan elektronlar üst enerji düzeylerine çıkar, geri dönerken belirli enerjide (renkte) ışık yayar; her elementin enerji düzeyleri farklıdır.'),
     ('Havai fişeklerdeki renkler bu deneyle nasıl ilişkilidir?', 'Havai fişeklerde farklı metal tuzları kullanılır; örneğin stronsiyum kırmızı, bakır yeşil-mavi, sodyum sarı renk verir.'),
     ('Bu gözlem Bohr atom modelini nasıl destekler?', 'Elektronların yalnızca belirli enerji düzeylerinde bulunabildiğini ve düzeyler arası geçişte belirli enerjide ışık yayıldığını gösterir.')],
    tablo=(['Tuz', 'Metal iyonu', 'Alev rengi'], [['LiCl', 'Li⁺', ''], ['NaCl', 'Na⁺', ''], ['KCl', 'K⁺', ''], ['CaCl₂', 'Ca²⁺', ''], ['CuCl₂', 'Cu²⁺', '']]),
    sure='20 dk')]

V['1.2.3-A'] = [F(
    'Element Kartlarıyla Kendi Periyodik Tablonu Kur',
    'Elementleri özelliklerine göre gruplandırarak periyodik tablonun düzenini keşfetmek ve elektron diziliminden yer bulmak.',
    ['ilk 20 element için kart (atom numarası, kütle, fiziksel hâl, metal/ametal, değerlik elektron sayısı yazılı)', 'büyük kâğıt', 'yapıştırıcı'],
    [],
    ['Kartları atom numarasına göre sıralayınız.', 'Benzer özellik gösteren (aynı değerlik elektron sayısına sahip) elementleri alt alta gelecek şekilde yerleştiriniz.', 'Oluşturduğunuz tabloyu gerçek periyodik tabloyla karşılaştırınız.', 'Her elementin elektron diziliminden periyodunu ve grubunu bulup kartına yazınız.'],
    [('Alt alta yerleştirdiğiniz elementlerin ortak özelliği nedir?', 'Değerlik elektron sayıları aynıdır; bu yüzden kimyasal özellikleri benzerdir.'),
     ('Elektron diziliminden periyot ve grup nasıl bulunur?', 'En yüksek katman numarası periyodu; s ve p orbitallerindeki değerlik elektron sayısı A grubu numarasını verir.'),
     ('Ca (Z = 20) elementinin yerini dizilimden bulunuz.', '1s² 2s² 2p⁶ 3s² 3p⁶ 4s²: 4. periyot, 2A grubu.')],
    sure='35 dk')]

V['1.2.3-B'] = [F(
    'Magnezyum Yanınca Ne Olur?',
    'Magnezyumun yanmasıyla oluşan maddeyi incelemek ve metal atomlarının elektron vererek iyon oluşturmasını açıklamak.',
    ['magnezyum şerit (2 cm)', 'maşa', 'ispirto lambası', 'saat camı', 'saf su', 'fenolftalein ya da kırmızı lahana suyu', 'deney tüpü'],
    [GOZLUK, 'Magnezyumun yanarken çıkardığı parlak ışığa doğrudan bakmayınız.', ISI],
    ['Öğretmeniniz magnezyum şeridi maşayla tutarak alevde yaksın; oluşan beyaz tozu saat camında toplasın.', 'Beyaz tozu deney tüpünde az miktarda suyla karıştırınız.', 'Karışıma birkaç damla fenolftalein ya da lahana suyu ekleyip rengi gözleyiniz.'],
    [('Magnezyum yanınca hangi madde oluştu? Denklemini yazınız.', 'Magnezyum oksit: 2Mg + O₂ → 2MgO.'),
     ('Magnezyum ve oksijen atomlarının iyonlara dönüşümünü elektron dizilimleriyle gösteriniz.', 'Mg (2-8-2) iki elektron vererek Mg²⁺ (2-8), O (2-6) iki elektron alarak O²⁻ (2-8) olur; ikisi de neon düzenine ulaşır.'),
     ('Oksidin suyla oluşturduğu çözelti neden indikatörün rengini değiştirdi?', 'MgO suyla magnezyum hidroksit oluşturur; çözelti baziktir.')],
    sure='20 dk')]

V['1.2.4-A'] = [F(
    'Atom ve İyon Büyüklüğünü Modelleme',
    'Balon ya da hamur modelleriyle bir periyotta ve grupta atom yarıçapının değişimini ve iyonlaşmanın boyuta etkisini göstermek.',
    ['farklı büyüklükte balonlar ya da oyun hamuru', 'cetvel', 'atom yarıçapları tablosu (Li, Na, K, Mg, Al, Cl ve iyonları)'],
    [],
    ['Tablodaki yarıçap değerlerini uygun bir ölçekle (örneğin 10 pm = 1 cm) modele çeviriniz.', '1A grubundaki Li, Na ve K atomlarını; 3. periyottaki Na, Mg, Al, Cl atomlarını modelleyiniz.', 'Na ile Na⁺ ve Cl ile Cl⁻ modellerini yan yana koyarak karşılaştırınız.'],
    [('Bir grupta yukarıdan aşağıya atom yarıçapı neden artar?', 'Katman sayısı artar; değerlik elektronları çekirdekten daha uzaktadır.'),
     ('Bir periyotta soldan sağa atom yarıçapı neden azalır?', 'Katman sayısı aynı kalırken proton sayısı artar; çekirdeğin elektronlara uyguladığı çekim artar.'),
     ('Na⁺ iyonu Na atomundan, Cl⁻ iyonu Cl atomundan neden farklı büyüklüktedir?', 'Na⁺ bir katmanını kaybeder ve küçülür; Cl⁻ bir elektron kazanınca elektronlar arası itme artar ve büyür.')],
    sure='25 dk')]

V['1.2.4-B'] = [F(
    'Veriden Örüntüye: İyonlaşma Enerjisi Grafiği',
    'Gerçek iyonlaşma enerjisi verilerini grafiğe dökerek periyodik eğilimleri ve ardışık iyonlaşma enerjilerindeki sıçramaları yorumlamak.',
    ['Z = 1–20 elementlerinin birinci iyonlaşma enerjileri tablosu', 'Na, Mg, Al için ardışık iyonlaşma enerjileri tablosu', 'milimetrik kâğıt ya da çizelge programı', 'renkli kalemler'],
    [],
    ['Birinci iyonlaşma enerjisini atom numarasına karşı grafiğe geçiriniz.', 'Soy gazları bir renkle, alkali metalleri başka bir renkle işaretleyiniz.', 'Na, Mg ve Al için ardışık iyonlaşma enerjilerini sütun grafiği olarak çiziniz.'],
    [('Grafikte tepe ve çukur noktalarda hangi elementler bulunuyor? Neden?', 'Tepelerde soy gazlar (kararlı dolu katman), çukurlarda alkali metaller (tek değerlik elektronu kolay verilir) bulunur.'),
     ('Mg\'nin ardışık iyonlaşma enerjilerinde büyük sıçrama hangi elektronda oluyor? Bu neyi gösterir?', 'Üçüncü elektronda; Mg\'nin iki değerlik elektronu vardır, 2A grubundadır.'),
     ('Bir periyotta Be–B ve N–O arasındaki küçük düşüşleri nasıl açıklarsınız?', 'B\'de elektron daha yüksek enerjili 2p orbitalinden; O\'da ise eşleşmiş elektronlar arası itme nedeniyle daha kolay koparılır.')],
    sure='35 dk')]

V['1.2.4-C'] = [F(
    'Elektronegatiflik Farkıyla Bağ Tahmini',
    'Elektronegatiflik değerlerini kullanarak madde çiftlerinde oluşacak bağ türünü tahmin etmek ve basit iletkenlik testiyle kontrol etmek.',
    ['elektronegatiflik tablosu', 'sofra tuzu, şeker, su', 'iletkenlik test düzeneği', 'beherler'],
    [GOZLUK],
    ['NaCl, C₁₂H₂₂O₁₁ (şeker içindeki C–O, C–H bağları), H₂O, Cl₂, HCl için elektronegatiflik farklarını hesaplayınız.', 'Bağ türlerini tahmin edip tabloya yazınız.', 'Tuz ve şekeri ayrı ayrı suda çözüp iletkenliklerini test ediniz.'],
    [('Hangi bileşiklerde elektronegatiflik farkı büyüktür ve bu ne tür bağa işaret eder?', 'NaCl\'de fark 2,23\'tür; iyonik bağ. Tuzlu suyun iletken olması iyonların varlığını destekler.'),
     ('Bir periyotta soldan sağa ve bir grupta yukarıdan aşağıya elektronegatiflik nasıl değişir?', 'Periyotta soldan sağa artar, grupta yukarıdan aşağıya azalır; en elektronegatif element flordur.'),
     ('Cl₂ ile HCl\'deki bağlar nasıl farklıdır?', 'Cl₂\'de fark sıfırdır (apolar kovalent); HCl\'de fark 0,96\'dır (polar kovalent).')],
    tablo=(['Madde', 'EN farkı', 'Tahmin edilen bağ türü'], [['NaCl', '', ''], ['H₂O (O–H)', '', ''], ['Cl₂', '', ''], ['HCl', '', '']]),
    sure='25 dk')]

V['2.1.1'] = [F(
    'Metaller Isıyı ve Elektriği Nasıl İletir?',
    'Farklı malzemelerin ısı ve elektrik iletkenliğini karşılaştırarak metalik bağın özelliklerini açıklamak.',
    ['eşit uzunlukta bakır tel, alüminyum çubuk, demir çivi, tahta çubuk, plastik pipet', 'tereyağı ya da mum damlası', 'sıcak su dolu beher', 'iletkenlik test düzeneği', 'çekiç ve bakır tel parçası'],
    [ISI],
    ['Çubukların ucuna eşit miktarda tereyağı sürünüz; diğer uçlarını aynı anda sıcak suya daldırınız.', 'Tereyağının erime sırasını gözleyiniz.', 'Her malzemenin elektrik iletkenliğini test düzeneğiyle kontrol ediniz.', 'Bakır teli çekiçle hafifçe dövüp şeklinin değişip değişmediğini, kırılıp kırılmadığını gözleyiniz.'],
    [('Metallerin ısıyı ve elektriği iyi iletmesini metalik bağ modeliyle açıklayınız.', 'Metal katyonlarının arasında serbestçe hareket eden elektronlar (elektron denizi) enerjiyi ve yükü kolayca taşır.'),
     ('Metaller dövülünce neden kırılmaz?', 'Katmanlar kaysa da elektron denizi katyonları bir arada tutmaya devam eder.'),
     ('Tahta ve plastik neden iletken değildir?', 'Serbest hareket eden elektronları yoktur.')],
    tablo=(['Malzeme', 'Tereyağı erime sırası', 'Elektrik iletkenliği'], [['Bakır', '', ''], ['Alüminyum', '', ''], ['Demir', '', ''], ['Tahta', '', ''], ['Plastik', '', '']]),
    sure='30 dk')]

V['2.1.2-A'] = [F(
    'Tuz Kristali Büyütme',
    'Doygun tuz çözeltisinden kristal büyüterek iyonik katıların düzenli kristal yapısını gözlemlemek; katı ve çözelti hâlindeki iletkenliği karşılaştırmak.',
    ['sofra tuzu ya da şap', 'sıcak su', 'kavanoz', 'ip ve kalem', 'büyüteç', 'iletkenlik test düzeneği'],
    [ISI],
    ['Sıcak suya, dipte çözünmeyen kalana kadar tuz ekleyerek doygun çözelti hazırlayınız.', 'Çözeltiyi kavanoza süzünüz; ucuna küçük bir kristal bağlanmış ipi kaleme sarıp çözeltiye sarkıtınız.', 'Kavanozu sarsılmayacak bir yerde birkaç gün bekletip kristali büyüteçle inceleyiniz.', 'Kuru tuz kristalinin ve tuzlu suyun iletkenliğini test ediniz.'],
    [('Kristallerin düzgün geometrik şekilli olmasının nedeni nedir?', 'Na⁺ ve Cl⁻ iyonları üç boyutta düzenli ve tekrarlanan bir örgü oluşturur.'),
     ('Katı tuz neden iletken değil, tuzlu su neden iletkendir?', 'Katıda iyonlar sabit konumdadır; suda çözünen iyonlar hareket ederek yükü taşır.'),
     ('İyonik bağı tanımlayınız.', 'Zıt yüklü iyonlar arasındaki elektrostatik çekim kuvvetidir.')],
    sure='Ders + birkaç gün gözlem')]

V['2.1.2-B'] = [F(
    'İyon Kartlarıyla Formül Yapma',
    'Yük kartlarını birleştirerek iyonik bileşiklerin formüllerini ve çok atomlu iyonları içeren bileşikleri yazmak.',
    ['iyon kartları: Na⁺, K⁺, Mg²⁺, Ca²⁺, Al³⁺, NH₄⁺, Cl⁻, O²⁻, S²⁻, OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻, PO₄³⁻ (her yük için kartın kenarında çıkıntı ya da girinti)', 'kâğıt ve kalem'],
    [],
    ['Bir katyon ve bir anyon kartı seçiniz.', 'Çıkıntılar ve girintiler tam oturana (toplam yük sıfır olana) kadar kart ekleyiniz.', 'Oluşan bileşiğin formülünü yazınız; çok atomlu iyonlar birden fazla kullanılıyorsa paranteze alınız.', 'En az sekiz farklı bileşik oluşturup tabloya yazınız.'],
    [('Al³⁺ ile SO₄²⁻ iyonlarından oluşan bileşiğin formülünü bulunuz.', 'Toplam yük denkliği için 2 Al³⁺ ve 3 SO₄²⁻ gerekir: Al₂(SO₄)₃.'),
     ('Ca(OH)₂ formülünde parantez neden kullanılır?', 'OH⁻ çok atomlu bir iyondur; iki tane olduğunu göstermek için parantez içine alınır.'),
     ('İyonik bileşik formülleri neden en küçük tam sayı oranıyla yazılır?', 'İyonik katılar molekül değil, iyonların belirli oranda düzenlendiği örgülerdir; formül bu oranı gösterir.')],
    tablo=(['Katyon', 'Anyon', 'Formül'], [['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']]),
    sure='25 dk')]

V['2.1.3-A'] = [F(
    'Hamur ve Kürdanla Molekül Modelleri',
    'Basit moleküllerin modellerini yaparak kovalent bağda elektronların ortaklaşa kullanıldığını ve bağ sayılarını göstermek.',
    ['farklı renklerde oyun hamuru', 'kürdanlar', 'kâğıt'],
    [],
    ['H (beyaz), O (kırmızı), N (mavi), C (siyah) için hamurdan toplar yapınız.', 'Her atomun yapabileceği bağ sayısı kadar kürdan bağlayarak H₂, O₂, N₂, H₂O, NH₃ ve CH₄ modellerini oluşturunuz.', 'İkili ve üçlü bağları iki ve üç kürdanla gösteriniz.'],
    [('Her kürdan neyi temsil eder?', 'İki atom arasında ortaklaşa kullanılan bir elektron çiftini (bir kovalent bağı).'),
     ('N₂ molekülünde neden üçlü bağ vardır?', 'Her N atomunun oktete ulaşmak için üç elektrona ihtiyacı vardır; üç elektron çifti ortaklaşa kullanılır.'),
     ('Modellerinizin gerçek moleküllerden farkları nelerdir?', 'Gerçek atomlar katı top değildir, bağlar çubuk değildir; elektron bulutları iç içe geçmiştir.')],
    sure='25 dk')]

V['2.1.3-B'] = [F(
    'Polar ve Apolar Sıvılar Karışır mı?',
    'Farklı sıvıların birbiri içinde karışıp karışmadığını gözlemleyerek moleküllerdeki bağ polarlığıyla ilişkilendirmek.',
    ['su', 'ayçiçek yağı', 'kolonya (etil alkol)', 'gıda boyası', 'deney tüpleri', 'damlalık'],
    [GOZLUK, 'Kolonyayı ateşten uzak tutunuz.'],
    ['Bir tüpe su ve yağ, bir tüpe su ve kolonya, bir tüpe yağ ve kolonya koyunuz.', 'Tüpleri çalkalayıp birkaç dakika bekleyiniz.', 'Tüplere birer damla gıda boyası ekleyip boyanın hangi tabakada dağıldığını gözleyiniz.'],
    [('Su ile yağ neden karışmadı?', 'Su molekülleri polar (O–H bağları polar), yağ molekülleri apolardır (C–H bağları neredeyse apolar).'),
     ('Gıda boyası hangi tabakada dağıldı? Neden?', 'Su tabakasında; boya polar ya da iyonik yapıdadır.'),
     ('Bir bağın polar olup olmadığına nasıl karar verilir?', 'Bağı oluşturan atomların elektronegatiflik farkına bakılır; fark varsa elektron çifti daha elektronegatif atoma kayar ve bağ polar olur.')],
    sure='20 dk')]

V['2.1.4'] = [F(
    'Lewis Yapısı Kartları ve Oktet Kontrolü',
    'Değerlik elektronlarını nokta kartlarıyla göstererek moleküllerin Lewis yapılarını çizmek.',
    ['element kartları (H, C, N, O, F, Cl)', 'nokta etiketleri ya da küçük mıknatıslar', 'tahta ya da büyük kâğıt'],
    [],
    ['Her atomun değerlik elektron sayısı kadar noktayı kartının çevresine yerleştiriniz.', 'H₂O, NH₃, CO₂, CH₄ ve HCl için atomları yan yana getirip ortak elektron çiftlerini aradaki çizgiyle gösteriniz.', 'Her atomun okteti (H için dubleti) tamamlayıp tamamlamadığını kontrol ediniz; ortaklanmamış çiftleri sayınız.'],
    [('H₂O\'da oksijen atomunun kaç ortaklanmış ve kaç ortaklanmamış elektron çifti vardır?', 'İki ortaklanmış (iki O–H bağı), iki ortaklanmamış elektron çifti.'),
     ('CO₂ molekülünde neden ikili bağlar vardır?', 'C\'nin dört, her O\'nun iki elektrona ihtiyacı vardır; C ile her O arasında iki elektron çifti ortaklaşa kullanılınca hepsi oktete ulaşır.'),
     ('Lewis yapısında ortaklanmamış elektron çiftlerini göstermek neden önemlidir?', 'Molekülün geometrisini ve polarlığını belirlemede rol oynarlar.')],
    sure='25 dk')]

V['2.1.5'] = [F(
    'Elektriklenmiş Balonla Sıvıları Saptırmak',
    'Elektrik yüklü bir cismin polar ve apolar sıvı akışları üzerindeki etkisini gözlemleyerek molekül polarlığını belirlemek.',
    ['balon', 'yün kumaş ya da saç', 'iki büret ya da delikli plastik şişe', 'su', 'ayçiçek yağı', 'iki beher'],
    [],
    ['Büretleri su ve yağla doldurup altlarına beher yerleştiriniz.', 'Musluğu açarak ince bir sıvı akışı oluşturunuz.', 'Balonu yün kumaşa sürterek elektriklendiriniz ve akışa yaklaştırınız (dokundurmayınız).', 'Her iki sıvı için akışın sapıp sapmadığını gözleyiniz.'],
    [('Hangi sıvının akışı balona doğru saptı? Neden?', 'Su; su molekülleri polardır, kısmi yüklü uçlarıyla elektrik yüklü balona yönelirler.'),
     ('Yağ akışı neden belirgin şekilde sapmadı?', 'Yağ molekülleri apolardır; kalıcı dipolleri yoktur.'),
     ('CO₂ molekülündeki bağlar polar olduğu hâlde molekül neden apolardır?', 'Doğrusal ve simetrik yapıda iki bağ dipolü zıt yönde ve eşit büyüklükte olduğundan birbirini yok eder.')],
    sure='20 dk')]

V['2.1.6-A'] = [F(
    'Etiket Avı: İyonik Bileşiklerin Adları',
    'Evdeki ürünlerin içerik listelerindeki iyonik bileşikleri bulup formüllerini yazarak adlandırma kurallarını uygulamak.',
    ['diş macunu, maden suyu, sofra tuzu, kabartma tozu, gübre ya da çiçek besini, antiasit tablet ambalajları', 'kâğıt ve kalem'],
    [],
    ['Ambalajların içerik listelerinde iyonik bileşik adlarını (sodyum florür, kalsiyum karbonat, magnezyum hidroksit vb.) bulunuz.', 'Her bileşiğin katyonunu, anyonunu ve formülünü tabloya yazınız.', 'Birden fazla yük alabilen metal içeren bileşikleri (örneğin demir(II) sülfat) ayrıca işaretleyiniz.'],
    [('Sodyum florür, kalsiyum karbonat ve magnezyum hidroksitin formüllerini yazınız.', 'NaF, CaCO₃, Mg(OH)₂.'),
     ('"Demir sülfat" adı neden eksiktir?', 'Demir +2 ve +3 yüklü olabilir; yük Roma rakamıyla belirtilmelidir: demir(II) sülfat (FeSO₄) ya da demir(III) sülfat (Fe₂(SO₄)₃).'),
     ('İyonik bileşiklerin adlandırılmasında sayı ön ekleri neden kullanılmaz?', 'İyonların oranı yüklerinden kesin olarak belli olduğu için.')],
    tablo=(['Ürün', 'Bileşik adı', 'Katyon', 'Anyon', 'Formül'], [['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]),
    sure='25 dk')]

V['2.1.6-B'] = [F(
    'Havadaki Moleküler Bileşikleri Adlandırma',
    'Hava kirliliği raporlarında geçen moleküler bileşikleri ön ekleri kullanarak adlandırmak ve formüllerini yazmak.',
    ['hava kalitesi ölçüm istasyonu raporu ya da çevre haberi', 'molekül modeli seti (isteğe bağlı)', 'kâğıt ve kalem'],
    [],
    ['Raporda geçen kirleticileri (CO, CO₂, NO₂, SO₂, N₂O, O₃) listeleyiniz.', 'Her birinin adını Yunanca sayı ön ekleriyle yazınız.', 'Molekül modeli setiyle en az üç molekülün modelini yapınız.'],
    [('CO, CO₂, SO₂, SO₃ ve N₂O₄\'ün adlarını yazınız.', 'Karbon monoksit, karbon dioksit, kükürt dioksit, kükürt trioksit, diazot tetraoksit.'),
     ('Karbon monoksitte "mono" ön eki neden ilk elementte kullanılmaz?', 'Kural gereği ilk elementin sayısı 1 ise mono ön eki yazılmaz.'),
     ('NO₂ ile N₂O\'nun özellikleri neden farklıdır?', 'Atom türleri aynı olsa da atom sayıları ve yapıları farklı olduğu için farklı maddelerdir.')],
    sure='20 dk')]

V['2.2.1-A'] = [F(
    'Buharlaşma Yarışı',
    'Farklı sıvıların buharlaşma hızlarını karşılaştırarak moleküller arası etkileşimlerin gücünü tahmin etmek.',
    ['su', 'kolonya (etil alkol)', 'aseton (oje çıkarıcı)', 'kâğıt havlu ya da kara tahta', 'damlalık', 'kronometre'],
    [GOZLUK, 'Aseton ve kolonya yanıcıdır; ortamda açık alev bulunmasın ve ortamı havalandırınız.'],
    ['Kâğıt havlu üzerine her sıvıdan aynı anda eşit büyüklükte birer damla damlatınız.', 'Lekelerin kaybolma sürelerini ölçünüz.', 'Bir damla aseton ve bir damla suyu elinizin üstüne damlatıp hissettiğiniz serinliği karşılaştırınız.'],
    [('Sıvıları buharlaşma hızına göre sıralayınız. Bu sıralama moleküller arası etkileşimler hakkında ne söyler?', 'Aseton > alkol > su; etkileşim ne kadar zayıfsa tanecikler sıvı yüzeyinden o kadar kolay ayrılır.'),
     ('Su ve etil alkolde hangi etkileşimler vardır?', 'İkisinde de hidrojen bağı ve London kuvvetleri vardır; su molekülleri daha fazla hidrojen bağı kurar.'),
     ('Asetonun eli daha çok serinletmesinin nedeni nedir?', 'Daha hızlı buharlaşır ve buharlaşırken elden daha hızlı ısı alır.')],
    tablo=(['Sıvı', 'Buharlaşma süresi (s)', 'Baskın etkileşim'], [['Su', '', ''], ['Etil alkol', '', ''], ['Aseton', '', '']]),
    sure='20 dk')]

V['2.2.1-B'] = [F(
    'Hangi Sıvı Daha Yüksek Sıcaklıkta Kaynar?',
    'Su, etil alkol ve asetonun kaynama sıcaklıklarını su banyosunda karşılaştırarak hidrojen bağının etkisini incelemek.',
    ['su', 'etil alkol', 'aseton', 'üç deney tüpü', 'kaynama taşı', 'su banyosu (beher ve ısıtıcı)', 'termometre'],
    [GOZLUK, 'Alkol ve aseton yanıcıdır; doğrudan alevle ısıtmayınız, deneyi öğretmeniniz yapsın.', ISI],
    ['Tüplere 2\'şer mL sıvı ve birer kaynama taşı koyunuz.', 'Tüpleri su banyosuna yerleştirip banyoyu yavaşça ısıtınız.', 'Her tüpte kaynamanın başladığı sıcaklığı kaydediniz.'],
    [('Kaynama sıcaklıklarını sıralayıp moleküller arası etkileşimlerle açıklayınız.', 'Aseton (≈56 °C) < etil alkol (≈78 °C) < su (100 °C); su en çok hidrojen bağı kurar, aseton molekülleri arasında hidrojen bağı yoktur.'),
     ('Hidrojen bağı hangi moleküller arasında oluşur?', 'F, O ya da N atomuna doğrudan bağlı H atomu bulunan moleküller arasında.'),
     ('Suyun molekül kütlesi küçük olmasına rağmen kaynama sıcaklığının yüksek olmasının nedeni nedir?', 'Molekülleri arasındaki güçlü ve çok sayıdaki hidrojen bağlarıdır.')],
    tablo=(['Sıvı', 'Kaynama sıcaklığı (°C)', 'Hidrojen bağı var mı?'], [['Aseton', '', ''], ['Etil alkol', '', ''], ['Su', '', '']]),
    sure='30 dk')]

V['2.2.2'] = [F(
    'Katıları Tanıyalım: Erime ve İletkenlik',
    'Farklı türdeki katıların erime davranışlarını ve elektrik iletkenliklerini karşılaştırarak katı türlerini sınıflandırmak.',
    ['sofra tuzu (iyonik)', 'şeker (moleküler)', 'mum (moleküler)', 'bakır tel (metalik)', 'kurşun kalem ucu (grafit, kovalent ağ)', 'metal kaşıklar', 'mum ısıtıcı', 'iletkenlik test düzeneği'],
    [GOZLUK, ISI],
    ['Katıların kuru hâldeki iletkenliğini test ediniz.', 'Metal kaşıklara az miktarda tuz, şeker ve mum koyup mum ısıtıcıda eşit süre ısıtınız; hangilerinin eridiğini gözleyiniz.', 'Tuz ve şekeri ayrı ayrı suda çözüp iletkenliklerini test ediniz.'],
    [('Mum ve şeker kolayca erirken tuz neden erimedi?', 'Mum ve şeker moleküler katılardır; moleküller arası etkileşimler zayıftır. Tuz iyonik katıdır; güçlü iyonik bağlar nedeniyle erime noktası çok yüksektir (801 °C).'),
     ('Grafit bir ametal olmasına rağmen neden elektriği iletir?', 'Grafitin katmanlarında serbest hareket edebilen elektronlar bulunur.'),
     ('Katıları türlerine göre sınıflandırınız.', 'Tuz: iyonik; şeker ve mum: moleküler; bakır: metalik; grafit: kovalent ağ örgülü.')],
    tablo=(['Katı', 'Katı hâlde iletkenlik', 'Kolay eridi mi?', 'Çözeltisi iletir mi?', 'Katı türü'], [['Tuz', '', '', '', ''], ['Şeker', '', '', '', ''], ['Mum', '', '', '—', ''], ['Bakır', '', '', '—', ''], ['Grafit', '', '', '—', '']]),
    sure='30 dk')]

V['2.2.3-A'] = [F(
    'Kapalı Kapta Buhar Basıncını Gözlemleme',
    'Kapalı bir şişedeki sıvının buharlaşmasıyla oluşan basıncı balonla gözlemlemek ve sıvı türü ile sıcaklığın etkisini incelemek.',
    ['üç küçük cam şişe', 'üç balon', 'su', 'etil alkol', 'aseton', 'ılık su banyosu (≈ 40 °C)', 'damlalık'],
    [GOZLUK, 'Alkol ve aseton yanıcıdır; açık alev kullanmayınız.'],
    ['Şişelere eşit miktarda (birkaç damla) su, alkol ve aseton koyup ağızlarına balon geçiriniz.', 'Şişeleri ılık su banyosuna koyunuz.', 'Birkaç dakika sonra balonların şişme durumunu karşılaştırınız.', 'Şişeleri banyodan çıkarıp soğumalarını izleyiniz.'],
    [('Hangi şişedeki balon daha çok şişti? Buhar basıncıyla ilişkilendiriniz.', 'Aseton şişesindeki; aynı sıcaklıkta asetonun buhar basıncı en yüksektir çünkü molekülleri arasındaki etkileşimler en zayıftır.'),
     ('Sıcaklık artınca buhar basıncı neden artar?', 'Yüzeyden ayrılabilecek kadar kinetik enerjiye sahip tanecik sayısı artar.'),
     ('Kapalı kapta denge kurulduğunda buharlaşma durur mu?', 'Durmaz; buharlaşma ve yoğuşma hızları eşitlenir (dinamik denge).')],
    tablo=(['Sıvı', 'Balonun durumu (ılık)', 'Soğuyunca'], [['Su', '', ''], ['Etil alkol', '', ''], ['Aseton', '', '']]),
    sure='25 dk')]

V['2.2.3-B'] = [F(
    'Şırıngada Ilık Suyu Kaynatmak',
    'Dış basıncı azaltarak suyun daha düşük sıcaklıkta kaynadığını gözlemlemek.',
    ['büyük plastik şırınga', 'ılık su (≈ 50 °C)', 'beher', 'termometre'],
    ['Su sıcaklığı 60 °C\'yi geçmesin; şırıngayı yüzünüze doğru tutmayınız.'],
    ['Şırıngaya bir miktar ılık su çekip içindeki havayı dışarı atınız.', 'Şırınganın ucunu parmağınızla sıkıca kapatıp pistonu geri çekiniz.', 'Sudaki değişimi gözleyiniz; pistonu bırakınca ne olduğunu not ediniz.'],
    [('Piston çekilince ılık su neden kaynadı?', 'Şırınga içindeki basınç azaldı; suyun buhar basıncı dış basınca eşit hâle gelince su kaynadı.'),
     ('Yüksek dağlarda yemeklerin geç pişmesinin nedeni nedir?', 'Açık hava basıncı düşük olduğundan su 100 °C\'nin altında kaynar; yemek daha düşük sıcaklıkta pişer.'),
     ('Düdüklü tencerede yemekler neden daha çabuk pişer?', 'İçerideki basınç yüksek olduğundan su 100 °C\'nin üzerinde kaynar.')],
    sure='15 dk')]

V['2.2.3-C'] = [F(
    'Akışkanlık Yarışı',
    'Farklı sıvıların akışkanlığını bilye düşürme yöntemiyle karşılaştırmak ve sıcaklığın etkisini incelemek.',
    ['dört özdeş uzun şeffaf tüp ya da şişe', 'su', 'ayçiçek yağı', 'gliserin', 'bal ya da şurup', 'dört özdeş bilye', 'kronometre', 'ılık su banyosu'],
    [],
    ['Tüpleri aynı yüksekliğe kadar sıvılarla doldurunuz.', 'Bilyeleri aynı anda sıvıların yüzeyinden bırakıp dibe ulaşma sürelerini ölçünüz.', 'Bal ya da yağ tüpünü ılık su banyosunda 10 dakika bekletip deneyi tekrarlayınız.'],
    [('Sıvıları viskozitesine göre sıralayınız.', 'Su < ayçiçek yağı < gliserin < bal (bilyenin düşme süresi arttıkça viskozite artar).'),
     ('Gliserinin viskozitesinin yüksek olmasının nedeni nedir?', 'Molekülünde üç –OH grubu bulunur; moleküller arasında çok sayıda hidrojen bağı oluşur.'),
     ('Isıtılan sıvıda bilye neden daha hızlı düştü?', 'Sıcaklık artınca moleküllerin kinetik enerjisi artar, moleküller arası etkileşimler daha kolay aşılır; viskozite azalır.')],
    tablo=(['Sıvı', 'Düşme süresi (s)', 'Isıtınca (s)'], [['Su', '', '—'], ['Ayçiçek yağı', '', ''], ['Gliserin', '', '—'], ['Bal', '', '']]),
    sure='25 dk')]

V['2.2.3-D'] = [F(
    'Bozuk Paraya Kaç Damla Sığar?',
    'Bozuk para üzerinde biriktirilebilen damla sayısını karşılaştırarak sıvı türü, sıcaklık ve deterjanın yüzey gerilimine etkisini incelemek.',
    ['üç aynı bozuk para', 'damlalık', 'soğuk su', 'ılık su', 'deterjanlı su', 'kolonya', 'kâğıt havlu', 'ince cam borular (farklı çaplarda) ve renkli su'],
    [],
    ['Kuru bozuk paranın üzerine taşana kadar damla damla soğuk su ekleyip damla sayısını yazınız.', 'Parayı kurulayıp aynı işlemi ılık su, deterjanlı su ve kolonya için tekrarlayınız.', 'Farklı çaplardaki cam boruları renkli suya daldırıp suyun yükselme yüksekliklerini karşılaştırınız.'],
    [('En çok damla hangi sıvıda sığdı? Neden?', 'Soğuk suda; su molekülleri arasındaki kohezyon (hidrojen bağları) yüzey gerilimini yüksek tutar.'),
     ('Deterjan ve sıcaklık yüzey gerilimini nasıl etkiledi?', 'Her ikisi de yüzey gerilimini azaltır; daha az damla sığar.'),
     ('İnce borularda su neden daha çok yükseldi?', 'Su ile cam arasındaki adezyon kohezyondan büyüktür; boru inceldikçe kılcallıkla yükselme artar.')],
    tablo=(['Sıvı', 'Damla sayısı'], [['Soğuk su', ''], ['Ilık su', ''], ['Deterjanlı su', ''], ['Kolonya', '']]),
    sure='25 dk')]

V['3.1.1'] = [F(
    'Çay Özütüyle Gümüş Nanoparçacık (Öğretmen Gösterisi)',
    'Bitki özütü kullanarak gümüş iyonlarından gümüş nanoparçacık elde etmek ve renk değişimiyle nano boyutu ilişkilendirmek.',
    ['seyreltik gümüş nitrat çözeltisi (≈ 1 mM)', 'demlenmiş yeşil çay (süzülmüş)', 'beher', 'damlalık', 'ısıtıcı', 'el feneri ya da lazer işaretçi'],
    [GOZLUK, 'Gümüş nitrat cildi lekeler ve tahriş eder; deneyi öğretmeniniz eldivenle yapsın.', ISI, ATIK],
    ['Öğretmeniniz behere 20 mL gümüş nitrat çözeltisi koysun ve ılık hâle getirsin.', 'Karıştırarak yavaş yavaş 2 mL yeşil çay özütü eklesin.', 'Renk değişimini 10 dakika boyunca gözleyiniz.', 'Karanlık bir ortamda çözeltiden el feneri ışığı geçirip ışığın yolunun görünüp görünmediğini gözleyiniz.'],
    [('Çözeltinin rengi neden sarı-kahverengiye döndü?', 'Çaydaki maddeler Ag⁺ iyonlarını gümüş atomlarına indirger; atomlar birleşerek nano boyutlu parçacıklar oluşturur. Nano boyuttaki gümüş ışıkla farklı etkileştiği için renkli görünür.'),
     ('Işığın yolunun çözeltide görünmesi neyi gösterir?', 'Çözeltide ışığı saçan küçük parçacıklar (kolloit) bulunduğunu gösterir (Tyndall etkisi).'),
     ('Gümüş nanoparçacıklar hangi alanlarda kullanılır?', 'Antibakteriyel özellikleri nedeniyle yara örtülerinde, tekstilde, su filtrelerinde.')],
    sure='30 dk')]

V['3.1.2'] = [F(
    'Patates Nişastasından Biyoplastik',
    'Yenilenebilir bir hammaddeden plastik benzeri malzeme üreterek yeşil kimyanın atık önleme ve yenilenebilir kaynak kullanma ilkelerini uygulamak.',
    ['patates nişastası (ya da mısır nişastası)', 'su', 'sirke', 'gliserin', 'gıda boyası', 'tencere ya da beher', 'ısıtıcı', 'kaşık', 'alüminyum folyo'],
    [ISI],
    ['Behere 1 yemek kaşığı nişasta, 4 yemek kaşığı su, 1 çay kaşığı sirke ve 1 çay kaşığı gliserin koyup karıştırınız.', 'Karışımı sürekli karıştırarak kısık ateşte koyulaşıp şeffaflaşana kadar ısıtınız.', 'Karışımı folyo üzerine ince bir tabaka hâlinde yayıp 1–2 gün kurumaya bırakınız.', 'Kuruyan biyoplastiğin bir parçasını toprağa gömüp birkaç hafta sonra kontrol ediniz.'],
    [('Bu biyoplastik hangi yönleriyle petrol kaynaklı plastiklerden daha çevrecidir?', 'Yenilenebilir bitkisel hammaddeden üretilir ve doğada parçalanabilir; zehirli çözücü ve yüksek sıcaklık gerektirmez.'),
     ('Gliserin miktarı değiştirilirse ürün nasıl etkilenir? Nasıl test edersiniz?', 'Gliserin esnekliği artırır; farklı gliserin oranlarıyla örnekler hazırlayıp esnekliklerini karşılaştırarak test edilir.'),
     ('Yeşil kimyanın "atığı önlemek, oluştuktan sonra temizlemekten iyidir" ilkesini bu deneyle ilişkilendiriniz.', 'Ürün kullanım sonrası doğada parçalanacak şekilde baştan tasarlanmıştır; kalıcı plastik atığı oluşmaz.')],
    sure='Ders + 1–2 gün kuruma')]

V['3.1.3'] = [F(
    'Çiviler Hangi Koşulda Paslanır?',
    'Demirin paslanma koşullarını ve alaşım ya da kaplamanın korozyona etkisini inceleyerek metal atıkların çevresel etkilerini tartışmak.',
    ['5 adet demir çivi', '1 adet paslanmaz çelik vida', '1 adet galvanizli (çinko kaplı) çivi', 'deney tüpleri', 'musluk suyu', 'tuzlu su', 'kaynatılıp soğutulmuş su ve yağ', 'kalsiyum klorür (nem çekici)', 'boya ya da oje'],
    [],
    ['Tüplere çivileri tablodaki koşullarda yerleştiriniz (kuru hava, musluk suyu, tuzlu su, havasız su, boyalı çivi, paslanmaz vida, galvanizli çivi).', 'Tüpleri bir hafta bekletip her gün gözlem yapınız.', 'Paslanma derecesini 0–3 arasında puanlayınız.'],
    [('Paslanma için hangi koşulların birlikte bulunması gerekir?', 'Su (nem) ve oksijen; tuz paslanmayı hızlandırır.'),
     ('Paslanmaz çelik ve galvanizli çivi neden paslanmadı ya da az paslandı?', 'Paslanmaz çelik krom ve nikel içeren bir alaşımdır, yüzeyinde koruyucu oksit tabakası oluşur. Galvanizli çivide çinko kaplama demiri korur.'),
     ('Metal atıkların doğaya atılması hangi sorunlara yol açar? Çözüm önerileri nelerdir?', 'Korozyonla toprak ve suya metal iyonları karışabilir, kaynaklar israf olur. Metal atıklar ayrı toplanıp geri dönüştürülmelidir.')],
    tablo=(['Koşul', '1. gün', '3. gün', '7. gün'], [['Kuru hava', '', '', ''], ['Musluk suyu', '', '', ''], ['Tuzlu su', '', '', ''], ['Havasız su (üstü yağlı)', '', '', ''], ['Boyalı çivi', '', '', ''], ['Paslanmaz vida', '', '', ''], ['Galvanizli çivi', '', '', '']]),
    sure='1 hafta')]

yaz('9', V)
