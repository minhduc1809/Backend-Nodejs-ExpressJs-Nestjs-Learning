# Tuần 6: Nhập môn NestJS & Core Concepts

## 🎯 Mục tiêu
- Cài đặt NestJS CLI và khởi tạo project đầu tiên.
- Khám phá các thư mục gốc và quy chuẩn đặt tên trong NestJS.
- Hiểu Core Concepts: Controllers, Providers (Services), Moudles.

---

## 📖 Phần 1: Khởi tạo và thiết lập

### 1.1 Cài đặt Nest CLI bằng NPM Toàn Cục (Global)
```bash
npm install -g @nestjs/cli
```

### 1.2 Tạo dự án mới cực đỉnh
Thay vì phải cài tay Babel, Middleware, Cors, TsNode... như trong Express, NestJS có một lệnh tạo toàn bộ dự án Enterprise:
```bash
nest new my-nest-project
cd my-nest-project
npm run start:dev
```
Truy cập `http://localhost:3000` và xem dòng chữ "Hello World!". Mọi thứ được build bằng TypeScript 100%.

### 1.3 Cấu trúc thư mục ban đầu (`src`)
- `main.ts`: File khởi động ứng dụng (EntryPoint), chứa hàm bootstrap(). Nhờ sự kiện app.listen().
- `app.module.ts`: Root module gom tất cả vào để chạy (như bo mạch chủ máy tính).
- `app.controller.ts`: Nơi định nghĩa Route (GET '/' trả về cái gì).
- `app.service.ts`: Nơi chứa Logic thật sự.

---

## 📖 Phần 2: Controllers trong NestJS

Controller nhận HTTP Request và trả HTTP Response về.
Trong Express.js, ta gọi `app.get()`. Ở NestJS, ta dùng Decorators (Cú pháp Bắt đầu bằng chữ `@`).

```typescript
import { Controller, Get, Post, Param, Body } from '@nestjs/common';

@Controller('users')  // Định tuyến tổng: /users
export class UsersController {
  
  @Get() // -> GET /users
  getAllUsers(): string {
    return 'Lấy danh sách Users';
  }

  @Get(':id') // -> GET /users/123
  getUserDetail(@Param('id') userId: string): string {
    return `Lấy User có ID là ${userId}`;
  }

  @Post() // -> POST /users
  createUser(@Body() bodyData: any): string {
    return `Nhận được payload: ${JSON.stringify(bodyData)}`;
  }
}
```

---

## 📖 Phần 3: Providers (Dịch vụ - Services)

Nếu Controller là Lễ tân khách sạn (chỉ đứng quầy nhận yêu cầu và giao tiếp với khách), thì Service chính là Đầu bếp (Nơi trực tiếp thực thi nấu nướng nghiệp vụ kinh doanh logic code).
Điều tuyệt vời là bạn đánh dấu 1 Service bằng `@Injectable()`.

```typescript
// file: users.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = ['A', 'B', 'C'];

  findAll(): string[] {
    return this.users;
  }
}
```

Và ở `UsersController`, làm sao để **gọi lễ tân gọi đầu bếp**? - Đáp án: Bơm qua Constructor (Dependency Injection).
```typescript
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // NestJS sẽ tự động tìm instance của UsersService tiêm vào đây!
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll(); // Gọi sang service lấy Data
  }
}
```

---

## 💻 Bài tập thực hành
Dùng Nest CLI tự tạo thêm một Feature gọi là `Products`:
```bash
nest generate module products
nest generate controller products
nest generate service products
// Hoặc gõ lệnh tắt siêu nhanh: nest g res products
```
1. Tạo 1 biến private array product bên trong file `products.service.ts`.
2. Tạo các route GET list, GET param id, POST object trong controller.
3. Test bằng Postman / ThunderClient.
