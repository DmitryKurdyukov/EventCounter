import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, TextInput, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { DateTimePicker, Host } from '@expo/ui/swift-ui';
import Container from '@/components/ui/container';
import { Radius, secondaryColorDark, secondaryColorLight, Spacing } from '@/constants/theme';
import { useEventsDataStore } from '@/zustand/mainStore';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import SmoothKeyboardScrollView from '@/components/smooth-keyboard-scrollview';

export default function ModalAddEventScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const eventsData = useEventsDataStore(state => state.eventsData);
  const setEventsData = useEventsDataStore(state => state.setEventsData);
  const [eventName, setEventName] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [comment, setComment] = useState<string>('');
  const [commentInputFocused, setCommentInputFocused] = useState<boolean>(false);

  useEffect(()=>{
    const event = eventsData.find(ev=>ev.id === params.id);
    if(params.id !== undefined && event !== undefined){
      setEventName(event.name);
    }
    else{
      alert('Error: event not found');
      router.back();
    }
  }, [params]);

  const addEvent = () => {
    let newEventsData = [...eventsData];
    newEventsData[newEventsData.findIndex(el=>el.id === params.id)].data.push(
      { dateTime: selectedDate.toISOString(), comment: comment }
    ); 
    setEventsData(newEventsData);
    router.back();
  }

  return (
    <Container>
      <SmoothKeyboardScrollView>
        <ScrollView contentContainerStyle={{flex:1, paddingBottom:100}} showsVerticalScrollIndicator={false}>
          <View style={[{flex:1, alignItems:'center', justifyContent:commentInputFocused?'flex-start':'center'}, commentInputFocused?{marginTop:Spacing.xl}:{}]}>
            <ThemedText style={{textAlign:'center'}} type="title">{eventName}</ThemedText>
            <View style={{marginVertical:Spacing.xxxl}}>
              <Host matchContents>
                <DateTimePicker
                  onDateSelected={date => {
                    setSelectedDate(date);
                  }}
                  displayedComponents='dateAndTime'
                  initialDate={selectedDate.toISOString()}
                  variant='compact'
                />
              </Host>
            </View>
            <TextInput 
              value={comment}
              onChangeText={setComment}
              placeholder='Comment'
              placeholderTextColor="#9AA0A6"
              multiline={true}
              onFocus={()=>{setCommentInputFocused(true)}}
              onBlur={()=>{setCommentInputFocused(false)}}
              style={{
                width:'100%',
                minHeight:100,
                padding:Spacing.md,
                backgroundColor: colorScheme === 'dark' ? secondaryColorDark : secondaryColorLight,
                fontWeight: '500',
                fontSize: 16,
                marginBottom:Spacing.xxxl,
                borderRadius: Radius.xl,
                color: colorScheme === 'dark' ? 'white' : 'black',
              }}
            />
            <Button title="Add Event" onPress={()=>{addEvent()}} />
          </View>
        </ScrollView>
      </SmoothKeyboardScrollView>
    </Container>
  );
}


