import { router } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, useColorScheme } from 'react-native';
import Button from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import Container from '@/components/ui/container';
import { Spacing, Radius, secondaryColorLight, secondaryColorDark } from '@/constants/theme';
import { primaryColor } from '@/constants/theme';
import HorizontalGridScroll from '@/components/horizontal-grid-scroll';
import { useEventsDataStore } from '@/zustand/mainStore';
import emojiData from 'emoji-datasource/emoji.json';
import SmoothKeyboardScrollView from '@/components/smooth-keyboard-scrollview';

const COLORS = [
  '#1E3A8A', '#8E24AA', '#D81B60', '#E53935', '#F4511E', '#FF8F00',
  '#2E7D32', '#00695C', '#00897B', '#0277BD', '#3949AB', '#512DA8',
  '#6D4C41', '#BF360C', '#4A148C', '#1B5E20', '#006064', '#B71C1C',
  '#AD1457', '#C2185B', '#7B1FA2', '#33691E', '#01579B', '#004D40',
  '#880E4F', '#F57C00', '#558B2F', '#311B92', '#D32F2F', '#00ACC1',
  '#283593', '#689F38', '#E64A19', '#5E35B1', '#00838F', '#6A1B9A',
  '#FF6F00', '#1A237E', '#2E7D32', '#C62828',
  '#FF3D00', '#FFEA00', '#00E5FF', '#76FF03', '#F50057', '#651FFF',
  '#E040FB', '#BBDEFB', '#C8E6C9', '#FFF9C4', '#FFCCBC', '#F8BBD0',
  '#D1C4E9', '#B2EBF2', '#757575', '#424242', '#BCAAA4', '#A1887F'
];

const getAllAppleEmojis = ():string[] => {
  if (!emojiData || emojiData.length === 0) {
    console.error("Не удалось загрузить данные эмодзи.");
    return [];
  }
  const emojiArray = emojiData.map(emoji => {
    const unifiedCode = emoji.unified.split('-')
      .map(code => parseInt(code, 16))
      .map(code => String.fromCodePoint(code))
      .join('');
      
    return unifiedCode;
  });

  return emojiArray;
};

const emojis = getAllAppleEmojis().splice(312, getAllAppleEmojis().length);

export default function ModalCreateEventScreen() {
  const colorScheme = useColorScheme();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(emojis[0]);

  const eventsData = useEventsDataStore(state => state.eventsData);
  const setEventsData = useEventsDataStore(state => state.setEventsData);

  const ActiveSelectContainer = ({ children }: { children?: ReactNode }) => (
    <View
      style={{
        borderWidth: 3,
        borderColor: primaryColor,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999,
      }}
    >
      {children}
    </View>
  );

  const createEvent = () => {
    if(name !== ''){
      const newEventsData = [...eventsData];
      newEventsData.push({
        id:Math.random().toString(36).substring(2, 2 + 20),
        name:name,
        color:selectedColor,
        icon:selectedEmoji,
        comment:'',
        favorite:false,
        data:[],
      });
      setEventsData(newEventsData);
      router.back();
    }
    else{
      alert('Please enter a name for the event.');
    }
  }

  return (
    <Container>
      <SmoothKeyboardScrollView>
        <ScrollView contentContainerStyle={{paddingBottom:100}} showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle" style={{ marginTop: Spacing.xl }}>
            Name
          </ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Event name"
            autoFocus={true}
            style={{
              marginTop: Spacing.sm,
              height: 48,
              borderRadius: Radius.xl,
              paddingHorizontal: Spacing.md,
              backgroundColor: colorScheme === 'dark' ? secondaryColorDark : secondaryColorLight,
              fontWeight: '500',
              fontSize: 16,
              color: colorScheme === 'dark' ? 'white' : 'black',
            }}
            placeholderTextColor="#9AA0A6"
          />

          <ThemedText type="subtitle" style={{ marginVertical: Spacing.md }}>
            Color
          </ThemedText>

          <HorizontalGridScroll
            data={COLORS}
            numRows={2}
            renderItem={({ item }) => (
              <>
                {
                  COLORS.indexOf(item) === COLORS.indexOf(selectedColor) ? 
                    <ActiveSelectContainer>
                      <View style={[{width:40, height:40, backgroundColor:item, borderRadius:Radius.full}]}></View>
                    </ActiveSelectContainer>
                  :
                    <TouchableOpacity onPress={()=>{setSelectedColor(item)}} style={[{width:55, height:55, backgroundColor:item, borderRadius:Radius.full}]}></TouchableOpacity>
                }
              </>
            )}
          />

          <ThemedText type="subtitle" style={{ marginVertical: Spacing.md }}>
            Icon
          </ThemedText>

          <HorizontalGridScroll
            data={emojis}
            numRows={3}
            renderItem={({ item }) => (
              <>
                {
                  emojis.indexOf(item) === emojis.indexOf(selectedEmoji) ? 
                    <ActiveSelectContainer>
                      <View style={{width:40, height:40, justifyContent:'center', alignItems:'center', backgroundColor:colorScheme === 'dark' ? secondaryColorDark:secondaryColorLight, borderRadius:Radius.full}}>
                        <Text style={{ fontSize: 28, color:colorScheme === 'dark' ? 'white' : 'black' }}>{item}</Text>
                      </View>
                    </ActiveSelectContainer>
                  :
                    <TouchableOpacity onPress={()=>{setSelectedEmoji(item)}} style={{width:55, height:55, justifyContent:'center', alignItems:'center', backgroundColor:colorScheme === 'dark' ? secondaryColorDark:secondaryColorLight, borderRadius:Radius.full}}>
                      <Text style={{ fontSize: 28, color:colorScheme === 'dark' ? 'white' : 'black' }}>{item}</Text>
                    </TouchableOpacity>
                }
              </>
              
            )}
          />
          <View style={{marginTop:Spacing.xxxl}}></View>
          <Button title="Create" onPress={()=>{createEvent()}} />
        </ScrollView>
      </SmoothKeyboardScrollView>
    </Container>
  );
}



