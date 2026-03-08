-- Seed Articles - Copy toàn bộ và paste vào Supabase SQL Editor

-- Xóa data cũ (nếu có)
DELETE FROM public.articles WHERE category IN ('nutrition', 'cooking_tips', 'home_workout');

-- Thêm articles
INSERT INTO public.articles (title, content, category, image_url) VALUES
('Protein: Kiến trúc sư xây dựng cơ bắp', 'Protein là chất dinh dưỡng quan trọng cho cơ thể', 'nutrition', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800'),
('Chất béo tốt và chất béo xấu', 'Không phải chất béo nào cũng có hại', 'nutrition', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800'),
('Vitamin và khoáng chất thiếu hụt', 'Dấu hiệu thiếu vitamin phổ biến', 'nutrition', 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800'),
('Quy tắc Đĩa ăn hạnh phúc', 'Cân bằng dinh dưỡng đơn giản', 'cooking_tips', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'),
('Meal Prep hiệu quả', 'Chuẩn bị bữa ăn cho cả tuần', 'cooking_tips', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
('Nhịn ăn gián đoạn', 'Intermittent Fasting cho người mới', 'cooking_tips', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'),
('Ngủ đủ giấc quan trọng', 'Giấc ngủ và phục hồi cơ thể', 'home_workout', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800'),
('Stress và ăn uống', 'Tại sao stress khiến bạn ăn nhiều', 'home_workout', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'),
('Tác hại ngồi lâu', 'Ngồi quá nhiều gây hại sức khỏe', 'home_workout', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'),
('Xây dựng thói quen 21 ngày', 'Bí quyết tạo thói quen mới', 'home_workout', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800');

-- Kiểm tra
SELECT category, COUNT(*) FROM articles GROUP BY category;
