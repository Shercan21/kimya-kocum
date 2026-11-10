from ortak import F, GOZLUK, ATIK, ISI, yaz

V = {}

V['1.1.1'] = [F(
    'Çözünürken Isınan ve Soğuyan Tuzlar',
    'Bazı tuzların suda çözünmesi sırasında ısı alışverişini kalorimetre ile ölçerek olayları endotermik ve ekzotermik olarak sınıflandırmak.',
    ['iç içe geçirilmiş iki strafor bardak ve kapağı', 'termometre', 'dereceli silindir', 'terazi', 'amonyum nitrat (NH₄NO₃)', 'kalsiyum klorür (CaCl₂)', 'saf su', 'baget', 'spatül'],
    [GOZLUK, 'Tuzları tatmayınız, koklamayınız; elinize temas ederse bol suyla yıkayınız.', ATIK],
    ['Strafor bardaklara 50 mL saf su koyup kapağı kapatınız; termometreyi kapaktaki delikten suya daldırınız.', 'Suyun sıcaklığı sabitlenince ilk sıcaklığı tabloya yazınız.', '5 g amonyum nitratı tartıp suya ekleyiniz, kapağı kapatıp baget ile karıştırınız.', 'Sıcaklığı 30 saniyede bir okuyarak en düşük ya da en yüksek değeri belirleyiniz ve tabloya yazınız.', 'Aynı işlemleri temiz bardaklarla 5 g kalsiyum klorür için tekrarlayınız.'],
    [('Hangi tuzun çözünmesi endotermik, hangisininki ekzotermiktir? Gerekçenizi yazınız.', 'Amonyum nitrat çözünürken sıcaklık düşer; çözünme ortamdan ısı alır, endotermiktir. Kalsiyum klorür çözünürken sıcaklık artar; ısı verir, ekzotermiktir.'),
     ('Suyun aldığı ya da verdiği ısıyı q = m·c·ΔT ile hesaplayınız (c = 4,18 J/g·°C).', 'Örneğin 55 g çözelti 7 °C soğuduysa q = 55·4,18·7 ≈ 1610 J; çözünme bu kadar ısıyı sudan almıştır.'),
     ('Strafor bardak kullanılmasının nedeni nedir? Cam beher kullanılsaydı sonuç nasıl etkilenirdi?', 'Strafor ısıyı iyi yalıttığı için çevreyle ısı alışverişi azalır. Cam beherde ısı kaybı ya da kazancı olur, ölçülen sıcaklık değişimi gerçek değerden küçük çıkar.'),
     ('Anlık soğuk kompreslerde hangi tuz kullanılabilir? Neden?', 'Amonyum nitrat gibi endotermik çözünen bir tuz; suyla karışınca ortamdan ısı alarak soğutur.')],
    tablo=(['Tuz', 'İlk sıcaklık (°C)', 'Son sıcaklık (°C)', 'ΔT (°C)', 'Endotermik / Ekzotermik'], [['NH₄NO₃', '', '', '', ''], ['CaCl₂', '', '', '', '']]),
    sure='30 dk')]

V['1.1.2'] = [F(
    'Besinlerin ve Yakıtların Enerjisini Karşılaştırma',
    'Farklı maddeler yandığında suya aktarılan ısıyı ölçerek enerji kaynağı olma potansiyellerini karşılaştırmak.',
    ['fındık, ceviz, kraker parçası (eşit kütlede)', 'ispirto lambası (etanol)', 'boş metal içecek kutusu', 'termometre', 'dereceli silindir', 'iğne ve mantar tıpa', 'kibrit', 'terazi', 'destek çubuğu ve kıskaç'],
    [GOZLUK, ISI, 'Yanıcı maddeleri alevden uzak tutunuz; masada yangın battaniyesi bulunsun.', 'Fındık alerjisi olan arkadaşlarınız besinlere dokunmamalıdır.'],
    ['Metal kutuya 100 mL su koyup kutuyu destek çubuğuna asınız ve ilk sıcaklığı ölçünüz.', 'Bir fındığı tartıp iğneye takınız, iğneyi mantar tıpaya saplayınız.', 'Fındığı tutuşturup hemen kutunun altına yerleştiriniz; tamamen yanana kadar bekleyiniz.', 'Suyun ulaştığı en yüksek sıcaklığı tabloya yazınız.', 'Kutudaki suyu yenileyerek aynı işlemleri ceviz ve kraker için tekrarlayınız.'],
    [('Suya aktarılan ısıyı her madde için hesaplayıp gram başına enerjiyi bulunuz.', 'q = 100·4,18·ΔT; bulunan değer maddenin kütlesine bölünür. Yağ oranı yüksek fındık ve ceviz genellikle krakerden fazla enerji verir.'),
     ('Bulduğunuz değerler besin etiketlerindeki değerlerden neden küçüktür?', 'Isının bir kısmı havaya ve kutuya kaçar, yanma eksik olabilir; ölçülen enerji gerçek değerden küçüktür.'),
     ('Deneyde bağımsız, bağımlı ve kontrol değişkenleri nelerdir?', 'Bağımsız: maddenin türü; bağımlı: suyun sıcaklık artışı; kontrol: su miktarı, madde kütlesi, kutu ile alev arasındaki uzaklık.'),
     ('Bir yakıtın seçiminde yalnızca yanma ısısına bakmak yeterli midir?', 'Hayır; maliyet, güvenli depolama, çevreye etkisi ve yanma ürünleri de değerlendirilmelidir.')],
    tablo=(['Madde', 'Kütle (g)', 'İlk T (°C)', 'Son T (°C)', 'q (J)', 'q / kütle (J/g)'], [['Fındık', '', '', '', '', ''], ['Ceviz', '', '', '', '', ''], ['Kraker', '', '', '', '', '']]),
    sure='40 dk')]

