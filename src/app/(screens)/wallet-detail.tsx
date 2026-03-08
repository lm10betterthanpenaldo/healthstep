import { ImageBackground, SafeAreaView, StatusBar, Text, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import AppBar from '@/components/common/AppBar'
import WalletCard from '@/components/wallet/WalletCard'
import ListTransaction from '@/components/common/ListTransaction'

type Props = {}

const WalletDetailScreen = (props: Props) => {
  return (
    <ImageBackground source={images.bgMain} className="flex-1 px-5">
      <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
        <AppBar title="Thông tin tài khoản" />
        <View className="my-4 gap-5">
          <WalletCard
            name="ACB"
            logo={'https://api.vietqr.io/img/ACB.png'}
            balance={50000}
            isDisabled={true}
          />

          <ListTransaction />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default WalletDetailScreen
