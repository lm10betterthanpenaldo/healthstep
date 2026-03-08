import { Text, View } from 'react-native'
import React from 'react'
import AppInput from '../form/AppInput'
import AppIconify, { AppIcons } from '../common/AppIcontify'
import AppButton from '../common/AppButton'

type Props = {}

const CreateForm = ({}: Props) => {
  return (
    <View className="rounded-[32px] bg-white py-4">
      <View className="p-5 border-b border-b-component-divider">
        <Text className="text-lg font-semibold text-primary">Thông tin tài khoản</Text>
      </View>
      <View className="py-3 px-5 gap-4">
        <AppInput label="Số dư ban đầu" required />
        <View className="mb-4">
          <Text className="text-sm font-normal text-primary ml-3 mb-1.5">Loại tài khoản</Text>

          <View
            className={`
          h-12 px-3 rounded-2xl text-base
          bg-white border border-input-outline
          text-zinc-900 dark:text-white flex-row items-center gap-2
        `}
          >
            <AppIconify icon={AppIcons.wallet} size={24} color="#9075FF" />
            <Text className="text-base text-primary">Ví tiền mặt</Text>
          </View>
        </View>
        <AppInput label="Mô tả" />
        <AppButton title="Thêm tài khoản" />
      </View>
    </View>
  )
}

export default CreateForm
