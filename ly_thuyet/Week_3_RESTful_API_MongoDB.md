# Tuần 3: RESTful API & Kết nối MongoDB bằng Mongoose

## 🎯 Mục tiêu
- Hiểu chuyên sâu về nguyên tắc thiết kế API theo chuẩn RESTful.
- Thiết lập MongoDB và MongoDB Atlas (Cloud).
- Hiểu kiến trúc ODM (Object Document Mapper) và sử dụng Mongoose.
- Thực hiện CRUD (Create, Read, Update, Delete) với MongoDB và Express.

---

## 📖 Phần 1: Tiêu chuẩn RESTful API

RESTful API là một tập hợp các quy tắc thiết kế API để client và server giao tiếp tốt nhất.

### 1.1 Resource định vị bởi URI
Thay vì dùng Request Name như: `/get-users`, `/create-user`, REST dùng danh từ số nhiều (Resource) kết hợp với HTTP Method:
- GET `/users`: Lấy danh sách users
- GET `/users/:id`: Lấy 1 user
- POST `/users`: Tạo user
- PUT `/users/:id`: Cập nhật user toàn bộ
- PATCH `/users/:id`: Cập nhật user 1 phần
- DELETE `/users/:id`: Xóa user

### 1.2 Tận dụng HTTP Status Codes
Backend phải trả về Status Code đúng đắn báo hiệu kết quả gọi API:
- `200 OK`: Thành công
- `201 Created`: Tạo mới thành công
- `400 Bad Request`: Lỗi dữ liệu gửi lên sai (Ví dụ: Email không đúng định dạng)
- `401 Unauthorized`: Chưa đăng nhập
- `403 Forbidden`: Không có quyên truy cập
- `404 Not Found`: Không tìm thấy dữ liệu
- `500 Internal Server Error`: Server bị lỗi (lỗi code, chết DB...)

---

## 📖 Phần 2: MongoDB cơ bản & Setup Mongoose

**MongoDB** là database dạng NoSQL. Thay vì lưu bằng Bảng (Table), Dòng (Row), MongoDB lưu dữ liệu bằng Collection (Tập hợp) chứa các Document dạng Object JSON (kích thước linh hoạt).

### 2.1 Cài đặt Mongoose
Mongoose là một thư viện giúp Express.js giao tiếp với MongoDB một cách có tổ chức (Model/Schema).
```bash
npm install mongoose
```

### 2.2 Kết nối tới MongoDB
```javascript
const mongoose = require('mongoose');

// Thay chuỗi "mongodb://..." bằng chuỗi trên MongoDB Atlas của bạn hoặc kết nối local
mongoose.connect('mongodb://localhost:27017/my_database')
  .then(() => console.log('✅ Kết nối MongoDB thành công!'))
  .catch((err) => console.log('❌ Kết nối thất bại!', err));
```

---

## 📖 Phần 3: Schema, Model & CRUD Dữ liệu

### 3.1 Định nghĩa Schema và Model
Schema là bản thiết kế quy định Document trong DB sẽ có những field nào.
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18 },
  createdAt: { type: Date, default: Date.now }
});

// Model dùng để tương tác trực tiếp tới collection 'users'
const User = mongoose.model('User', userSchema);
module.exports = User;
```

### 3.2 Viết API xử lý CRUD

**Tạo mới (Create)**
```javascript
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Đọc dữ liệu (Read)**
```javascript
app.get('/users', async (req, res) => {
  const users = await User.find(); // Lấy tất cả
  res.status(200).json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User không tồn tại' });
  res.status(200).json(user);
});
```

**Cập nhật (Update)**
```javascript
app.put('/users/:id', async (req, res) => {
  // Option {new: true} để Mongoose trả về user *sau* khi đã update
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedUser);
});
```

**Xóa (Delete)**
```javascript
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Đã xóa user' });
});
```

---
## 💻 Bài tập thực hành
Thay thế bài tập quản lý Array Memory ở Tuần 2 thành quản lý bằng MongoDB Mongoose.
1. Khởi tạo MongoDB Collection "Products".
2. Khai báo Schema Product có name, price, description.
3. Hoàn tất RESTful 5 APIs (GET List, GET Detail, POST, PUT, DELETE).
