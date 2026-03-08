import React, { useState } from 'react'
import { Tabs, router } from 'expo-router'
import { TouchableOpacity, View, Alert } from 'react-native'
import { Home2, ReceiptEdit, Notepad2, User, Add } from 'iconsax-react-native'
import { clsx } from 'clsx'
import MealTypeModal, { MealType } from '@/components/meals/MealTypeModal'
import SleepModal from '@/components/sleep/SleepModal'
import { ERouteTable } from '@/constants/route-table'
import Story from '@/assets/icons/home/story'
import StoryActive from '@/assets/icons/home/story_active'

const icons = {
  home: Home2,
  transaction: ReceiptEdit,
  user: User,
  notepad2: Notepad2,
}

type TabIconProps = {
  Icon: React.ElementType
  focused: boolean
}

const TabIcon = ({ Icon, focused }: TabIconProps) => {
  return (
    <View
      className={clsx(
        'w-14 mt-8 aspect-square rounded-full items-center justify-center',
        focused ? 'bg-white dark:bg-zinc-900' : '',
      )}
    >
      <Icon
        size={24}
        color={focused ? '#477AFF' : '#637381'}
        variant={focused ? 'Bold' : 'Outline'}
      />
    </View>
  )
}

export default function TabsLayout() {
  const [modalVisible, setModalVisible] = useState(false)
  const [sleepModalVisible, setSleepModalVisible] = useState(false)

  const handleAddPress = () => {
    setModalVisible(true)
  }

  const handleSelectMealType = (type: MealType) => {
    // Navigate to appropriate screen based on meal type
    switch (type) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
      case 'snack':
        router.push({
          pathname: ERouteTable.SEARCH_FOOD,
          params: { mealType: type },
        })
        break
      case 'exercise':
        router.push(ERouteTable.EXERCISE)
        break
      case 'sleep':
        setSleepModalVisible(true)
        break
    }
  }

  const handleSaveSleep = (hours: number) => {
    // TODO: Save sleep data
    Alert.alert('Thành công', `Đã lưu ${hours} giờ ngủ`)
  }

  return (
    <>
      <Tabs
        screenOptions={({ route }: any) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            height: 80,
            borderRadius: 999,
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          },
          tabBarItemStyle: {
            alignSelf: 'center',
          },
          tabBarIcon: ({ focused }: any) => {
            if (route.name === 'story') {
              const IconStory = focused ? StoryActive : Story
              return (
                <View
                  className={clsx(
                    'w-14 mt-8 aspect-square rounded-full items-center justify-center',
                    focused ? 'bg-white dark:bg-zinc-900' : '',
                  )}
                >
                  <IconStory width={24} height={24} />
                </View>
              )
            }
            const Icon = icons[route.name as keyof typeof icons]
            return <TabIcon Icon={Icon} focused={focused} />
          },
        })}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="story" options={{ title: 'Story' }} />
        <Tabs.Screen
          name='transaction'
          options={{
            title: 'Transaction',
            tabBarButton: () => (
              <TouchableOpacity
                onPress={handleAddPress}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <View className='w-16 h-16 rounded-full justify-center items-center bg-primary-main'>
                  <Add size={32} color='#fff' />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen name="notepad2" options={{ title: 'Notepad2' }} />
        <Tabs.Screen name="user" options={{ title: 'User' }} />
      </Tabs>

      {/* Meal Type Modal */}
      <MealTypeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectMealType={handleSelectMealType}
      />

      {/* Sleep Modal */}
      <SleepModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
        onSave={handleSaveSleep}
      />
    </>
  )
}
