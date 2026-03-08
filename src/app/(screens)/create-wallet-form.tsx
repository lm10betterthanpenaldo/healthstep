import { ImageBackground, SafeAreaView, StatusBar, View } from 'react-native'
import React from 'react'
import { images } from '@/constants'
import AppBar from '@/components/common/AppBar'
import CreateForm from '@/components/create-wallet/CreateForm'

type Props = {}

const CreateWalletFormScreen = (props: Props) => {
  return (
    <ImageBackground source={images.bgMain} className="flex-1 px-5">
      <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
        <AppBar title="Thêm tài khoản" />
        <View className="my-4 gap-5">
          <CreateForm />
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default CreateWalletFormScreen
