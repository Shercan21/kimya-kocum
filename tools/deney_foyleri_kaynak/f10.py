from ortak import F, GOZLUK, ATIK, ISI, yaz

V = {}

V['1.1.1'] = [F(
    'Kimyasal Değişimin İzleri',
    'Farklı madde çiftlerini karıştırarak kimyasal değişimin göstergelerini (gaz çıkışı, çökelek, renk ve sıcaklık değişimi) gözlemek ve fiziksel değişimden ayırmak.',
    ['sirke', 'karbonat (sodyum bikarbonat)', 'demlenmiş çay', 'limon suyu', 'süt', 'şeker', 'su', 'şeffaf bardaklar', 'termometre', 'çay kaşığı'],
    [GOZLUK, 'Deneydeki maddeleri tatmayınız.'],
    ['Bir bardağa sirke koyup içine bir çay kaşığı karbonat ekleyiniz; gözlemlerinizi ve sıcaklık değişimini yazınız.', 'Demlenmiş çaya birkaç damla limon suyu damlatıp renk değişimini gözleyiniz.', 'Ilık süte bir yemek kaşığı limon suyu ekleyip birkaç dakika bekleyiniz.', 'Bir bardak suya şeker ekleyip karıştırınız.', 'Gözlemlerinizi tabloya kaydedip her olayın fiziksel mi kimyasal mı olduğuna karar veriniz.'],
    [('Sirke ile karbonat karışınca oluşan kabarcıklar neyin kanıtıdır?', 'Yeni bir madde olan karbon dioksit gazının oluştuğunun, yani kimyasal değişimin kanıtıdır.'),
     ('Süte limon eklenince oluşan topaklanma neden kimyasal bir değişim olarak kabul edilir?', 'Süt proteinleri asitle yapısı değişerek çöker; yeni özellikte bir katı oluşur.'),
     ('Şekerin suda çözünmesi neden fiziksel değişimdir?', 'Yeni madde oluşmaz; su buharlaştırılınca şeker geri elde edilir.'),
     ('Tek bir gösterge (örneğin renk değişimi) kimyasal değişim olduğunu kanıtlamaya her zaman yeter mi?', 'Yetmez; boya çözünmesi de renk değiştirir. Yeni madde oluşup oluşmadığı birden fazla kanıtla değerlendirilmelidir.')],
    tablo=(['Karıştırılan maddeler', 'Gözlem', 'Gösterge', 'Fiziksel / Kimyasal'], [['Sirke + karbonat', '', '', ''], ['Çay + limon', '', '', ''], ['Süt + limon', '', '', ''], ['Su + şeker', '', '', '']]),
    sure='25 dk')]

V['1.1.2'] = [F(
    'Çökelme, Nötralleşme ve Metal–İyon Tepkimeleri',
    'Farklı türdeki tepkimeleri gözlemleyip denklemlerini yazarak sınıflandırmak.',
    ['0,1 M gümüş nitrat (AgNO₃)', '0,1 M sodyum klorür (NaCl)', '0,5 M bakır(II) sülfat (CuSO₄)', 'çinko granül', '1 M HCl', '1 M NaOH', 'fenolftalein', 'deney tüpleri', 'damlalık', 'termometre'],
    [GOZLUK, 'Gümüş nitrat cildi lekeler; asit ve baz çözeltileri tahriş edicidir.', ATIK],
    ['Bir tüpe 2 mL AgNO₃, üzerine 2 mL NaCl ekleyip gözleyiniz.', 'Bir tüpe 3 mL NaOH ve 1 damla fenolftalein koyunuz; renk kaybolana kadar damla damla HCl ekleyip tüpün ısısını elinizle hissediniz.', 'Bir tüpe 5 mL CuSO₄ çözeltisi koyup içine bir çinko granül atınız; 10 dakika sonra çinkonun yüzeyini ve çözeltinin rengini gözleyiniz.'],
    [('Her tepkimenin türünü ve denklemini yazınız.', 'AgNO₃ + NaCl → AgCl(k) + NaNO₃: çökelme. HCl + NaOH → NaCl + H₂O: asit–baz. Zn + CuSO₄ → ZnSO₄ + Cu: indirgenme–yükseltgenme.'),
     ('Çinko–bakır sülfat tepkimesinde hangi tür elektron verdi, hangisi aldı?', 'Zn elektron verip Zn²⁺ oldu (yükseltgendi); Cu²⁺ elektron alıp Cu oldu (indirgendi).'),
     ('Çökelme tepkimesinin net iyon denklemini yazınız; seyirci iyonlar hangileridir?', 'Ag⁺ + Cl⁻ → AgCl(k); seyirci iyonlar Na⁺ ve NO₃⁻.')],
    tablo=(['Tepkime', 'Gözlem', 'Tepkime türü'], [['AgNO₃ + NaCl', '', ''], ['HCl + NaOH', '', ''], ['Zn + CuSO₄', '', '']]),
    sure='30 dk')]