V['1.1.3'] = [F(
    'Molekül Modelleriyle Bağ Kırma ve Bağ Oluşturma',
    'Molekül modelleri kullanarak tepkimelerde kırılan ve oluşan bağları belirlemek ve bağ enerjileriyle tepkime entalpisini hesaplamak.',
    ['molekül modeli seti (ya da farklı renkte oyun hamuru ve kürdan)', 'bağ enerjileri tablosu', 'kâğıt, kalem'],
    [],
    ['H₂ ve Cl₂ moleküllerini modellerle yapınız; her bağı bir kürdanla gösteriniz.', 'Kürdanları çıkararak bağları "kırınız" ve kırdığınız bağların türünü ve sayısını tabloya yazınız.', 'Atomları yeniden birleştirerek 2 HCl molekülü oluşturunuz; oluşan bağları tabloya yazınız.', 'Aynı işlemleri 2H₂ + O₂ → 2H₂O ve CH₄ + 2O₂ → CO₂ + 2H₂O tepkimeleri için tekrarlayınız.', 'Bağ enerjileri tablosunu kullanarak her tepkimenin ΔH değerini hesaplayınız.'],
    [('ΔH değerini hesaplarken kırılan bağlar neden "+", oluşan bağlar neden "−" alınır?', 'Bağ kırmak enerji gerektirir (sistem enerji alır); bağ oluşurken enerji açığa çıkar (sistem enerji verir).'),
     ('H₂ + Cl₂ → 2HCl tepkimesinin ΔH değerini bulunuz (H–H 436, Cl–Cl 243, H–Cl 432 kJ/mol).', 'ΔH = (436 + 243) − 2·432 = −185 kJ; tepkime ekzotermiktir.'),
     ('Modelinizde hangi durum gerçek tepkimeyi tam olarak yansıtmaz?', 'Gerçekte bağlar aynı anda ve aşamalı olarak kopup oluşabilir; model bunu tek tek adımlar şeklinde gösterir. Bağ enerjileri de ortalama değerlerdir.')],
    tablo=(['Tepkime', 'Kırılan bağlar', 'Oluşan bağlar', 'ΔH (kJ)'], [['H₂ + Cl₂ → 2HCl', '', '', ''], ['2H₂ + O₂ → 2H₂O', '', '', ''], ['CH₄ + 2O₂ → CO₂ + 2H₂O', '', '', '']]),
    sure='25 dk')]

V['1.1.4'] = [F(
    'Hess Yasasını Deneyle Doğrulama',
    'Katı NaOH\'ın HCl ile tepkimesinin ısısını iki farklı yoldan ölçerek tepkime entalpisinin izlenen yoldan bağımsız olduğunu göstermek.',
    ['strafor bardaklar ve kapak', 'termometre', 'dereceli silindir', 'terazi', 'katı NaOH (pul)', '0,5 M HCl çözeltisi', '0,5 M NaOH çözeltisi', 'saf su'],
    [GOZLUK, 'Katı NaOH yakıcıdır; spatülle alınız, elle dokunmayınız.', ATIK],
    ['Yol 1: 50 mL 0,5 M HCl\'ye 1,0 g katı NaOH ekleyip sıcaklık değişimini ölçünüz (tepkime A).', 'Yol 2a: 50 mL saf suya 1,0 g katı NaOH ekleyip sıcaklık değişimini ölçünüz (çözünme, tepkime B).', 'Yol 2b: 25 mL 0,5 M NaOH ile 25 mL 0,5 M HCl\'yi, ikisi de oda sıcaklığındayken karıştırıp sıcaklık değişimini ölçünüz (nötralleşme, tepkime C).', 'Her ölçümde q = m·c·ΔT ile ısıyı ve 1 mol NaOH için ΔH değerini hesaplayınız.'],
    [('Tepkime A\'nın ΔH değeri ile B ve C\'nin toplamını karşılaştırınız. Ne sonuca varıyorsunuz?', 'Deneysel hatalar dışında ΔH(A) ≈ ΔH(B) + ΔH(C) bulunur; tepkime ısısı izlenen yoldan bağımsızdır (Hess yasası).'),
     ('Sonuçlar arasındaki küçük farkların olası nedenleri nelerdir?', 'Çevreye ısı kaybı, termometre okuma hatası, NaOH\'ın havadan nem çekmesi, çözeltilerin özgül ısısının suyunkine eşit kabul edilmesi.'),
     ('Standart oluşum entalpileri tablosu kullanılarak ΔH nasıl hesaplanır?', 'ΔH° = ΣΔH°ol(ürünler) − ΣΔH°ol(tepkenler); elementlerin standart oluşum entalpisi sıfırdır.')],
    tablo=(['Ölçüm', 'İlk T (°C)', 'Son T (°C)', 'q (J)', 'ΔH (kJ/mol NaOH)'], [['A: NaOH(k) + HCl', '', '', '', ''], ['B: NaOH(k) çözünmesi', '', '', '', ''], ['C: NaOH(suda) + HCl', '', '', '', '']]),
    sure='40 dk')]

V['1.2.1'] = [F(
    'Kibrit Neden Kendiliğinden Yanmaz?',
    'Bir tepkimenin başlaması için aktivasyon enerjisinin gerekli olduğunu gözlemlemek.',
    ['kibrit kutusu', 'şeker küpü', 'bir tutam kül (ya da odun kömürü tozu)', 'metal kapak', 'maşa', 'çakmak'],
    [GOZLUK, ISI, 'Deneyi öğretmen gözetiminde, yanıcı maddelerden uzakta yapınız.'],
    ['Kibriti kutunun kenarına sürtmeden bir süre gözleyiniz; yanma olup olmadığını not ediniz.', 'Kibriti sürterek yakınız; neden şimdi yandığını düşününüz.', 'Şeker küpünü maşayla tutup çakmak alevine yaklaştırınız; yanıp yanmadığını gözleyiniz.', 'Başka bir şeker küpünün üzerine bir tutam kül sürüp aynı işlemi tekrarlayınız.'],
    [('Kibrit sürtünmeden neden yanmaz? Sürtünme neyi sağlar?', 'Kibritteki maddeler oksijenle tepkimeye girebilir ama aktivasyon enerjisi sağlanmadığı için tepkime başlamaz. Sürtünmenin oluşturduğu ısı aktivasyon enerjisini sağlar.'),
     ('Kül sürülmüş şeker neden daha kolay yanar?', 'Kül katalizör gibi davranarak tepkimenin daha düşük aktivasyon enerjili bir yoldan ilerlemesini sağlar.'),
     ('Çarpışma teorisine göre bir çarpışmanın ürün oluşturması için hangi iki koşul gerekir?', 'Taneciklerin aktivasyon enerjisine eşit ya da daha büyük kinetik enerjiyle ve uygun geometride (doğru yönelimle) çarpışması gerekir.')],
    sure='15 dk')]

