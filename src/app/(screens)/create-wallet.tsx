import { ImageBackground, SafeAreaView, StatusBar, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import AppBar from '@/components/common/AppBar'
import CreateCashCard from '@/components/create-wallet/CreateCashCard'
import CreateBankCard from '@/components/create-wallet/CreateBankCard'
import CreateEWalletCard from '@/components/create-wallet/CreateEWalletCard'

type Props = {}

const CreateWalletScreen = (props: Props) => {
  return (
    <ImageBackground source={images.bgMain} className="flex-1 px-5">
      <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
        <AppBar title="Thêm tài khoản" />
        <View className="my-4 gap-5">
          <CreateCashCard />
          <CreateBankCard />
          <CreateEWalletCard />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default CreateWalletScreen