V['1.1.3-A'] = [F(
    'Saymadan Saymak: Tartarak Sayma',
    'Küçük nesneleri tek tek saymadan tartarak sayılarını bulmak ve bu yöntemi mol kavramıyla ilişkilendirmek.',
    ['bir paket mercimek ya da pirinç', 'bir avuç ataş', 'hassas terazi (0,01 g)', 'küçük kap'],
    [],
    ['20 adet mercimek sayıp kütlesini tartınız; bir mercimeğin ortalama kütlesini hesaplayınız.', 'Bir avuç mercimeği tartıp bu kütleden mercimek sayısını tahmin ediniz.', 'Tahmininizi bir bölümünü sayarak kontrol ediniz.', 'Aynı işlemleri ataşlar için yapınız.', '"Bir düzine", "bir deste" gibi sayma birimlerini mol ile karşılaştırınız.'],
    [('Mercimeklerin sayısını tartarak nasıl buldunuz? Bu yöntemin kimyadaki karşılığı nedir?', 'Toplam kütle ÷ bir tanenin kütlesi = tane sayısı. Kimyada atomlar tek tek sayılamadığı için kütle mol kütlesine bölünerek mol (tanecik sayısı) bulunur.'),
     ('Eşit sayıda mercimek ve ataş tartsaydınız kütleler eşit olur muydu?', 'Hayır; tanelerin kütleleri farklıdır. Aynı şekilde 1 mol C 12 g, 1 mol Fe 56 g gelir.'),
     ('1 mol neden 6,02·10²³ gibi çok büyük bir sayıdır?', 'Atomlar çok küçük olduğundan, tartılabilir bir miktarda (gram düzeyinde) bu kadar çok tanecik bulunur.')],
    tablo=(['Nesne', '20 tanenin kütlesi (g)', '1 tanenin kütlesi (g)', 'Avuçtaki kütle (g)', 'Tahmini sayı'], [['Mercimek', '', '', '', ''], ['Ataş', '', '', '', '']]),
    sure='25 dk')]

V['1.1.3-B'] = [F(
    'Bir Mol Ne Kadar?',
    'Farklı maddelerden 1\'er mol tartarak kütle ve hacimlerini karşılaştırmak, mol–kütle–tanecik sayısı dönüşümlerini uygulamak.',
    ['sofra tuzu (NaCl)', 'şeker (sakaroz)', 'su', 'alüminyum folyo', 'terazi', 'dereceli silindir', 'saat camı'],
    [],
    ['18 g su ölçüp dereceli silindirdeki hacmini yazınız (1 mol H₂O).', '58,5 g tuz ve 342 g şeker tartınız (her biri 1 mol).', '2,7 g alüminyum folyo tartınız (0,1 mol Al).', 'Her örnekteki tanecik sayısını ve toplam atom sayısını hesaplayınız.'],
    [('1 mol su, 1 mol tuz ve 1 mol şekerin kütleleri neden farklıdır?', 'Mol kütleleri farklıdır; her biri aynı sayıda (6,02·10²³) tanecik içerir ama taneciklerin kütleleri farklıdır.'),
     ('18 g suda kaç tane H atomu vardır?', '1 mol H₂O → 2 mol H atomu = 1,204·10²⁴ tane.'),
     ('2,7 g alüminyum folyoda kaç atom vardır?', '0,1 mol × 6,02·10²³ = 6,02·10²² atom.')],
    tablo=(['Madde', 'Mol kütlesi (g/mol)', 'Tartılan kütle (g)', 'Mol', 'Tanecik sayısı'], [['Su', '18', '18', '', ''], ['Tuz', '58,5', '58,5', '', ''], ['Şeker', '342', '342', '', ''], ['Alüminyum', '27', '2,7', '', '']]),
    sure='20 dk')]

V['1.1.4'] = [F(
    'Kütlenin Korunumu',
    'Kapalı ve açık kapta gerçekleşen bir tepkimede toplam kütleyi ölçerek kütlenin korunumunu göstermek ve denkleştirmenin anlamını kavramak.',
    ['sirke', 'karbonat', 'pet şişe', 'balon', 'terazi', 'huni'],
    [GOZLUK],
    ['Huni ile balonun içine bir çay kaşığı karbonat koyunuz; şişeye 50 mL sirke koyunuz.', 'Balonu karbonat dökülmeden şişenin ağzına geçirip düzeneği tartınız.', 'Balonu kaldırıp karbonatı sirkeye dökünüz; tepkime bitince düzeneği yeniden tartınız.', 'Deneyi balonsuz (açık kapta) tekrarlayıp önceki ve sonraki kütleleri karşılaştırınız.'],
    [('Kapalı ve açık düzeneklerde kütle nasıl değişti? Neden?', 'Kapalı kapta kütle değişmez; açık kapta oluşan CO₂ havaya kaçtığı için kütle azalır.'),
     ('NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂ denkleminde her atomun sayısını iki tarafta karşılaştırınız.', 'C: 3–3, H: 5–5, O: 5–5, Na: 1–1; denklem denktir.'),
     ('Denklemleri denkleştirirken formüllerdeki alt indisler neden değiştirilmez?', 'Alt indis değişirse madde değişir (H₂O yerine H₂O₂ başka bir maddedir); yalnızca katsayılar değiştirilir.')],
    tablo=(['Düzenek', 'Önceki kütle (g)', 'Sonraki kütle (g)', 'Fark (g)'], [['Kapalı (balonlu)', '', '', ''], ['Açık', '', '', '']]),
    sure='25 dk')]

