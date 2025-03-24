import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from './Text';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const Loading = ({
  text = 'Loading...',
  size = 'large',
  fullScreen = false,
}: LoadingProps) => {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={size} color="#11CBD7" />
        {text && (
          <Text className="mt-2 text-primary font-rubik-medium">{text}</Text>
        )}
      </View>
    );
  }

  return (
    <View className="py-4 items-center justify-center">
      <ActivityIndicator size={size} color="#11CBD7" />
      {text && (
        <Text className="mt-2 text-primary font-rubik-medium">{text}</Text>
      )}
    </View>
  );
};