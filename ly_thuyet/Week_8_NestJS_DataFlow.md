# Tuần 8: Luồng Dữ Liệu (Data Flow) trong NestJS 

## 🎯 Mục tiêu
- Hiểu toàn diện về vòng đời Req -> Res và các tầng Can thiệp.
- Học cách Validate dữ liệu bằng DTO (Data Transfer Object) với Decorator.
- Sử dụng Pipes để ép kiểu và Middleware vòng tay thứ 2.
- Kiểm soát Lỗi phản hồi chuyên nghiệp với Exception Filters.
- Format định dạng trả về bằng Interceptors.

---

## 📖 Phần 1: Các "Trạm gác" trên HTTP Request Flow

Khi một Request gửi đến server NestJS, nó sẽ đi qua các lớp (layer) bảo vệ như sau trước khi vào `Controller`:

`Client Request` ➡ **(1) Middleware** ➡ **(2) Guards (Bảo vệ Route)** ➡ **(3) Interceptors (Nghe ngóng trước)** ➡ **(4) Pipes (Transform/Validate)** ➡ `Controller` ➡ `Service` ➡ **(5) Interceptors (Nghe ngóng sau để đổi Data)** ➡ **(6) Exception Filters (Xử lý nếu Code lỗi quăng Error)** ➡ `Client Response`.

---

## 📖 Phần 2: DTOs & Custom Validation (Pipes)

Thay vì viết hàm `if (!req.body.email || req.body.email.length < 5)` lặp đi lặp lại rất cực và bực mình, NestJS cung cấp Class Validator (thư viện từ Hệ sinh thái Typescript Class-validator).

### 2.1 Cài thư viện:
```bash
npm install class-validator class-transformer
```

### 2.2 Viết File DTO (Lưới lọc Đầu Vào)
```typescript
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Tên phải là một chuỗi văn bản" })
  @MinLength(5, { message: "Tên phải dài tối thiểu 5 ký tự" })
  readonly fullName: string; // Sử dụng readonly để tránh sửa Data ngõ vào

  @IsEmail({}, { message: "Định dạng email không hợp lệ!" })
  readonly email: string;
}
```

### 2.3 Bật tính năng Pipe Global ở trong file `main.ts`
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Quan trọng: Phải mở khóa Pipe này lên thì file DTO mới có tác dụng quăng lỗi tự động
  app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, // Xoá bỏ các trường (key) rác dư thừa không có khai báo trong class DTO
      forbidNonWhitelisted: true, // Nếu truyền thêm trường rác sẽ báo lỗi ngay lập tức
  })); 
  await app.listen(3000);
}
```

Và giờ áp dụng vô Controller:
```typescript
@Post()
// Body được đi qua cái Pipe ValidationPipe ở trên, và dùng DTO khuôn mẫu kiểm tra
create(@Body() createUserDto: CreateUserDto) { 
  return 'Lọc xong xui, gọi lưu thôi: ' + createUserDto.email;
}
```
*Ghi chú: Giờ thì API rất chuyên nghiệp, người dùng gửi sai sẽ tự động nhận JSON mảng lỗi.*

---

## 📖 Phần 3: 🛠 Bắt lỗi và tùy biến bằng Exception Filters & Interceptor

### 3.1 Ném Lỗi có ý nghĩa với Exceptions
NestJS tích hợp sẵn mọi HTTP Error code:
```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Get(':id')
findOne(@Param('id') id: string) {
  if (id !== "admin1") {
     throw new NotFoundException(`User với id=${id} không có trên đời ai khóc nỗi đau này!`);
  }
}
// Chữ tự động bọc vô cục mảng JSON Status code: 404 xịn xò.
```

### 3.2 Interceptors - Dụng cụ ma thuật (Học Angular)
Tình huống điển hình: Bạn muốn giấu biến "password" đối với dữ liệu người dùng khi trả về hoặc bạn muốn bọc lại response trong một `data: {}`.

```typescript
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Luồng đi vào có thể check gì đó...

    // Luồng trả về - map đổi Response bọc vô biến {}
    return next.handle().pipe(map(data => ({
         statusCode: context.switchToHttp().getResponse().statusCode,
         data: data, // bọc dữ liệu api ở trong chữ DATA
         time: new Date()
      })
    )); 
  }
}
```
Áp dụng Global bằng hàm `app.useGlobalInterceptors()` tại `main.ts`. Mọi thứ về quy nhất thống JSON chuẩn.

---
## 💻 Bài tập thực hành
Thiết lập 1 bộ DTO đăng ký Account (RegisterAccountDto) có: Email hợp lệ, Password tối thiểu 8 ký tự kèm 1 biến role là enum chỉ nhận (USER/ADMIN). Dùng `class-validator/class-transformer` hoàn thiện.
