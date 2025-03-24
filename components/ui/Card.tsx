import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SHADOWS } from '../../constants/theme';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  style,
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: COLORS.white,
          borderWidth: 0,
          ...SHADOWS.md,
        };
      case 'outlined':
        return {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.gray[200],
        };
      case 'filled':
        return {
          backgroundColor: COLORS.gray[50],
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: COLORS.white,
          borderWidth: 0,
          ...SHADOWS.md,
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return {
          padding: 0,
        };
      case 'small':
        return {
          padding: 8,
        };
      case 'medium':
        return {
          padding: 16,
        };
      case 'large':
        return {
          padding: 24,
        };
      default:
        return {
          padding: 16,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        getPaddingStyles(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default Card;