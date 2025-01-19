import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./StackNavigator";
import { FlatList, Text, View } from "react-native";

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, "History">;

export default function HistoryScreen({ route }: HistoryScreenProps) {
  const { historyData } = route.params || { historyData: [] };
  return (
    <View>
      <FlatList
        data={historyData}
        renderItem={({ item }: { item: string }) => <Text>{item}</Text>}
        ListHeaderComponent={<Text>History</Text>}
      />
    </View>
  );
}
