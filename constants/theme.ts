import { COLORS } from './colors';
import { FONTS, FONT_SIZES } from './fonts';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  xxl: 64,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const THEME = {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  SIZES,
  SHADOWS,
};

export default THEME;