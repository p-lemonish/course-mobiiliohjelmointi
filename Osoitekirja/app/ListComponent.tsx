import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { MD3LightTheme as DefaultTheme, PaperProvider, TextInput, Text, Button, Surface } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

type RootStackParamList = {
    Lista: undefined;
    Kartta: { address: string; };
};

type AddressItem = {
    id: number;
    address: string;
};

export default function ListComponent() {
    const [db, setDb] = useState<any>(null);
    const [address, setAddress] = useState<string>('');
    const [addressList, setAddressList] = useState<AddressItem[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        async function initDb() {
            const database = await SQLite.openDatabaseAsync("addressList.db");
            setDb(database);
            await database.execAsync(`
        CREATE TABLE IF NOT EXISTS addresses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          address TEXT,
          location TEXT
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
            const items = await dbInstance.getAllAsync("SELECT * FROM addresses");
            setAddressList(items);
        } catch (error) {
            console.error("Error loading items:", error);
        }
    };

    const handleAdd = async () => {
        if (address.trim() === "" || !db) return;
        const location = JSON.stringify({ lat: 60.1699, lon: 24.9384 });
        try {
            await db.runAsync(
                "INSERT INTO addresses (address, location) VALUES (?, ?)",
                address,
                location
            );
            loadItems();
            setAddress("");
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    const handlePress = (item: AddressItem) => {
        navigation.navigate("Kartta", { address: item.address });
    };

    const handleLongPress = async (id: number) => {
        if (!db) return;
        try {
            await db.runAsync("DELETE FROM addresses WHERE id = ?", id);
            loadItems();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const renderItem = ({ item }: { item: AddressItem; }) => (
        <TouchableOpacity
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item.id)}
        >
            <Surface style={styles.itemContainer}>
                <Text>{item.address}</Text>
            </Surface>
        </TouchableOpacity>
    );

    return (
        <PaperProvider theme={DefaultTheme}>
            <Surface style={styles.container}>
                <TextInput
                    label="Add Address"
                    mode="outlined"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleAdd} style={styles.button}>
                    Save
                </Button>
                <FlatList
                    data={addressList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={<Text style={styles.listTitle}>Addresses</Text>}
                />
            </Surface>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginBottom: 20,
    },
    listTitle: {
        fontSize: 20,
        marginVertical: 10,
        textAlign: "center",
    },
    itemContainer: {
        padding: 12,
        marginVertical: 6,
        elevation: 2,
    },
});