V['1.1.5'] = [F(
    'Sınırlayıcı Bileşeni Balonlarla Bulma',
    'Sabit miktar sirkeye artan miktarlarda karbonat ekleyerek oluşan gaz miktarını karşılaştırmak ve sınırlayıcı bileşeni belirlemek.',
    ['5 adet aynı boy balon', '5 adet aynı pet şişe', 'sirke', 'karbonat', 'terazi', 'huni', 'mezura'],
    [GOZLUK],
    ['Her şişeye 50 mL sirke koyunuz.', 'Balonlara sırasıyla 1, 2, 3, 4 ve 5 g karbonat koyunuz.', 'Balonları şişelere geçirip karbonatı aynı anda sirkeye dökünüz.', 'Tepkime bitince balonların çevresini mezura ile ölçüp tabloya yazınız; şişelerin dibinde artan karbonat olup olmadığını gözleyiniz.'],
    [('Balon büyüklüğü hangi noktadan sonra artmadı? Bunun nedeni nedir?', 'Sirkedeki asetik asit tükendiğinde gaz oluşumu durur; daha fazla karbonat eklemek balonu büyütmez. Bu noktadan sonra sınırlayıcı bileşen sirkedir.'),
     ('İlk şişelerde sınırlayıcı bileşen hangisiydi?', 'Karbonat; tamamen tükenmiş, sirke artmıştır.'),
     ('Sınırlayıcı bileşenin sanayide neden önemli olduğunu açıklayınız.', 'Pahalı ya da istenen maddenin tamamen kullanılması için ucuz bileşen fazla alınır; ürün miktarı sınırlayıcı bileşene göre hesaplanır.')],
    tablo=(['Şişe', 'Karbonat (g)', 'Balon çevresi (cm)', 'Artan madde'], [['1', '1', '', ''], ['2', '2', '', ''], ['3', '3', '', ''], ['4', '4', '', ''], ['5', '5', '', '']]),
    sure='30 dk')]

V['1.2.1'] = [F(
    'Gazlar Sıkıştırılabilir mi?',
    'Ağzı kapalı şırıngalarda hava, su ve kumun sıkıştırılabilirliğini karşılaştırarak gazların tanecikli yapısını yorumlamak.',
    ['3 adet büyük plastik şırınga (ucu kapatılabilen)', 'su', 'kuru kum', 'balon', 'sıcak ve soğuk su'],
    [],
    ['Şırıngalardan birini hava, birini su, birini kumla doldurup uçlarını parmağınızla kapatınız.', 'Pistonları itip hacimdeki azalmayı gözleyiniz.', 'Ağzına balon geçirilmiş boş bir şişeyi önce sıcak suya, sonra soğuk suya koyup balonu gözleyiniz.'],
    [('En kolay hangi şırınga sıkıştırıldı? Tanecikli modelle açıklayınız.', 'Hava; gaz tanecikleri arasında çok fazla boşluk vardır, tanecikler birbirine yaklaştırılabilir.'),
     ('Sıcak suda balonun şişmesi gaz taneciklerinin hangi özelliğiyle ilgilidir?', 'Isınan gaz taneciklerinin hızları ve çarpma etkileri artar; gaz genleşir.'),
     ('Bir gazın durumunu belirleyen dört değişken nedir?', 'Basınç, hacim, sıcaklık ve madde miktarı (mol).')],
    sure='20 dk')]

