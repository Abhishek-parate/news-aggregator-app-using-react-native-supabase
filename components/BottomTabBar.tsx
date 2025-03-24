import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from './ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, router } from 'expo-router';

interface TabItem {
  name: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

export const BottomTabBar = () => {
  const pathname = usePathname();
  
  const tabs: TabItem[] = [
    {
      name: 'home',
      label: 'Home',
      icon: 'home-outline',
      activeIcon: 'home',
      path: '/',
    },
    {
      name: 'categories',
      label: 'Categories',
      icon: 'grid-outline',
      activeIcon: 'grid',
      path: '/categories',
    },
    {
      name: 'bookmarks',
      label: 'Bookmarks',
      icon: 'bookmark-outline',
      activeIcon: 'bookmark',
      path: '/bookmarks',
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
      path: '/profile',
    },
  ];

  const handleTabPress = (path: string) => {
    router.push(path);
  };

  const isActive = (tabPath: string) => {
    if (tabPath === '/' && pathname === '/') return true;
    return pathname.startsWith(tabPath) && tabPath !== '/';
  };

  return (
    <SafeAreaView className="bg-white border-t border-gray-200">
      <View className="flex-row items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handleTabPress(tab.path)}
              className="items-center px-2 py-1"
              activeOpacity={0.7}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={22}
                color={active ? '#11CBD7' : '#6B7280'}
              />
              <Text
                variant="caption"
                className={active ? 'text-primary' : 'text-gray-500'}
                weight={active ? 'medium' : 'regular'}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};