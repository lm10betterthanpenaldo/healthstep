# Hướng dẫn chạy dự án Expo Health

Tài liệu này mô tả từng bước setup môi trường, cấu hình Supabase và chạy ứng dụng **expo-health** (theo dõi sức khỏe: bữa ăn, nước, cân nặng, tập luyện, giấc ngủ, bài viết).

---

## 1. Công nghệ cần cài đặt

| Công nghệ | Phiên bản khuyến nghị | Ghi chú |
|-----------|------------------------|---------|
| **Node.js** | 18.x hoặc 20.x LTS | [nodejs.org](https://nodejs.org) |
| **npm** | 9.x trở lên | Đi kèm Node.js |
| **Expo CLI** | Mới nhất | Chạy `npx expo` (không cần cài global) |
| **Git** | Bất kỳ | Để clone và quản lý mã nguồn |
| **Supabase** | Tài khoản miễn phí | [supabase.com](https://supabase.com) — dùng làm backend (Auth, DB, Realtime, Storage) |

### Chạy trên thiết bị thật / simulator

- **iOS**: Mac với **Xcode** (chỉ cần khi chạy `expo run:ios` trên simulator hoặc thiết bị).
- **Android**: **Android Studio** + Android SDK (khi chạy `expo run:android` hoặc dùng Expo Go).
- **Expo Go** (tùy chọn): Cài app Expo Go trên điện thoại để mở bản development build qua QR.

---

## 2. Clone và mở dự án

```bash
# Clone (nếu chưa có)
git clone <url-repo> expo-health-steps
cd expo-health-steps

# Hoặc nếu đã có thư mục, chỉ cần vào thư mục
cd expo-health-steps
```

---

## 3. Cài đặt dependencies

```bash
npm install
```

Đảm bảo không có lỗi; nếu có conflict phiên bản, có thể chạy `npm ci` (sau khi đã có `package-lock.json` ổn định).

---

## 4. Cấu hình môi trường (Environment)

### 4.1. File `.env`

Tạo hoặc chỉnh file `.env` ở **thư mục gốc** của dự án:

```env
# URL backend (nếu bạn dùng custom backend)
EXPO_PUBLIC_URL=http://localhost:5005

# Supabase (thay bằng project của bạn)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- Lấy **Supabase URL** và **anon (public) key** tại: Supabase Dashboard → Project Settings → API.
- Nếu hiện tại app đang hardcode Supabase trong `src/lib/supabase.ts`, bạn nên chuyển sang dùng biến môi trường để dễ đổi project:

```ts
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '...';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '...';
```

### 4.2. Bảo mật

- **Không** commit file `.env` hoặc key bí mật lên Git (đã có trong `.gitignore`).
- Chỉ dùng **anon key** ở client; key `service_role` chỉ dùng ở server/backend.

---

## 5. Setup Supabase (Database, Auth, Storage, Realtime)

Tạo một project mới trên [Supabase](https://supabase.com) (hoặc dùng project có sẵn), sau đó vào **SQL Editor** và chạy lần lượt các file SQL trong thư mục `supabase/` **theo đúng thứ tự** dưới đây.

### Thứ tự chạy SQL (bắt buộc)

| Bước | File | Mô tả |
|------|------|--------|
| 1 | `schema.sql` **hoặc** `setup_steps.sql` | **Chọn một trong hai.** `schema.sql`: tạo toàn bộ bảng cơ bản (profiles, weight_logs, water_logs, meal_plans, meals, meal_logs, articles, saved_articles) + RLS + trigger tạo profile khi đăng ký. `setup_steps.sql`: bản có DROP bảng cũ rồi tạo lại (dùng khi muốn reset DB). |
| 2 | `add_exercise_sleep_tables.sql` | Tạo bảng `exercise_logs`, `sleep_logs` + RLS + index. |
| 3 | `add_meal_type_column.sql` | Thêm cột `meal_type` vào `meal_logs` (breakfast/lunch/snack/dinner). Nếu DB mới chưa có dòng nào trong `meal_logs`, vẫn chạy được. |
| 4 | `notifications_schema.sql` | Tạo bảng `notifications`, `notification_settings`, hàm `create_notification`, các trigger mục tiêu (nước, calo, tập) và trigger tạo cài đặt + thông báo chào mừng khi tạo profile. |
| 5 | `add_notification_triggers.sql` | Cập nhật logic trigger (BMR/TDEE, mục tiêu nước theo cân nặng, streak,…). Chạy sau `notifications_schema.sql`. Sau khi chạy xong, nên xóa trigger cũ để tránh trùng: trong SQL Editor chạy: `DROP TRIGGER IF EXISTS create_notification_settings_trigger ON public.profiles;` |
| 6 | `enable_realtime_notifications.sql` | Bật Realtime cho bảng `notifications` (app nhận thông báo realtime). |
| 7 | `fix_meal_logs_policy.sql` | Thêm policy RLS **DELETE** cho `meal_logs` (cho phép user xóa log của mình). |
| 8 | `storage_policies.sql` | Policy cho Storage: upload/cập nhật/xóa avatar trong bucket `profiles` (thư mục `avatars`). **Lưu ý:** Trong Dashboard cần tạo bucket tên `profiles` (public nếu muốn xem ảnh không cần auth). |

### Seed dữ liệu (tùy chọn nhưng nên dùng)

| File | Mô tả |
|------|--------|
| `meals_data.sql` | Thêm danh sách món ăn mẫu (Việt Nam) vào `meals`. |
| `seed_articles_simple.sql` | Thêm bài viết mẫu vào `articles` (nutrition, cooking_tips, home_workout). |

Chạy 2 file này sau khi đã chạy xong 8 bước trên.

### Tạo Storage bucket trong Supabase Dashboard

1. Vào **Storage** → **New bucket**.
2. Tên bucket: **`profiles`**.
3. Chọn **Public** nếu muốn ảnh đại diện xem được qua URL công khai.
4. Sau đó chạy `storage_policies.sql` như bước 8.

---

## 6. Cấu hình Auth (Supabase)

- **Authentication → Providers**: Bật **Email**. Nếu dùng OTP/ magic link thì bật thêm tùy chọn tương ứng.
- **URL redirect**: Trong Supabase Auth URL config, thêm scheme của app (ví dụ `myapp://`) nếu dùng deep link cho đổi mật khẩu / xác thực email.

---

## 7. Chạy ứng dụng

### Development (Expo dev server)

```bash
npm start
```

Sau đó:

- Quét **QR code** bằng **Expo Go** (Android/iOS) để mở app, hoặc
- Nhấn **i** (iOS simulator) / **a** (Android emulator) nếu đã cài simulator/emulator.

### Chạy bản build bản địa (tùy chọn)

```bash
# iOS (cần Xcode trên Mac)
npm run ios

# Android (cần Android Studio + SDK)
npm run android
```

### Web (nếu hỗ trợ)

```bash
npm run web
```

---

## 8. Tóm tắt thư mục `supabase/` sau khi dọn dẹp

| File | Mục đích |
|------|----------|
| `schema.sql` | Schema gốc: bảng cơ bản + RLS + trigger tạo profile. |
| `setup_steps.sql` | Reset DB + tạo lại bảng (tương đương schema + bước xóa cũ). |
| `add_exercise_sleep_tables.sql` | Bảng tập luyện & giấc ngủ. |
| `add_meal_type_column.sql` | Cột `meal_type` cho `meal_logs`. |
| `notifications_schema.sql` | Bảng & trigger thông báo. |
| `add_notification_triggers.sql` | Cập nhật logic trigger thông báo. |
| `enable_realtime_notifications.sql` | Bật Realtime cho `notifications`. |
| `fix_meal_logs_policy.sql` | Policy xóa `meal_logs`. |
| `storage_policies.sql` | Policy Storage cho avatar. |
| `meals_data.sql` | Seed món ăn mẫu. |
| `seed_articles_simple.sql` | Seed bài viết mẫu. |

Các file **test/debug** (test notification, test data, debug meal logs, v.v.) đã được xóa; chỉ giữ lại file dùng cho **setup** và **seed** như trên.

---

## 9. Xử lý lỗi thường gặp

- **Không kết nối được Supabase**: Kiểm tra `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` và đã sửa `src/lib/supabase.ts` dùng env chưa. Kiểm tra Network trong Supabase Dashboard (cho phép domain nếu cần).
- **RLS chặn truy vấn**: Đảm bảo đã chạy đủ các file schema và `fix_meal_logs_policy.sql`; kiểm tra user đã đăng nhập đúng.
- **Realtime không nhận thông báo**: Đã chạy `enable_realtime_notifications.sql` chưa; kiểm tra publication `supabase_realtime` có bảng `notifications`.
- **Upload avatar lỗi**: Đã tạo bucket `profiles` và chạy `storage_policies.sql` chưa; kiểm tra path `avatars/...`.

---

## 10. Công nghệ trong dự án (tham khảo)

- **Frontend**: React Native (Expo SDK ~53), React 19, Expo Router, NativeWind (Tailwind), React Query, Zustand, React Hook Form, Zod.
- **Backend / BaaS**: Supabase (PostgreSQL, Auth, Realtime, Storage).
- **Công cụ**: TypeScript, ESLint, Prettier.

Sau khi làm đủ các bước trên, bạn có thể đăng ký/đăng nhập, cập nhật profile, log bữa ăn/nước/tập/ngủ, xem bài viết và nhận thông báo realtime.

Demo apk app: https://drive.google.com/file/d/1LcpjdplYJRDDfFhqzmcn2_KDF7fs7NSL/view?usp=sharing
