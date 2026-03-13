# Tuần 5: Typescript cho Backend Developer

## 🎯 Mục tiêu
- Hiểu tại sao TypeScript (TS) là bắt buộc trong mọi dự án lớn.
- Khai báo Type, Interface, và Enum cơ bản.
- Hiểu kiến thức về Classes, Access Modifiers và Generics trong TS.
- Cách thiết lập một dự án Node.js với TypeScript (`tsconfig.json`).

---

## 📖 Phần 1: TypeScript là gì? Tại sao cần nó?

TypeScript = **JavaScript** + **Hệ thống Static Typing** (Kiểu dữ liệu tĩnh).
Trình duyệt và Node.js chỉ hiểu JavaScript. TypeScript là ngôn ngữ mẹ, code sẽ được Trình biên dịch (Compiler) chuyển đổi (compile/transpile) về JavaScript thuần để chạy.

**Lợi ích lớn nhất:** 
1. Cảnh báo lỗi ngay trong lúc GÕ CODE trên Editor (Compile Time).
2. Tự động gợi ý thuộc tính/hàm (Auto-completion/IntelliSense) chuẩn xác 100%.

---

## 📖 Phần 2: Cú pháp và khai báo kiểu

### 2.1 Khởi tạo biến (Primitives)
```typescript
let age: number = 25;
let userName: string = 'Alex';
let isActive: boolean = true;
let scores: number[] = [10, 8, 9]; // Mảng chứa number
```

### 2.2 Interface và Type (Khai báo Object)
Thay vì dùng "Duck Typing" (chẳng biết Object đó có trường gì), ta bắt buộc dùng `Interface`:
```typescript
// Định nghĩa khuôn mẫu
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string; // Dấu hỏi (?) báo hiệu trường này có thể null/undefined (Optional)
}

// Áp dụng định nghĩa vào object
const newUser: User = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com"
  // Thiếu ID sẽ lập tức báo vạch đỏ lỗi trên Editor
};
```

### 2.3 Enum (Tập hợp các hằng số)
Thay vì code cứng bằng chữ (Hard-code) gây dễ nhầm lẫn:
```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR'
}

let myRole: UserRole = UserRole.ADMIN;
```

---

## 📖 Phần 3: Lập trình OOP (Hướng đối tượng) trong TS

NestJS dựa hoàn toàn vào OOP, nên đây là kiến thức sống còn:

### 3.1 Classes và Access Modifiers
Các biến trong TypeScript class có thể "kín" như Java/C#:
- `public`: Gọi mọi nơi (mặc định).
- `private`: Chỉ gọi được bên trong chính class đó.
- `protected`: Class con kết thừa gọi được.

```typescript
class ProductService {
  private products: string[] = [];

  public addProduct(name: string) {
    this.products.push(name);
  }

  public getProducts() {
    return this.products;
  }
}

const pService = new ProductService();
pService.addProduct("Iphone 15");
// console.log(pService.products); // LỖI BÁO ĐỎ! Biến products là private.
```

### 3.2 Generics: Tái sử dụng type linh hoạt
Khi bạn viết 1 hàm mà không chắc sẽ truyền vào kiểu mảng numbers, hay mảng strings. Tính linh hoạt kiểu thay thế là Generics (`<T>`).
```typescript
// Truyền kiểu 'T' tự do
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const numb = getFirstElement<number>([1, 2, 3]); // trả ra number
const str = getFirstElement<string>(['A', 'B']); // trả ra string
```

---
## 💻 Bài tập thực hành
Tạo 1 project NPM bằng `npm init -y`.
Cài TS bằng `npm i -D typescript ts-node`. Khởi tạo `npx tsc --init`.
Viết 1 file `user.ts` sử dụng Interface, Enum để quản lý dữ liệu User và thử compile sang file `user.js`.
