import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Text } from './ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../context/AuthContext';
import { router, usePathname } from 'expo-router';

interface SidebarItemProps {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
  onPress: () => void;
}

const SidebarItem = ({
  icon,
  label,
  path,
  isActive,
  onPress,
}: SidebarItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`flex-row items-center py-3 px-4 mx-2 rounded-lg
               ${isActive ? 'bg-secondary' : 'bg-transparent'}`}
  >
    <Ionicons
      name={icon}
      size={22}
      color={isActive ? '#11CBD7' : '#6B7280'}
      className="mr-3"
    />
    <Text
      weight={isActive ? 'medium' : 'regular'}
      className={isActive ? 'text-primary' : 'text-gray-700'}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

interface AdminSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({
  isVisible,
  onClose,
}: AdminSidebarProps) => {
  const { profile, signOut } = useAuthContext();
  const pathname = usePathname();
  const slideAnim = React.useRef(new Animated.Value(isVisible ? 0 : -300)).current;
  const screenWidth = Dimensions.get('window').width;
  const sidebarWidth = Math.min(300, screenWidth * 0.8);

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -sidebarWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim, sidebarWidth]);

  const menuItems = [
    {
      icon: 'speedometer-outline',
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: 'newspaper-outline',
      label: 'Feeds',
      path: '/feeds',
    },
    {
      icon: 'people-outline',
      label: 'Users',
      path: '/users',
    },
    {
      icon: 'analytics-outline',
      label: 'Analytics',
      path: '/analytics',
    },
  ];

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleOverlayPress = () => {
    onClose();
  };

  if (!isVisible && slideAnim._value === -sidebarWidth) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50 flex-row">
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleOverlayPress}
        className="absolute inset-0 bg-black/50"
      />
      
      <Animated.View
        className="h-full bg-white"
        style={{
          width: sidebarWidth,
          transform: [{ translateX: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <View className="py-8 px-4 bg-primary">
          <View className="items-center">
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                className="w-20 h-20 rounded-full mb-3"
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3">
                <Text variant="h3" className="text-primary font-rubik-bold">
                  {profile?.full_name?.charAt(0) || 'A'}
                </Text>
              </View>
            )}
            <Text variant="h6" weight="semibold" className="text-white">
              {profile?.full_name || 'Admin'}
            </Text>
            <Text variant="caption" className="text-white/80">
              {profile?.role === 'admin' ? 'Administrator' : 'User'}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 py-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={isActive(item.path)}
              onPress={() => handleNavigation(item.path)}
            />
          ))}

          <View className="border-t border-gray-200 my-2 mx-4" />

          <TouchableOpacity
            onPress={() => handleNavigation('/')}
            activeOpacity={0.7}
            className="flex-row items-center py-3 px-4 mx-2 rounded-lg"
          >
            <Ionicons
              name="home-outline"
              size={22}
              color="#6B7280"
              className="mr-3"
            />
            <Text className="text-gray-700">User App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
            className="flex-row items-center py-3 px-4 mx-2 rounded-lg"
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#FA4659"
              className="mr-3"
            />
            <Text className="text-accent">Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};