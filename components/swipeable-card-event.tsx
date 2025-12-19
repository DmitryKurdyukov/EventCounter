import { Dimensions, Text, TouchableOpacity, useColorScheme, View, Animated, PanResponder } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import HapticWrapper from '@/components/haptic-wrapper';
import { router } from 'expo-router';
import { primaryColor, Radius, Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { EventType } from '@/interfaces/interfaces';
import { useRef } from 'react';

interface SwipeableCardEventType {
  event:EventType
  onAdd:()=>void
  onDelete:()=>void
  onSetFavorite:()=>void
  onSwipeStart:()=>void
  onSwipeEnd:()=>void
}

export default function SwipeableCardEvent({ event, onAdd, onDelete, onSwipeStart, onSwipeEnd, onSetFavorite }: SwipeableCardEventType) {
  const translateX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const swipeThreshold = screenWidth * 0.3;
  const colorScheme = useColorScheme();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
          const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          if (isHorizontalSwipe && Math.abs(gestureState.dx) > 5) {
            onSwipeStart();
            return true;
          }
          return false;
      },
      onPanResponderMove: (_, gestureState) => {
        const maxSwipe = 100; 
        const limitedDx = Math.max(-maxSwipe, Math.min(maxSwipe, gestureState.dx));
        translateX.setValue(limitedDx);
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => {
        // Reset position if gesture is terminated
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
        onSwipeEnd();
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) >= swipeThreshold) {
          if (gestureState.dx > 0) {
            // Swipe to right
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            onSwipeEnd();
            // addFastEvent
            onAdd();
          } else {
            // Swipe to left
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            onSwipeEnd();
            onDelete();
          }
        } else {
          // Return to original position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
          onSwipeEnd();
        }
      },
    })
  ).current;

  const leftActionOpacity = translateX.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [-swipeThreshold, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ marginBottom: Spacing.md }}>
      {/* Add button */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 16,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: leftActionOpacity,
        }}
      >
        <IconSymbol size={55} name="plus.circle.fill" color={primaryColor} />
      </Animated.View>

      {/* Delete button */}
      <Animated.View
        style={{
          position: 'absolute',
          right: 16,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: rightActionOpacity,
        }}
      >
        <IconSymbol size={55} name="trash.circle.fill" color={'#dc3545'} />
      </Animated.View>

      {/* Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setTimeout(()=>{
              router.push({pathname:'/modalEvent', params:{id:event.id}});
            }, 200);
          }}
          onLongPress={() => {onDelete()}}
          activeOpacity={0.9}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow:'hidden',
            padding: Spacing.md,
            borderRadius: Radius.lg,
            backgroundColor: colorScheme === 'dark' ? '#121212':'white',
          }}>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <View style={{width:48, height:48, backgroundColor:`${event.color}30`, marginRight: Spacing.sm, justifyContent:'center', alignItems:'center', borderRadius:Radius.full}}>
                <Text style={{ fontSize: 30, color:'white' }}>{event.icon}</Text>
              </View>
              <ThemedText type="subtitle" style={{ flexShrink: 1 }}>
                {event.name}
              </ThemedText>
            </View>
            <View style={{width:3, height:'80%', backgroundColor:event.color, borderRadius:Radius.full}}></View>
            <View style={{ flexDirection:'row', marginLeft: Spacing.sm,  justifyContent:'center', alignItems:'center' }}>
              <HapticWrapper hapticStyle="light" style={{marginRight:4}} onPress={()=>{onSetFavorite()}}>
                <IconSymbol size={22} name={event.favorite?"star.fill":"star"} color={primaryColor} />
              </HapticWrapper>
              <HapticWrapper 
                hapticStyle="light" 
                onPress={() => {
                  setTimeout(()=>{
                    router.push({pathname:'/modalAddEvent', params:{id:event.id}});
                  }, 100);
                }}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                }}
              >
                <IconSymbol size={40} name="plus.circle.fill" color={primaryColor} />
              </HapticWrapper>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}