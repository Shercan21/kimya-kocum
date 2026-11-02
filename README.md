# Kimya Koçum

9–12. sınıf öğrencileri ve TYT/AYT adayları için yapay zekâ destekli kişisel kimya koçu. Telefon, tablet ve bilgisayarda çalışan bir PWA.

Ana proje planı: [docs/PLAN.md](docs/PLAN.md)

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5174
```

## Derleme

```bash
npm run build      # dist/ klasörüne derler
npm run preview    # derlenmiş sürümü http://localhost:4174 adresinde açar
```

GitHub Pages için alt yol ile derleme:

```bash
BASE_PATH=/kimya-kocum/ npm run build
```

Windows PowerShell'de:

```powershell
$env:BASE_PATH="/kimya-kocum/"; npm run build
```

## Teknik notlar

- React 19 + TypeScript + Vite
- Veriler şimdilik tarayıcıda (localStorage, `kimya-kocum-` önekli anahtarlar) saklanır.
- Service worker (`public/sw.js`) yalnızca derlenmiş sürümde çalışır; yeni sürümde `CACHE` adını artırın.

## İçerik (konu anlatımı, testler, etkinlikler)

9, 10 ve 11. sınıf içerikleri Shercan Kimya'dan, kazanımlar `kimya klasör/kazanımlar/config.py` dosyasından aktarılır:

```bash
python tools/icerik_aktar.py "C:/Users/LENOVO/Desktop/shercan-kimya" "C:/Users/LENOVO/Desktop/kimya klasör/kazanımlar/config.py" public/icerik src/data/mufredat.json
```

- `src/data/mufredat.json` → sınıf / tema / bölüm / konu / kazanım ağacı (uygulamaya gömülü)
- `public/icerik/<sınıf>/testler.json`, `konular.json`, `etkinlikler.json` ve `public/icerik/img/` → gerektiğinde yüklenir
