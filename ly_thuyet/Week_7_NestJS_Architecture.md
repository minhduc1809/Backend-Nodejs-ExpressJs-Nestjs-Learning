# Tuần 7: Kiến trúc Hệ Thống của NestJS (Enterprise Scale)

## 🎯 Mục tiêu
- Hiểu thấu đáo về nguyên lý Dependency Injection (DI) và Inversion of Control (IoC).
- Gom nhóm và thiết kế các Feature Modules (`@Module`).
- Phân biệt giữa Global Module và Feature Module.
- Vận dụng chia tách dự án lớn (Monolith hoặc Microservices).

---

## 📖 Phần 1: Dependency Injection (DI) và Inversion of Control (IoC)

### 1.1 Khái niệm IoC (Inversion of Control)
Thay vì tự tay tạo ra các đối tượng service bằng từ khóa `new Service()`, bạn "giao phó" quyền đó lại cho Framework. Việc đổi này gọi là "Đảo ngược luồng điều khiển" (Inversion).

**Lợi ích:** 
- Khi đổi 1 thành phần từ thư viện A sang B, không phải sửa ở hàng trăm file đang `new A()`.
- Rất dễ viết Unit Test vì có thể bơm (inject) một service giả (Mocks) vào thay vì đồ thật.

### 1.2 Nguyên lý DI trong NestJS
- NestJS tạo ra **IoC Container** chạy ngầm khi khởi động ứng dụng.
- Khi framework đọc qua Constructor của `UsersController`, nó thấy cần 1 bản thể `UsersService`. 
- IoC Container tự lục lọi trong danh sách `providers` để bốc `UsersService` ném vào cho bạn.

```typescript
@Injectable() // Từ khóa Đánh dấu class này chịu sự quản lý của DI
export class LoggerService {
  log(msg: string) { console.log(msg) }
}
```

---

## 📖 Phần 2: Design bằng Modules (`@Module`)

### 2.1 Tại sao cần Module?
Dự án có hàng ngàn route, hàng trăm service. Module đóng vai trò là "Thư mục ảo", đóng gói Controller và Service của một nghiệp vụ cụ thể thành 1 cục (Feature).

### 2.2 Định nghĩa các mảng cốt lõi của `@Module`
```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [], // List các Module khác mà Module này cần xài lại. Thí dụ Module Auth cần UsersModule để tìm User
  controllers: [UsersController], // List các Controllers muốn kích hoạt trong module này
  providers: [UsersService], // List các Services mà IoC sẽ nạp vào
  exports: [UsersService] // Ném Service này ra ngoài để các Module khác (nếu import module này) có thể gọi ké!
})
export class UsersModule {}
```

Nếu quên `exports`, một Module khác Import `UsersModule` cũng sẽ bị Nest báo lỗi không tìm thấy Service (Đây là cơ chế Private Default rất an toàn của Nest).

### 2.3 Global Module (Gói tiện ích dùng chung)
Một số thứ như Kết nối Database, Quản lý biến môi trường (.env), Logging ghi chú,... Bạn gọi nó ở TẤT CẢ mọi Feature cụ thể khác.
Thay vì phải list thủ công tên `import: [MyLoggerModule]` ở mọi File `xxxx.module.ts`. Bạn dùng `@Global()`.

```typescript
import { Module, Global } from '@nestjs/common';

@Global() // Đặt Decorator Global ở đây!
@Module({
  providers: [SuperLoggerService],
  exports: [SuperLoggerService],
})
export class AwesomeLoggerModule {}
```

---

## 📖 Phần 3: Phân rã cấu trúc File cho một Module

Khi một module phình to:

```text
/users/
├── dto/                 # Định nghĩa validation dữ liệu đầu vào (CreateUserDto)
├── entities/            # Định nghĩa các Schema của DB (UserSchema cho Mongoose hoặc class TypeORM)
├── users.controller.ts  # Chỉ chứa Decorator Routes
├── users.service.ts     # Trục cốt lõi xử lý Logic
├── users.module.ts      # Bật các file trong package
└── users.repository.ts  # (Tùy dự án mở rộng, Repo là tầng trừu tượng gọi Query tới Database trực tiếp)
```

## 💻 Bài tập thực hành
1. Xóa hết file mặc định (`app.controller`, `app.service`).
2. Tự xây dựng cấu trúc Module `Auth` và Module `Users`.
3. Cho `AuthService` tiêm và gọi lấy thông tin user nhờ `exports` từ `UsersModule`. (Đây là ví dụ kinh điển ở thực tế).