V['1.2.2'] = [F(
    'Gaz Hacmiyle Tepkime Hızını İzleme',
    'Magnezyum ile hidroklorik asit tepkimesinde oluşan gazın hacmini zamanla ölçerek ortalama tepkime hızlarını hesaplamak.',
    ['magnezyum şerit (3 cm)', '1 M HCl çözeltisi', 'erlen ve delikli tıpa', 'cam boru ve hortum', 'su dolu dereceli silindir ve küvet (ters çevrilmiş silindirle gaz toplama düzeneği)', 'kronometre', 'zımpara'],
    [GOZLUK, 'HCl çözeltisi aşındırıcıdır; dökülürse öğretmeninize haber veriniz.', 'Oluşan hidrojen gazı yanıcıdır; ortamda açık alev bulundurmayınız.', ATIK],
    ['Magnezyum şeridi zımparalayarak oksit tabakasını temizleyiniz.', 'Erlene 25 mL 1 M HCl koyunuz ve gaz toplama düzeneğini hazırlayınız.', 'Magnezyumu erlene atıp tıpayı hemen kapatınız ve kronometreyi başlatınız.', 'Silindirde toplanan gaz hacmini 20 saniyede bir okuyup tabloya yazınız.', 'Gaz çıkışı bitince ölçümü sonlandırınız.'],
    [('Her zaman aralığı için ortalama hızı (mL/s) hesaplayınız. Hız zamanla nasıl değişti?', 'Ortalama hız = ΔV/Δt. Tepkime ilerledikçe HCl derişimi azaldığı için hız azalır.'),
     ('Hacim–zaman grafiğini çiziniz. Eğrinin eğimi neyi gösterir?', 'Eğim tepkime hızını gösterir; başta dik olan eğri zamanla yataylaşır.'),
     ('Bu tepkimenin hızını gaz hacmi dışında hangi yollarla ölçebilirdiniz?', 'Açık kapta kütle azalmasını, pH değişimini ya da magnezyumun tükenme süresini ölçerek.')],
    tablo=(['Zaman (s)', '0', '20', '40', '60', '80', '100', '120'], [['Gaz hacmi (mL)', '0', '', '', '', '', '', '']]),
    sure='30 dk')]

V['1.2.3'] = [F(
    'Tepkime Hızına Etki Eden Faktörler',
    'Sıcaklık, derişim, temas yüzeyi ve katalizörün tepkime hızına etkisini değişkenleri kontrol ederek incelemek.',
    ['efervesan tablet (4 adet)', 'havan ve tokmak', '4 adet beher', 'sıcak ve soğuk su', 'termometre', 'kronometre', '%3\'lük hidrojen peroksit (H₂O₂)', 'maya ya da çiğ patates dilimi', 'deterjan', 'iki deney tüpü'],
    [GOZLUK, 'Hidrojen peroksit cildi tahriş edebilir; eldiven kullanınız.', ATIK],
    ['Sıcaklık: Biri soğuk (≈10 °C), biri ılık (≈40 °C) eşit hacimde su bulunan iki behere birer tablet atıp tabletin tamamen çözünme süresini ölçünüz.', 'Temas yüzeyi: Oda sıcaklığında eşit hacimde su bulunan iki behere bir bütün tablet ve havanda toz hâline getirilmiş bir tablet atıp süreleri ölçünüz.', 'Katalizör: İki deney tüpüne 5 mL H₂O₂ ve birer damla deterjan koyunuz; birine bir tutam maya ekleyiniz. Köpük oluşumunu karşılaştırınız.', 'Gözlemlerinizi tabloya kaydediniz.'],
    [('Her deneyde değiştirdiğiniz ve sabit tuttuğunuz değişkenleri yazınız.', 'Örneğin sıcaklık deneyinde değiştirilen sıcaklık; sabit tutulan su miktarı, tablet türü ve tablet biçimidir.'),
     ('Sonuçları çarpışma teorisiyle açıklayınız.', 'Sıcaklık artınca aktivasyon enerjisini aşan tanecik sayısı artar. Toz hâlde temas yüzeyi büyür, çarpışma sayısı artar. Katalizör daha düşük aktivasyon enerjili bir yol sağlar.'),
     ('Mayadaki katalizör tepkimede harcanır mı? Nasıl kontrol edersiniz?', 'Harcanmaz; tepkime bittikten sonra aynı mayayı yeni H₂O₂ ile kullanınca tepkimenin yine hızlı gerçekleştiği görülür.')],
    tablo=(['Deney', 'Koşul 1', 'Süre / gözlem', 'Koşul 2', 'Süre / gözlem'], [['Sıcaklık', 'Soğuk su', '', 'Ilık su', ''], ['Temas yüzeyi', 'Bütün tablet', '', 'Toz tablet', ''], ['Katalizör', 'Mayasız', '', 'Mayalı', '']]),
    sure='35 dk')]

V['1.2.4'] = [F(
    'Derişimin Hıza Etkisi: Tiyosülfat Deneyi',
    'Sodyum tiyosülfat derişiminin tepkime hızına etkisini ölçerek tepkimenin bu maddeye göre derecesini tahmin etmek.',
    ['0,15 M sodyum tiyosülfat (Na₂S₂O₃) çözeltisi', '1 M HCl çözeltisi', 'saf su', '5 adet küçük beher', 'dereceli silindir', 'üzerine X işareti çizilmiş beyaz kâğıt', 'kronometre'],
    [GOZLUK, 'Tepkimede az miktarda kükürt dioksit gazı oluşur; ortamı havalandırınız ve kokuyu doğrudan koklamayınız.', ATIK],
    ['Beherleri X işaretli kâğıdın üzerine koyunuz.', 'Beherlere tablodaki miktarlarda tiyosülfat çözeltisi ve su koyarak toplam hacmi 50 mL yapınız.', 'Her behere 5 mL HCl ekleyip kronometreyi başlatınız; X işareti bulanıklık nedeniyle görünmez olana kadar geçen süreyi ölçünüz.', 'Hızı 1/süre olarak hesaplayıp tabloya yazınız.'],
    [('Tiyosülfat derişimi iki katına çıktığında hız yaklaşık kaç katına çıktı?', 'Yaklaşık iki katına çıkar; tepkime tiyosülfata göre birinci derecedir (r = k[S₂O₃²⁻]...).'),
     ('1/süre – derişim grafiği nasıl bir eğri verdi? Bu neyi gösterir?', 'Orijinden geçen doğruya yakın bir grafik; hız derişimle doğru orantılıdır.'),
     ('Hız denklemindeki üsler neden deneyle belirlenir?', 'Çok basamaklı tepkimelerde üsler denklemdeki katsayılara eşit olmayabilir; ancak deney verileriyle bulunabilir.')],
    tablo=(['Beher', 'Na₂S₂O₃ (mL)', 'Su (mL)', 'Süre (s)', '1/süre (s⁻¹)'], [['1', '50', '0', '', ''], ['2', '40', '10', '', ''], ['3', '30', '20', '', ''], ['4', '20', '30', '', ''], ['5', '10', '40', '', '']]),
    sure='35 dk')]

