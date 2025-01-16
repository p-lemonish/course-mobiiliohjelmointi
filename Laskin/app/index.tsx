import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";
export default function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleSum = () => {
    setResult(parseFloat(num1) + parseFloat(num2));
  };

  const handleDiff = () => {
    setResult(parseFloat(num1) - parseFloat(num2));
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "30%",
    paddingTop: 10,
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
