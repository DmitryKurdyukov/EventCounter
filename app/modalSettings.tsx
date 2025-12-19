import Button from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Spacing } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useEventsDataStore } from '@/zustand/mainStore';

export default function ModalSettingsScreen() {
  const setEventsData = useEventsDataStore(state => state.setEventsData);

  const isJson = (value: unknown): boolean => {
    if (typeof value !== 'string') {
      return false;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }

    try {
      const parsed = JSON.parse(trimmed);
      return true;
    } catch (e) {
      return false;
    }
  }

  const exportData = () => {
    AsyncStorage.getItem('eventsData').then((data)=>{
      Alert.alert(
        'Data',     
        data??'[]',                   
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',                 
          },
          {
            text: 'Copy to Clipboard',
            onPress: () => {
              Clipboard.setStringAsync(data??'[]');
            },
            style: 'default',            
          },
        ],
        { cancelable: true }                 
      );
    });
  }

  const importData = () => {
    Clipboard.getStringAsync().then((data)=>{
      Alert.alert(
        'Clipboard data',                    
        isJson(data)?String(data):'[]',       
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',                 
          },
          {
            text: 'Import',
            onPress: () => {
              setEventsData(isJson(data)?JSON.parse(data):[]);
            },
            style: 'default',            
          },
        ],
        { cancelable: true }                 
      );
    });
  }

  return (
    <Container>
      <View style={{marginTop:Spacing.xl}}>
        <Button title="Export data" onPress={()=>{exportData()}} />
        <View style={{marginTop:Spacing.xl}}></View>
        <Button title="Import data" onPress={()=>{importData()}} />
      </View>
      
    </Container>
  );
}