V['1.2.2-A'] = [F(
    'Şırınga ile Boyle Yasası',
    'Sabit sıcaklıkta belirli miktar havanın basınç–hacim ilişkisini ağırlıklarla inceleyerek Boyle yasasına ulaşmak.',
    ['60 mL plastik şırınga (ucu kapatılmış)', 'şırınganın pistonuna oturan karton tabla', 'eşit kütleli kitaplar (4–5 adet)', 'destek'],
    [],
    ['Şırıngaya 50 mL hava çekip ucunu sıkıca kapatınız ve dik olarak sabitleyiniz.', 'Pistonun üzerine karton tablayı koyup hacmi okuyunuz.', 'Tablaya birer birer kitap ekleyerek her seferinde hacmi okuyunuz.', 'Kitap sayısını basınçla orantılı kabul ederek (P ∝ 1 + kitap sayısı × k) P·V çarpımını hesaplayınız.'],
    [('Kitap sayısı arttıkça hacim nasıl değişti?', 'Hacim azaldı; basınç arttıkça hacim küçülür.'),
     ('Basınç–hacim grafiğinin şekli nasıldır? P·V çarpımı için ne söylenebilir?', 'Hiperbol şeklindedir; P·V yaklaşık sabittir (Boyle yasası).'),
     ('Deneyde sabit tutulması gereken değişkenler nelerdir?', 'Sıcaklık ve gaz miktarı (şırınganın ucunun hava kaçırmaması).')],
    tablo=(['Kitap sayısı', '0', '1', '2', '3', '4'], [['Hacim (mL)', '', '', '', '', '']]),
    sure='25 dk')]

V['1.2.2-B'] = [F(
    'Sıcaklık–Basınç ve Hacim İlişkisi',
    'Isıtılan ve soğutulan kapalı gaz örneklerinde basınç ve hacim değişimini gözlemlemek.',
    ['cam şişe', 'balon', 'şırınga (ucu kapatılmış)', 'sıcak su (≈ 70 °C)', 'buzlu su', 'termometre', 'cetvel'],
    [ISI],
    ['Şırıngaya 30 mL hava çekip ucunu kapatınız; önce buzlu suya, sonra sıcak suya daldırıp hacmi okuyunuz.', 'Ağzına balon geçirilmiş şişeyi buzlu ve sıcak suya koyup balonun boyutunu karşılaştırınız.', 'Su sıcaklıklarını Kelvin\'e çevirip V/T oranlarını hesaplayınız.'],
    [('Sıcaklık arttıkça gazın hacmi nasıl değişti? V/T oranı için ne söylenebilir?', 'Hacim arttı; sabit basınçta V/T yaklaşık sabittir (Charles yasası).'),
     ('Ağzı sıkıca kapatılmış bir kap ısıtılırsa gazın basıncı neden artar?', 'Hacim değişemediği için hızlanan tanecikler çeperlere daha sık ve şiddetli çarpar (Gay-Lussac yasası).'),
     ('Sprey kutularının neden ateşe atılmaması gerektiğini açıklayınız.', 'Isınan gazın basıncı artar ve kutu patlayabilir.')],
    tablo=(['Ortam', 'Sıcaklık (°C)', 'Sıcaklık (K)', 'Hacim (mL)', 'V/T'], [['Buzlu su', '', '', '', ''], ['Oda', '', '', '', ''], ['Sıcak su', '', '', '', '']]),
    sure='25 dk')]

V['1.2.3'] = [F(
    'Bir Gazın Mol Kütlesini Bulma',
    'Çakmak gazının kütle kaybını ve su altında toplanan hacmini ölçerek ideal gaz denklemiyle mol kütlesini hesaplamak.',
    ['çakmak (bütan)', 'su dolu dereceli silindir ve küvet', 'terazi (0,01 g)', 'termometre', 'barometre değeri (ya da 1 atm kabulü)', 'kâğıt havlu'],
    [GOZLUK, 'Deneyi açık alevden uzakta, iyi havalandırılan bir ortamda yapınız; çakmağı yakmayınız.'],
    ['Çakmağı tartınız.', 'Çakmağı su altında tutup gazını ters çevrilmiş su dolu silindire yaklaşık 100 mL toplanana kadar bırakınız.', 'Çakmağı iyice kurulayıp yeniden tartınız.', 'Toplanan gazın hacmini, suyun sıcaklığını ve basıncı kaydediniz.', 'n = PV/RT ile mol sayısını, M = m/n ile mol kütlesini hesaplayınız.'],
    [('Bulduğunuz mol kütlesini bütanın (C₄H₁₀) mol kütlesiyle (58 g/mol) karşılaştırınız.', 'Örneğin 0,24 g gaz 1 atm ve 298 K\'de 100 mL hacim kaplıyorsa n ≈ 0,0041 mol, M ≈ 58 g/mol bulunur.'),
     ('Sonucun gerçek değerden farklı çıkmasının nedenleri neler olabilir?', 'Çakmağın tam kurulanmaması, gazın bir kısmının suda çözünmesi ya da kaçması, su buharı basıncının hesaba katılmaması.'),
     ('Gerçek gazlar hangi koşullarda ideal gaz gibi davranır?', 'Düşük basınç ve yüksek sıcaklıkta.')],
    tablo=(['Ölçüm', 'Değer'], [['İlk kütle (g)', ''], ['Son kütle (g)', ''], ['Gaz kütlesi (g)', ''], ['Gaz hacmi (L)', ''], ['Sıcaklık (K)', ''], ['Mol kütlesi (g/mol)', '']]),
    sure='30 dk')]

