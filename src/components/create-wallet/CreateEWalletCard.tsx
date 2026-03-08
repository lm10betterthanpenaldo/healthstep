import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ArrowRight2 } from 'iconsax-react-native'
import IcMomo from '../icons/IcMomo'
import IcZalopay from '../icons/IcZalopay'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

type Props = {}

const CreateEWalletCard = (props: Props) => {
  const router = useRouter()

  const _onCreateWalletForm = () => {
    router.push(ERouteTable.CREATE_WALLET_FORM)
  }
  return (
    <View className="bg-white rounded-[32px] gap-2">
      <View className="p-5 border-b border-b-component-divider">
        <Text className="text-lg font-semibold text-primary">Ví điện tử</Text>
      </View>
      <View className="px-5 py-4 gap-4">
        <TouchableOpacity onPress={_onCreateWalletForm}>
          <View className="bg-white rounded-[32px] p-5 flex-row items-center justify-between border-b border-component-divider">
            <View className="flex-row items-center gap-3">
              <IcMomo />
              <Text className="text-base text-primary">Momo</Text>
            </View>
            <View>
              <ArrowRight2 size={14} color="#919EAB" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={_onCreateWalletForm}>
          <View className="bg-white rounded-[32px] p-5 flex-row items-center justify-between border-b border-component-divider">
            <View className="flex-row items-center gap-3">
              <IcZalopay />
              <Text className="text-base text-primary">Zalo Pay</Text>
            </View>
            <View>
              <ArrowRight2 size={14} color="#919EAB" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CreateEWalletCard
