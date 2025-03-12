import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import * as Speech from "expo-speech";

const App = () => {
  const [text, setText] = useState("");

  const speak = () => {
    if (text.trim() !== "") {
      Speech.speak(text, {
        language: "fi-FI",
        pitch: 1.0,
        rate: 1.0,
      });
    } else {
      alert("Syötä teksti ensin");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Kirjoita teksti..."
        onChangeText={setText}
        value={text}
      />
      <Button title="Puhu" onPress={speak} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default App;
