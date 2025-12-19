import React from 'react';
import { FlatList, View, StyleProp, ViewStyle, ListRenderItemInfo } from 'react-native';

interface HorizontalGridScrollProps<T> {
  data: T[];
  renderItem: (info: { item: T; index: number }) => React.ReactNode;
  numRows?: number;
  gap?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyExtractor?: (item: T, index: number) => string;
}

// This component uses FlatList for virtualization, which significantly 
// improves performance when handling large datasets compared to ScrollView.
export default function OptimizedHorizontalGridScroll<T>({
  data,
  renderItem,
  numRows = 2,
  gap = 12,
  contentContainerStyle,
  keyExtractor,
}: HorizontalGridScrollProps<T>) {
  // -----------------------------------------------------------
  // 1. Data Structure Transformation:
  // We restructure the array to group elements into COLUMNS instead of rows.
  // FlatList will scroll horizontally through these columns.
  //
  // Original data: [E1, E2, E3, E4, E5, E6]
  // numRows = 2
  //
  // Transformed data (for FlatList):
  // Col 1: [E1, E2]
  // Col 2: [E3, E4]
  // Col 3: [E5, E6]
  // -----------------------------------------------------------

  const numColumns = Math.ceil(data.length / numRows);
  const columnsData: (T | null)[][] = Array.from({ length: numColumns }, () => []);

  for (let colIndex = 0; colIndex < numColumns; colIndex++) {
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const originalIndex = colIndex * numRows + rowIndex;
      // Populate the column. Use null if data runs out (for non-full last column).
      columnsData[colIndex][rowIndex] = data[originalIndex] || null;
    }
  }

  // 2. Rendering a single column (The Item for the FlatList)
  const renderColumnItem = ({ item: column, index: colIndex }: ListRenderItemInfo<(T | null)[]>) => {
    // 'column' is an array containing up to 'numRows' elements.
    return (
      // Wrapper for the column (vertical placement of items)
      <View
        style={{
          // Horizontal margin between columns (the horizontal gap)
          marginRight: gap,
          // Vertical gap between items within the column
          gap: gap, 
          // Must specify flexDirection: 'column' as FlatList items are often row-based by default.
          flexDirection: 'column', 
        }}
      >
        {column.map((item, rowIndex) => {
          if (!item) return null; // Skip null placeholders

          const originalIndex = colIndex * numRows + rowIndex;
          const key = keyExtractor ? keyExtractor(item, originalIndex) : String(originalIndex);

          return (
            <View key={key}>
              {renderItem({ item, index: originalIndex })}
            </View>
          );
        })}
      </View>
    );
  };
  
  // 3. FlatList for Horizontal Virtualization
  return (
    <FlatList
      data={columnsData}
      renderItem={renderColumnItem}
      keyExtractor={(_, index) => `col-${index}`}
      horizontal // Enable horizontal scrolling
      showsHorizontalScrollIndicator={false}
      
      // We often need to adjust contentContainerStyle to manage the starting/ending gap.
      contentContainerStyle={[
        // Adding a small padding on all sides to avoid clipping or for aesthetic spacing.
        { paddingVertical: gap / 2, paddingHorizontal: -gap }, 
        contentContainerStyle,
      ]}

      // Performance Optimization Props:
      initialNumToRender={5} // Number of columns to render initially
      maxToRenderPerBatch={5} // Maximum number of items to render per batch 
      windowSize={10}         // Determines the number of items rendered off-screen (for smoother scrolling)
    />
  );
}