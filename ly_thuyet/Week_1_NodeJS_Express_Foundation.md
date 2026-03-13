# Tuần 1: Nền tảng Node.js & Server Express Đầu Tiên

## 🎯 Mục tiêu tuần học
- Hiểu được bản chất của Node.js (Tại sao nó nhanh? Nó hoạt động thế nào?).
- Nắm được cách quản lý thư viện với `npm` và file `package.json`.
- Hiểu HTTP protocol cơ bản (Request/Response).
- Khởi tạo thành công server Express.js đầu tiên.

---

## 📖 Phần 1: Node.js là gì? Hiểu bản chất cốt lõi
Thường khi Code JavaScript, bạn chạy nó trên trình duyệt (Chrome, Safari,...). **Node.js** chính là một môi trường giúp mang JavaScript ra ngoài trình duyệt, chạy trực tiếp trên máy tính/server của bạn.

### 1.1 Tính chất quan trọng nhất của Node.js: "Non-blocking I/O"
Để dễ hiểu, hãy tưởng tượng server của bạn là một **Quán phở** và Node.js là **Anh phục vụ bàn duy nhất (Single Thread)**.

- **Mô hình cũ (Blocking I/O):** Anh phục vụ nhận order của khách bàn 1 -> Chạy vào bếp đợi phở -> Mang ra cho khách bàn 1 -> XONG mới sang bàn 2 nhận order. => Rất chậm.
- **Mô hình Node.js (Non-blocking I/O):** Anh phục vụ nhận order bàn 1 -> Chuyển ngay cho nhà bếp -> Lập tức nhận order bàn 2, bàn 3. Khi nào bếp báo xong phở bàn 1 (Call-back/Event Loop), anh ta mới mang ra. => Hiệu năng cực cao.

### 1.2 V8 Engine
Node.js sử dụng V8 Engine của Google Chrome để dịch mã JavaScript sang mã máy với tốc độ chớp nhoáng.

---

## 📖 Phần 2: Khởi tạo dự án & Quản lý Package (NPM)

### 2.1 Bước 1: Khởi tạo project
```bash
mkdir express-course-w1
cd express-course-w1
npm init -y
```
- Lệnh `npm init -y` tạo ra file `package.json`. Đây là bản "Hợp đồng thiết kế", lưu tên dự án và danh sách tất cả các thư viện cần dùng.

### 2.2 Bước 2: Cài đặt Express và Nodemon
```bash
npm install express
npm install --save-dev nodemon
```
- `express`: Framework giúp viết server Node.js nhanh.
- `nodemon`: Tự động restart server mỗi khi code thay đổi.

---

## 📖 Phần 3: Ứng dụng Express.js đầu tiên

Tạo một file tên là `index.js` ở thư mục gốc:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Xin chào! Đây là server Express đầu tiên của tôi.');
});

app.get('/api/info', (req, res) => {
    res.json({
        name: "Backend Developer",
        course: "Node.js to NestJS",
        status: "Learning"
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

Cấu hình `package.json` trong phần `scripts`:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```
Chạy `npm run dev` và truy cập `http://localhost:3000`.

---
## 💻 Bài tập thực hành
Thêm route `GET /api/me` trả về thông tin cá nhân của bạn dưới dạng JSON.
