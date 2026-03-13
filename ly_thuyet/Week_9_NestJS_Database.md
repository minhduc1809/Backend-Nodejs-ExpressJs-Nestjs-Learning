# Tuần 9: Làm việc với CSDL (MongoDB/Mongoose trong NestJS)

## 🎯 Mục tiêu
- Tích hợp chuẩn Mongoose Database Module (`@nestjs/mongoose`) vào NestJS.
- Khai báo Schema thông qua cú pháp OOP Decorator của TypeScript.
- Repository Pattern và Data Access Layer.
- Xử lý quan hệ (Populate/Ref trong Document).

---

## 📖 Phần 1: Tích hợp Database vào NestJS

Khác với File kết nối rườm rà ở Node Express, Nest bọc Mongoose thành 1 Module xịn mịn. 

### 1.1 Cài đặt thư viện:
```bash
npm install @nestjs/mongoose mongoose
```

### 1.2 Import vào Root (`app.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  // Tương tự hàm mongoose.connect() - kết nối toàn cầu
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-course'), 
    UsersModule
  ],
})
export class AppModule {}
```

---

## 📖 Phần 2: Cài đặt Schema bằng Class & Decorators (Lõi Typescript)

Chúng ta không dùng Object thô khai báo dài dòng như lúc viết bằng Mongoose Express thuần.

### 2.1 Định nghĩa Class Entity (`users/schemas/user.schema.ts`)
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Giúp Class này có type của Mongoose Node 
export type UserDocument = User & Document; 

@Schema({ timestamps: true }) // Tự lo update cái createdAt và updatedAt
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string; // Không lưu password text mà phải hash
  
  @Prop() 
  avatarUrl: string; // Những trường nào không khai options có thể linh hoạt (nhúng optional)
  
  @Prop({ type: [String], default: [] }) // Type Array String Mongoose
  hobbies: string[];
}

// Bắt nest-mongoose tự gen ngược ra Model xài
export const UserSchema = SchemaFactory.createForClass(User);
```

---

## 📖 Phần 3: Tiêm trực tiếp Model vào Service (Repository Inject)

### 3.1 Đăng ký Schema vào tính năng cục bộ (`users.module.ts`)
Phải khai báo cho IoC biết Model có sự tồn tại ở đây thông qua `forFeature`.
```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
   // Nạp vào hệ thống để dùng tiêm DI
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UsersService],
})
export class UsersModule {}
```

### 3.2 Inject sử dụng trong Service
Sử dụng đặc thù kỹ thuật `@InjectModel()` vì Mongoose ko phải 1 Service thường của Nest mà tạo ra từ hàm forFeature ở trên.

```typescript
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from '../dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
     // Lấy Model User vô đây để chọc Data!
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Async lấy toàn bộ
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Create document bằng lệnh DTO
  async create(createData: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createData);
    return createdUser.save();
  }
}
```

---

## 📖 Phần 4: Nhắc nhẹ Async Configure (Sau này làm dự án Deploy)

Khi đưa dự án lên mạng, URI MongoDB thay thành `cloud` lấy từ `.env`. Lúc đó cần Module Config. 
```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'), // bảo mật kết nối tuyệt đối không hard-code code.
  }),
  inject: [ConfigService],
})
```

## 💻 Bài tập thực hành
- Lên lại Code các Route API (Get, Put, Delete) kết nối MongoDB với Schema Products. 
- Gọi lấy được Document và bọc Exception Filter xử lý nếu Product ID không có sẵn (Quăng 404).
