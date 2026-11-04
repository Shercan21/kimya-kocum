"""Kimya Koçum soru bankası ve etkinlik kitabı çıktılarını uygulamaya aktarır.

Eski (Shercan'dan gelen) testlerin ve etkinliklerin yerine geçer:
  public/icerik/<sinif>/testler.json      ← soru bankası (kazanım, bağlam, sarmal, karma testleri)
  public/icerik/<sinif>/etkinlikler.json  ← etkinlik kitabı
  src/data/mufredat.json                  ← konu/bölüm/sınıf test listeleri ve soru sayıları

Kullanım:
    python tools/soru_bankasi_aktar.py <soru bankası çıktı klasörü>
Örnek:
    python tools/soru_bankasi_aktar.py ../sb/cikti
(<klasör>/<sinif>/Kimya-Kocum-<sinif>-sinif-soru-bankasi.json ve
 <klasör>/etkinlik/<sinif>/Kimya-Kocum-<sinif>-sinif-etkinlik-kitabi.json okunur.)
"""

import json
import sys
from collections import OrderedDict
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
SINIFLAR = ['9', '10', '11']
SEV = {'kolay': 'Kolay', 'orta': 'Orta', 'zor': 'Zor'}
SEV_SIRA = {'kolay': 0, 'orta': 1, 'zor': 2}


def temiz(sorular):
    # Uygulamanın Soru tipine uygun alanlar
    return [{k: v for k, v in s.items() if k in ('s', 'sik', 'd', 'c', 'z', 'k') and v is not None} for s in sorular]


def main(cikti: Path):
    mufredat_yol = KOK / 'src/data/mufredat.json'
    mufredat = json.loads(mufredat_yol.read_text(encoding='utf-8'))
    ozet = []
    sayilar = {}
    for sinif in SINIFLAR:
        sb = json.loads((cikti / sinif / f'Kimya-Kocum-{sinif}-sinif-soru-bankasi.json').read_text(encoding='utf-8'))
        etk = json.loads((cikti / 'etkinlik' / sinif / f'Kimya-Kocum-{sinif}-sinif-etkinlik-kitabi.json').read_text(encoding='utf-8'))
        M = mufredat[sinif]
        testler = OrderedDict()

        # --- konu kazanım testleri: konu başına tek dosya, Kolay/Orta/Zor seviyeleri
        kazanim = {}
        for t in sb:
            if t['tur'] == 'kazanim':
                kazanim.setdefault(t['konu'], []).append(t)
        baglam = {}
        for t in sb:
            if t['tur'] == 'baglam':
                baglam.setdefault(t['konu'], []).append(t)
        sarmal = {}
        for t in sb:
            if t['tur'] == 'sarmal':
                sarmal.setdefault(t['bolum'], []).append(t)
        karma = [t for t in sb if t['tur'] == 'karma']

        for tema in M['temalar']:
            for bolum in tema['bolumler']:
                for konu in bolum['konular']:
                    kod = konu['kod']
                    kt = sorted(kazanim.get(kod, []), key=lambda t: SEV_SIRA[t['seviye']])
                    assert kt, f'{sinif} {kod}: kazanım testi yok'
                    tid = f'k{kod}'
                    testler[tid] = dict(id=tid, baslik=f'{kod} {konu["ad"]}', tur='kazanim',
                                        testler=[dict(seviye=SEV[t['seviye']], sorular=temiz(t['sorular'])) for t in kt])
                    konu['test'] = tid
                    konu['seviyeler'] = [SEV[t['seviye']] for t in kt]
                    konu['soru'] = sum(len(t['sorular']) for t in kt)
                    konu['baglam'] = []
                    for t in sorted(baglam.get(kod, []), key=lambda t: (t['kz'], SEV_SIRA[t['seviye']])):
                        bid = f'b{kod}-{t["kz"].split(".", 2)[-1]}-{t["seviye"]}'
                        testler[bid] = dict(id=bid, baslik=f'{t["kz"]} · Bağlam temelli test ({SEV[t["seviye"]]})', tur='baglam',
                                            testler=[dict(seviye=None, sorular=temiz(t['sorular']))])
                        konu['baglam'].append(dict(id=bid, baslik=f'Bağlam temelli test · {SEV[t["seviye"]]}',
                                                   kazanim=t['kz'], soru=len(t['sorular'])))
                bolum['sarmal'] = []
                for i, t in enumerate(sarmal.get(bolum['kod'], [])):
                    sid = f's{bolum["kod"]}-{i + 1}'
                    sev = SEV.get(t['seviye'], '')
                    testler[sid] = dict(id=sid, baslik=f'Sarmal test {bolum["kod"]}-{i + 1} ({sev}) · {bolum["ad"]}', tur='sarmal',
                                        testler=[dict(seviye=None, sorular=temiz(t['sorular']))])
                    bolum['sarmal'].append(dict(id=sid, baslik=f'Sarmal {i + 1} · {sev}', soru=len(t['sorular'])))
        M['karma'] = []
        for i, t in enumerate(karma):
            mid = f'karma-{i + 1:02d}'
            testler[mid] = dict(id=mid, baslik=f'Karma test {i + 1:02d}', tur='karma',
                                testler=[dict(seviye=None, sorular=temiz(t['sorular']))])
            M['karma'].append(dict(id=mid, baslik=f'Karma test {i + 1:02d}', soru=len(t['sorular'])))

        # --- etkinlikler: konu kodu → kitap
        for tema in M['temalar']:
            for bolum in tema['bolumler']:
                for konu in bolum['konular']:
                    assert konu['kod'] in etk, f'{sinif} {konu["kod"]}: etkinlik yok'
                    konu['etkinlik'] = len(etk[konu['kod']]['etkinlikler'])

        hedef = KOK / 'public/icerik' / sinif
        (hedef / 'testler.json').write_text(json.dumps(testler, ensure_ascii=False), encoding='utf-8')
        (hedef / 'etkinlikler.json').write_text(json.dumps(etk, ensure_ascii=False), encoding='utf-8')
        n_soru = sum(len(x['sorular']) for d in testler.values() for x in d['testler'])
        n_etk = sum(len(v['etkinlikler']) for v in etk.values())
        sayilar[sinif] = dict(konu=sum(len(b['konular']) for t in M['temalar'] for b in t['bolumler']), soru=n_soru,
                              kazanim=len({k for t in M['temalar'] for b in t['bolumler'] for kn in b['konular'] for k in kn['kazanimlar']}), etkinlik=n_etk)
        ozet.append(f'{sinif}. sınıf: {len(testler)} test dosyası, {n_soru} soru, {n_etk} etkinlik')

    mufredat_yol.write_text(json.dumps(mufredat, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    (KOK / 'public/icerik/ozet.json').write_text(json.dumps(sayilar, ensure_ascii=False), encoding='utf-8')
    print('\n'.join(ozet))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
