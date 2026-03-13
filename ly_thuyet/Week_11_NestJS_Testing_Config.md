# Tuần 11: Môi trường (Config) & Viết Unit Test và Logging

## 🎯 Mục tiêu
- Thành thạo xử lý biến môi trường bằng `@nestjs/config`.
- Hiểu được tầm quan trọng của Unit Test (Kiểm thử phần mềm tự động).
- Sử dụng Framework `Jest` tích hợp sẵn trong NestJS để test các Service.
- Thay thế Logger Console của JS bằng `Nest Logger` (hoặc `Winston`).

---

## 📖 Phần 1: Tách cấu hình với Config Module

Khi viết Code, bạn truyền mật khẩu CSDL bằng tay (`localhost:27017...`). Nhưng khi lên môi trường Server (VM), đường dẫn Database sẽ khác. Bạn không thể sửa Code lại rồi đẩy lên. Mọi thứ được lưu trong `.env`

```bash
npm install @nestjs/config
```

**Cấu hình tại cấu trúc `app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Biến toàn cầu - Đọc toàn bộ các Key trong file .env nạp thẳng vào process.env
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', // File môi trường ở thư mục gốc chứa (PORT=8000, MONGO_URI=xxxx)
    }),
  ],
})
export class AppModule {}
```

Gọi ở trong Controller/Service thông qua DI:
```typescript
constructor(private configService: ConfigService) {}

getHello() {
  const dbPass = this.configService.get<string>('DB_PASS');
  return dbPass;
}
```

---

## 📖 Phần 2: Kiểm thử tự động (Unit Test bằng Jest)

Nest CLI từ lúc gõ `nest g service users` cũng sinh kèm 1 file tên là `users.service.spec.ts`. Nó chính là file Test tự động.

### 2.1 Viết kịch bản kiểm thử (Test Case)
Định nghĩa Service test cơ bản:

```typescript
// math.service.ts
@Injectable()
export class MathService {
   add(a: number, b: number): number { return a + b; }
}
```

```typescript
// math.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MathService } from './math.service';

describe('MathService - Kiểm tra mô-đun Toán', () => {
  let service: MathService;

  beforeEach(async () => {
    // Mô phỏng IoC gọi File giả lên bộ nhớ tạm chứ không cần chạy server thật
    const module: TestingModule = await Test.createTestingModule({
      providers: [MathService],
    }).compile();

    service = module.get<MathService>(MathService);
  });

  it('Hàm add: Nên trả ra 5 khi đưa vào 2 và 3', () => {
    // Đây là Expect - kỳ vọng
    expect(service.add(2, 3)).toBe(5); 
  });
  
  it('Hàm add: Số âm và dương cộng lại hợp lệ', () => {
     expect(service.add(-1, 5)).toBe(4);
  });
});
```

### 2.2 Chạy lệnh kiểm tra hàng loạt
```bash
npm run test
```
- Nếu chữ báo Xanh (Passed): Code không bị phá vỡ.
- Mọi logic tính tiền, tính lãi ngân hàng đều cần Unit Test 100% để đề phòng sau này chỉnh sửa sai lầm.

---

## 📖 Phần 3: Chuẩn hóa hệ thống Logging

`console.log()` sẽ làm treo luồng nếu in quá nhiều trong server scale to. Thay bằng Logger.

```typescript
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  doSomething() {
    this.logger.log('Đang làm gì đó...'); // Log info
    this.logger.error('Có lỗi xảy ra không xác định!'); // Log error
    this.logger.warn('Cẩn thận bộ nhớ đầy!'); // Warning
    this.logger.debug('Xem biến tạm trong logic'); // Debug
  }
}
```

NestJS sẽ xuất kèm màu, tên Service báo gọi hàm cực đẹp mắt, và cho phép tắt bằng CLI.

---
## 💻 Bài tập thực hành
Tạo file `.env` chứa biến `JWT_SECRET`. Cấu hình Root `ConfigModule` và tái cấu trúc lại tính năng AuthGuard lúc trước nhưng bằng cách lấy qua lớp ConfigService thay cho hard-code. Chạy Jest Unit test nhẹ cho hàm băm PassWord để coi mật khẩu mã hoá bcrypt có đúng len không (`expect(pw.length).toBeGreaterThan(10)`).
