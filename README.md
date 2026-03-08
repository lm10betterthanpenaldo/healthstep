# **1. Introduction**

**HealthStep** là một ứng dụng di động hỗ trợ theo dõi và cải thiện sức khỏe cá nhân, được thiết kế nhằm cung cấp một nền tảng toàn diện giúp người dùng quản lý cân nặng, dinh dưỡng và hoạt động thể chất hằng ngày.

Ứng dụng không chỉ dừng lại ở việc ghi chép dữ liệu, mà còn phân tích các chỉ số khoa học như **BMR (Tỷ lệ chuyển hóa cơ bản)** và **TDEE (Tổng năng lượng tiêu hao hằng ngày)** để đưa ra gợi ý phù hợp với mục tiêu giảm cân, duy trì hoặc tăng cơ.

HealthStep hướng đến việc giúp người dùng xây dựng lối sống lành mạnh, khoa học và bền vững dựa trên dữ liệu cá nhân.

# **2. Vision & Mission**

## **Vision**

Trở thành ứng dụng di động hàng đầu tại Việt Nam trong lĩnh vực theo dõi và cải thiện sức khỏe cá nhân dựa trên dữ liệu khoa học.

## **Mission**

- Cung cấp nền tảng theo dõi sức khỏe đơn giản nhưng hiệu quả.
- Tự động tính toán và phân tích các chỉ số cơ thể.
- Khuyến khích hình thành thói quen sống lành mạnh thông qua nhắc nhở thông minh và biểu đồ tiến trình trực quan.

# **3. Target Users**

**Primary Users:**

Học sinh, sinh viên, người trẻ và nhân viên văn phòng mong muốn quản lý cân nặng và cải thiện thể trạng.

**Secondary Users:**

Người tập gym, người chơi thể thao cần theo dõi lượng calo nạp vào và tiêu hao mỗi ngày.

# **4. Technology Stack**

## **🖥️ Front-end - Expo CLI (React Native)**

- Hỗ trợ đa nền tảng: Hoạt động mượt mà trên cả iOS và Android.
- Hot Reloading: Cập nhật thay đổi ngay lập tức trong quá trình phát triển.
- Tích hợp thư viện mở rộng: Dễ dàng thêm biểu đồ, animation và giao diện responsive.

## **☁️ Back-end - Supabase**

- Cơ sở dữ liệu Realtime: Cập nhật dữ liệu sức khỏe ngay khi có thay đổi.
- Xác thực bảo mật: Hỗ trợ đăng nhập bằng email với mật khẩu được mã hóa.
- Lưu trữ tệp tin: Lưu ảnh đại diện người dùng qua hệ thống Storage Bucket.

# **5. Key Features**

## **🏠 Welcome Screen**

- Hiển thị lời chào cá nhân hóa và tổng quan nhanh tình trạng calo trong ngày.
- Điều hướng nhanh đến bảng điều khiển và các mục ghi chép.
- Giao diện tối giản, dễ thao tác.

## **🔐 Login & Authentication**

- Đăng nhập bằng email và mật khẩu.
- Bảo mật bằng mã hóa mật khẩu và định danh người dùng qua UUID.
- Duy trì phiên đăng nhập trên nhiều thiết bị.

## **📊 Health Dashboard**

- Hiển thị các chỉ số quan trọng như BMR và TDEE.
- So sánh lượng calo nạp vào và calo tiêu hao.
- Biểu đồ trực quan theo tuần/tháng về cân nặng và tiến trình.

## **🍽️ Nutrition Tracking**

- Ghi lại bữa ăn theo nhóm (Sáng, Trưa, Tối, Phụ).
- Tự động tính tổng lượng calo trong ngày.
- So sánh với mục tiêu calo dựa trên TDEE.

## **🏃 Exercise Tracking**

- Ghi nhận các hoạt động thể chất (Cardio, Strength, Đi bộ…).
- Ước tính lượng calo tiêu hao theo thời gian vận động.
- Theo dõi tiến độ hoàn thành mục tiêu tập luyện.

## **⚖️ Weight Management**

- Cập nhật cân nặng định kỳ.
- Tự động tính lại BMR và TDEE khi cân nặng thay đổi.
- Hiển thị biểu đồ xu hướng tăng/giảm cân.

