import { ImageBackground, ScrollView, View, ActivityIndicator, Alert, RefreshControl, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import HomeHeader from '@/components/home-new/HomeHeader'
import WeekCalendar from '@/components/home-new/WeekCalendar'
import CalorieCard from '@/components/home-new/CalorieCard'
import CalorieProgress from '@/components/home-new/CalorieProgress'
import HealthMetrics from '@/components/home-new/HealthMetrics'
import WaterTracker from '@/components/home-new/WaterTracker'
import ActivityTracker from '@/components/home-new/ActivityTracker'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { useNotifications } from '@/context/notification-provider'
import { HomeService, HomeData } from '@/services/home.service'

const Home = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { selectedDate, setSelectedDate, refreshTrigger } = useDate()
  const { unreadCount, onNewNotification, offNewNotification } = useNotifications()
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateLoading, setDateLoading] = useState(false) // Loading when switching dates

  // Load home data for a specific date
  const loadHomeData = async (date?: string, isDateSwitch = false) => {
    const dateToLoad = date || selectedDate
    console.log('=== LOADING HOME DATA ===')
    console.log('User ID:', user?.id)
    console.log('Date:', dateToLoad)
    console.log('Is Date Switch:', isDateSwitch)
    console.log('Is Authenticated:', isAuthenticated)
    
    if (!user?.id) {
      console.log('No user ID, stopping load')
      setLoading(false)
      setDateLoading(false)
      return
    }

    try {
      console.log('Fetching home data for date:', dateToLoad)
      const data = await HomeService.getHomeData(user.id, dateToLoad)
      console.log('Home data received:', data)
      
      if (data) {
        setHomeData(data)
        console.log('Home data set successfully')
      } else {
        console.log('No data returned from service')
        Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng kiểm tra profile của bạn.')
      }
    } catch (error: any) {
      console.error('=== ERROR LOADING HOME DATA ===')
      console.error('Error:', error)
      console.error('Error message:', error?.message)
      console.error('Error stack:', error?.stack)
      Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error?.message || 'Không rõ nguyên nhân'}`)
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
      setRefreshing(false)
      setDateLoading(false)
    }
  }

  // Load data on mount and when refresh triggered
  useEffect(() => {
    console.log('=== HOME USEEFFECT ===')
    console.log('authLoading:', authLoading)
    console.log('isAuthenticated:', isAuthenticated)
    console.log('user:', user)
    console.log('refreshTrigger:', refreshTrigger)
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('Auth still loading, waiting...')
      return
    }
    
    // If not authenticated after auth loaded, redirect to sign in
    if (!isAuthenticated || !user) {
      console.log('Not authenticated, redirecting to sign in...')
      setLoading(false)
      router.replace(ERouteTable.SIGIN_IN)
      return
    }
    
    // User is authenticated, load home data
    console.log('User authenticated, calling loadHomeData...')
    loadHomeData()
  }, [user, isAuthenticated, authLoading, refreshTrigger])

  // Listen for new notifications and auto-refresh data
  useEffect(() => {
    const handleNewNotification = (notification: any) => {
      console.log('New notification received in Home:', notification.type)
      
      // Refresh home data when goal-related notifications are received
      const goalTypes = ['goal_completed', 'streak', 'water_reminder', 'meal_reminder', 'exercise_reminder']
      if (goalTypes.includes(notification.type)) {
        console.log('Refreshing home data due to notification...')
        // Only refresh if viewing today's data
        const today = new Date().toISOString().split('T')[0]
        if (selectedDate === today) {
          loadHomeData(selectedDate, true)
        }
      }
    }

    // Subscribe to new notifications
    onNewNotification(handleNewNotification)

    // Cleanup
    return () => {
      offNewNotification(handleNewNotification)
    }
  }, [selectedDate, onNewNotification, offNewNotification])

  const handleNotificationPress = () => {
    router.push(ERouteTable.NOTIFICATIONS)
  }

  const handleDateSelect = (date: string) => {
    console.log('Date selected:', date)
    setSelectedDate(date)
    // Show loading overlay when switching dates
    setDateLoading(true)
    // Reload data for the selected date
    loadHomeData(date, true)
  }

  const handleWaterChange = async (delta: number) => {
    if (!user?.id) return

    try {
      console.log('Water change delta:', delta, 'ml for date:', selectedDate)
      
      if (delta > 0) {
        // Increment: Insert new water log
        const success = await HomeService.updateWaterIntake(user.id, delta, selectedDate)
        if (success) {
          // Reload data for selected date to reflect changes
          loadHomeData(selectedDate, true)
        } else {
          Alert.alert('Lỗi', 'Không thể cập nhật lượng nước.')
        }
      } else if (delta < 0) {
        // Decrement: Delete the last water log entry
        const success = await HomeService.deleteLastWaterLog(user.id, selectedDate)
        if (success) {
          // Reload data for selected date to reflect changes
          loadHomeData(selectedDate, true)
        } else {
          Alert.alert('Lỗi', 'Không thể giảm nước. Có thể chưa có dữ liệu uống nước.')
        }
      }
    } catch (error) {
      console.error('Error updating water:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật.')
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadHomeData(selectedDate)
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ImageBackground source={images.bgSplash} className="flex-1 w-full">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        </ImageBackground>
      </View>
    )
  }

  // If no data, show empty state
  if (!homeData) {
    return (
      <View className="flex-1 items-center justify-center px-5">
        <ImageBackground source={images.bgSplash} className="flex-1 w-full">
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A78BFA" />
          </View>
        </ImageBackground>
      </View>
    )
  }

  return (
    <ImageBackground source={images.bgSplash} className="flex-1">
       <View className='mt-16 px-5'>
       <HomeHeader
                userName={homeData.profile.full_name || 'User'}
                avatar={
                  homeData.profile.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    homeData.profile.full_name || 'User'
                  )}&background=A78BFA&color=fff`
                }
                notificationCount={unreadCount}
                onNotificationPress={handleNotificationPress}
              />
       </View>
        <ScrollView
              className="flex-1 px-5 mb-20"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#A78BFA"
                  colors={['#A78BFA']}
                />
              }
            >
              {/* Header */}
            

              {/* Week Calendar */}
              <WeekCalendar onDateSelect={handleDateSelect} />

              {/* Content with optional loading overlay */}
              <View style={{ opacity: dateLoading ? 0.5 : 1 }}>
                {/* Calorie Card */}
                <CalorieCard calories={homeData.todayCalories} />

                {/* Calorie Progress */}
                <CalorieProgress
                  currentCalories={homeData.todayCalories}
                  targetCalories={homeData.targetCalories}
                  macros={homeData.macros}
                />

                {/* Health Metrics */}
                <HealthMetrics bmi={homeData.bmi} tdee={homeData.tdee} />

                {/* Water Tracker */}
                <WaterTracker
                  initialAmount={homeData.waterIntake.current}
                  targetAmount={homeData.waterIntake.target}
                  selectedDate={selectedDate}
                  onAmountChange={handleWaterChange}
                />

                {/* Activity Tracker */}
                <ActivityTracker
                  exerciseMinutes={homeData.exerciseMinutes}
                  sleepHours={homeData.sleepHours}
                />
              </View>

              {/* Loading overlay when switching dates */}
              {dateLoading && (
                <View 
                  style={{
                    position: 'absolute',
                    top: 300, // Below calendar
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 16,
                      padding: 20,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <ActivityIndicator size="large" color="#A78BFA" />
                    <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 14 }}>
                      Đang tải dữ liệu...
                    </Text>
                  </View>
                </View>
              )}
        </ScrollView>

        {/* Chat health bubble - only when home data is loaded */}
        {homeData && (
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.CHAT_HEALTH)}
            activeOpacity={0.8}
            className="absolute bottom-24 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary-main shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
          </TouchableOpacity>
        )}
      </ImageBackground>
  )
}

export default Home
