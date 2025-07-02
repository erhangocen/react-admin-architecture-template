# React Admin Architecture Template

Bu proje, modern ve ölçeklenebilir bir React admin paneli geliştirmek isteyenler için başlangıç mimarisi sunar. Domain'e özel kodlardan arındırılmıştır ve kolayca kendi projenize entegre edebilirsiniz.

## 🚀 Kullanılan Başlıca Kütüphaneler & Hızlı Başlangıç

### 🖼️ UI & Componentler
- **Shadcn UI** & **Radix UI**  
  Modern, erişilebilir ve özelleştirilebilir React componentleri.  
  Kullanım:  
  ```tsx
  import { Button } from "@/src/components/ui/button";
  <Button>Click me</Button>
  ```
- **Lucide React** & **@tabler/icons-react**  
  SVG ikonlar.  
  Kullanım:  
  ```tsx
  import { Home } from "lucide-react";
  <Home />
  ```

### 🎨 Stil & Animasyon
- **TailwindCSS**  
  Utility-first CSS framework.  
  Kullanım:  
  ```tsx
  <div className="p-4 bg-primary text-white">Hello</div>
  ```
- **tailwindcss-animate** & **framer-motion**  
  Animasyonlar için.  
  Kullanım:  
  ```tsx
  import { motion } from "framer-motion";
  <motion.div animate={{ scale: 1.2 }} />
  ```

### 🧩 Formlar & Doğrulama
- **react-hook-form**  
  Form yönetimi.  
  Kullanım:  
  ```tsx
  const { register, handleSubmit } = useForm();
  ```
- **zod** & **@hookform/resolvers**  
  Şema tabanlı doğrulama.  
  Kullanım:  
  ```tsx
  import { z } from "zod";
  const schema = z.object({ email: z.string().email() });
  ```

### 📊 Grafik & Tablo
- **echarts-for-react** & **recharts**  
  Grafikler ve veri görselleştirme.  
  Kullanım:  
  ```tsx
  import ReactECharts from "echarts-for-react";
  <ReactECharts option={option} />
  ```

### 🔗 Network & API
- **axios**  
  HTTP istekleri için.  
  Kullanım:  
  ```tsx
  import axios from "axios";
  axios.get("/api/data");
  ```
- **@tanstack/react-query**  
  Veri fetch ve cache yönetimi.  
  Kullanım:  
  ```tsx
  import { useQuery } from "@tanstack/react-query";
  ```

### 🛠️ Diğerleri
- **dayjs**  
  Tarih işlemleri.
- **clsx** & **class-variance-authority**  
  Dinamik className yönetimi.
- **jwt-decode**  
  JWT token çözümleme.

---

### ⚡ Hızlı Başlangıç

1. Bağımlılıkları yükle:  
   ```bash
   pnpm install
   ```
2. Geliştirme sunucusunu başlat:  
   ```bash
   pnpm dev
   ```
3. Componentleri ve hookları `src/components` ve `src/hooks` altından kullanmaya başla!

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
