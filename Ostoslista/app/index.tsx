import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from "react-native";
export default function App() {
  const [item, setItem] = useState("");
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  const handleAdd = () => {
    setShoppingList((prevShoppingList) => [...prevShoppingList, item]);
    setItem("");
  };

  const handleClear = () => {
    setShoppingList([]);
  };

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={item}
        onChangeText={(text) => setItem(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={handleAdd} />
        <Button title="Clear" onPress={handleClear} />
      </View>
      <FlatList
        data={shoppingList}
        renderItem={renderItem}
        ListHeaderComponent={<Text>Shopping List</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "30%",
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
