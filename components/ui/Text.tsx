import React, { ReactNode } from 'react';
import { Text as RNText, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'caption';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'light';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Text = ({
  children,
  variant = 'body',
  weight = 'regular',
  align,
  className,
  ...rest
}: CustomTextProps) => {
  
  const variantClasses = {
    h1: 'text-4xl',
    h2: 'text-3xl',
    h3: 'text-2xl',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base font-rubik-semibold',
    body: 'text-base',
    'body-sm': 'text-sm',
    caption: 'text-xs',
  };

  const weightClasses = {
    light: 'font-rubik-light',
    regular: 'font-rubik',
    medium: 'font-rubik-medium',
    semibold: 'font-rubik-semibold',
    bold: 'font-rubik-bold',
    extrabold: 'font-rubik-extrabold',
  };

  const alignClasses = {
    auto: '',
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
    justify: 'text-justify',
  };

  return (
    <RNText
      className={`${variantClasses[variant]} ${weightClasses[weight]} ${align ? alignClasses[align] : ''} text-gray-800 ${className || ''}`}
      {...rest}
    >
      {children}
    </RNText>
  );
};