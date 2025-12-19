import React from 'react';
import { View, useColorScheme } from 'react-native';
import { WeeklyHeatMap } from '@symbiot.dev/react-native-heatmap';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';
import { primaryColor, secondaryColorDark, secondaryColorLight } from '@/constants/theme';
import { EventDataItemType } from '@/interfaces/interfaces';
import { toYYYYMMDD } from '@/utils/utils';

interface HeatmapProps {
  data: EventDataItemType[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const colorScheme = useColorScheme();

  // Get unique months from the data
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