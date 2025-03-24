import React, { useEffect } from 'react';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import '../global.css';

// Create React Query client
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf'),
    'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
    'Rubik-ExtraBold': require('../assets/fonts/Rubik-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <StatusBar style="auto" />
          <Slot />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}