## **🔔 Smart Notifications**

- Nhắc nhở khi gần đạt hoặc vượt mục tiêu calo.
- Thông báo khi hoàn thành mục tiêu vận động.
- Cập nhật tức thì nhờ công nghệ Realtime.

## **⚙️ Account Settings**

- Quản lý hồ sơ cá nhân (tuổi, chiều cao, cân nặng, mục tiêu).
- Đổi mật khẩu và cài đặt quyền riêng tư.
- Tùy chỉnh loại thông báo nhận được.

# **6. System Architecture**

## **🧩 Overview**

- Client: Ứng dụng di động xây dựng bằng Expo CLI (React Native).
- Server: Supabase quản lý cơ sở dữ liệu PostgreSQL, xác thực và lưu trữ.
- API: RESTful API đảm bảo trao đổi dữ liệu an toàn giữa ứng dụng và backend.

## **🔄 Data Flow**

- Login: Thông tin đăng nhập được gửi đến Supabase Auth để xác thực.
- Ghi dữ liệu sức khỏe: Nhật ký ăn uống, vận động và cân nặng được lưu vào database.
- Tính toán tự động: Trigger trong database tính lại BMR và TDEE khi có thay đổi.
- Realtime: Thông báo và dữ liệu được cập nhật ngay lập tức lên ứng dụng.

# **7. Data Model**

## **🧱 Database Entities**

| **Bảng** | **Mô tả** |
| --- | --- |
| Profiles | Thông tin cá nhân: họ tên, tuổi, chiều cao, cân nặng, mục tiêu |
| Weight_logs | ID người dùng, ngày ghi nhận, cân nặng |
| Meals | Thư viện món ăn: tên, calo, protein, chất béo |
| Meal_logs | ID người dùng, ID món ăn, loại bữa |
| Exercise_logs | ID người dùng, loại hoạt động, thời gian, calo tiêu hao |
| Notifications | ID người dùng, tiêu đề, nội dung, trạng thái đã đọc |

## **🔗 Relationships**

- Một người dùng có thể có nhiều bản ghi cân nặng, bữa ăn và vận động.
- Mỗi bản ghi liên kết với người dùng thông qua user_id.
- Thông báo được tạo tự động dựa trên hoạt động và mục tiêu cá nhân.

# **8. Development Roadmap**

| **Giai đoạn** | **Mô tả** |
| --- | --- |
| Phase 1 | Thiết kế UI/UX và xây dựng tính năng theo dõi cơ bản |
| Phase 2 | Tích hợp Supabase và cấu hình database |
| Phase 3 | Triển khai tính năng Realtime và biểu đồ phân tích |
| Phase 4 | Kiểm thử beta và tối ưu trước khi phát hành |

# **9. Marketing Strategy**

- Quảng bá trên mạng xã hội: Facebook, TikTok, cộng đồng sinh viên.
- Hợp tác với phòng gym và câu lạc bộ thể thao.
- Chia sẻ nội dung kiến thức về calo và dinh dưỡng.

# **10. Conclusion**

HealthStep không chỉ là một ứng dụng theo dõi sức khỏe — mà là một người bạn đồng hành số giúp người dùng hiểu rõ cơ thể mình thông qua dữ liệu và phân tích khoa học.

Sự kết hợp giữa Expo CLI và Supabase mang đến trải nghiệm mượt mà, bảo mật và cập nhật thời gian thực.

Chúng tôi tin rằng HealthStep sẽ trở thành công cụ thiết yếu giúp người trẻ xây dựng lối sống khỏe mạnh và chủ động hơn mỗi ngày.

# **💡 Tech Summary**

| **Layer** | **Công nghệ** | **Mục đích** |
| --- | --- | --- |
| Frontend | Expo CLI (React Native) | Phát triển ứng dụng đa nền tảng |
| Backend | Supabase | Database Realtime, Auth, Storage |
| Auth | Supabase Auth | Xác thực bảo mật qua Email |
| Charts | Victory Native / Recharts | Trực quan hóa dữ liệu sức khỏe |
| Realtime | Supabase Realtime | Cập nhật thông báo tức thì |
