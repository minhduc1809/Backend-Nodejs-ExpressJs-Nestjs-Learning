# Tuần 4: Vấn đề của Express & Bước đệm tới Enterprise Backend

## 🎯 Mục tiêu
- Nhìn nhận khách quan những ưu/nhược điểm khi ứng dụng Express.js phình to lên mức doanh nghiệp (Enterprise scale).
- Hiểu kiến trúc MVC (Model-View-Controller) và cách áp dụng vào Express.
- Giải thích vì sao JavaScript "duck typing" lại gây khó khăn trong nhóm nhiều thành viên.
- Tại sao lại cần NestJS để thay thế?

---

## 📖 Phần 1: Ưu và nhược điểm của Express.js

### 1.1 Ưu điểm (Lý do Express là huyền thoại)
- **Cộng đồng khổng lồ**: Bất cứ thư viện, middleware hay câu hỏi lỗi nào bạn gặp phải đều đã có sẵn hàng triệu câu trả lời trên StackOverflow.
- **Tự do tuyệt đối (Unopinionated)**: Bạn muốn tổ chức thư mục kiểu gì cũng được. Code 1 file (`index.js`) hay 100 files, Express không bắt buộc.
- **Rất nhẹ và nhanh**: Không nhồi nhét những công cụ dư thừa.

### 1.2 Nhược điểm (Sự tự do là con dao hai lưỡi)
- **Thiếu cấu trúc quy chuẩn**: Vì Express không bắt buộc kiến trúc, mỗi dự án/công ty sẽ cấu trúc code khác nhau. Khi đổi dự án mới, bạn mất rất nhiều thời gian để "đọc hiểu" bộ khung của dự án.
- **Callback / Promise Hell**: Xử lý logic phức tạp dễ làm code dài ngoằng và lồng nhau khó đọc.
- **Khó Scale (Khó mở rộng dự án lớn)**: Khi số lượng Routes và Controllers lên tới con số hàng trăm, làm thế nào để quản lý các tính năng phụ thuộc lẫn nhau một cách rời rạc? Code file `A.js` cần file `B.js` dẫn đến "Spaghetti Code" (Code rối bời như mì Ý).
- **JavaScript là ngôn ngữ linh hoạt quá mức**: "Duck Typing" của JS cho phép biến đổi kiểu dữ liệu liên tục. Lỗi runtime do gọi hàm/chuyền biến sai (Undefined is not a function) chiếm rất cao tỉ lệ hỏng API.

---

## 📖 Phần 2: Kiến trúc MVC trong Express (Giải pháp tạm thời)

Đây là chuẩn mực tách biệt được sử dụng nhằm giảm tải cho App Express:
- **Model**: Nơi giao tiếp với CSDL (Ví dụ: Thư mục `models/User.js`). Xử lý cấu trúc dữ liệu.
- **View**: Giao diện (Thường Backend chỉ làm API nên phần này chuyển dữ liệu JSON thay vì thiết kế HTML).
- **Controller**: Nơi chứa logic nghiệp vụ chính (Business logic) `controllers/userController.js`. Ở đây sẽ nhận Request, gọi Model lất data, kiểm tra logic, và trả về Response.

*Mặc dù có MVC, việc tái sử dụng code giữa các Controllers ("Dependency") vẫn tốn công quản lý (phải require/import thủ công).*

---

## 📖 Phần 3: Tại sao lại là NestJS?

NestJS ra đời để khắc phục hoàn toàn những nhược điểm trên của Node.js:
1. **Kiến trúc chặt chẽ (Opinionated)**: Nest ép nhà phát triển sử dụng một cấu trúc chung cực mạnh (gọi là Modular architecture) được học hỏi từ Angular. Điều này giúp mọi developer cùng 1 tiếng nói.
2. **TypeScript 100%**: An toàn kiểu dữ liệu! Lỗi được phát hiện ngay khi bạn vừa gõ phím chứ không cần đợi tới lúc ứng dụng chạy mới hỏng.
3. **Dependency Injection (DI) & Inversion of Control (IoC)**: Quản lý tự động các `instance` của các Service. Cho phép tiêm sự phụ thuộc siêu tiện lợi thay vì dùng `require()` gọi biến truyền đi truyền lại.

---
## 💻 Bài tập & Thảo luận
1. Phân tích: Tại sao khi bạn viết ứng dụng Express.js và lỡ đánh vần sai tên của thuộc tính trong Body (`req.body.emai` thay vì `email`), Express không hề cảnh báo lỗi?
2. Bắt đầu cài đặt TypeScript trên máy để sẵn sàng cho phần Crash Course tiếp theo.
