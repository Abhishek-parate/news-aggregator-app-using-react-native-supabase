import React, { ReactNode, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onPressRightIcon?: () => void;
}

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onPressRightIcon,
  secureTextEntry,
  className,
  ...rest
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus({} as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur({} as any);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getBorderColorClass = () => {
    if (isFocused) return 'border-primary';
    if (error) return 'border-accent';
    return 'border-gray-300';
  };

  return (
    <View className={`mb-4 ${className || ''}`}>
      {label && (
        <Text className="text-gray-700 mb-1 font-rubik-medium">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-lg overflow-hidden
                   ${getBorderColorClass()}
                   ${leftIcon ? 'pl-3' : 'pl-4'}
                   ${rightIcon || secureTextEntry ? 'pr-3' : 'pr-4'}
                   py-2.5`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-gray-800 font-rubik"
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity className="ml-2" onPress={onPressRightIcon}>
            {rightIcon}
          </TouchableOpacity>
        )}
        {secureTextEntry && (
          <TouchableOpacity 
            className="ml-2" 
            onPress={togglePasswordVisibility}
          >
            <Text>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-accent text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};