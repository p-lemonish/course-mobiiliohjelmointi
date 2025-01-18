import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";

const randVal = Math.floor(Math.random() * 100) + 1;

export default function App() {
  const [guess, setGuess] = useState<number | null>(null);
  const [num1, setNum1] = useState<string>("");
  const [amountOfGuesses, setAmountOfGuesses] = useState<number>(1);

  const handleGuess = () => {
    const parsedNumber = parseInt(num1, 10);
    setGuess(parsedNumber);
    if (parsedNumber === randVal) {
      Alert.alert(`You guessed the number in ${amountOfGuesses} guesses`);
    } else {
      setAmountOfGuesses((prev) => prev + 1);
    }
  };
  return (
    <View style={styles.container}>
      {guess !== null && (
        <Text>
          Your guess {guess} is {guess < randVal && <Text>too low</Text>}
          {guess > randVal && <Text>too high</Text>}
          {guess === randVal && <Text>correct!</Text>}
        </Text>
      )}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={num1}
        onChangeText={(val) => setNum1(val)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Make guess" onPress={handleGuess} />
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
