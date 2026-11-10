// Sanal deneylerin sonundaki "Ne buldun?" kontrol soruları (her deney türü için).
// [soru, seçenekler, doğru seçenek sırası, açıklama]

export type KontrolSorusu = [string, string[], number, string]

export const DENEY_GOREVLERI: Record<string, KontrolSorusu[]> = {
  gaz: [
    ['Sabit sıcaklıkta pistonu iterek hacmi yarıya indirdin. Basınç ne olur?', ['Yarıya iner', 'Değişmez', 'İki katına çıkar', 'Dört katına çıkar'], 2, 'Boyle yasası: sabit T ve n\'de P·V sabittir; V yarıya inince P iki katına çıkar.'],
    ['Sabit hacimde gazı ısıttığında basınç neden artar?', ['Tanecikler büyür', 'Tanecikler hızlanır, çeperlere daha sık ve şiddetli çarpar', 'Tanecik sayısı artar', 'Gaz sıvılaşır'], 1, 'Sıcaklık artınca taneciklerin ortalama kinetik enerjisi artar.'],
  ],
  difuzyon: [
    ['NH₃ ve HCl deneyinde beyaz halka hangi uca yakın oluşur?', ['NH₃ ucuna', 'Tam ortaya', 'HCl ucuna', 'Rastgele bir yere'], 2, 'Hafif olan NH₃ daha hızlı yayılır ve daha uzun yol alır.'],
    ['He gazı CH₄\'ten (16 g/mol) kaç kat hızlı yayılır? (He: 4 g/mol)', ['2', '4', '0,5', '16'], 0, 'v₁/v₂ = √(M₂/M₁) = √(16/4) = 2'],
  ],
  hiz: [
    ['Katalizör eklenince ne değişti?', ['Ürün miktarı arttı', 'Aktivasyon enerjisi düştü, tepkime hızlandı', 'ΔH değişti', 'Tanecikler büyüdü'], 1, 'Katalizör daha düşük aktivasyon enerjili bir yol sağlar; ΔH ve ürün miktarı değişmez.'],
    ['Derişim–zaman grafiğinde eğim zamanla neden azalır?', ['Sıcaklık düşer', 'Tepken derişimi azaldığı için çarpışma sayısı azalır', 'Katalizör tükenir', 'Ürün tepkimeyi durdurur'], 1, 'Tepkenler azaldıkça etkin çarpışma sayısı ve hız azalır.'],
    ['Sıcaklık artınca Maxwell–Boltzmann eğrisinde ne olur?', ['Eₐ çizgisi sola kayar', 'Eğri sağa yayılır, Eₐ\'yı aşan tanecik oranı artar', 'Tanecik sayısı artar', 'Eğri değişmez'], 1, 'Aktivasyon enerjisi değişmez; ona ulaşan tanecik oranı artar.'],
  ],
  denge: [
    ['Dengedeki N₂O₄ ⇌ 2NO₂ (ΔH > 0) sistemi ısıtılınca renk nasıl değişir?', ['Açılır', 'Koyulaşır', 'Değişmez', 'Önce koyulaşır sonra eski hâline döner'], 1, 'Endotermik yön (NO₂) yeğlenir; kahverengi NO₂ artar.'],
    ['Dengede tepkimeler için hangisi doğrudur?', ['İleri ve geri tepkimeler durur', 'İleri ve geri tepkime hızları eşittir', 'Tepken ve ürün derişimleri eşittir', 'Kc sürekli değişir'], 1, 'Denge dinamiktir; hızlar eşit, derişimler sabittir.'],
    ['Hacmi küçültünce denge hangi yöne kayar?', ['NO₂ yönüne', 'N₂O₄ yönüne (daha az gaz molü)', 'Kaymaz', 'Önce NO₂ yönüne'], 1, 'Basınç artışı, gaz mol sayısının az olduğu yöne kaydırır.'],
  ],
  ph: [
    ['0,1 M HCl ile 0,1 M CH₃COOH\'den hangisinin pH\'ı daha düşüktür?', ['CH₃COOH', 'HCl', 'Eşittir', 'Sıcaklığa bağlı değil, hacme bağlı'], 1, 'HCl tamamen iyonlaşır; [H₃O⁺] daha büyüktür.'],
    ['Saf su 60 °C\'ye ısıtılınca pH 6,5 oldu. Su asidik mi oldu?', ['Evet', 'Hayır, [H₃O⁺] = [OH⁻] olduğu için nötrdür', 'Bazik oldu', 'Su iyonlaşmaz'], 1, 'Kw sıcaklıkla artar; nötrlük [H₃O⁺] = [OH⁻] demektir.'],
  ],
  titrasyon: [
    ['25 mL 0,1 M HCl kaç mL 0,1 M NaOH ile tam nötralleşir?', ['12,5', '25', '50', '0,1'], 1, 'n(H⁺) = n(OH⁻): 0,1·25 = 0,1·V → V = 25 mL'],
    ['Zayıf asit–kuvvetli baz titrasyonunda eşdeğerlik noktası pH\'ı nasıldır?', ['7', '7\'den küçük', '7\'den büyük', '0'], 2, 'Oluşan asetat iyonu bazik özellik gösterir (pH ≈ 8,7).'],
  ],
  kcc: [
    ['Doygun AgCl çözeltisine NaCl eklenince ne olur?', ['AgCl daha çok çözünür', 'AgCl çöker, çözünürlük azalır', 'Kçç artar', 'Değişiklik olmaz'], 1, 'Ortak iyon (Cl⁻) dengeyi sola kaydırır.'],
    ['Qçç > Kçç ise ne gözlenir?', ['Çökelek oluşur', 'Çözelti doymamıştır', 'Tuz daha çok çözünür', 'Sıcaklık artar'], 0, 'Çözelti aşırı doygundur; fazla iyonlar çöker.'],
  ],
  kalorimetre: [
    ['NH₄NO₃ suda çözününce sıcaklık düştü. Çözünme nasıl bir olaydır?', ['Ekzotermik', 'Endotermik', 'Isı alışverişi yoktur', 'Kimyasal tepkime'], 1, 'Ortamdan ısı alır, ortam soğur.'],
    ['50 g su 10 °C ısınırsa aldığı ısı yaklaşık kaç J\'dür? (c = 4,18 J/g·°C)', ['209', '418', '2090', '4180'], 2, 'q = m·c·ΔT = 50·4,18·10 = 2090 J'],
  ],
  entalpi: [
    ['Kırılan bağların enerjisi oluşan bağlarınkinden küçükse tepkime nasıldır?', ['Endotermik', 'Ekzotermik', 'ΔH = 0', 'Gerçekleşmez'], 1, 'ΔH = Σ(kırılan) − Σ(oluşan) < 0'],
    ['Bağ kırılması için ne gerekir?', ['Enerji açığa çıkar', 'Enerji gerekir', 'Katalizör gerekir', 'Hiçbir şey'], 1, 'Bağ kırmak her zaman enerji gerektirir (endotermik).'],
  ],
  elektroliz: [
    ['Suyun elektrolizinde H₂ ve O₂ hacimleri oranı kaçtır?', ['1 : 1', '2 : 1', '1 : 2', '3 : 1'], 1, '2H₂O → 2H₂ + O₂'],
    ['Hangi durumda üretilen hidrojen "yeşil" sayılır?', ['Kömür elektriğiyle', 'Doğal gazdan', 'Güneş ya da rüzgâr elektriğiyle', 'Her zaman'], 2, 'Yenilenebilir kaynakla üretimde sera gazı salınmaz.'],
  ],
  karistir: [
    ['AgNO₃ ve NaCl çözeltileri karıştırılınca oluşan beyaz katı neyin göstergesidir?', ['Fiziksel değişim', 'Çökelme tepkimesi', 'Gaz çıkışı', 'Erime'], 1, 'Suda çözünmeyen AgCl oluşur.'],
    ['Şekerin suda çözünmesi neden fiziksel değişimdir?', ['Renk değişir', 'Yeni madde oluşmaz', 'Isı açığa çıkar', 'Gaz çıkar'], 1, 'Şeker molekülleri bozulmadan dağılır.'],
  ],
  mol: [
    ['1 mol C (12 g) ile 1 mol Fe (56 g) için hangisi doğrudur?', ['Kütleleri eşittir', 'Atom sayıları eşittir', 'Hacimleri eşittir', 'Hiçbiri'], 1, 'Her ikisi de 6,02·10²³ atom içerir.'],
    ['36 g su kaç moldür? (H₂O: 18 g/mol)', ['0,5', '1', '2', '36'], 2, 'n = 36/18 = 2 mol'],
  ],
  denklem: [
    ['Denkleştirmede neyi değiştirebiliriz?', ['Formüllerdeki alt indisleri', 'Yalnızca katsayıları', 'Atom türlerini', 'Hepsini'], 1, 'Alt indis değişirse madde değişir.'],
    ['2H₂ + O₂ → 2H₂O tepkimesinde 6 H₂ ve 4 O₂ molekülünden hangisi artar?', ['H₂', 'O₂', 'Hiçbiri', 'İkisi de'], 1, '6 H₂ için 3 O₂ yeter; 1 O₂ artar. Sınırlayıcı bileşen H₂\'dir.'],
  ],
  cozunme: [
    ['Na⁺ iyonuna su molekülünün hangi ucu yönelir?', ['H ucu', 'O ucu (kısmi negatif)', 'Rastgele', 'Hiçbiri'], 1, 'Zıt yükler çekilir.'],
    ['Hangi çözelti elektriği iletir?', ['Şekerli su', 'Tuzlu su', 'Saf su', 'Yağlı su'], 1, 'Tuz suda iyonlarına ayrışır.'],
  ],
  cozunurluk: [
    ['20 °C\'de 100 g suya 50 g KNO₃ eklendi (çözünürlük 31,6 g). Çözelti nasıldır?', ['Doymamış', 'Doymuş, dipte katı var', 'Aşırı doymuş', 'Seyreltik'], 1, 'Yaklaşık 18 g dipte kalır.'],
    ['KNO₃\'ün çözünürlüğü sıcaklıkla nasıl değişir?', ['Azalır', 'Artar', 'Değişmez', 'Önce artar sonra azalır'], 1, 'Çözünmesi endotermiktir.'],
  ],
  derisim: [
    ['0,2 mol tuz 500 mL çözeltide çözünmüştür. Molarite kaçtır?', ['0,1 M', '0,2 M', '0,4 M', '2 M'], 2, 'M = n/V = 0,2/0,5 = 0,4 M'],
    ['Çözeltiye su eklenince ne değişmez?', ['Molarite', 'Hacim', 'Çözünen mol sayısı', 'Renk koyuluğu'], 2, 'Seyreltmede çözünen miktarı aynı kalır.'],
  ],
  koligatif: [
    ['Aynı derişimde hangisinin donma noktası en düşüktür?', ['Şeker', 'NaCl', 'CaCl₂', 'Hepsi eşit'], 2, 'CaCl₂ en çok iyon (3) oluşturur.'],
    ['Tuzlu suyun kaynama noktası saf suya göre nasıldır?', ['Daha düşük', 'Daha yüksek', 'Aynı', 'Tuz miktarına bağlı değil'], 1, 'Çözünen tanecikler buhar basıncını düşürür.'],
  ],
  sera: [
    ['Sera gazları hangi ışınları soğurup yeniden yayar?', ['Görünür ışık', 'Kızılötesi (IR)', 'Morötesi', 'X ışınları'], 1, 'Yüzeyin yaydığı IR ışınları soğurulur.'],
    ['CO₂ miktarı arttıkça ne olur?', ['Uzaya kaçan ısı artar', 'Yüzeye geri dönen ısı artar, sıcaklık yükselir', 'Güneş ışığı azalır', 'Değişiklik olmaz'], 1, 'Sera etkisi güçlenir.'],
  ],
  rutherford: [
    ['Alfa taneciklerinin çoğunun doğrudan geçmesi neyi gösterir?', ['Atom dolu bir küredir', 'Atomun büyük kısmı boşluktur', 'Elektronlar çekirdektedir', 'Alfa tanecikleri yüksüzdür'], 1, 'Tanecikler boşluktan sapmadan geçer.'],
    ['Az sayıda taneciğin geri dönmesi neyin kanıtıdır?', ['Küçük, yoğun ve pozitif yüklü çekirdek', 'Negatif yüklü çekirdek', 'Dağınık pozitif yük', 'Nötronlar'], 0, 'Pozitif alfa tanecikleri pozitif çekirdekten itilir.'],
  ],
  atom: [
    ['Na (Z = 11) atomunun elektron dizilimi hangisidir?', ['1s² 2s² 2p⁷', '1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶ 3p¹', '1s² 2s⁸ 3s¹'], 1, 'Orbitaller 1s, 2s, 2p, 3s sırasıyla dolar.'],
    ['Mg atomu iki elektron verince hangi soy gazın dizilimine ulaşır?', ['He', 'Ne', 'Ar', 'Kr'], 1, 'Mg²⁺: 1s² 2s² 2p⁶ (Ne düzeni)'],
  ],
  periyodik: [
    ['Bir periyotta soldan sağa atom yarıçapı nasıl değişir?', ['Artar', 'Azalır', 'Değişmez', 'Önce artar sonra azalır'], 1, 'Proton sayısı artar, çekim güçlenir.'],
    ['En yüksek elektronegatiflik hangi elementindir?', ['O', 'Cl', 'F', 'N'], 2, 'Flor (3,98)'],
  ],
  bag: [
    ['Na ile Cl arasında hangi bağ oluşur?', ['Apolar kovalent', 'Polar kovalent', 'İyonik', 'Metalik'], 2, 'EN farkı büyüktür (2,23); elektron aktarılır.'],
    ['H₂ molekülündeki bağ için hangisi doğrudur?', ['Polar kovalent', 'Apolar kovalent', 'İyonik', 'Metalik'], 1, 'Aynı atomlar arasında EN farkı sıfırdır.'],
  ],
  polarlik: [
    ['CO₂ molekülü neden apolardır?', ['Bağları apolardır', 'Doğrusal yapıda bağ dipolleri birbirini yok eder', 'Ortaklanmamış çifti vardır', 'İyonik bağlıdır'], 1, 'Simetrik yapı nedeniyle net dipol sıfırdır.'],
    ['Elektrik alanında hangi molekül yönlenir?', ['CH₄', 'CO₂', 'H₂O', 'BF₃'], 2, 'H₂O polardır.'],
  ],
  iyon: [
    ['Al³⁺ ve O²⁻ iyonlarından oluşan bileşiğin formülü nedir?', ['AlO', 'Al₂O₃', 'Al₃O₂', 'AlO₃'], 1, 'Toplam yük: 2·(+3) + 3·(−2) = 0'],
    ['N₂O₅ bileşiğinin adı nedir?', ['Azot oksit', 'Diazot pentaoksit', 'Azot(V) oksit', 'Pentazot dioksit'], 1, 'Moleküler bileşiklerde Yunanca sayı ön ekleri kullanılır.'],
  ],
  buhar: [
    ['Aynı sıcaklıkta hangi sıvının buhar basıncı en yüksektir?', ['Su', 'Etanol', 'Aseton', 'Dietil eter'], 3, 'Molekülleri arası etkileşim en zayıf olan.'],
    ['Erzurum\'da su 100 °C\'den düşük sıcaklıkta kaynar. Neden?', ['Hava soğuktur', 'Dış basınç düşüktür', 'Su saf değildir', 'Rüzgâr vardır'], 1, 'Buhar basıncı daha düşük dış basınca daha erken eşitlenir.'],
  ],
  viskozite: [
    ['Gliserinin viskozitesinin yüksek olmasının nedeni nedir?', ['Molekülleri apolardır', 'Molekülleri arasında çok sayıda hidrojen bağı vardır', 'Yoğunluğu düşüktür', 'Kaynama noktası düşüktür'], 1, 'Üç –OH grubu hidrojen bağı yapar.'],
    ['Sıcaklık artınca viskozite nasıl değişir?', ['Artar', 'Azalır', 'Değişmez', 'Önce artar'], 1, 'Moleküller arası etkileşimler daha kolay aşılır.'],
  ],
  kilcallik: [
    ['İnce borularda su neden daha çok yükselir?', ['Kohezyon büyüktür', 'Adezyon kohezyondan büyüktür ve boru ince olduğu için etki artar', 'Su ağırdır', 'Basınç düşüktür'], 1, 'h ∝ 1/r'],
    ['Cıvanın cam boruda menisküsü nasıldır?', ['İçbükey', 'Dışbükey (tümsek)', 'Düz', 'Dalgalı'], 1, 'Kohezyon adezyondan büyüktür.'],
  ],
  nano: [
    ['1 cm\'lik küp 10\'ar parçaya bölünürse toplam yüzey alanı ne olur?', ['Değişmez', '10 katına çıkar', '100 katına çıkar', 'Yarıya iner'], 1, '6 cm² → 60 cm²'],
    ['Nanoparçacıkların çok etkin olmasının temel nedeni nedir?', ['Ağır olmaları', 'Yüzey alanı / hacim oranının büyük olması', 'Renkli olmaları', 'Çözünmemeleri'], 1, 'Daha çok tanecik yüzeyde, tepkimeye açıktır.'],
  ],
  guvenlik: [
    ['Kimyasal bir maddenin kokusu nasıl kontrol edilir?', ['Şişe buruna yaklaştırılır', 'El ile yelpazelenerek', 'Tadına bakılır', 'Hiç kontrol edilmez'], 1, 'Buhar doğrudan solunmaz.'],
    ['Yanan yağ tavası nasıl söndürülür?', ['Su dökülür', 'Kapak kapatılarak oksijen kesilir', 'Üflenir', 'Alkol dökülür'], 1, 'Su, kızgın yağı sıçratır.'],
  ],
  yesil: [
    ['Yeşil kimyanın birinci ilkesi nedir?', ['Atığı oluştuktan sonra temizlemek', 'Atığı baştan önlemek', 'Daha çok ürün üretmek', 'Yüksek sıcaklıkta çalışmak'], 1, 'Önlemek, temizlemekten iyidir.'],
    ['Katalizör kullanımı yeşil kimyaya nasıl katkı sağlar?', ['Atığı artırır', 'Daha düşük sıcaklıkta ve az yan ürünle üretim sağlar', 'Ürün miktarını azaltır', 'Çözücü ihtiyacını artırır'], 1, 'Katalizör harcanmaz, enerji ve atık azalır.'],
  ],
  paslanma: [
    ['Paslanma için hangi iki madde birlikte gereklidir?', ['Su ve oksijen', 'Tuz ve azot', 'Oksijen ve azot', 'Yalnızca su'], 0, 'Kuru havada ve havasız suda paslanma çok yavaştır.'],
    ['Galvanizli çivi demiri nasıl korur?', ['Boya ile', 'Çinko kaplama ile', 'Krom alaşımı ile', 'Yağ ile'], 1, 'Çinko demirden önce yükseltgenir.'],
  ],
  mikroplastik: [
    ['Mikroplastik kaç mm\'den küçük plastik parçalardır?', ['5 mm', '5 cm', '1 m', '0,5 m'], 0, 'Nanoplastikler ise 1 µm\'den küçüktür.'],
    ['Mikroplastikler besin zincirine nasıl girer?', ['Buharlaşarak', 'Küçük canlılar ve balıklar tarafından yutularak', 'Çözünerek', 'Yanarak'], 1, 'Parçalanan plastikler canlılar tarafından besin sanılır.'],
  ],
  pil: [
    ['Zn–Cu pilinde elektronlar hangi yöne akar?', ['Cu\'dan Zn\'ye', 'Zn\'den Cu\'ya', 'Akmaz', 'Tuz köprüsünden'], 1, 'Aktif metal Zn yükseltgenir, elektron verir.'],
    ['Tuz köprüsü çıkarılınca ne olur?', ['Gerilim artar', 'Devre tamamlanmaz, akım kesilir', 'Bakır çözünür', 'Değişiklik olmaz'], 1, 'İyon akışı olmadan çözeltiler yük dengesini koruyamaz.'],
  ],
  kristal: [
    ['Elmas ile grafit arasındaki temel fark nedir?', ['Farklı elementlerden oluşurlar', 'Karbon atomlarının dizilişi farklıdır', 'Elmas iyoniktir', 'Grafit metaldir'], 1, 'Elmasta her C dört C\'ye, grafitte üç C\'ye bağlıdır.'],
    ['Buz neden suda yüzer?', ['Buz suda çözünmez', 'Hidrojen bağlarıyla oluşan açık yapı nedeniyle buz sudan az yoğundur', 'Buzun içinde hava vardır', 'Buz apolardır'], 1, 'Altıgen örgü boşluklu bir yapıdır.'],
  ],
  isitma: [
    ['Hâl değişimi sırasında sıcaklık neden sabit kalır?', ['Isı verilmez', 'Verilen ısı tanecikler arası etkileşimleri yenmeye harcanır', 'Termometre bozulur', 'Tanecikler yavaşlar'], 1, 'Kinetik enerji değil, potansiyel enerji değişir.'],
    ['Kaynama düzlüğü erime düzlüğünden neden daha uzundur?', ['Su daha ağırdır', 'Buharlaşma ısısı erime ısısından çok büyüktür', 'Isıtıcı yavaşlar', 'Buz daha soğuktur'], 1, '2260 J/g > 334 J/g'],
  ],
  kromatografi: [
    ['Rf değeri nasıl hesaplanır?', ['Çözücü yolu / boya yolu', 'Boya yolu / çözücü yolu', 'Boya yolu × çözücü yolu', 'Boya kütlesi / hacim'], 1, 'Rf her zaman 0 ile 1 arasındadır.'],
    ['Çözücü değişince boyaların sırası neden değişir?', ['Boyalar değişir', 'Boyaların çözücüyle etkileşim güçleri farklıdır', 'Kâğıt değişir', 'Sıcaklık değişir'], 1, 'Benzer benzeri çözer.'],
  ],
  mermer: [
    ['Hangi mermer en hızlı tepkimeye girer?', ['Blok', 'Parçalar', 'Toz', 'Hepsi eşit'], 2, 'Temas yüzeyi en büyük olan.'],
    ['Sonunda toplanan CO₂ miktarları neden eşittir?', ['Asit tükenmez', 'Mermer kütleleri eşittir', 'Hız eşittir', 'Sıcaklık eşittir'], 1, 'Ürün miktarı tepken miktarına bağlıdır, hıza değil.'],
  ],
  tampon: [
    ['Tampon çözeltiye az miktarda asit eklenince pH nasıl değişir?', ['Çok düşer', 'Çok az değişir', 'Artar', '7 olur'], 1, 'Asetat iyonları eklenen H⁺\'yı tutar.'],
    ['Asetat tamponu hangi maddeleri içerir?', ['HCl ve NaCl', 'CH₃COOH ve CH₃COONa', 'NaOH ve su', 'Yalnızca su'], 1, 'Zayıf asit ve onun tuzu.'],
  ],
}
