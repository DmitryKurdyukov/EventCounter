import { Alert, Dimensions, FlatList, View } from 'react-native';
import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useEventsDataStore } from '@/zustand/mainStore';
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import SwipeableCardEvent from '@/components/swipeable-card-event';

/**
 * Main home screen component displaying the list of tracked events.
 * 
 * Manages event data loading from AsyncStorage, displays events in a scrollable
 * list (sorted by favorite status), and provides functionality to add, delete,
 * and favorite events. Events with favorite status appear first.
 * 
 * On first launch, initializes with default sample events if no data exists.
 * 
 * @returns Home screen with event list
 */
export default function HomeScreen() {
  const eventsData = useEventsDataStore(state => state.eventsData);
  const setEventsData = useEventsDataStore(state => state.setEventsData);
  const flatListRef = useRef<FlatList>(null);

  const startData = [
    {id:'1', name:'Did a good deed', color:'#1E3A8A', icon:'🌈', comment:'', favorite:false, data:[]},
    {id:'2', name:'Went for a medical check-up', color:'#0277BD', icon:'🚑', comment:'', favorite:false, data:[]},
    {id:'3', name:'Experienced stress', color:'#B71C1C', icon:'🫩', comment:'', favorite:false, data:[]}
  ];

  useEffect(()=>{
    try{
      AsyncStorage.getItem('eventsData').then((data)=>{
        if(data !== null){
          setEventsData(JSON.parse(data));
        }
        else{
          setEventsData(startData);
        }
      })
    }
    catch{
      setEventsData(startData);
    }
    
  }, []);

  /**
   * Shows a confirmation alert before deleting an event.
   * 
   * @param id - ID of the event to delete
   */
  const showDeleteAlert = (id:string) => {
    Alert.alert(
      'Delete event?',                    
      'Do you want to delete this event?',     
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',                 
        },
        {
          text: 'Delete',
          onPress: () => deleteEvent(id),
          style: 'destructive',            
        },
      ],
      { cancelable: true }                 
    );
  };

  /**
   * Toggles the favorite status of an event.
   * 
   * @param id - ID of the event to toggle favorite status
   */
  const setFavoriteEvent = (id:string) => {
    let newEventsData = [...eventsData];
    const eventIndex = newEventsData.findIndex(ev => ev.id === id);
    if (eventIndex !== -1) {
      newEventsData[eventIndex].favorite = !newEventsData[eventIndex].favorite;
      setEventsData(newEventsData);
    }
  }

  /**
   * Adds a new occurrence of an event with current timestamp.
   * 
   * Creates a new event data entry with the current date/time and
   * triggers haptic feedback on success.
   * 
   * @param id - ID of the event to add an occurrence to
   */
  const addEvent = (id:string) => {
    let newEventsData = [...eventsData];
    newEventsData[newEventsData.findIndex(el=>el.id === id)].data.push(
      { dateTime: new Date().toISOString(), comment: '' }
    ); 
    setEventsData(newEventsData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /**
   * Removes an event from the events list.
   * 
   * @param id - ID of the event to delete
   */
  const deleteEvent = (id:string) => {
    const newEventsData = eventsData.filter(ev => ev.id !== id);
    setEventsData(newEventsData);
  };

  return (
    <FlatList
      ref={flatListRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom:100, marginTop:Spacing.xl, marginHorizontal:Spacing.md}}
      data={[...eventsData].sort((a, b) => { return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) })}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SwipeableCardEvent 
          event={item} 
          onAdd={()=>{addEvent(item.id)}} 
          onDelete={()=>{showDeleteAlert(item.id)}} 
          onSetFavorite={()=>{setFavoriteEvent(item.id)}}
          onSwipeStart={()=>{flatListRef.current?.setNativeProps({ scrollEnabled: false })}}
          onSwipeEnd={()=>{flatListRef.current?.setNativeProps({ scrollEnabled: true })}}
        />
      )}
      ListEmptyComponent={()=>{
        return(
          <View style={{flex:1, height:Dimensions.get('screen').height/2, justifyContent:'center', alignItems:'center'}}>
            <ThemedText type='subtitle' style={{textAlign:'center'}}>The event list is empty. To add an event, click on the + in the upper right corner.</ThemedText>
          </View>
        )
      }}
    />
  );
}