import { router, Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { primaryColor, Spacing } from '@/constants/theme';
import HapticWrapper from '@/components/haptic-wrapper';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          headerRight(props) {
            return (
              <HapticWrapper 
                hapticStyle='light' 
                onPress={()=>{
                  setTimeout(()=>{
                    router.push('/modalCreateEvent');
                  }, 200);
                }} 
                style={{marginRight:Spacing.md}}>
                <IconSymbol size={28} name="plus" color={primaryColor} />
              </HapticWrapper>
            )
          },
          headerLeft(props) {
            return (
              <HapticWrapper 
                hapticStyle='light' 
                onPress={()=>{
                  setTimeout(()=>{
                    router.push('/modalSettings');
                  }, 200);
                }} 
                style={{marginLeft:Spacing.md}}>
                <IconSymbol size={28} name="gear" color={primaryColor} />
              </HapticWrapper>
            )
          },
        }}
      />
    </Tabs>
  );
}
