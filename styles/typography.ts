import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

// Typography styles extracted from Figma design system
export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.25,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.15,
  },
  h4: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.15,
  },
  h5: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.15,
  },
  h6: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.25,
  },
});