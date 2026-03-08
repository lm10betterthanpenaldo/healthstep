import { Text, View } from 'react-native'
import React from 'react'
import BalanceMoney from '../common/BalanceMoney'

type Props = {}

const CurrentBalance = (props: Props) => {
  return (
    <View className="items-center gap-2 mt-8 mb-10">
      <View className="flex-row items-center gap-1">
        <Text className="text-sm text-primary">Tổng tài sản</Text>
        <Text className="text-sm font-semibold text-success-main">+26,8%</Text>
      </View>
      <BalanceMoney balance={5000000} />
    </View>
  )
}

export default CurrentBalance
