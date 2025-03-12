import React, { useState, useEffect } from "react";
import { View, Button, FlatList, Text, StyleSheet } from "react-native";
import * as Contacts from "expo-contacts";
import { StatusBar } from "expo-status-bar";

const App = () => {
  const [contacts, setContacts] = useState<
    Array<{ id: string; name: string; phone: string }>
  >([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
      }
    })();
  }, []);

  const getContacts = async () => {
    if (permissionGranted) {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const formattedContacts = data.map((contact) => {
        const phone = contact.phoneNumbers?.[0]?.number || "No phone number";
        return {
          id: contact.id,
          name: contact.name || "Unnamed",
          phone,
        };
      });

      setContacts(formattedContacts);
    } else {
      alert("Permission to access contacts is required!");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Get Contacts" onPress={getContacts} />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text>{item.phone}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  contactItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  contactName: {
    fontWeight: "bold",
  },
});

export default App;