V['2.1.1'] = [F(
    'Mavi–Beyaz–Mavi: Tersinir Bir Değişim',
    'Bakır(II) sülfat pentahidratın ısıtılıp yeniden suyla buluşturulmasıyla tersinir tepkimeyi gözlemlemek.',
    ['mavi bakır(II) sülfat pentahidrat kristalleri', 'deney tüpü', 'tüp maşası', 'ispirto lambası', 'damlalık', 'saf su'],
    [GOZLUK, ISI, 'Bakır sülfat zararlıdır; elle dokunmayınız ve tatmayınız.', 'Isıtılan tüpün ağzını kimseye doğrultmayınız.', ATIK],
    ['Tüpe bir spatül ucu mavi kristal koyup rengini not ediniz.', 'Tüpü eğik tutarak hafifçe ısıtınız; renk değişimini ve tüpün ağzında biriken damlaları gözleyiniz.', 'Tüp soğuduktan sonra beyaz toza birkaç damla su ekleyiniz.', 'Renk değişimini ve tüpün sıcaklığını (elinizi tüpe yaklaştırarak) gözleyiniz.'],
    [('Isıtma ve su ekleme sırasında gerçekleşen değişimleri denklemle gösteriniz.', 'CuSO₄·5H₂O(k, mavi) ⇌ CuSO₄(k, beyaz) + 5H₂O(g); ileri yön ısı alır, geri yön ısı verir.'),
     ('Bu değişimin tersinir olduğunu gösteren kanıtlar nelerdir?', 'Isıtınca beyazlaşır ve su çıkar; su eklenince yeniden maviye döner ve ısı açığa çıkar.'),
     ('Açık kapta yapılan bu deneyde neden denge kurulmaz?', 'Isıtma sırasında su buharı ortamdan uzaklaşır; ileri ve geri tepkimeler aynı kapta aynı anda gerçekleşemez.')],
    sure='20 dk')]

V['2.1.2'] = [F(
    'Kapalı Kapta Buharlaşma ile Fiziksel Denge',
    'Ağzı kapalı ve açık kaplardaki suyun davranışını karşılaştırarak fiziksel dengeyi gözlemlemek.',
    ['iki özdeş kavanoz (biri kapaklı)', 'su', 'kalıcı kalem', 'cetvel'],
    [],
    ['İki kavanoza eşit hacimde su koyup su seviyesini kalemle işaretleyiniz.', 'Birinin kapağını kapatıp diğerini açık bırakınız ve kavanozları aynı ortama koyunuz.', 'Bir hafta boyunca her gün su seviyelerini ölçüp tabloya yazınız; kapaklı kavanozun iç yüzeyini gözleyiniz.'],
    [('Kapaklı kavanozda su seviyesi neden bir süre sonra değişmez?', 'Kapalı kapta buharlaşma ve yoğuşma hızları eşitlenir; fiziksel denge kurulur.'),
     ('Dengede buharlaşma durur mu? Kanıtınız nedir?', 'Durmaz; kapağın iç yüzeyinde sürekli damlacıklar oluşup geri akar, iki olay eşit hızla devam eder (dinamik denge).'),
     ('Fiziksel denge ile kimyasal dengeye birer örnek veriniz.', 'Fiziksel: kapalı kapta su ⇌ su buharı. Kimyasal: N₂O₄(g) ⇌ 2NO₂(g).')],
    tablo=(['Gün', '1', '2', '3', '4', '5', '6', '7'], [['Açık kap (cm)', '', '', '', '', '', '', ''], ['Kapalı kap (cm)', '', '', '', '', '', '', '']]),
    sure='1 hafta (günde 2 dk)')]

V['2.1.3'] = [F(
    'Bozuk Para Modeliyle Denge Sabiti',
    'İki grup arasında oranla yer değiştiren "tanecikler" modeliyle dengenin her iki yönden kurulabildiğini ve denge oranının başlangıç miktarından bağımsız olduğunu göstermek.',
    ['60 adet aynı renk düğme ya da bozuk para', 'iki kâse (A ve B)', 'kâğıt, kalem'],
    [],
    ['A kâsesine 60 düğme koyunuz, B boş kalsın.', 'Her turda A\'daki düğmelerin 1/4\'ünü B\'ye, B\'dekilerin 1/2\'sini A\'ya aynı anda aktarınız (kesirli sonuçları yuvarlayınız).', 'Her turdaki sayıları tabloya yazınız; sayılar değişmeyene kadar devam ediniz.', 'Deneyi bu kez B kâsesinde 60 düğme ile başlatıp tekrarlayınız.'],
    [('Her iki deneyde dengedeki B/A oranı kaç oldu?', 'Yaklaşık 0,5 (20 B, 40 A); aktarma oranlarının oranına (1/4 ÷ 1/2) eşittir.'),
     ('Bu modelde "denge sabiti" neye karşılık gelir? Başlangıç miktarına bağlı mı?', 'B/A oranı denge sabitine karşılık gelir; başlangıç miktarından bağımsızdır, yalnızca aktarma oranlarına (hız sabitlerine) bağlıdır.'),
     ('Gerçek sistemlerde Kc\'yi değiştiren tek etken nedir?', 'Sıcaklık.')],
    tablo=(['Tur', '0', '1', '2', '3', '4', '5', '6'], [['A', '60', '', '', '', '', '', ''], ['B', '0', '', '', '', '', '', '']]),
    sure='20 dk')]

V['2.1.4'] = [F(
    'Q ile Yön Tahmini: Demir(III) Tiyosiyanat',
    'Dengedeki bir sisteme madde ekleyerek tepkime oranının değiştiğini ve sistemin hangi yöne ilerleyeceğini tahmin edip gözlemlemek.',
    ['0,002 M demir(III) nitrat çözeltisi', '0,002 M potasyum tiyosiyanat (KSCN) çözeltisi', '0,1 M demir(III) nitrat', '0,1 M KSCN', 'katı sodyum fosfat (Na₃PO₄)', '4 deney tüpü', 'damlalık', 'beyaz zemin'],
    [GOZLUK, ATIK],
    ['20 mL Fe(NO₃)₃ ile 20 mL KSCN\'yi karıştırıp kırmızı renkli denge karışımını hazırlayınız ve dört tüpe eşit bölünüz.', '1. tüpü karşılaştırma için ayırınız.', '2. tüpe birkaç damla 0,1 M Fe(NO₃)₃, 3. tüpe birkaç damla 0,1 M KSCN ekleyiniz.', '4. tüpe bir spatül ucu Na₃PO₄ ekleyiniz (Fe³⁺ iyonlarını bağlar).', 'Renkleri karşılaştırma tüpüyle kıyaslayıp tabloya yazınız.'],
    [('Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ dengesinde Fe³⁺ eklenince Q nasıl değişir, sistem hangi yöne ilerler?', 'Q küçülür (Q < Kc); sistem ileri yönde ilerler, kırmızı renk koyulaşır.'),
     ('4. tüpteki renk değişimini Q ile açıklayınız.', 'Fe³⁺ derişimi azalınca Q büyür (Q > Kc); sistem geri yönde ilerler, renk açılır.'),
     ('Kc değeri bu deneylerde değişti mi? Neden?', 'Değişmedi; sıcaklık sabit kaldı. Değişen yalnızca Q\'dur.')],
    tablo=(['Tüp', 'Eklenen', 'Renk değişimi', 'Q – Kc ilişkisi', 'Kayma yönü'], [['1', '—', 'Karşılaştırma', '—', '—'], ['2', 'Fe³⁺', '', '', ''], ['3', 'SCN⁻', '', '', ''], ['4', 'PO₄³⁻', '', '', '']]),
    sure='25 dk')]

