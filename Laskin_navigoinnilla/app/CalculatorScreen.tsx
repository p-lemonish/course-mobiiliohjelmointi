import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./StackNavigator";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

type CalculatorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Calculator"
>;

export default function CalculatorScreen({
  navigation,
}: CalculatorScreenProps) {
  const [historyData, setHistoryData] = useState<string[]>([]);
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleSum = () => {
    const sum = parseFloat(num1) + parseFloat(num2);
    setResult(sum);
    const newHistoryDataItem = num1 + " + " + num2 + " = " + sum;
    setHistoryData((prevHistoryData) => [
      ...prevHistoryData,
      newHistoryDataItem,
    ]);
  };

  const handleDiff = () => {
    const diff = parseFloat(num1) - parseFloat(num2);
    setResult(diff);
    const newHistoryDataItem = num1 + " - " + num2 + " = " + diff;
    setHistoryData((prevHistoryData) => [
      ...prevHistoryData,
      newHistoryDataItem,
    ]);
  };

  return (
    <View style={styles.container}>
      {result !== null && <Text>Result: {result}</Text>}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={num1}
        onChangeText={(text) => setNum1(text)}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={num2}
        onChangeText={(text) => setNum2(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={handleSum} />
        <Button title="-" onPress={handleDiff} />
        <Button
          title="History"
          onPress={() => navigation.navigate("History", { historyData })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "50%",
    paddingTop: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "60%",
    height: 40,
    borderWidth: 1,
  },
});
