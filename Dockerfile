# 1. Node.js image'ini kullanıyoruz
FROM node:18-alpine

# 2. Çalışma dizinini ayarlıyoruz
WORKDIR /app

# 3. pnpm yüklemesi yapıyoruz
RUN npm install -g pnpm

# 4. package.json ve pnpm-lock.yaml dosyalarını kopyalıyoruz
COPY package.json pnpm-lock.yaml ./

# 5. Bağımlılıkları kuruyoruz
RUN pnpm install --frozen-lockfile

# 6. Proje dosyalarını kopyalıyoruz
COPY . .

# 7. Vite uygulamasını build ediyoruz
RUN pnpm run build

# 8. Serve paketi yüklemiyoruz, çünkü npx ile çalıştıracağız
# RUN pnpm add -g serve (Bu satırı kaldırdık)

# 9. Uygulamanın serve komutuyla çalıştırılması
CMD ["npx", "serve", "-s", "dist"]

# 10. Uygulamanın çalışacağı portu açıyoruz
EXPOSE 3000
EXPOSE 80