V['2.1.5'] = [F(
    'Kobalt Klorür ile Le Chatelier İlkesi',
    'Sıcaklık ve derişim değişikliklerinin bir denge sistemine etkisini renk değişimiyle gözlemlemek.',
    ['kobalt(II) klorür çözeltisi (pembe)', 'derişik HCl (öğretmen tarafından damlatılır)', 'saf su', '3 deney tüpü', 'sıcak su banyosu (≈80 °C)', 'buzlu su', 'damlalık'],
    [GOZLUK, 'Kobalt bileşikleri zehirlidir; eldivensiz dokunmayınız, deney sonrası ellerinizi yıkayınız.', 'Derişik HCl yalnızca öğretmen tarafından çeker ocakta kullanılmalıdır.', ISI, ATIK],
    ['Üç tüpe 3\'er mL kobalt klorür çözeltisi koyunuz.', 'Öğretmeniniz 1. tüpe renk maviye dönene kadar damla damla derişik HCl eklesin; ardından tüpe su ekleyiniz.', '2. tüpü sıcak su banyosuna, 3. tüpü buzlu suya koyunuz; birkaç dakika sonra renkleri karşılaştırınız.', 'Tüpleri yer değiştirip renk değişimini tekrar gözleyiniz.'],
    [('[Co(H₂O)₆]²⁺(pembe) + 4Cl⁻ ⇌ [CoCl₄]²⁻(mavi) + 6H₂O dengesinde Cl⁻ eklenince ve su eklenince ne oldu?', 'Cl⁻ eklenince denge ileri kayar, renk maviye döner; su eklenince geri kayar, renk pembeye döner.'),
     ('Isıtınca mavi, soğutunca pembe renk oluşuyorsa ileri tepkime endotermik mi ekzotermik mi?', 'Isıtınca ileri yöne (mavi) kaydığına göre ileri tepkime endotermiktir.'),
     ('Le Chatelier ilkesini kendi cümlelerinizle açıklayınız.', 'Dengedeki bir sisteme dışarıdan bir etki yapılırsa sistem bu etkiyi azaltacak yönde kayarak yeni bir denge kurar.')],
    tablo=(['Değişiklik', 'Gözlenen renk', 'Kayma yönü'], [['HCl (Cl⁻) ekleme', '', ''], ['Su ekleme', '', ''], ['Isıtma', '', ''], ['Soğutma', '', '']]),
    sure='30 dk')]

V['2.2.1'] = [F(
    'Saf Su Elektriği İletir mi?',
    'Saf su, musluk suyu ve tuzlu suyun iletkenliğini karşılaştırarak suyun çok az iyonlaştığını göstermek.',
    ['iletkenlik test düzeneği (pil, LED ya da ampul, iki elektrot)', 'saf su', 'musluk suyu', 'tuzlu su', 'üç beher'],
    [GOZLUK, 'Elektrotları ıslak elle tutmayınız; düzenekte yalnızca düşük voltajlı pil kullanınız.'],
    ['Üç behere eşit hacimde saf su, musluk suyu ve tuzlu su koyunuz.', 'Elektrotları sırayla her behere daldırıp LED\'in ışık şiddetini gözleyiniz.', 'Her ölçümden sonra elektrotları saf suyla durulayıp kurulayınız.'],
    [('Saf suda LED yanmadı ya da çok sönük yandı. Bu, saf suda hiç iyon olmadığı anlamına mı gelir?', 'Hayır; saf su çok az iyonlaşır (H₂O + H₂O ⇌ H₃O⁺ + OH⁻). İyon derişimi çok düşük olduğundan iletkenlik çok azdır.'),
     ('25 °C\'de saf suda [H₃O⁺] ve [OH⁻] kaçtır?', 'Her ikisi de 1·10⁻⁷ M\'dir; Kw = 1·10⁻¹⁴.'),
     ('Musluk suyunun saf sudan daha iyi iletmesinin nedeni nedir?', 'Musluk suyunda çözünmüş Ca²⁺, Mg²⁺, Na⁺, Cl⁻ gibi iyonlar vardır.')],
    tablo=(['Örnek', 'LED parlaklığı', 'İyon derişimi (az / orta / çok)'], [['Saf su', '', ''], ['Musluk suyu', '', ''], ['Tuzlu su', '', '']]),
    sure='15 dk')]

V['2.2.2'] = [F(
    'Kırmızı Lahana İndikatörü Hazırlama',
    'Doğal bir indikatör hazırlayarak evdeki maddeleri asit ve baz olarak sınıflandırmak.',
    ['kırmızı lahana yaprakları', 'sıcak su', 'süzgeç', 'şeffaf bardaklar', 'limon suyu, sirke, karbonat çözeltisi, sabunlu su, şekerli su, gazoz', 'etiket'],
    [GOZLUK, 'Temizlik ürünlerini birbirine karıştırmayınız.'],
    ['Lahana yapraklarını doğrayıp sıcak suda 10 dakika bekletiniz ve süzerek mor renkli indikatörü elde ediniz.', 'Bardaklara eşit miktarda indikatör koyup etiketleyiniz.', 'Her bardağa farklı bir maddeden birkaç damla ekleyiniz ve renkleri tabloya yazınız.', 'Renklere göre maddeleri asidik, nötr ve bazik olarak sınıflandırınız.'],
    [('Arrhenius tanımına göre limon suyu ve karbonat çözeltisi neden sırasıyla asit ve baz özelliği gösterir?', 'Limon suyundaki sitrik asit suda H⁺ (H₃O⁺) oluşturur; karbonat suyla tepkimeye girerek OH⁻ oluşturur.'),
     ('NH₃ formülünde OH yoktur ama bazdır. Bunu hangi teori daha iyi açıklar?', 'Brønsted–Lowry teorisi: NH₃ sudan proton alır (NH₃ + H₂O ⇌ NH₄⁺ + OH⁻).'),
     ('İndikatörün renk değiştirmesinin nedeni nedir?', 'İndikatör molekülleri ortamın pH\'ına göre proton alıp vererek farklı renkli yapılara dönüşür.')],
    tablo=(['Madde', 'Renk', 'Asidik / Nötr / Bazik'], [['Limon suyu', '', ''], ['Sirke', '', ''], ['Gazoz', '', ''], ['Şekerli su', '', ''], ['Karbonat çözeltisi', '', ''], ['Sabunlu su', '', '']]),
    sure='30 dk')]

