import React from 'react';
import { View, TouchableOpacity, StatusBar, SafeAreaView, Image } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Text } from './ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showProfileButton?: boolean;
  rightComponent?: React.ReactNode;
}

export const Header = ({
  title,
  showBackButton = false,
  showSearchButton = false,
  showProfileButton = false,
  rightComponent,
}: HeaderProps) => {
  const navigation = useNavigation();
  const { profile } = useAuthContext();

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push('/');
    }
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="mr-3 p-1"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
          )}
          {title && (
            <Text variant="h5" weight="semibold">
              {title}
            </Text>
          )}
        </View>

        <View className="flex-row items-center">
          {showSearchButton && (
            <TouchableOpacity
              onPress={handleSearchPress}
              className="ml-3 p-1"
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={22} color="#333333" />
            </TouchableOpacity>
          )}

          {showProfileButton && (
            <TouchableOpacity
              onPress={handleProfilePress}
              className="ml-3 p-1"
              activeOpacity={0.7}
            >
              {profile?.avatar_url ? (
                <Image 
                  source={{ uri: profile.avatar_url }} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white font-rubik-medium text-xs">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};