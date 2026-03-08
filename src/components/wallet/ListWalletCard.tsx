import { StyleSheet, View } from 'react-native'
import React from 'react'
import WalletCard from './WalletCard'
import CreateCardButton from './CreateCardButton'

type Props = {}

const ListWalletCard = (props: Props) => {
  return (
    <View className="gap-2">
      <WalletCard balance={50000} />
      <WalletCard name="VP Bank" logo={'https://api.vietqr.io/img/VPB.png'} balance={50000} />
      <WalletCard name="ACB" logo={'https://api.vietqr.io/img/ACB.png'} balance={50000} />

      <CreateCardButton />
    </View>
  )
}

export default ListWalletCard
