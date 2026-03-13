# Tuần 2: Routing chi tiết & Middleware trong Express.js

## 🎯 Mục tiêu
- Nắm vững cách định tuyến (Routing) nâng cao với Express router.
- Hiểu cách truy xuất dữ liệu từ HTTP Request (Params, Query, Body).
- Nắm vững khái niệm Middleware - cốt lõi của ứng dụng Express.
- Triển khai xử lý lỗi (Error Handling) tập trung.

---

## 📖 Phần 1: Hệ thống Routing cơ bản và nâng cao

Routing là cách ứng dụng phản hồi lại yêu cầu (request) của client tới một endpoint cụ thể.

### 1.1 Các phương thức HTTP (HTTP Methods)
- **GET**: Lấy dữ liệu.
- **POST**: Gửi/Tạo mới dữ liệu.
- **PUT / PATCH**: Cập nhật dữ liệu.
- **DELETE**: Xóa dữ liệu.

```javascript
app.get('/users', (req, res) => res.send('Danh sách user'));
app.post('/users', (req, res) => res.send('Tạo user mới'));
app.put('/users/:id', (req, res) => res.send('Cập nhật user'));
app.delete('/users/:id', (req, res) => res.send('Xóa user'));
```

### 1.2 Nhận dữ liệu từ Client (Params, Query, Body)

- **Req.params**: Nhận tham số động trên URL.
  ```javascript
  // URL: /users/123
  app.get('/users/:id', (req, res) => {
    console.log(req.params.id); // "123"
  });
  ```

- **Req.query**: Nhận dữ liệu truyền qua URL sau dấu `?`.
  ```javascript
  // URL: /search?keyword=laptrinh&page=1
  app.get('/search', (req, res) => {
    console.log(req.query.keyword); // "laptrinh"
  });
  ```

- **Req.body**: Nhận dữ liệu thông qua Request Body (thường dùng ở POST/PUT).
  ```javascript
  // Cần thêm Middleware này để Express tự động parse JSON body
  app.use(express.json()); 

  app.post('/users', (req, res) => {
    console.log(req.body); // { username: "abc", password: "123" }
  });
  ```

### 1.3 `express.Router()`
Giúp chia nhỏ file, quản lý route theo từng module thành phần:
```javascript
// file: routes/user.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Danh sách users'));
module.exports = router;

// file: index.js
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);
```

---

## 📖 Phần 2: Middleware

**Middleware** là những hàm có quyền truy cập tới `request`, `response` và hàm `next()`.
Mô hình hoạt động: Request --> [Middleware 1] --> [Middleware 2] --> [Route Handler] --> Response.

### 2.1 Cấu trúc một form Middleware
```javascript
const myLogger = function (req, res, next) {
  console.log('Có request mới từ: ', req.url);
  next(); // Bắt buộc phải gọi next() nếu không server sẽ bị treo ở đây
};

// Áp dụng middleware cho mọi route
app.use(myLogger);
```

### 2.2 Sử dụng middleware có sẵn hữu ích
```bash
npm install cors helmet morgan
```
- **cors**: Cho phép client khác domain gọi API của bạn.
- **helmet**: Thêm các header bảo mật cơ bản.
- **morgan**: Tự động log các request HTTP ra console (rất tiện để debug).

### 2.3 Error Handling Middleware
Express có 1 middleware xử lý lỗi đặc biệt (nhận 4 tham số):
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Đã có lỗi phía Server!' });
});
```

---
## 💻 Bài tập thực hành
Tạo file chuyên quản lý mảng dữ liệu (CRUD danh sách Sản phẩm bằng memory array).
- Viết API GET /products để lấy danh sách.
- Viết API POST /products để thêm cấu hình gửi qua `req.body`.
- Viết một middleware logger cơ bản cho dự án.
