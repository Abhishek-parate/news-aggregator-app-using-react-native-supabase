import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuthContext();

  const validateForm = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert(
          'Success', 
          'Account created successfully! Please check your email to verify your account.',
          [
            { 
              text: 'OK', 
              onPress: () => router.push('/login') 
            }
          ]
        );
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
        <View className="items-center mb-8">
          <View className="bg-primary rounded-full w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="newspaper" size={40} color="#FFFFFF" />
          </View>
          <Text variant="h4" weight="bold" className="text-primary">
            NewsAggregator
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Create your account
          </Text>
        </View>

        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
        />

        <Input
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
        />

        <Button
          fullWidth
          loading={isLoading}
          onPress={handleRegister}
          className="mt-2 mb-4"
        >
          Sign Up
        </Button>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity activeOpacity={0.7} className="ml-1">
              <Text className="text-primary font-rubik-medium">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}