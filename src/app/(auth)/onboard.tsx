import { Image, ImageBackground, SafeAreaView, StatusBar, Text, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import AppButton from '@/components/common/AppButton'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

type Props = {}

const OnboardScreen = ({}: Props) => {
  const router = useRouter()

  const _onLoginScreen = () => {
    router.push(ERouteTable.SIGIN_IN)
  }
  return (
    <View className="flex-1">
      <ImageBackground source={images.bgOnBoarding} className="flex-1">
        <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
          <View className="flex-1 px-8 items-center pb-8">
            <View className="flex-1 justify-between">
              <View className="flex-1 justify-end">
                <Text className="text-4xl text-primary text-left mt-8">
                  Cải thiện sức khỏe
                  & chế độ ăn uống
                </Text>
                <Text className="text-base text-primary text-start mt-4">
                  Bắt đầu hành trình thay đổi ngay hôm nay! HealthSteps giúp bạn cá nhân hóa thực đơn, theo dõi dinh dưỡng và xây dựng thói quen lành mạnh từng bước một.
                </Text>
              </View>
              <View>
                <AppButton title="Bắt đầu ngay!" onPress={_onLoginScreen} className="mt-8 h-14" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default OnboardScreen
