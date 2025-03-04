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
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type ShoppingItem = {
  id: string;
  product: string;
  amount: string;
};

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    const shoppingColRef = collection(db, "shopping");
    const unsubscribe = onSnapshot(shoppingColRef, (snapshot) => {
      const items: ShoppingItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        product: doc.data().product,
        amount: doc.data().amount,
      }));
      setShoppingList(items);
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (product.trim() === "" || amount.trim() === "") return;
    try {
      await addDoc(collection(db, "shopping"), { product, amount });
      setProduct("");
      setAmount("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteDoc(doc(db, "shopping", id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.product} ({item.amount})
      </Text>
      <TouchableOpacity onPress={() => handleRemove(item.id)}>
        <Text style={styles.removeText}>Remove</Text>
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
      <Button title="Add" onPress={handleAdd} />
      <FlatList
        data={shoppingList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
  removeText: {
    color: "red",
    fontSize: 16,
  },
});
