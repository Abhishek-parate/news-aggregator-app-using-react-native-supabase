import React, { useState } from 'react';
import { View, Image, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Error', error);
      } else {
        // Success, navigation will be handled by the auth context
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
            Your one-stop news destination
          </Text>
        </View>

        <Text variant="h5" weight="semibold" className="mb-6">
          Welcome Back
        </Text>

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
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/forgot-password')}
          className="self-end mb-6"
        >
          <Text className="text-primary">Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          fullWidth
          loading={isLoading}
          onPress={handleLogin}
          className="mb-4"
        >
          Sign In
        </Button>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Don't have an account?</Text>
          <Link href="/register" asChild>
            <TouchableOpacity activeOpacity={0.7} className="ml-1">
              <Text className="text-primary font-rubik-medium">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}