import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

type Props = {}

const AboutScreen = (props: Props) => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-10">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 bg-gray-50">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-6">
                    Giới thiệu
                </Text>
            </View>

            {/* Content */}
            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
            >
                <View className="bg-white rounded-3xl px-5 pt-5 pb-8 mb-8"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }}
                >
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                        Chúng tôi tin rằng một cuộc sống hạnh phúc bắt đầu từ một cơ thể khỏe mạnh.
                        Ứng dụng của chúng tôi ra đời không chỉ để đếm calo, mà để trở thành người
                        bạn đồng hành giúp bạn xây dựng lối sống lành mạnh một cách đơn giản, tự nhiên
                        và bền vững nhất.
                    </Text>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        1. Tại sao chúng tôi thực hiện dự án này?
                    </Text>
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                        Chứng kiến những người trẻ và nhân viên văn phòng luôn bận rộn đến mức quên
                        chăm sóc bản thân, chúng tôi – nhóm phát triển ứng dụng – quyết định xây dựng
                        một công cụ đơn giản, dễ dùng để giúp bạn:
                    </Text>
                    <View className="mb-4">
                        <Text className="text-base text-gray-700 leading-6">
                            • Theo dõi ăn uống và vận động mỗi ngày.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • Hiểu rõ hơn về cơ thể thông qua các chỉ số như BMI, TDEE.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • Xây dựng thói quen tốt từng bước nhỏ, nhưng bền vững.
                        </Text>
                    </View>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        2. Giá trị mà ứng dụng mang lại
                    </Text>
                    <View className="mb-4">
                        <Text className="text-base text-gray-700 leading-6">
                            • <Text className="font-semibold">Đơn giản</Text>: Mọi chỉ số đều được trình bày rõ ràng, dễ hiểu.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • <Text className="font-semibold">Thực tế</Text>: Gợi ý phù hợp với thói quen ăn uống và sinh hoạt của người Việt.
                        </Text>
                        <Text className="text-base text-gray-700 leading-6">
                            • <Text className="font-semibold">Kiên trì</Text>: Tập trung vào những thay đổi nhỏ nhưng mang lại kết quả lớn về lâu dài.
                        </Text>
                    </View>

                    <Text className="text-base font-semibold text-gray-900 mb-2">
                        3. Tầm nhìn của chúng tôi
                    </Text>
                    <Text className="text-base text-gray-700 leading-6 mb-4">
                        Chúng tôi mong muốn xây dựng một ứng dụng sức khỏe gần gũi, đáng tin cậy và
                        hữu ích cho cộng đồng, đặc biệt là những người bận rộn. Đây là một dự án được
                        phát triển với tinh thần học hỏi và đóng góp, không đặt nặng yếu tố lợi nhuận.
                    </Text>

                    <Text className="text-base text-gray-700 leading-6">
                        Nếu bạn có bất kỳ góp ý nào, đừng ngần ngại liên hệ với chúng tôi tại màn
                        hình <Text className="font-semibold">Liên hệ hỗ trợ</Text>. Mọi phản hồi của bạn đều rất quý giá để
                        chúng tôi có thể cải thiện ứng dụng ngày một tốt hơn.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AboutScreen
