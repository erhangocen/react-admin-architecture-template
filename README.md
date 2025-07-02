# React Admin Architecture Template

Bu proje, modern ve ölçeklenebilir bir React admin paneli geliştirmek isteyenler için başlangıç mimarisi sunar. Domain'e özel kodlardan arındırılmıştır ve kolayca kendi projenize entegre edebilirsiniz.

## Özellikler
- Modern React (18+) mimarisi
- Vite + TypeScript + TailwindCSS
- Shadcn UI ve Radix UI tabanlı component mimarisi
- Hazır authentication, ayarlar, dashboard, hata sayfaları
- Kolayca genişletilebilir dosya ve klasör yapısı

## Kurulum

```bash
# Bağımlılıkları yükleyin
pnpm install
# veya
yarn install
# veya
npm install

# Geliştirme sunucusunu başlatın
pnpm dev
# veya
yarn dev
# veya
npm run dev
```

## Klasör Yapısı

```
src/
  components/      # UI ve custom componentler
  data/            # Ortak veri, sabitler, modeller
  hooks/           # Ortak hooklar
  lib/             # Yardımcı fonksiyonlar
  pages/           # Sayfalar (auth, dashboard, settings, errors, vs.)
  assets/          # Statik dosyalar
  network/         # API ve network işlemleri
  main.tsx         # Uygulama giriş noktası
  router.tsx       # Router tanımı
```

## Örnek Sayfalar
- Giriş/Çıkış (auth)
- Dashboard (örnek ana sayfa)
- Ayarlar (tema, profil, bildirim)
- Hata sayfaları (404, 500, bakım)
- Görevler (örnek tablo)

## Kendi Projenize Entegre Etme
1. Kendi domain modellerinizi ve sayfalarınızı ekleyin.
2. Gereksiz örnek sayfaları silebilirsiniz.
3. UI componentlerini özelleştirin veya yenilerini ekleyin.

## Katkı
Pull request ve issue açarak katkıda bulunabilirsiniz.

---

**Not:** Bu template, domain'e özel kodlardan arındırılmıştır. Kendi iş kurallarınızı ve veri modellerinizi ekleyerek özelleştirebilirsiniz.
