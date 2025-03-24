import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthContext } from '../../context/AuthContext';
import { View } from 'react-native';
import { Loading } from '../../components/ui/Loading';
import { BottomTabBar } from '../../components/BottomTabBar';

export default function MainLayout() {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login
      router.replace('/login');
    }
  }, [user, loading]);

  // When the app is still loading or checking auth state,
  // we can return a loading indicator
  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Loading text="Loading..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F0FFF3' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="bookmarks" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="search" />
        <Stack.Screen name="categories" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="news/[id]" />
        <Stack.Screen name="browser" />
      </Stack>
      <BottomTabBar />
    </View>
  );
}