V['2.2.3'] = [F(
    'Kuvvetli ve Zayıf Asitleri Ayırt Etme',
    'Aynı derişimdeki hidroklorik asit ve asetik asidin iletkenlik, pH ve magnezyumla tepkime hızlarını karşılaştırmak.',
    ['0,1 M HCl', '0,1 M CH₃COOH (asetik asit)', 'iletkenlik test düzeneği', 'pH kâğıdı ya da pH metre', 'iki deney tüpü', 'iki eşit magnezyum şerit (2 cm)'],
    [GOZLUK, 'Asit çözeltileri tahriş edicidir; dökülürse bol suyla yıkayınız.', ATIK],
    ['İki çözeltinin pH değerlerini ölçüp tabloya yazınız.', 'İletkenlik düzeneğiyle LED parlaklıklarını karşılaştırınız.', 'İki tüpe 5\'er mL çözelti koyup aynı anda magnezyum şeritleri atınız; gaz çıkış hızını karşılaştırınız.'],
    [('Derişimleri aynı olmasına rağmen iki çözeltinin pH değerleri neden farklıdır?', 'HCl suda tamamen iyonlaşır (kuvvetli); CH₃COOH ise kısmen iyonlaşır (zayıf), [H₃O⁺] daha düşüktür.'),
     ('"Derişik asit" ile "kuvvetli asit" aynı şey midir?', 'Hayır; derişik çözünen miktarının çok olduğunu, kuvvetli ise suda tamamen iyonlaştığını belirtir.'),
     ('Deneyi tanecik düzeyinde çizerek açıklayınız.', 'HCl çözeltisinde yalnızca H₃O⁺ ve Cl⁻ iyonları; asetik asit çözeltisinde çoğunlukla iyonlaşmamış CH₃COOH ve az sayıda H₃O⁺ ile CH₃COO⁻ bulunur.')],
    tablo=(['Ölçüt', '0,1 M HCl', '0,1 M CH₃COOH'], [['pH', '', ''], ['LED parlaklığı', '', ''], ['Mg ile gaz çıkışı', '', '']]),
    sure='20 dk')]

V['2.2.4'] = [F(
    'Seyreltme ile pH Değişimi',
    'Bir asit çözeltisini 10\'ar kat seyrelterek pH değerinin nasıl değiştiğini ölçmek ve hesaplamayla karşılaştırmak.',
    ['0,1 M HCl çözeltisi', 'saf su', '10 mL pipet ve puar', '4 adet 100 mL ölçülü balon ya da dereceli silindir', 'pH metre ya da geniş aralıklı pH kâğıdı'],
    [GOZLUK, 'Pipeti ağızla çekmeyiniz; puar kullanınız.', ATIK],
    ['0,1 M HCl\'nin pH değerini ölçünüz.', 'Bu çözeltiden 10 mL alıp saf suyla 100 mL\'ye tamamlayarak 0,01 M çözelti hazırlayınız ve pH değerini ölçünüz.', 'Aynı yolla 0,001 M ve 0,0001 M çözeltileri hazırlayıp pH değerlerini ölçünüz.', 'Her derişim için pH değerini hesaplayıp ölçümlerinizle karşılaştırınız.'],
    [('Derişim 10 kat azaldığında pH kaç birim değişti?', 'pH yaklaşık 1 birim artar (pH = −log[H₃O⁺]).'),
     ('Bir asit çözeltisi sonsuz seyreltilirse pH 7\'yi geçebilir mi? Neden?', 'Geçemez; çok seyreltildiğinde suyun kendi iyonlaşmasından gelen H₃O⁺ baskın olur, pH 7\'ye yaklaşır.'),
     ('0,01 M NaOH çözeltisinin pH değerini hesaplayınız.', '[OH⁻] = 10⁻², pOH = 2, pH = 12.')],
    tablo=(['Derişim (M)', 'Hesaplanan pH', 'Ölçülen pH'], [['0,1', '1', ''], ['0,01', '', ''], ['0,001', '', ''], ['0,0001', '', '']]),
    sure='30 dk')]

V['2.2.5'] = [F(
    'Nötralleşmeyi Sıcaklık ve İndikatörle İzleme',
    'Asit ile bazın tepkimesinde sıcaklık değişimini ve indikatör rengini izleyerek nötralleşme noktasını belirlemek.',
    ['1 M HCl', '1 M NaOH', 'strafor bardak', 'termometre', 'dereceli silindir', 'fenolftalein', 'damlalık'],
    [GOZLUK, 'NaOH ve HCl çözeltileri yakıcıdır; dikkatli çalışınız.', ATIK],
    ['Strafor bardağa 20 mL 1 M HCl ve 2 damla fenolftalein koyup sıcaklığı ölçünüz.', 'NaOH çözeltisini 4 mL\'lik kısımlar hâlinde ekleyiniz; her eklemeden sonra karıştırıp sıcaklığı ve rengi tabloya yazınız.', 'Toplam 32 mL NaOH eklenene kadar devam ediniz.'],
    [('Sıcaklık en yüksek değerine kaç mL NaOH eklendiğinde ulaştı? Bu nokta neyi gösterir?', 'Yaklaşık 20 mL\'de; bu noktada asit ve baz tam nötralleşmiştir (n H⁺ = n OH⁻).'),
     ('Nötralleşme tepkimesinin net iyon denklemini yazınız. Tepkime ekzotermik mi?', 'H⁺(suda) + OH⁻(suda) → H₂O(s); sıcaklık arttığı için ekzotermiktir.'),
     ('Fenolftaleinin renk değiştirdiği nokta ile en yüksek sıcaklık noktası uyumlu mu?', 'Yaklaşık uyumludur; fenolftalein, nötralleşme noktasından hemen sonra ortam bazikleşince pembeleşir.')],
    tablo=(['Eklenen NaOH (mL)', '0', '4', '8', '12', '16', '20', '24', '28', '32'], [['Sıcaklık (°C)', '', '', '', '', '', '', '', '', ''], ['Renk', '', '', '', '', '', '', '', '', '']]),
    sure='30 dk')]

