# Tuần 10: Authentication, Authorization & Security trong NestJS

## 🎯 Mục tiêu
- Phân biệt Authentication (Xác thực) và Authorization (Phân quyền).
- Mã hóa mật khẩu bảo mật chuẩn bằng `bcrypt`.
- Thiết lập module đăng nhập JWT (JSON Web Token) thông qua `@nestjs/passport` và `@nestjs/jwt`.
- Bảo vệ các Route bằng Guards (`@UseGuards()`).
- Tự viết Custom Decorator để làm Role-Based Access Control (RBAC).

---

## 📖 Phần 1: Mã hóa mật khẩu (Bcrypt)

Tuyệt đối KHÔNG LƯU MẬT KHẨU thô (plain text) dưới Database.

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

Trong hàm `register(signUpDTO)` của Services, trước khi new Model lưu:
```typescript
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
const hash = await bcrypt.hash(signUpDTO.password, saltOrRounds);

// Lưu `hash` này vào CSDL thay vì mật khẩu thực.
const createdUser = new this.userModel({ ...signUpDTO, password: hash });
return createdUser.save();
```
Khi người dùng Login, lấy string Login Password truyền lúc này đi vô hàm `bcrypt.compare(txt, hash)` trả ra `true/false`.

---

## 📖 Phần 2: Xây dựng JWT Authentication Module

NestJS sinh ra một thư viện vỏ bọc mạnh mẽ cho Passport.js.
```bash
npm install @nestjs/passport passport @nestjs/jwt passport-jwt
npm install -D @types/passport-jwt
```

### 2.1 Cài đặt JwtModule trong `auth.module.ts`
```typescript
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "CHIA_KHOA_BI_MAT_SIEU_BAO_MAT", // Nên lưu trong .env
      signOptions: { expiresIn: '60s' }, // Token hết hạn sau 60 giây
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### 2.2 Hàm Login trong AuthService
```typescript
async login(user: any) {
    const payload = { username: user.username, sub: user.userId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
```

---

## 📖 Phần 3: Bảo vệ Controllers bằng Guards (`@UseGuards`)

Tạo ra 1 file logic phân tích Request header (Xác thực jwt coi hợp lệ không).
Nơi nào cần chặn người lạ thì đặt Guards đó lên đầu.

### 3.1 Gắn Guard kiểm tra Token
```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Dùng template Passport

@Controller('profile')
export class ProfileController {

  @UseGuards(AuthGuard('jwt')) // Muốn truy cập Route này? Bắt buộc Header phải kẹp Jwt hợp lệ!
  @Get()
  getProfile(@Request() req) {
    return req.user; // Thông tin tài khoản được tách vỏ từ Token!
  }
}
```

---

## 📖 Phần 4: Phân quyền Authorization (RBAC)

Bên đăng nhập Guard xong, tiếp theo ta phân luồng tài khoản có chức năng admin với Custom Decorator.

### 4.1 Định nghĩa Roles Decorator
```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### 4.2 Xây Cổng Chặn Admin
```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Đọc cái roles gắn trên hàm Route. Ví dụ '@Roles('admin')'
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Tuyến công khai
    }
    const { user } = context.switchToHttp().getRequest();
    // check role nếu thằng user đăng nhập có chữ admin ko
    return requiredRoles.some((role) => user.role?.includes(role)); 
  }
}
```

### 4.3 Áp dụng
```typescript
@Get('dashboard')
@Roles('ADMIN') // Đánh dấu chỉ dành cho nhóm Admin!
@UseGuards(JwtAuthGuard, RolesGuard)
getAdminData() { return 'Dữ liệu mật cho Quản trị viên!'; }
```

## 💻 Bài tập thực hành
Tạo Module Auth, kết nối DB MongoDB check username/pass bằng `bcrypt.compare`.
Lấy data token dán từ Postman, gọi Get route `/orders` - kiểm tra AuthGuard thành công. 
Lập role nhân viên ('STAFF') và Test lấy Access Denied.
