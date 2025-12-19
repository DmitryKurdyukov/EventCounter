import { EventType } from '@/interfaces/interfaces';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EventsState {
  eventsData: EventType[];
  setEventsData: (data: EventType[]) => void;
}

export const useEventsDataStore = create<EventsState>((set) => ({
  eventsData: [],
  setEventsData: (data) => {
    set({ eventsData: data })
    AsyncStorage.setItem('eventsData', JSON.stringify(data));
  },
}));
