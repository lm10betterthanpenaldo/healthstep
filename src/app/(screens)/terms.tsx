import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

type Props = {}

const TermsScreen = (props: Props) => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-10">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-gray-50">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-6">
                    Điều khoản & Điều kiện
                </Text>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
            >
                <View
                    className="bg-white rounded-3xl px-5 pt-5 pb-8 mb-8"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }}
                >
                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        1. Chấp nhận các điều khoản
                    </Text>
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                        Bằng việc truy cập và sử dụng ứng dụng này, bạn đồng ý tuân thủ các điều khoản
                        và điều kiện được nêu dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui
                        lòng ngừng sử dụng ứng dụng.
                    </Text>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        2. Tuyên bố từ chối trách nhiệm y tế
                    </Text>
                    <View className="mb-4">
                        <Text className="text-base text-gray-700 leading-6">
                            • Ứng dụng không thay thế cho tư vấn, chẩn đoán hoặc điều trị từ bác sĩ hay
                            chuyên gia y tế.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • Các chỉ số như BMI, TDEE và gợi ý dinh dưỡng chỉ mang tính tham khảo, dựa
                            trên công thức phổ biến.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • Bạn nên tham khảo ý kiến bác sĩ trước khi thay đổi chế độ ăn uống hoặc
                            tập luyện, đặc biệt nếu có bệnh lý nền.
                        </Text>
                    </View>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        3. Dữ liệu người dùng & Quyền riêng tư
                    </Text>
                    <View className="mb-4">
                        <Text className="text-base text-gray-700 leading-6">
                            • Chúng tôi chỉ thu thập các thông tin cần thiết để tính toán chỉ số và cải
                            thiện trải nghiệm sử dụng.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • Chúng tôi cam kết không bán hoặc chia sẻ dữ liệu cá nhân của bạn cho bên
                            thứ ba vì mục đích thương mại.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • Một số dữ liệu có thể được ẩn danh để phục vụ mục đích thống kê và cải
                            thiện sản phẩm.
                        </Text>
                    </View>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        4. Quyền sở hữu trí tuệ
                    </Text>
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                        Toàn bộ nội dung, giao diện, hình ảnh và mã nguồn thuộc quyền sở hữu của nhóm
                        phát triển ứng dụng, trừ khi được ghi chú khác đi. Bạn không được phép sao chép
                        hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.
                    </Text>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        5. Giới hạn trách nhiệm
                    </Text>
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                        Chúng tôi nỗ lực để đảm bảo ứng dụng hoạt động ổn định, tuy nhiên không thể đảm
                        bảo ứng dụng luôn không mắc lỗi hoặc gián đoạn. Chúng tôi không chịu trách nhiệm
                        cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng dụng.
                    </Text>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        6. Thay đổi điều khoản
                    </Text>
                    <Text className="text-base text-gray-700 leading-6">
                        Chúng tôi có thể cập nhật các điều khoản này theo từng thời điểm để phù hợp với
                        sự phát triển của sản phẩm. Các thay đổi sẽ có hiệu lực ngay khi được cập nhật
                        trong ứng dụng. Việc bạn tiếp tục sử dụng ứng dụng đồng nghĩa với việc bạn chấp
                        nhận các điều khoản mới.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TermsScreen
