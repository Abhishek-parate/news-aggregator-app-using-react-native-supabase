import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  padding = 'md',
  elevation = 'md',
  className,
  ...rest
}: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  return (
    <View
      className={`bg-white rounded-lg overflow-hidden
                 ${paddingClasses[padding]} 
                 ${elevationClasses[elevation]}
                 ${className || ''}`}
      {...rest}
    >
      {children}
    </View>
  );
};

interface CardHeaderProps extends ViewProps {
  children: ReactNode;
}

export const CardHeader = ({ children, className, ...rest }: CardHeaderProps) => {
  return (
    <View className={`mb-3 ${className || ''}`} {...rest}>
      {children}
    </View>
  );
};

interface CardContentProps extends ViewProps {
  children: ReactNode;
}

export const CardContent = ({ children, className, ...rest }: CardContentProps) => {
  return <View className={className || ''} {...rest}>{children}</View>;
};

interface CardFooterProps extends ViewProps {
  children: ReactNode;
}

export const CardFooter = ({ children, className, ...rest }: CardFooterProps) => {
  return (
    <View className={`mt-3 pt-3 border-t border-gray-200 ${className || ''}`} {...rest}>
      {children}
    </View>
  );
};