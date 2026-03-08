import { ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import ProfileHeader from '@/modules/user-profile/components/ProfileHeader'
import SettingsMenuItem from '@/modules/user-profile/components/SettingsMenuItem'
import { MenuItem } from '@/modules/user-profile/types/user-profile.types'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/context/auth-provider'
import { useNotifications } from '@/context/notification-provider'
import { AuthService } from '@/services/auth.service'

type Props = {}

const UserScreen = (props: Props) => {
  const { user: authUser } = useAuth()
  const { profile, isLoading } = useProfile()
  const { unreadCount } = useNotifications()

  // Map profile data to user object for ProfileHeader
  const user = {
    id: authUser?.id || '',
    name: profile?.full_name || authUser?.email?.split('@')[0] || 'User',
    email: profile?.email || authUser?.email || '',
    avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=A78BFA&color=fff`,
  }

  const handleEditProfile = () => {
    router.push(ERouteTable.EDIT_PROFILE)
  }

  const handleLogout = async () => {
    try {
      await AuthService.signOut()
      router.replace(ERouteTable.SIGIN_IN)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const menuItems: MenuItem[] = [
    {
      icon: 'fitness-outline',
      label: 'Cập nhật chỉ số trao đổi chất (BMR)',
      route: ERouteTable.BMR_TRACKING,
      onPress: () => router.push(ERouteTable.BMR_TRACKING),
    },
    {
      icon: 'information-circle-outline',
      label: 'Giới thiệu',
      route: ERouteTable.ABOUT,
      onPress: () => router.push(ERouteTable.ABOUT),
    },
    {
      icon: 'headset-outline',
      label: 'Liên hệ hỗ trợ',
      route: ERouteTable.SUPPORT,
      onPress: () => router.push(ERouteTable.SUPPORT),
    },
    {
      icon: 'document-text-outline',
      label: 'Điều khoản & Điều kiện',
      route: ERouteTable.TERMS,
      onPress: () => router.push(ERouteTable.TERMS),
    },
    {
      icon: 'log-out-outline',
      label: 'Đăng xuất',
      color: '#EF4444',
      onPress: handleLogout,
    },
  ]

  return (
    <View
      className="flex-1"
    >
      <ImageBackground source={images.bgSplash} className="flex-1">
      <SafeAreaView className="flex-1 pt-10">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-4">
          <Text className="text-2xl font-bold text-gray-900">Cá nhân</Text>

          {/* Notification Bell with Badge */}
          <TouchableOpacity 
            className="relative"
            onPress={() => router.push(ERouteTable.NOTIFICATIONS)}
          >
            <Ionicons name="notifications-outline" size={28} color="#000" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-cyan-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1">
                <Text className="text-white text-xs font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          {isLoading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#A78BFA" />
            </View>
          ) : (
            <ProfileHeader user={user} onEditPress={handleEditProfile} />
          )}

          {/* Settings & Support Section */}
          <View className="bg-white rounded-3xl mx-4 mb-6 shadow-sm overflow-hidden">
            {/* Section Title */}
            <View className="px-4 pt-4 pb-2">
              <Text className="text-base font-semibold text-gray-900">
                Cài đặt & Hỗ trợ
              </Text>
            </View>

            {/* Menu Items */}
            <View>
              {menuItems.map((item, index) => (
                <View key={index}>
                  <SettingsMenuItem item={item} />
                  {index < menuItems.length - 1 && (
                    <View className="h-px bg-gray-100 mx-4" />
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default UserScreen
