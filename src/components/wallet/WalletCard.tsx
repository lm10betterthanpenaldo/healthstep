import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BalanceMoney, { ESizeBalance } from '../common/BalanceMoney'
import { Setting2 } from 'iconsax-react-native'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import AppIconify, { AppIcons } from '../common/AppIcontify'

type Props = {
  name?: string
  logo?: string
  balance: number
  isDisabled?: boolean
}

const WalletCard = ({ name = '', logo = '', balance, isDisabled = false }: Props) => {
  const router = useRouter()
  const _onWalletDetail = () => {
    router.push(ERouteTable.WALLET_DETAIL)
  }
  const isCashCard = !name || !logo

  return (
    <TouchableOpacity onPress={_onWalletDetail} disabled={isDisabled}>
      <View className="rounded-3xl bg-white p-5 gap-8">
        <View className="flex-row gap-3 items-center">
          {isCashCard ? (
            <>
              <AppIconify icon={AppIcons.wallet} size={28} color="#9075FF" />
              <Text className="text-lg font-semibold text-primary">Ví tiền mặt</Text>
            </>
          ) : (
            <>
              <Image
                source={{ uri: logo }}
                className="w-8 h-8 rounded-lg bg-slate-200"
                resizeMode="contain"
              />
              <Text className="text-lg font-semibold text-primary">{name}</Text>
            </>
          )}
        </View>
        <View className="flex-row items-center justify-between">
          <BalanceMoney size={ESizeBalance.S} balance={balance} />
          <TouchableOpacity>
            <Setting2 size={20} variant="Outline" color="#212B36" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default WalletCard
