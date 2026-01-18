import { EventType } from '@/interfaces/interfaces';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * State interface for the events data store.
 * 
 * Manages the global state of all events and provides methods to update them.
 * Changes are automatically persisted to AsyncStorage.
 */
interface EventsState {
  /** Array of all tracked events */
  eventsData: EventType[];
  /**
   * Updates the events data and persists it to AsyncStorage.
   * 
   * @param data - New array of events to replace the current state
   */
  setEventsData: (data: EventType[]) => void;
}

/**
 * Zustand store for managing events data.
 * 
 * Provides global state management for events with automatic persistence
 * to AsyncStorage. Use this store to access and update events throughout
 * the application.
 * 
 * @example
 * const eventsData = useEventsDataStore(state => state.eventsData);
 * const setEventsData = useEventsDataStore(state => state.setEventsData);
 */
export const useEventsDataStore = create<EventsState>((set) => ({
  eventsData: [],
  setEventsData: (data) => {
    set({ eventsData: data })
    AsyncStorage.setItem('eventsData', JSON.stringify(data));
  },
}));
