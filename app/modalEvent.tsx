import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Dimensions, FlatList, ScrollView, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Host, Picker } from '@expo/ui/swift-ui';
import Container from '@/components/ui/container';
import { primaryColor, Radius, Spacing } from '@/constants/theme';
import { BarChart } from "react-native-gifted-charts";
import { useEffect, useState } from 'react';
import { useEventsDataStore } from '@/zustand/mainStore';
import { EventDataItemType } from '@/interfaces/interfaces';
import Heatmap from '@/components/heatmap';
import { formatDateTimeUS } from '@/utils/utils';
import HapticWrapper from '@/components/haptic-wrapper';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ModalEventScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [selectedTabNum, setSelectedTabNum] = useState<number>(0);
  const [currentEventData, setCurrentEventData] = useState<EventDataItemType[]>([]);
  const [yearlyStats, setYearlyStats] = useState<{
    year: number;
    events: EventDataItemType[];
    barData: { value: number; label: string }[];
  }[]>([]);
  const eventsData = useEventsDataStore(state => state.eventsData);
  const setEventsData = useEventsDataStore(state => state.setEventsData);

  useEffect(()=>{
    const event = eventsData.find(ev=>ev.id === params.id);
    if(params.id !== undefined && event !== undefined){
      setCurrentEventData(event.data);
      updateYearlyStats(event.data);
    }
    else{
      alert('Error: event not found');
      router.back();
    }
  }, []);

  const updateYearlyStats = (data: EventDataItemType[]) => {
    // Group events by year
    const byYear = new Map<number, EventDataItemType[]>();
    data.forEach((ev) => {
      const d = new Date(ev.dateTime);
      const y = d.getFullYear();
      if (!byYear.has(y)) byYear.set(y, []);
      byYear.get(y)!.push(ev);
    });

    // Build yearly stats array sorted descending by year
    const years = Array.from(byYear.keys()).sort((a, b) => b - a);
    const stats = years.map((y) => {
      const eventsOfYear = byYear.get(y) || [];
      const months = Array.from({ length: 12 }).map((_, i) => ({ 
        value: 0, 
        label: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'][i] 
      }));
      eventsOfYear.forEach((ev) => {
        const m = new Date(ev.dateTime).getMonth();
        months[m].value += 1;
      });
      return { year: y, events: eventsOfYear, barData: months.filter(m => m.value > 0) };
    });

    setYearlyStats(stats);
  };

  const removeEvent = (itemToRemove: EventDataItemType) => {
    const eventIndex = eventsData.findIndex(ev=>ev.id === params.id);
    if (eventIndex === -1) return;

    let newEventData = [...eventsData];
    const dataIndex = newEventData[eventIndex].data.findIndex(
      ev => ev.dateTime === itemToRemove.dateTime && ev.comment === itemToRemove.comment
    );
    
    if (dataIndex !== -1) {
      newEventData[eventIndex].data.splice(dataIndex, 1);
      setEventsData(newEventData);
      setCurrentEventData(newEventData[eventIndex].data);
      updateYearlyStats(newEventData[eventIndex].data);
    }
  }

  return (
    <Container>
      <View style={{marginTop:Spacing.xl}}>
        <Host matchContents>
          <Picker
            options={['History', 'Analytics']}
            selectedIndex={selectedTabNum}
            onOptionSelected={({ nativeEvent: { index } }) => {
              setSelectedTabNum(index);
            }}
            variant="segmented"
          />
        </Host>
      </View>

      {
        selectedTabNum === 0 && (
          <View>
            <View style={{marginTop:Spacing.xl}}>
              {
                currentEventData.length !== 0 && (
                  <View style={{position:'absolute', marginLeft:3, width:1, height:'100%', backgroundColor:colorScheme === 'dark' ? 'white' : 'black'}}></View>
                )
              }
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:100}}
                data={[...currentEventData].reverse()}
                keyExtractor={(item, index) => `${item.dateTime}-${index}`}
                renderItem={({ item }) => {
                  return(
                    <View style={{paddingLeft:Spacing.md, paddingBottom:Spacing.md}}>
                      <View style={{
                        position:'absolute', 
                        width:7, 
                        height:7,
                        top:8, 
                        backgroundColor:colorScheme === 'dark' ? 'white' : 'black', 
                        borderRadius:Radius.full
                      }}/>
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                        <HapticWrapper 
                          hapticStyle="light" 
                          style={{marginRight:Spacing.xs}} 
                          onPress={()=>{
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
                                  onPress: () => removeEvent(item),
                                  style: 'destructive',            
                                },
                              ],
                              { cancelable: true }                 
                            );
                          }}
                        >
                          <IconSymbol size={14} name={"trash"} color={'#dc3545'} />
                        </HapticWrapper>
                        <ThemedText style={{fontWeight:'600'}}>{formatDateTimeUS(item.dateTime)}</ThemedText>
                      </View>
                      {
                        item.comment !== '' && (
                          <ThemedText style={{marginLeft:Spacing.sm, fontStyle:'italic'}}>{item.comment}</ThemedText>
                        )
                      }
                    </View>
                  )
                }}
                ListEmptyComponent={()=>{
                  return(
                    <View style={{flex:1, height:Dimensions.get('screen').height/2, justifyContent:'center', alignItems:'center'}}>
                      <ThemedText type='subtitle' style={{textAlign:'center'}}>The event addition history is empty.</ThemedText>
                    </View>
                  )
                }}
              ></FlatList>
            </View>
          </View>
        )
      }

      {
        selectedTabNum === 1 && currentEventData.length > 0 && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
            <View style={{marginTop:Spacing.xl}}>
              <ThemedText type={'title'} style={{marginBottom:Spacing.md}}>{'Total events: '+currentEventData.length}</ThemedText>

              {yearlyStats.map((ys) => (
                <View key={String(ys.year)} style={{marginBottom: Spacing.xl}}>
                  {
                    yearlyStats.length > 1 && (
                      <>
                        <ThemedText type={'title'} style={{marginBottom: Spacing.sm}}>{`Year ${ys.year}`}</ThemedText>
                        <ThemedText type={'subtitle'} style={{marginBottom:Spacing.md}}>{`total:${ys.events.length}`}</ThemedText>
                      </>
                    )
                  }
                  <ThemedText type={'subtitle'} style={{marginBottom:Spacing.md}}>{`Bar chart`}</ThemedText>
                  <BarChart
                    // stepValue={1}
                    barBorderRadius={5}
                    frontColor={primaryColor}
                    data={ys.barData}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    yAxisTextStyle={{color: colorScheme === 'dark' ? 'white' : 'black'}}
                    xAxisLabelTextStyle={{color: colorScheme === 'dark' ? 'white' : 'black'}}
                  />

                  <View style={{height:Spacing.md}} />
                    <ThemedText type={'subtitle'} style={{marginBottom:Spacing.md}}>{`Heat map`}</ThemedText>

                    <Heatmap data={ys.events} />
                  </View>
              ))}
            </View>
          </ScrollView>
        )
      }
    </Container>
  );
}