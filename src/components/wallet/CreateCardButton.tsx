import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Add } from 'iconsax-react-native'
import { ERouteTable } from '@/constants/route-table'

type Props = {}

const CreateCardButton = (props: Props) => {
  const router = useRouter()

  const _onCreateCardScreen = () => {
    router.push(ERouteTable.CREATE_WALLET)
  }
  return (
    <TouchableOpacity onPress={_onCreateCardScreen}>
      <View className="flex-row gap-2 p-3 justify-center items-center rounded-2xl bg-transparent-grey">
        <Add size={24} color="#000" />
        <Text className="text-primary text-base font-semibold">Thêm tài khoản</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CreateCardButton
