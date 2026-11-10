"""public/icerik/<sinif>/deney-foyleri.json dosyalarından src/data/foyIndex.ts dizinini üretir.

Kullanım: python tools/deney_foyleri.py
"""
import json
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
anahtarlar = []
for yol in sorted((KOK / 'public/icerik').glob('*/deney-foyleri.json')):
    sinif = yol.parent.name
    veri = json.loads(yol.read_text(encoding='utf-8'))
    anahtarlar += [f'{sinif}:{kod}' for kod, foyler in veri.items() if foyler]
icerik = '// Otomatik üretilir (tools/deney_foyleri.py). Deney föyü olan konular.\nexport const FOYLU_KONULAR = new Set<string>([\n' + ''.join(f"  '{a}',\n" for a in anahtarlar) + '])\n'
(KOK / 'src/data/foyIndex.ts').write_text(icerik, encoding='utf-8')
print(len(anahtarlar), 'konu')