V['2.2.6'] = [F(
    'Sirkedeki Asetik Asit Miktarını Titrasyonla Bulma',
    'Derişimi bilinen NaOH çözeltisiyle titrasyon yaparak sirkedeki asetik asit derişimini belirlemek.',
    ['beyaz sirke', '0,1 M NaOH çözeltisi', 'büret, destek çubuğu ve kıskaç', '10 mL pipet ve puar', '100 mL ölçülü balon', 'erlen (3 adet)', 'fenolftalein', 'beyaz kâğıt', 'saf su'],
    [GOZLUK, 'Büreti göz hizasının üzerinde doldururken huniyi kullanınız ve dökmemeye dikkat ediniz.', ATIK],
    ['10 mL sirkeyi pipetle alıp ölçülü balonda saf suyla 100 mL\'ye seyreltiniz.', 'Bu çözeltiden 10 mL\'yi erlene alıp 2 damla fenolftalein ekleyiniz.', 'Büreti NaOH çözeltisiyle doldurup başlangıç okumasını yazınız.', 'Erleni çalkalayarak NaOH\'ı damla damla ekleyiniz; açık pembe renk 30 saniye kalıcı olunca durunuz ve son okumayı yazınız.', 'Titrasyonu iki kez daha tekrarlayıp ortalama hacmi bulunuz.'],
    [('Seyreltilmiş sirkedeki ve asıl sirkedeki asetik asit derişimini hesaplayınız.', 'Mₐ·Vₐ = M_b·V_b; örneğin ortalama 13,0 mL harcandıysa Mₐ = 0,1·13,0/10 = 0,13 M; asıl sirke 10 kat derişik, 1,3 M.'),
     ('Bu derişimi kütlece yüzdeye çeviriniz ve etiketle karşılaştırınız (CH₃COOH: 60 g/mol, sirkenin yoğunluğu ≈ 1 g/mL).', '1,3 mol/L × 60 g/mol = 78 g/L ≈ %7,8; etiketteki değerle karşılaştırılır.'),
     ('Zayıf asit titrasyonunda neden fenolftalein seçilir, metil oranj seçilmez?', 'Eşdeğerlik noktasında ortam baziktir (pH ≈ 8,7); fenolftalein bu aralıkta renk değiştirir, metil oranj ise asidik bölgede değiştirdiği için erken döner.')],
    tablo=(['Deneme', 'Başlangıç (mL)', 'Son (mL)', 'Harcanan NaOH (mL)'], [['1', '', '', ''], ['2', '', '', ''], ['3', '', '', ''], ['Ortalama', '—', '—', '']]),
    sure='45 dk')]

V['2.2.7'] = [F(
    'Evdeki Ürünlerin pH Haritası',
    'Kişisel bakım ve temizlik ürünlerinin pH değerlerini ölçerek kullanım amaçlarıyla ilişkilendirmek.',
    ['şampuan, sıvı sabun, diş macunu, antiasit tablet, bulaşık deterjanı, cam temizleyici, limon suyu', 'pH kâğıdı ya da kırmızı lahana indikatörü', 'şeffaf bardaklar', 'saf su', 'baget'],
    [GOZLUK, 'Temizlik ürünlerini birbirine karıştırmayınız; özellikle çamaşır suyunu asidik ürünlerle asla karıştırmayınız (zehirli gaz oluşur).', 'Ürünleri koklamayınız ve tatmayınız.'],
    ['Katı ürünleri az miktarda saf suda çözünüz; sıvı ürünlerden birkaç damla alınız.', 'Her ürünün pH değerini ölçüp tabloya yazınız.', 'Ürünleri pH skalası üzerinde sıralayan bir poster hazırlayınız.'],
    [('Cilt temizleme ürünlerinin hafif asidik olmasının nedeni nedir?', 'Cildin doğal pH değeri yaklaşık 5,5\'tir; bu değere yakın ürünler cildin koruyucu tabakasını daha az bozar.'),
     ('Antiasit tablet mide ekşimesini nasıl giderir?', 'Bazik yapıdadır; mide asidinin bir kısmını nötralleştirir.'),
     ('Bir ürünü satın alırken pH değerine bakmak hangi durumlarda önemlidir?', 'Hassas cilt, diş minesi, yüzey türü (mermer asitten zarar görür) ve güvenli kullanım açısından önemlidir.')],
    tablo=(['Ürün', 'pH', 'Asidik / Nötr / Bazik', 'Kullanım amacıyla ilişkisi'], [['Şampuan', '', '', ''], ['Sıvı sabun', '', '', ''], ['Diş macunu', '', '', ''], ['Antiasit tablet', '', '', ''], ['Bulaşık deterjanı', '', '', ''], ['Cam temizleyici', '', '', '']]),
    sure='30 dk')]

V['2.3.1'] = [F(
    'Çökelek Oluşumu ve Kçç',
    'İki çözelti karıştırıldığında çökelek oluşup oluşmayacağını Qçç ile Kçç\'yi karşılaştırarak tahmin etmek ve deneyle doğrulamak.',
    ['0,01 M ve 0,0001 M AgNO₃ çözeltisi', '0,01 M ve 0,0001 M NaCl çözeltisi', '4 deney tüpü', 'damlalık', 'siyah zemin'],
    [GOZLUK, 'Gümüş nitrat cildi lekeler ve tahriş eder; eldiven kullanınız.', ATIK],
    ['1. tüpte 0,01 M AgNO₃ ile 0,01 M NaCl\'den, 2. tüpte 0,0001 M AgNO₃ ile 0,0001 M NaCl\'den eşit hacimlerde karıştırınız.', 'Karıştırmadan önce her tüp için Qçç değerini hesaplayıp çökelek oluşup oluşmayacağını tahmin ediniz (AgCl için Kçç = 1,8·10⁻¹⁰).', 'Tüpleri siyah zemin önünde gözleyip tahminlerinizle karşılaştırınız.'],
    [('Eşit hacimler karıştırıldığında derişimler yarıya iner. 1. tüp için Qçç kaçtır? Çökelek oluşur mu?', 'Qçç = (0,005)(0,005) = 2,5·10⁻⁵ > Kçç; çökelek oluşur.'),
     ('2. tüp için Qçç kaçtır?', 'Qçç = (5·10⁻⁵)² = 2,5·10⁻⁹ > 1,8·10⁻¹⁰; çok az da olsa çökelek (hafif bulanıklık) beklenir.'),
     ('Qçç < Kçç olsaydı ne gözlenirdi?', 'Çökelek oluşmaz; çözelti doymamış kalır.')],
    sure='20 dk')]

