import { ImageBackground, SafeAreaView, ScrollView, StatusBar, View, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import MealHeader from '@/components/meals/MealHeader'
import DatePicker from '@/components/meals/DatePicker'
import MealSection from '@/components/meals/MealSection'
import { MealItemType } from '@/components/meals/MealItem'
import { useAuth } from '@/context/auth-provider'
import { useDate } from '@/context/date-context'
import { useNotifications } from '@/context/notification-provider'
import { MealsService, MealWithDetails } from '@/services/meals.service'

const MealsScreen = () => {
  const { user } = useAuth()
  const { selectedDate, setSelectedDate, refreshTrigger, triggerRefresh } = useDate()
  const { unreadCount } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  const [breakfastMeals, setBreakfastMeals] = useState<MealItemType[]>([])

  const [lunchMeals, setLunchMeals] = useState<MealItemType[]>([])
  const [snackMeals, setSnackMeals] = useState<MealItemType[]>([])
  const [dinnerMeals, setDinnerMeals] = useState<MealItemType[]>([])

  // Convert MealWithDetails to MealItemType
  const convertMealToItem = (log: MealWithDetails): MealItemType => {
    const meal = log.meals
    return {
      id: log.id,
      name: log.custom_meal_name || meal?.name || 'Unknown meal',
      image: meal?.image_url || 'https://via.placeholder.com/400',
      calories: log.calories || meal?.calories || 0,
      weight: 100, // Default weight
      protein: meal?.protein_g || 0,
      fat: meal?.fats_g || 0,
      carbs: meal?.carbs_g || 0,
    }
  }

  // Load meals for selected date
  const loadMeals = async (date?: string) => {
    const dateToLoad = date || selectedDate
    
    if (!user?.id) {
      setLoading(false)
      return
    }

    console.log('Loading meals for date:', dateToLoad)
    
    try {
      const mealsByType = await MealsService.getMealLogsByDate(user.id, dateToLoad)
      
      // Convert to MealItemType format
      setBreakfastMeals(mealsByType.breakfast.map(convertMealToItem))
      setLunchMeals(mealsByType.lunch.map(convertMealToItem))
      setSnackMeals(mealsByType.snack.map(convertMealToItem))
      setDinnerMeals(mealsByType.dinner.map(convertMealToItem))
      
      console.log('Meals loaded successfully')
    } catch (error) {
      console.error('Error loading meals:', error)
      Alert.alert('Lỗi', 'Không thể tải dữ liệu bữa ăn.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load on mount and when date changes or refresh triggered
  useEffect(() => {
    if (user?.id) {
      loadMeals()
    } else {
      setLoading(false)
    }
  }, [user, selectedDate, refreshTrigger])

  const calculateTotalCalories = (meals: MealItemType[]) => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0)
  }

  const handleRemoveMeal = async (id: string) => {
    if (!user?.id) return
    
    try {
      const success = await MealsService.removeMealLog(id)
      if (success) {
        // Remove from local state
        setBreakfastMeals((prev) => prev.filter((meal) => meal.id !== id))
        setLunchMeals((prev) => prev.filter((meal) => meal.id !== id))
        setSnackMeals((prev) => prev.filter((meal) => meal.id !== id))
        setDinnerMeals((prev) => prev.filter((meal) => meal.id !== id))
        
        // Trigger refresh for home screen
        triggerRefresh()
      } else {
        Alert.alert('Lỗi', 'Không thể xóa bữa ăn.')
      }
    } catch (error) {
      console.error('Error removing meal:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa bữa ăn.')
    }
  }

  const handlePressMeal = (meal: MealItemType) => {
    router.push(ERouteTable.MEAL_DETAIL)
  }

  const handleDateChange = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    console.log('Date changed:', dateStr)
    setSelectedDate(dateStr)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadMeals()
  }

  // Loading state
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

  return (
    <View className="flex-1">
      <ImageBackground source={images.bgSplash} className="flex-1">
        <SafeAreaView className="flex-1" style={{ paddingTop: StatusBar.currentHeight }}>
          <View className="px-5 pt-4">
            <MealHeader notificationCount={unreadCount} />
            <DatePicker onDateChange={handleDateChange} />
          </View>

          <ScrollView
            className="flex-1 px-5"
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
            {/* Breakfast */}
            <MealSection
              title="Bữa sáng"
              totalCalories={calculateTotalCalories(breakfastMeals)}
              meals={breakfastMeals}
              onRemoveMeal={handleRemoveMeal}
              onPressMeal={handlePressMeal}
            />

            {/* Lunch */}
            <MealSection
              title="Bữa trưa"
              totalCalories={calculateTotalCalories(lunchMeals)}
              meals={lunchMeals}
              onRemoveMeal={handleRemoveMeal}
              onPressMeal={handlePressMeal}
            />

            {/* Snack */}
            <MealSection
              title="Ăn vặt"
              totalCalories={calculateTotalCalories(snackMeals)}
              meals={snackMeals}
              onRemoveMeal={handleRemoveMeal}
              onPressMeal={handlePressMeal}
            />

            {/* Dinner */}
            <MealSection
              title="Bữa tối"
              totalCalories={calculateTotalCalories(dinnerMeals)}
              meals={dinnerMeals}
              onRemoveMeal={handleRemoveMeal}
              onPressMeal={handlePressMeal}
            />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default MealsScreen
