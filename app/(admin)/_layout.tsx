import React, { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthContext } from '../../context/AuthContext';
import { View } from 'react-native';
import { Loading } from '../../components/ui/Loading';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminSidebar } from '../../components/AdminSidebar';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuthContext();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [title, setTitle] = useState('Dashboard');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/login');
      } else if (!isAdmin) {
        // Not an admin, redirect to home
        router.replace('/');
      }
    }
  }, [user, loading, isAdmin]);

  // When the app is still loading or checking auth state,
  // we can return a loading indicator
  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Loading text="Loading..." />
      </View>
    );
  }

  // Set title based on screen
  const setScreenTitle = (route: string) => {
    switch (route) {
      case 'dashboard':
        setTitle('Dashboard');
        break;
      case 'feeds':
        setTitle('Feeds');
        break;
      case 'add-feed':
        setTitle('Add Feed');
        break;
      case 'edit-feed/[id]':
        setTitle('Edit Feed');
        break;
      case 'users':
        setTitle('Users');
        break;
      case 'analytics':
        setTitle('Analytics');
        break;
      default:
        setTitle('Admin');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <View className="flex-1 bg-background">
      <AdminHeader
        title={title}
        showMenu={true}
        onMenuPress={toggleSidebar}
        showAdd={title === 'Feeds'}
      />
      
      <AdminSidebar 
        isVisible={isSidebarVisible} 
        onClose={toggleSidebar} 
      />
      
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F0FFF3' },
        }}
        screenListeners={{
          state: (e) => {
            const routes = e.data?.state?.routes;
            if (routes && routes.length) {
              const currentRoute = routes[routes.length - 1].name;
              setScreenTitle(currentRoute);
            }
          },
        }}
      >
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="feeds" />
        <Stack.Screen name="add-feed" />
        <Stack.Screen name="edit-feed/[id]" />
        <Stack.Screen name="users" />
        <Stack.Screen name="analytics" />
      </Stack>
    </View>
  );
}