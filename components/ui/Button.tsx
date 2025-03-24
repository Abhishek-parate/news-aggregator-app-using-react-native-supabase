import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  className,
  ...rest
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    outline: 'bg-transparent border border-primary',
    ghost: 'bg-transparent',
    danger: 'bg-accent',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-800',
    outline: 'text-primary',
    ghost: 'text-primary',
    danger: 'text-white',
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 rounded-md',
    md: 'py-2.5 px-4 rounded-lg',
    lg: 'py-3 px-5 rounded-xl',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`${disabled || loading ? 'opacity-70' : 'opacity-100'} 
                  ${fullWidth ? 'w-full' : 'w-auto'} 
                  ${sizeClasses[size]} 
                  ${variantClasses[variant]} 
                  flex flex-row items-center justify-center
                  ${className || ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost'
              ? '#11CBD7'
              : '#FFFFFF'
          }
          className="mr-2"
        />
      ) : icon && iconPosition === 'left' ? (
        <Text className="mr-2">{icon}</Text>
      ) : null}

      <Text
        className={`font-rubik-medium text-center
                   ${textSizeClasses[size]} 
                   ${textVariantClasses[variant]}`}
      >
        {children}
      </Text>

      {icon && iconPosition === 'right' && !loading ? (
        <Text className="ml-2">{icon}</Text>
      ) : null}
    </TouchableOpacity>
  );
};