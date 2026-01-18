import React from 'react';
import { View, useColorScheme } from 'react-native';
import { WeeklyHeatMap } from '@symbiot.dev/react-native-heatmap';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { primaryColor, secondaryColorDark, secondaryColorLight } from '@/constants/theme';
import { EventDataItemType } from '@/interfaces/interfaces';
import { toYYYYMMDD } from '@/utils/utils';

interface HeatmapProps {
  /** Array of event data items to visualize in the heatmap */
  data: EventDataItemType[];
}

/**
 * Displays a weekly heatmap visualization of event occurrences.
 * 
 * The component processes event data to create a calendar-style heatmap
 * showing event frequency by date. Only months with events are displayed,
 * and cells are color-coded based on event count.
 * 
 * @param props - Component props
 * @param props.data - Array of event occurrences to visualize
 * @returns A scrollable weekly heatmap component
 */
export default function Heatmap({ data }: HeatmapProps) {
  const colorScheme = useColorScheme();

  /**
   * Extracts unique months (YYYY-MM format) from event data.
   * 
   * @param events - Array of event data items
   * @returns Sorted array of month keys in YYYY-MM format
   */
  const getMonthsWithData = (events: EventDataItemType[]) => {
    const months = new Set<string>();
    events.forEach((event) => {
      const date = parseISO(event.dateTime);
      const monthKey = format(date, 'yyyy-MM');
      months.add(monthKey);
    });
    return Array.from(months).sort();
  };

  const monthsWithData = getMonthsWithData(data);

  // Create data only for months that have events
  const formatData: Record<string, number> = {};

  monthsWithData.forEach((monthKey) => {
    const [year, month] = monthKey.split('-');
    const monthStart = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const monthEnd = endOfMonth(new Date(parseInt(year), parseInt(month) - 1));

    const daysInMonth = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    });

    daysInMonth.forEach((date) => {
      formatData[format(date, 'yyyy-MM-dd')] = 0;
    });
  });

  /**
   * Converts event data to heatmap format.
   * 
   * Groups events by date and counts occurrences per day.
   * 
   * @param events - Array of event data items
   * @returns Record mapping date strings (YYYY-MM-DD) to event counts
   */
  const eventsToHeatmapData = (
    events: EventDataItemType[]
  ): Record<string, number> => {
    const result: Record<string, number> = {};

    events.forEach((event) => {
      const dateKey = event.dateTime.split('T')[0];
      result[dateKey] = (result[dateKey] || 0) + 1;
    });

    return result;
  };

  const activityDays = eventsToHeatmapData(data);

  Object.entries(activityDays).forEach(([date, value]) => {
    formatData[date] = value;
  });

  const cellColor: Record<number, string> = {
    0: colorScheme === 'dark' ? secondaryColorDark : secondaryColorLight,
    1: primaryColor,
  };

  // Determine the start date (first day of the first month with data)
  const startDate = monthsWithData.length > 0
    ? startOfMonth(parseISO(monthsWithData[0] + '-01'))
    : new Date();

  return (
    <View style={{ width: '100%' }}>
      <WeeklyHeatMap
        data={formatData}
        startDate={startDate}
        weekStartsOn={1}
        cellText="count"
        cellSize={26}
        cellRadius={4}
        cellGap={4}
        pressable={true}
        scrollable={true}
        isHeaderVisible={true}
        isCellTextVisible={true}
        isSidebarVisible={true}
        onCellPress={({ date, count }) => {
          alert(`Date: ${toYYYYMMDD(date)}\nEvents: ${count}`);
        }}
        theme={{ cellColor: cellColor, cellTextColor: 'white' }}
        cellTextFontSize={12}
      />
    </View>
  );
}