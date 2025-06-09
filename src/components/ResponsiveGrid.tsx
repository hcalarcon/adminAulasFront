import { FlatList, View, useWindowDimensions } from "react-native";
import React from "react";

interface ResponsiveGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactElement | null;
  numColumns?: number;
  getKey: (item: T) => string | number;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListEmptyComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  alumno?: boolean;
}

export default function ResponsiveGrid<T>({
  items,
  renderItem,
  getKey,
  numColumns,
  refreshing,
  onRefresh,
  ListEmptyComponent,
  ListFooterComponent,
  alumno,
}: ResponsiveGridProps<T>) {
  const { width } = useWindowDimensions();

  const computedColumns =
    alumno === true ? 1 : numColumns ? numColumns : width >= 900 ? 2 : 1;

  return (
    <FlatList
      data={items}
      key={computedColumns} // para forzar re-render al cambiar columnas
      keyExtractor={(item) => getKey(item).toString()}
      numColumns={computedColumns}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{
        padding: 12,
        gap: 12,
        paddingBottom: 32,
      }}
      columnWrapperStyle={
        computedColumns > 1
          ? {
              gap: 12,
              justifyContent: "space-between",
              marginBottom: 12,
            }
          : undefined
      }
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginBottom: 12 }}>{renderItem(item)}</View>
      )}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
}
