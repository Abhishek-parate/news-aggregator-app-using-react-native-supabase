import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuthContext();

  const validateEmail = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        Alert.alert('Error', error);
      } else {
        setIsSent(true);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="self-start mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="bg-primary rounded-full w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="key" size={40} color="#FFFFFF" />
          </View>
          <Text variant="h4" weight="bold" className="text-primary">
            Reset Password
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            We'll send you a link to reset your password
          </Text>
        </View>

        {isSent ? (
          <View className="items-center">
            <Ionicons name="checkmark-circle" size={60} color="#11CBD7" className="mb-4" />
            <Text variant="h5" weight="semibold" className="text-center mb-2">
              Reset Link Sent!
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Please check your email to reset your password.
            </Text>
            <Button
              variant="primary"
              onPress={() => router.push('/login')}
              className="mt-4"
            >
              Back to Login
            </Button>
          </View>
        ) : (
          <>
            <Input
              label="Email"
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
            />

            <Button
              fullWidth
              loading={isLoading}
              onPress={handleResetPassword}
              className="mt-4 mb-4"
            >
              Send Reset Link
            </Button>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/login')}
              className="self-center mt-4"
            >
              <Text className="text-primary">Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}