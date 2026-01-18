import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEventsDataStore } from '../mainStore';
import { EventType } from '@/interfaces/interfaces';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('useEventsDataStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state before each test
    useEventsDataStore.setState({ eventsData: [] });
  });

  it('should initialize with empty events data', () => {
    const state = useEventsDataStore.getState();
    expect(state.eventsData).toEqual([]);
  });

  it('should set events data and persist to AsyncStorage', () => {
    const mockEvents: EventType[] = [
      {
        id: '1',
        name: 'Test Event',
        color: '#1E3A8A',
        icon: '🌈',
        comment: '',
        favorite: false,
        data: [],
      },
    ];

    const { setEventsData } = useEventsDataStore.getState();
    setEventsData(mockEvents);

    const state = useEventsDataStore.getState();
    expect(state.eventsData).toEqual(mockEvents);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'eventsData',
      JSON.stringify(mockEvents)
    );
  });

  it('should update events data correctly', () => {
    const initialEvents: EventType[] = [
      {
        id: '1',
        name: 'Event 1',
        color: '#1E3A8A',
        icon: '🌈',
        comment: '',
        favorite: false,
        data: [],
      },
    ];

    const updatedEvents: EventType[] = [
      ...initialEvents,
      {
        id: '2',
        name: 'Event 2',
        color: '#0277BD',
        icon: '🚑',
        comment: '',
        favorite: false,
        data: [],
      },
    ];

    const { setEventsData } = useEventsDataStore.getState();
    setEventsData(initialEvents);
    setEventsData(updatedEvents);

    const state = useEventsDataStore.getState();
    expect(state.eventsData).toHaveLength(2);
    expect(state.eventsData).toEqual(updatedEvents);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(2);
  });

  it('should handle empty array correctly', () => {
    const { setEventsData } = useEventsDataStore.getState();
    setEventsData([]);

    const state = useEventsDataStore.getState();
    expect(state.eventsData).toEqual([]);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('eventsData', '[]');
  });

  it('should handle events with data items', () => {
    const eventsWithData: EventType[] = [
      {
        id: '1',
        name: 'Event with data',
        color: '#1E3A8A',
        icon: '🌈',
        comment: '',
        favorite: false,
        data: [
          {
            dateTime: '2024-12-25T14:30:45.123Z',
            comment: 'First occurrence',
          },
          {
            dateTime: '2024-12-26T10:00:00.000Z',
            comment: 'Second occurrence',
          },
        ],
      },
    ];

    const { setEventsData } = useEventsDataStore.getState();
    setEventsData(eventsWithData);

    const state = useEventsDataStore.getState();
    expect(state.eventsData[0].data).toHaveLength(2);
    expect(state.eventsData[0].data[0].comment).toBe('First occurrence');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'eventsData',
      JSON.stringify(eventsWithData)
    );
  });

  it('should overwrite existing data when setEventsData is called', () => {
    const firstEvents: EventType[] = [
      {
        id: '1',
        name: 'First Event',
        color: '#1E3A8A',
        icon: '🌈',
        comment: '',
        favorite: false,
        data: [],
      },
    ];

    const secondEvents: EventType[] = [
      {
        id: '2',
        name: 'Second Event',
        color: '#0277BD',
        icon: '🚑',
        comment: '',
        favorite: false,
        data: [],
      },
    ];

    const { setEventsData } = useEventsDataStore.getState();
    setEventsData(firstEvents);
    setEventsData(secondEvents);

    const state = useEventsDataStore.getState();
    expect(state.eventsData).toHaveLength(1);
    expect(state.eventsData[0].id).toBe('2');
    expect(state.eventsData[0].name).toBe('Second Event');
  });
});
