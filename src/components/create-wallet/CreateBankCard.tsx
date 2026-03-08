import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BankAutocompleteInput from '../common/BankInput'
import { ArrowRight2 } from 'iconsax-react-native'

type Props = {}

const CreateBankCard = (props: Props) => {
  const [selectedBank, setSelectedBank] = useState<any>(null)
  console.log('🚀 ~ CreateBankCard ~ selectedBank:', selectedBank)
  return (
    <View className="bg-white rounded-[32px] gap-2">
      <View className="p-5 border-b border-b-component-divider">
        <Text className="text-lg font-semibold text-primary">Tài khoản ngân hàng</Text>
      </View>
      <View className="px-5 py-4 gap-4">
        <BankAutocompleteInput onSelect={(bank) => setSelectedBank(bank)} />
        {selectedBank && (
          <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-2 rounded-xl border border-gray-300">
            <View className="flex-row items-center gap-3">
              <Image
                source={{ uri: selectedBank.logo }}
                className="w-24 h-12 rounded-2xl"
                resizeMode="contain"
              />
              <Text className="text-base font-medium text-zinc-800">{selectedBank.shortName}</Text>
            </View>

            <ArrowRight2 size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default CreateBankCard
