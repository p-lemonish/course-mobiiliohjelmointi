import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SQLite from "expo-sqlite";

type ShoppingItem = {
  id: number;
  product: string;
  amount: string;
};

export default function App() {
  const [db, setDb] = useState<any>(null);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    async function initDb() {
      const database = await SQLite.openDatabaseAsync("shoppingList.db");
      setDb(database);
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS shopping (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product TEXT,
          amount TEXT
        );
      `);
      loadItems(database);
    }
    initDb();
  }, []);

  const loadItems = async (databaseInstance?: any) => {
    const dbInstance = databaseInstance || db;
    if (!dbInstance) return;
    try {
      const items = await dbInstance.getAllAsync("SELECT * FROM shopping");
      setShoppingList(items);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const handleAdd = async () => {
    if (product.trim() === "" || amount.trim() === "") return;
    if (!db) return;
    try {
      await db.runAsync(
        "INSERT INTO shopping (product, amount) VALUES (?, ?)",
        product,
        amount
      );
      loadItems();
      setProduct("");
      setAmount("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleBought = async (id: number) => {
    if (!db) return;
    try {
      await db.runAsync("DELETE FROM shopping WHERE id = ?", id);
      loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.product} ({item.amount})
      </Text>
      <TouchableOpacity onPress={() => handleBought(item.id)}>
        <Text style={styles.boughtText}>bought</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product"
        value={product}
        onChangeText={setProduct}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleAdd} />
      </View>
      <FlatList
        data={shoppingList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text style={styles.listTitle}>Shopping List</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  boughtText: {
    color: "blue",
    fontSize: 16,
  },
});
