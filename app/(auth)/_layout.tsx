import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthContext } from '../../context/AuthContext';
import { View } from 'react-native';
import { Loading } from '../../components/ui/Loading';

export default function AuthLayout() {
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && user) {
      // User is already logged in, redirect to home
      router.replace('/');
    }
  }, [user, loading]);

  // When the app is still loading or checking auth state,
  // we can return a loading indicator
  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Loading text="Checking authentication..." />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0FFF3' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}