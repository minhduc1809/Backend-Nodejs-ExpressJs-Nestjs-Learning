# Tuần 12: Đóng gói với Docker & Triển khai lên Production (Deploy)

## 🎯 Mục tiêu
- Hiểu khái niệm Docker (Đóng gói ứng dụng vào container).
- Viết Image Dockerfile cho dự án NestJS.
- Viết `docker-compose.yml` để chạy liền 1 cục Back-End chung với cục Database MongoDB.
- Cơ sở nền tảng quy trình CI/CD tích hợp Push code từ GitHub lên Server (VPS/Cloud).

---

## 📖 Phần 1: Docker là gì? Tại sao phải sài Docker?

**Vấn đề:** "Team em chạy code tốt trên máy mà lên máy sếp lại lỗi thiếu version Node.js!".
**Giải pháp:** Docker. 

Thay vì cài Node, PM2 rối rắm lên VPS sếp, bạn gộp *Source Code + Hệ điều hành Linux nhỏ con xíu + Node.js Engine* thành 1 khối (Image). 
Bất kỳ máy tính / server nào cài Docker đều tải hình chép (Image) đó về chạy 1 phát được y chang nhau luôn. (gọi là 1 Container).

---

## 📖 Phần 2: Dockerize NestJS App

### 2.1 Chuẩn bị tạo `Dockerfile`
Tạo 1 file tên chính xác là `Dockerfile` (không đuôi) ở thư mục gốc Project NestJS.

```dockerfile
# Bước 1: Khởi động từ 1 máy ảo có sẵn Node.js (Alpine siêu nhẹ)
FROM node:18-alpine As build

# Bước 2: Chỉ định thư mục làm việc trong máy ảo
WORKDIR /usr/src/app

# Bước 3: Copy các file chứa dependencies (package.json và package-lock.json) vào trước
COPY package*.json ./

# Bước 4: Chạy lệnh cài đặt
RUN npm ci

# Bước 5: Copy toàn bộ mã nguồn của dự án vô
COPY . .

# Bước 6: Build dự án NestJS TSC -> sinh ra folder /dist
RUN npm run build

# --- Tầng Production Siêu Nhẹ ---
FROM node:18-alpine As production
WORKDIR /usr/src/app

# Copy package và môi trường, cài đặt các deps CHỈ dành cho Prod (-g, thiếu devDeps)
COPY package*.json ./
RUN npm ci --only=production

# Lấy kết quả file JS Compile /dist từ phía khối build gắn vô khối run
COPY --from=build /usr/src/app/dist ./dist

# Mở cổng cho thế giới
EXPOSE 3000

# Khởi chạy file code thật đã compile ra JS
CMD ["node", "dist/main"]
```

### 2.2 Đóng File Ignore
Tạo `.dockerignore`:
```text
node_modules
dist
.env
```

---

## 📖 Phần 3: Chạy song song Docker Compose chung Database

Tạo `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Cột Backend
  nhanvien-api:
    build: .
    ports:
      - '3000:3000'
    env_file:
      - .env
    environment:
      - MONGODB_URI=mongodb://my-mongo:27017/nest-db
    depends_on:
      - my-mongo

  # Cột CSDL MongoDB
  my-mongo:
    image: mongo:latest
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db # Ghi đè RAM để Data ko bị bay màu khi tắt

volumes:
  mongo_data:
```

### 2.3 Cách chạy Toàn bộ Trái Đất
```bash
docker-compose up --build -d
```
Gõ 1 lệnh là toàn bộ API + Database của chúng ta Online! Test bằng Postman. 

---

## 📖 Phần 4: Roadmap Tiếp THEO Khi Tốt nghiệp khóa học 🎓

- Đăng ký GitHub Actions tích hợp mảng CI/CD cơ bản. Mọi Push pull request sẽ Auto chạy hàm Test. Nếu passed thì kết nối SSH Deploy tự động vảo server VPS của bạn ở DigitalOcean / Vultr. 
- Mua Domain và gắn Chứng chỉ SSL Cloudflare chuyển về nginx Proxy trước mặt khối NestJS API.
- Xin mời tiếp tục tìm hiểu thêm về **Microservices** nếu muốn trở thành Senior thật thụ.  

🎉🎉 **CHÚC MỪNG HOÀN THÀNH LỘ TRÌNH 12 TUẦN BACK-END EXPRESS TO NEST!** 🎉🎉
