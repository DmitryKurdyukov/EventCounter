import * as Haptics from 'expo-haptics';
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export type HapticStyle =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

const getHapticStyle = (style: HapticStyle) => {
  switch (style) {
    case 'light':
      return Haptics.ImpactFeedbackStyle.Light;
    case 'medium':
      return Haptics.ImpactFeedbackStyle.Medium;
    case 'heavy':
      return Haptics.ImpactFeedbackStyle.Heavy;
    case 'success':
      return Haptics.NotificationFeedbackType.Success;
    case 'warning':
      return Haptics.NotificationFeedbackType.Warning;
    case 'error':
      return Haptics.NotificationFeedbackType.Error;
    default:
      return Haptics.ImpactFeedbackStyle.Medium;
  }
};

interface HapticWrapperProps extends TouchableOpacityProps {
  /*
   * Haptic styles. Use simple strings for selection.
   */
  hapticStyle: HapticStyle;

  /*
   * Disables haptics.
   */
  disableHaptics?: boolean;
}

/*
 * A wrapper component for haptic feedback on press.
 */
export default function HapticWrapper({
  children,
  onPress,
  hapticStyle,
  disableHaptics = false,
  ...rest
}: HapticWrapperProps) {
  const handlePress = (event: any) => {
    if (!disableHaptics) {
      const hapticFeedback = getHapticStyle(hapticStyle);

      if (
        hapticFeedback === Haptics.NotificationFeedbackType.Success ||
        hapticFeedback === Haptics.NotificationFeedbackType.Warning ||
        hapticFeedback === Haptics.NotificationFeedbackType.Error
      ) {
        Haptics.notificationAsync(hapticFeedback);
      } else {
        Haptics.impactAsync(hapticFeedback as Haptics.ImpactFeedbackStyle);
      }
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} {...rest}>
      {children}
    </TouchableOpacity>
  );
}