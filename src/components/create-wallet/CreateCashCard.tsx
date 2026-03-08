import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppIconify, { AppIcons } from '../common/AppIcontify'
import { ArrowRight2 } from 'iconsax-react-native'

type Props = {}

const CreateCashCard = (props: Props) => {
  return (
    <TouchableOpacity>
      <View className="bg-white rounded-[32px] p-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <AppIconify
            icon={AppIcons.wallet}
            size={24}
            color="#9075FF"
            className="bg-transparent-primary p-1.5 rounded-xl"
          />
          <Text className="text-base text-primary">Ví tiền mặt</Text>
        </View>
        <View>
          <ArrowRight2 size={14} color="#919EAB" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CreateCashCard
