import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalculatorScreen from "./CalculatorScreen";
import HistoryScreen from "./HistoryScreen";

export type RootStackParamList = {
  Calculator: undefined;
  History: { historyData: string[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Calculator">
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