V['2.3.2'] = [F(
    'Ortak İyon Etkisi',
    'Doygun bir tuz çözeltisine ortak iyon içeren tuz ekleyerek çözünürlüğün azaldığını gözlemlemek.',
    ['doygun sodyum klorür (NaCl) çözeltisi', 'katı kalsiyum klorür (CaCl₂)', 'iki deney tüpü', 'spatül', 'baget'],
    [GOZLUK, ATIK],
    ['İki tüpe 5\'er mL berrak doygun NaCl çözeltisi koyunuz.', 'Birinci tüpe bir spatül dolusu katı CaCl₂ ekleyip karıştırınız.', 'İkinci tüpü karşılaştırma için bekletiniz; iki tüpü birkaç dakika sonra gözleyiniz.'],
    [('Birinci tüpte beyaz katı oluşmasının nedeni nedir?', 'CaCl₂ çözeltiye Cl⁻ iyonu ekler; NaCl(k) ⇌ Na⁺ + Cl⁻ dengesi sola kayar, NaCl çöker (ortak iyon etkisi).'),
     ('Ortak iyon eklenmesi Kçç değerini değiştirir mi?', 'Hayır; Kçç yalnızca sıcaklıkla değişir. Değişen, tuzun çözünürlüğüdür.'),
     ('Ortak iyon etkisinin günlük hayattan ya da sanayiden bir örneğini veriniz.', 'Böbrek taşı oluşumunda kalsiyum iyonunun fazlalığı; laboratuvarda çökeleklerin ortak iyon içeren çözeltiyle yıkanması.')],
    sure='15 dk')]

V['3.1.1'] = [F(
    'Suyun Elektrolizi ile Hidrojen Üretimi',
    'Suyun elektrolizinde oluşan gazların hacim oranını belirlemek ve yenilenebilir enerjiyle üretilen yeşil hidrojeni tartışmak.',
    ['9 V pil ya da küçük güneş paneli', 'iki grafit elektrot (kurşun kalem uçları)', 'su ve bir tatlı kaşığı sodyum sülfat (Na₂SO₄)', 'iki küçük deney tüpü', 'şeffaf kap', 'bağlantı kabloları', 'kibrit (öğretmen kontrolünde)'],
    [GOZLUK, 'Elektrolit olarak tuz (NaCl) kullanmayınız; zehirli klor gazı oluşur.', 'Hidrojen gazı yanıcıdır; gaz testini yalnızca öğretmeniniz yapsın.'],
    ['Kaba su koyup sodyum sülfatı çözünüz.', 'Su dolu iki tüpü ters çevirerek elektrotların üzerine yerleştiriniz.', 'Elektrotları pil ya da güneş paneline bağlayıp gaz kabarcıklarını gözleyiniz.', 'Belirli aralıklarla iki tüpteki gaz yüksekliklerini ölçünüz.', 'Öğretmeniniz katottaki gaza yanan kibrit, anottaki gaza közlü kibrit yaklaştırarak gazları test etsin.'],
    [('İki tüpteki gaz hacimleri oranı yaklaşık kaçtır? Hangi tüpte hangi gaz toplandı?', 'Katotta (−) H₂, anotta (+) O₂ toplanır; hacim oranı yaklaşık 2 : 1\'dir (2H₂O → 2H₂ + O₂).'),
     ('Güneş paneliyle yapılan elektrolizde üretilen hidrojen neden "yeşil" sayılır?', 'Elektrik yenilenebilir kaynaktan sağlandığı için üretim sürecinde sera gazı salınmaz.'),
     ('Hidrojenin yaygın yakıt olarak kullanılmasının önündeki engeller nelerdir?', 'Üretim maliyeti, depolama ve taşımanın zorluğu (yüksek basınç, düşük sıcaklık) ve güvenlik.')],
    tablo=(['Süre (dk)', '2', '4', '6', '8', '10'], [['Katot gazı (mm)', '', '', '', '', ''], ['Anot gazı (mm)', '', '', '', '', '']]),
    sure='30 dk')]

V['3.1.2'] = [F(
    'Lotus Etkisi: Su İtici Yüzeyler',
    'Nano yapılı yüzeylerin su itme özelliğini doğal ve yapay yüzeylerde gözlemlemek.',
    ['lahana ya da nasturtium (latin çiçeği) yaprağı', 'normal kâğıt', 'mumla ovulmuş kâğıt', 'su itici sprey uygulanmış kumaş (varsa)', 'damlalık', 'su', 'büyüteç'],
    ['Sprey kullanılacaksa açık havada ve maske takarak uygulayınız.'],
    ['Her yüzeye birer damla su damlatınız.', 'Damlaların şeklini büyüteçle gözleyip çiziniz.', 'Yüzeyleri hafifçe eğerek damlanın yuvarlanıp yuvarlanmadığını ve yüzeydeki tozu toplayıp toplamadığını gözleyiniz.'],
    [('Lahana yaprağında su damlası neden küre şeklinde kalır ve yuvarlanır?', 'Yaprak yüzeyindeki mikro ve nano boyutlu çıkıntılar suyla teması azaltır; adezyon küçük, kohezyon büyük olduğundan damla küre şeklinde kalır.'),
     ('Bu özelliği taklit eden nanoteknolojik ürünlere örnek veriniz.', 'Kendi kendini temizleyen camlar ve boyalar, su itici kumaşlar.'),
     ('Nano kaplamalı ürünlerin olası zararları için hangi sorular sorulmalıdır?', 'Kaplama zamanla aşınıp çevreye karışıyor mu, canlılarda birikir mi, kullanım sonrası atığı nasıl yönetilir?')],
    sure='20 dk')]

V['3.1.3'] = [F(
    'Kozmetik Ürünlerde Mikroplastik Avı',
    'Bazı kişisel bakım ürünlerinde mikroplastik parçacık bulunup bulunmadığını süzme yöntemiyle araştırmak.',
    ['peeling jeli ya da diş macunu (etiketinde polietilen yazan ürün tercih edilir)', 'sıcak su', 'beher', 'kahve filtresi ya da ince kumaş', 'huni', 'büyüteç ya da mikroskop', 'koyu renkli zemin'],
    [GOZLUK],
    ['Bir çay kaşığı ürünü beherde 100 mL sıcak suda karıştırarak çözünüz.', 'Karışımı huni ve filtreden süzünüz.', 'Filtrede kalan parçacıkları koyu zemin üzerinde büyüteçle inceleyiniz; sayısını ve boyutunu tahmin ediniz.', 'Ürün etiketindeki içerik listesini inceleyerek plastik türlerini (polietilen, polipropilen vb.) not ediniz.'],
    [('Filtrede kalan parçacıkların plastik olduğunu nasıl ayırt edebilirsiniz?', 'Suda çözünmez, renkli ve sert küçük taneciklerdir; etikette polietilen gibi polimerler yazar.'),
     ('Bu parçacıklar lavabodan aktıktan sonra nereye gider ve ne gibi sorunlara yol açar?', 'Arıtma tesislerinde tamamen tutulamaz; denizlere ve göllere ulaşır, canlılar tarafından yutulup besin zincirine girer.'),
     ('Mikroplastik kirliliğini azaltmak için bireysel olarak neler yapabilirsiniz?', 'Mikro boncuk içermeyen ürünleri seçmek, tek kullanımlık plastikleri azaltmak, sentetik kıyafetleri daha az yıkamak.')],
    sure='25 dk')]

yaz('11', V)
