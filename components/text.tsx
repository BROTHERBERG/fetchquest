// components/Text.tsx
import { Text as RNText, TextStyle } from 'react-native';
import { theme } from '@/constants/theme';

type TextProps = {
  variant: 'h1' | 'h2' | 'body';
  weight?: 'regular' | 'medium' | 'bold';
} & TextStyle;

export const Text = ({ variant, weight = 'regular', ...props }) => (
  <RNText
    style={[
      { 
        fontSize: theme.typography.sizes[variant],
        fontFamily: theme.typography.fonts[weight],
      },
      props.style,
    ]}
    {...props}
  />
);