V['1.2.4'] = [F(
    'Hangi Koku Önce Gelir?',
    'Farklı mol kütleli gazların yayılma hızlarını karşılaştırarak Graham yasasını gözlemlemek.',
    ['parfüm', 'amonyaklı cam temizleyici', 'sirke', 'üç pamuk', 'kronometre', 'sınıf içinde eşit uzaklıkta duran üç öğrenci'],
    ['Kokuları doğrudan burnunuza yaklaştırarak koklamayınız.'],
    ['Pamukları maddelerle ıslatıp sınıfın bir köşesinde aynı anda açığa koyunuz.', 'Eşit uzaklıkta (örneğin 4 m) duran öğrenciler kokuyu ilk hissettikleri anı kaydetsin.', 'Ölçümleri sınıf ortalaması alarak karşılaştırınız.', 'Öğretmeniniz uzun bir cam boruda NH₃ ve HCl ile beyaz halka deneyini gösterebilir.'],
    [('Hangi koku daha önce algılandı? Mol kütleleriyle ilişkilendiriniz (NH₃: 17, CH₃COOH: 60 g/mol).', 'Amonyak; mol kütlesi küçük olan gaz daha hızlı yayılır.'),
     ('Cam boru deneyinde beyaz halka neden HCl ucuna daha yakın oluşur?', 'NH₃ HCl\'den daha hızlı yayıldığı için daha uzun yol alır; v(NH₃)/v(HCl) = √(36,5/17) ≈ 1,47.'),
     ('Difüzyon ile efüzyon arasındaki farkı yazınız.', 'Difüzyon bir gazın başka bir gaz içinde yayılmasıdır; efüzyon gazın küçük bir delikten boşluğa kaçmasıdır.')],
    tablo=(['Koku', '1. öğrenci (s)', '2. öğrenci (s)', '3. öğrenci (s)', 'Ortalama (s)'], [['Amonyak', '', '', '', ''], ['Parfüm', '', '', '', ''], ['Sirke', '', '', '', '']]),
    sure='20 dk')]

V['2.1.1'] = [F(
    'Renkli Kristallerin Çözünmesi',
    'Bir maddenin suda çözünme sürecini gözlemleyip tanecik modeliyle açıklamak.',
    ['bakır(II) sülfat kristali', 'sıcak ve soğuk su', 'iki beher', 'cımbız', 'beyaz kâğıt'],
    [GOZLUK, ATIK],
    ['İki behere eşit hacimde soğuk ve sıcak su koyup beherleri beyaz kâğıt üzerine yerleştiriniz.', 'Her behere cımbızla birer kristal bırakınız; karıştırmayınız.', 'Renkli bölgenin yayılmasını 1, 3 ve 5. dakikalarda çiziniz.'],
    [('Kristal karıştırılmadan neden zamanla çözünüp yayıldı?', 'Su molekülleri kristal yüzeyindeki tanecikleri çekerek koparır, tanecikler sürekli hareketle su içinde dağılır.'),
     ('Sıcak suda çözünme neden daha hızlıdır?', 'Su moleküllerinin kinetik enerjisi büyüktür; tanecikler daha hızlı ayrılır ve yayılır.'),
     ('Bakır sülfatın suda çözünmesini tanecik düzeyinde çiziniz.', 'Cu²⁺ ve SO₄²⁻ iyonları kristalden ayrılır; Cu²⁺\'nın çevresini suyun O uçları, SO₄²⁻\'nin çevresini H uçları sarar (hidratasyon).')],
    sure='15 dk')]

V['2.1.2'] = [F(
    'Kim Kimde Çözünür?',
    'Polar ve apolar maddelerin su ve yağ (apolar) içinde çözünürlüğünü test ederek "benzer benzeri çözer" ilkesine ulaşmak.',
    ['su', 'ayçiçek yağı', 'kolonya (etanol)', 'tuz', 'şeker', 'pastel boya talaşı', 'deney tüpleri', 'spatül'],
    [GOZLUK, 'Kolonyayı ateşten uzak tutunuz.'],
    ['Altı tüpe su, altı tüpe yağ koyunuz.', 'Her çözücüye ayrı ayrı tuz, şeker, kolonya, yağ (suya), su (yağa) ve pastel talaşı ekleyip çalkalayınız.', 'Çözünme durumunu tabloya yazınız.'],
    [('Suda çözünen maddelerin ortak özelliği nedir?', 'İyonik ya da polar olmaları; su da polardır.'),
     ('Yağda çözünen maddelerin ortak özelliği nedir?', 'Apolar olmaları.'),
     ('Yağlı bir lekeyi suyla çıkarmak neden zordur? Sabun nasıl yardımcı olur?', 'Yağ apolar, su polardır; aralarında güçlü etkileşim oluşmaz. Sabunun apolar ucu yağı, polar ucu suyu tutarak yağı uzaklaştırır.')],
    tablo=(['Çözünen', 'Suda', 'Yağda'], [['Tuz', '', ''], ['Şeker', '', ''], ['Kolonya', '', ''], ['Yağ / Su', '', ''], ['Pastel talaşı', '', '']]),
    sure='25 dk')]

