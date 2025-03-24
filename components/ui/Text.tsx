import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'small' | 'caption';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  centered?: boolean;
}

const Text: React.FC<CustomTextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = COLORS.gray[800],
  centered = false,
  style,
  children,
  ...props
}) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'light':
        return FONTS.light;
      case 'regular':
        return FONTS.regular;
      case 'medium':
        return FONTS.medium;
      case 'semibold':
        return FONTS.semibold;
      case 'bold':
        return FONTS.bold;
      case 'extrabold':
        return FONTS.extrabold;
      default:
        return FONTS.regular;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: 32,
          lineHeight: 40,
        };
      case 'h2':
        return {
          fontSize: 28,
          lineHeight: 36,
        };
      case 'h3':
        return {
          fontSize: 24,
          lineHeight: 32,
        };
      case 'h4':
        return {
          fontSize: 20,
          lineHeight: 28,
        };
      case 'subtitle':
        return {
          fontSize: 18,
          lineHeight: 26,
        };
      case 'body':
        return {
          fontSize: 16,
          lineHeight: 24,
        };
      case 'small':
        return {
          fontSize: 14,
          lineHeight: 20,
        };
      case 'caption':
        return {
          fontSize: 12,
          lineHeight: 18,
        };
      default:
        return {
          fontSize: 16,
          lineHeight: 24,
        };
    }
  };

  return (
    <RNText
      style={[
        {
          color,
          fontFamily: getFontFamily(),
          textAlign: centered ? 'center' : 'auto',
          ...getVariantStyles(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;