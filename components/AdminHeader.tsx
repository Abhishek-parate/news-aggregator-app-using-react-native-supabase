import React from 'react';
import { View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Text } from './ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../context/AuthContext';
import { router } from 'expo-router';

interface AdminHeaderProps {
  title: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
  showAdd?: boolean;
  onAddPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const AdminHeader = ({
  title,
  showMenu = true,
  onMenuPress,
  showAdd = false,
  onAddPress,
  rightComponent,
}: AdminHeaderProps) => {
  const { signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    }
  };

  const handleAddPress = () => {
    if (onAddPress) {
      onAddPress();
    } else if (showAdd) {
      // Default add behavior if not specified
      if (title === 'Feeds') {
        router.push('/add-feed');
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary">
      <StatusBar barStyle="light-content" backgroundColor="#11CBD7" />
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          {showMenu && (
            <TouchableOpacity
              onPress={handleMenuPress}
              className="mr-3 p-1"
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <Text variant="h5" weight="semibold" className="text-white">
            {title}
          </Text>
        </View>

        <View className="flex-row items-center">
          {showAdd && (
            <TouchableOpacity
              onPress={handleAddPress}
              className="ml-3 p-1"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSignOut}
            className="ml-3 p-1"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
};