V['2.1.3'] = [F(
    'Hangi Çözelti Elektriği İletir?',
    'Çözeltilerin elektrik iletkenliğini test ederek iyonik ve moleküler çözünmeyi ayırt etmek.',
    ['iletkenlik test düzeneği (pil, LED, iki elektrot)', 'saf su', 'tuz', 'şeker', 'sirke', 'kolonya', 'beherler'],
    [GOZLUK],
    ['Beherlere saf su, tuzlu su, şekerli su, sirke ve kolonyalı su koyunuz.', 'Elektrotları sırayla daldırıp LED\'i gözleyiniz; her ölçümden sonra elektrotları durulayınız.', 'Sonuçları tabloya kaydediniz.'],
    [('Tuzlu su neden iletken, şekerli su neden iletken değildir?', 'Tuz suda iyonlarına ayrışır (iyonik çözünme); şeker molekülleri bozulmadan dağılır (moleküler çözünme), iyon oluşmaz.'),
     ('Sirkenin zayıf iletkenliği neyi gösterir?', 'Asetik asit suda kısmen iyonlaşır; az sayıda iyon oluşur.'),
     ('Tuzun suda çözünmesini sembolik olarak gösteriniz.', 'NaCl(k) → Na⁺(suda) + Cl⁻(suda)')],
    tablo=(['Çözelti', 'LED durumu', 'İyonik / Moleküler'], [['Saf su', '', ''], ['Tuzlu su', '', ''], ['Şekerli su', '', ''], ['Sirke', '', ''], ['Kolonyalı su', '', '']]),
    sure='20 dk')]

V['2.1.4'] = [F(
    'Tuzun Çözünürlüğünü Belirleme',
    'Belirli sıcaklıkta 100 g suda çözünebilen en fazla tuz miktarını deneysel olarak bulmak.',
    ['sofra tuzu', 'su', 'beher', 'terazi', 'baget', 'termometre', 'çay kaşığı'],
    [GOZLUK],
    ['Behere 50 g su koyup sıcaklığını ölçünüz.', 'Önceden tartılmış tuzdan bir çay kaşığı ekleyip tamamen çözünene kadar karıştırınız.', 'Dipte çözünmeyen tuz kalana kadar eklemeye devam ediniz.', 'Kalan tuzu tartıp çözünen toplam tuz miktarını bulunuz ve 100 g su için hesaplayınız.'],
    [('Bulduğunuz değeri tablo değeriyle (20 °C\'de ≈ 36 g/100 g su) karşılaştırınız.', 'Örneğin 50 g suda 18 g tuz çözünmüşse 100 g su için 36 g bulunur.'),
     ('Karıştırma hızını artırmak çözünürlüğü değiştirir mi?', 'Hayır; yalnızca çözünme hızını artırır. Çözünürlük madde türüne ve sıcaklığa bağlıdır.'),
     ('Çözünürlük neden ayırt edici bir özelliktir?', 'Aynı koşullarda her maddenin çözünürlüğü kendine özgüdür.')],
    tablo=(['Ölçüm', 'Değer'], [['Su kütlesi (g)', '50'], ['Sıcaklık (°C)', ''], ['Başlangıçtaki tuz (g)', ''], ['Kalan tuz (g)', ''], ['Çözünen tuz (g)', ''], ['100 g su için çözünürlük', '']]),
    sure='25 dk')]

V['2.1.5'] = [F(
    'Sıcaklık ve Basıncın Çözünürlüğe Etkisi',
    'Katı bir tuzun ve bir gazın çözünürlüğünün sıcaklıkla değişimini incelemek.',
    ['şeker', 'iki beher', 'sıcak ve soğuk su', 'iki şişe soğuk ve ılık gazlı içecek (kapalı)', 'iki balon', 'terazi', 'baget'],
    [ISI],
    ['Eşit miktarda (50 g) sıcak ve soğuk suya dipte katı kalana kadar şeker ekleyip çözünen miktarları karşılaştırınız.', 'Soğuk ve ılık gazlı içecek şişelerinin kapaklarını açıp hemen ağızlarına balon geçiriniz.', '5 dakika sonra balonların büyüklüğünü karşılaştırınız.'],
    [('Sıcaklık arttıkça şekerin çözünürlüğü nasıl değişti?', 'Arttı; şekerin çözünmesi endotermiktir.'),
     ('Ilık gazlı içecekte balon neden daha çok şişti?', 'Gazların sudaki çözünürlüğü sıcaklık arttıkça azalır; daha fazla CO₂ çözeltiden ayrılır.'),
     ('Kapak açılınca gazlı içeceğin köpürmesini basınçla açıklayınız.', 'Kapalı şişede basınç yüksektir; açılınca basınç düşer, CO₂\'nin çözünürlüğü azalır ve gaz kabarcıklar hâlinde çıkar.')],
    tablo=(['Deney', 'Soğuk', 'Sıcak / Ilık'], [['Çözünen şeker (g/50 g su)', '', ''], ['Balon çevresi (cm)', '', '']]),
    sure='30 dk')]

