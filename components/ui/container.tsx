import { View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { ThemedView } from '../themed-view';
import { Spacing } from '@/constants/theme';

interface ContainerProps extends ViewProps {
  children?: ReactNode;
  style?: ViewProps['style'];
  
}

export default function Container({ children, style, ...rest }: ContainerProps) {
  return (
    <ThemedView style={[style, {paddingHorizontal:Spacing.xl, flex:1}]} {...rest}>
      {children}
    </ThemedView>
  )
}