import React, { useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Header } from '../../components/Header';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '../../lib/utils';

export default function ProfileScreen() {
  const { user, profile, signOut, updateProfile, isAdmin } = useAuthContext();
  const { mode, setMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setFullName(profile?.full_name || '');
    setUsername(profile?.username || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: fullName,
        username: username || undefined,
      });

      if (error) {
        Alert.alert('Error', error);
      } else {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
  };

  const handleGoToAdmin = () => {
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Profile" />
        <View className="flex-1 bg-background items-center justify-center p-4">
          <Ionicons name="person" size={60} color="#C6F1E7" className="mb-4" />
          <Text variant="h5" weight="semibold" className="text-center mb-2">
            Sign in to view profile
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Create an account or sign in to manage your profile settings.
          </Text>
          <Button 
            onPress={() => router.push('/login')}
            icon={<Ionicons name="log-in-outline" size={20} color="#FFFFFF" />}
          >
            Sign In
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Profile" />
      <ScrollView className="flex-1 bg-background p-4">
        {/* Profile Card */}
        <Card className="mb-4">
          <View className="items-center py-4">
            {profile?.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }} 
                className="w-24 h-24 rounded-full mb-4"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-secondary items-center justify-center mb-4">
                <Text variant="h2" className="text-primary font-rubik-bold">
                  {getInitials(profile?.full_name || profile?.username || 'User')}
                </Text>
              </View>
            )}
            
            {isEditing ? (
              <View className="w-full px-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter a username"
                />
                <View className="flex-row mt-4">
                  <Button
                    variant="outline"
                    onPress={handleCancelEdit}
                    className="flex-1 mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={isLoading}
                    onPress={handleSaveProfile}
                    className="flex-1 ml-2"
                  >
                    Save
                  </Button>
                </View>
              </View>
            ) : (
              <>
                <Text variant="h5" weight="semibold" className="mb-1">
                  {profile?.full_name || 'User'}
                </Text>
                {profile?.username && (
                  <Text className="text-gray-600 mb-2">
                    @{profile.username}
                  </Text>
                )}
                <Text className="text-gray-600 mb-4">
                  {user?.data?.user?.email}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleEditProfile}
                  icon={<Ionicons name="pencil-outline" size={16} color="#11CBD7" />}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </View>
        </Card>

        {/* Settings Section */}
        <Text variant="h6" weight="semibold" className="mb-2 px-1">
          Settings
        </Text>
        
        {/* Theme Settings */}
        <Card className="mb-4">
          <Text weight="medium" className="mb-3">
            Theme
          </Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity
              onPress={() => handleThemeChange('light')}
              className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                mode === 'light' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`${
                  mode === 'light' ? 'text-white' : 'text-gray-800'
                }`}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleThemeChange('dark')}
              className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                mode === 'dark' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`${
                  mode === 'dark' ? 'text-white' : 'text-gray-800'
                }`}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleThemeChange('system')}
              className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                mode === 'system' ? 'bg-primary border-primary' : 'bg-white border-gray-300'
              }`}
            >
              <Text
                className={`${
                  mode === 'system' ? 'text-white' : 'text-gray-800'
                }`}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Admin Section */}
        {isAdmin && (
          <Card className="mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text weight="medium" className="mb-1">
                  Admin Dashboard
                </Text>
                <Text variant="body-sm" className="text-gray-600">
                  Manage feeds, users and view analytics
                </Text>
              </View>
              <Button size="sm" onPress={handleGoToAdmin}>
                Go to Admin
              </Button>
            </View>
          </Card>
        )}

        {/* Version Info */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600">App Version</Text>
            <Text className="text-gray-600">1.0.0</Text>
          </View>
        </Card>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          fullWidth
          className="mt-2"
          onPress={handleSignOut}
          icon={<Ionicons name="log-out-outline" size={20} color="#FA4659" />}
        >
          <Text className="text-accent">Sign Out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}