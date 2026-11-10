import json
from pathlib import Path

# Deney föyü kaynakları: python fXX.py → public/icerik/<sınıf>/deney-foyleri.json
# Ardından: python ../deney_foyleri.py (foyIndex.ts)
def F(ad, amac, malzemeler, guvenlik, adimlar, sorular, tablo=None, sure=None, ipucu=None):
    d = dict(ad=ad, amac=amac, malzemeler=malzemeler, guvenlik=guvenlik, adimlar=adimlar, sorular=[dict(s=s, c=c) for s, c in sorular])
    if tablo: d['tablo'] = dict(basliklar=tablo[0], satirlar=tablo[1])
    if sure: d['sure'] = sure
    if ipucu: d['ipucu'] = ipucu
    return d
GOZLUK = 'Koruyucu gözlük, önlük ve eldiven kullanınız.'
ATIK = 'Deney sonunda çözeltileri öğretmeninizin gösterdiği atık kabına dökünüz; lavaboya dökmeyiniz.'
ISI = 'Isıtma yaparken saçınızı toplayınız; sıcak cam malzemeye maşa ile dokununuz.'
def yaz(sinif, veri):
    yol = Path(__file__).resolve().parents[2] / 'public' / 'icerik' / sinif / 'deney-foyleri.json'
    json.dump(veri, open(yol, 'w', encoding='utf-8'), ensure_ascii=False)
    print(sinif, len(veri), 'konu', sum(len(v) for v in veri.values()), 'föy')