V['2.1.6'] = [F(
    'Aşırı Doymuş Çözelti ve Kristallenme',
    'Doymamış, doymuş ve aşırı doymuş çözeltileri hazırlayarak ayırt etmek.',
    ['sodyum asetat ya da şeker', 'su', 'beher', 'ısıtıcı', 'baget', 'temiz kavanoz', 'iplik'],
    [GOZLUK, ISI],
    ['Behere 50 mL su koyup az miktarda şeker çözünüz (doymamış).', 'Dipte katı kalana kadar şeker ekleyiniz (doymuş).', 'Çözeltiyi ısıtıp daha fazla şeker çözünüz; sarsmadan yavaşça oda sıcaklığına soğutunuz (aşırı doymuş).', 'Soğuyan çözeltiye bir şeker kristali bağlanmış iplik sarkıtıp birkaç gün boyunca kristal oluşumunu gözleyiniz.'],
    [('Bir çözeltinin doymamış, doymuş ya da aşırı doymuş olduğunu nasıl anlarsınız?', 'Bir miktar daha çözünen eklenir: çözünürse doymamış, dibe çökerse doymuş, eklenen kristal üzerinde hızla kristallenme başlarsa aşırı doymuş.'),
     ('Aşırı doymuş çözelti neden kararsızdır?', 'Çözünürlüğün üzerinde çözünen içerir; küçük bir kristal ya da sarsıntı fazla maddenin kristallenmesini başlatır.'),
     ('Seyreltik ve derişik çözeltileri doygunlukla karıştırmamak neden önemlidir?', 'Derişik bir çözelti doymamış olabilir; seyreltik/derişik çözünen miktarını, doymuş/doymamış çözünürlükle ilişkisini anlatır.')],
    sure='Ders + birkaç gün gözlem')]

V['2.1.7'] = [F(
    'Belirli Derişimde Çözelti Hazırlama',
    'Molaritesi bilinen bir çözelti hazırlamak ve seyreltme yaparak derişimin nasıl değiştiğini gözlemlemek.',
    ['bakır(II) sülfat pentahidrat (CuSO₄·5H₂O, 250 g/mol)', '100 mL ölçülü balon', 'terazi', 'huni', 'saf su', '10 mL pipet ve puar', 'beherler'],
    [GOZLUK, 'Bakır sülfat zararlıdır; elle dokunmayınız.', ATIK],
    ['0,1 M 100 mL çözelti için gereken kütleyi hesaplayınız (n = M·V, m = n·M).', 'Hesapladığınız kütleyi (2,5 g) tartıp az suda çözünüz ve ölçülü balonda 100 mL\'ye tamamlayınız.', 'Bu çözeltiden 10 mL alıp 100 mL\'ye seyrelterek 0,01 M çözelti hazırlayınız.', 'İki çözeltinin renklerini beyaz zemin önünde karşılaştırınız.'],
    [('0,1 M 100 mL çözelti için neden 2,5 g tartılır?', 'n = 0,1 × 0,1 = 0,01 mol; m = 0,01 × 250 = 2,5 g.'),
     ('Seyreltmede çözünen mol sayısı değişir mi? Hesapla gösteriniz.', 'Değişmez: M₁V₁ = M₂V₂ → 0,1 × 10 = 0,01 × 100.'),
     ('Renk koyuluğu ile derişim arasındaki ilişkiyi yazınız.', 'Derişim arttıkça birim hacimdeki renkli iyon sayısı artar, renk koyulaşır.')],
    sure='30 dk')]

V['2.1.8'] = [F(
    'Tuz Suyun Donma ve Kaynama Noktasını Değiştirir mi?',
    'Saf su ile tuzlu suyun donma ve kaynama noktalarını karşılaştırarak koligatif özellikleri incelemek.',
    ['buz', 'kaba tuz', 'iki beher', 'termometre (−20 °C ile 110 °C arası)', 'ısıtıcı', 'deney tüpü', 'su'],
    [GOZLUK, ISI],
    ['Bir behere buz, diğerine buz ve tuz karışımı koyup sıcaklıklarını ölçünüz.', 'Tuzlu buz karışımına su dolu bir deney tüpü daldırıp suyun donmasını gözleyiniz.', 'Bir behere saf su, diğerine 100 mL suda 10 g tuz çözülmüş su koyup ısıtınız; kaynama sıcaklıklarını ölçünüz.'],
    [('Tuzlu buzun sıcaklığı neden 0 °C\'nin altına indi?', 'Tuz suyun donma noktasını düşürür; buz erirken ortamdan ısı alır ve karışım soğur.'),
     ('Tuzlu suyun kaynama noktası saf suya göre nasıl değişti?', 'Yükseldi; çözünen tanecikler buhar basıncını düşürür.'),
     ('Kışın yollara tuz serpilmesinin nedeni nedir? Aynı miktarda CaCl₂ neden daha etkilidir?', 'Tuz buzun donma noktasını düşürerek erimesini sağlar. CaCl₂ suda 3 iyon oluşturduğundan (NaCl 2) aynı mol başına daha fazla tanecik verir.')],
    tablo=(['Ölçüm', 'Saf su', 'Tuzlu su'], [['Donma / erime sıcaklığı (°C)', '', ''], ['Kaynama sıcaklığı (°C)', '', '']]),
    sure='35 dk')]

V['3.1.1'] = [F(
    'Aynı Deney, İki Ölçek',
    'Aynı tepkimeyi makro ve mikro ölçekte yaparak kullanılan madde, su ve oluşan atık miktarlarını karşılaştırmak.',
    ['sirke', 'karbonat', 'kırmızı lahana indikatörü', 'beher (makro)', 'kuyucuklu plaka ya da şişe kapakları (mikro)', 'damlalık', 'dereceli silindir'],
    [GOZLUK],
    ['Makro: behere 50 mL indikatörlü sirke koyup 5 g karbonat ekleyiniz; renk değişimini ve gaz çıkışını gözleyiniz.', 'Mikro: bir kuyucuğa 10 damla indikatörlü sirke koyup bir çimdik karbonat ekleyiniz.', 'Her iki ölçekte kullanılan madde, temizlik suyu ve atık miktarlarını tabloya yazınız.'],
    [('İki ölçekte gözlemler farklı mıydı?', 'Gözlemler (renk değişimi, köpürme) aynıdır; yalnızca miktarlar farklıdır.'),
     ('Mikro ölçekli deneylerin avantajları nelerdir?', 'Daha az kimyasal ve su kullanılır, atık azalır, daha güvenli ve ucuzdur.'),
     ('Mikro ölçekli deneylerin sınırlılıkları nelerdir?', 'Bazı gözlemler daha zor yapılır, hassas ölçüm araçları gerekebilir.')],
    tablo=(['Ölçüt', 'Makro', 'Mikro'], [['Sirke (mL)', '', ''], ['Karbonat (g)', '', ''], ['Temizlik suyu (mL)', '', ''], ['Atık (mL)', '', '']]),
    sure='25 dk')]

V['3.1.2'] = [F(
    'Asit Yağmurunun Etkileri',
    'Asidik suyun mermer, metal ve bitkiler üzerindeki etkisini model deneyle incelemek.',
    ['sirke (asit yağmuru modeli)', 'musluk suyu', 'mermer ya da tebeşir parçaları', 'çivi', 'iki saksı tere tohumu', 'şeffaf bardaklar', 'pH kâğıdı'],
    [GOZLUK],
    ['İki bardağın birine sirke, diğerine musluk suyu koyup pH değerlerini ölçünüz.', 'Her bardağa birer tebeşir parçası ve çivi koyunuz; 1 hafta boyunca gözleyiniz.', 'Tere tohumlarından birini sulandırılmış sirkeyle, diğerini musluk suyuyla sulayıp büyümelerini karşılaştırınız.'],
    [('Tebeşir (CaCO₃) sirkede neden köpürerek aşındı?', 'Asit karbonatla tepkimeye girip CO₂ oluşturur: CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂.'),
     ('Asit yağmurlarına neden olan gazlar hangileridir, nereden kaynaklanır?', 'SO₂ ve NOₓ; fosil yakıtların yakılması, termik santraller ve taşıtlar.'),
     ('Asit yağmurlarını azaltmak için iki öneri yazınız.', 'Kükürt oranı düşük yakıt kullanmak, bacalara filtre takmak, yenilenebilir enerji ve toplu taşımayı yaygınlaştırmak.')],
    tablo=(['Gözlem', 'Sirke', 'Musluk suyu'], [['pH', '', ''], ['Tebeşir (1 hafta sonra)', '', ''], ['Çivi (1 hafta sonra)', '', ''], ['Tere boyu (cm)', '', '']]),
    sure='1 hafta')]

yaz('10', V)
