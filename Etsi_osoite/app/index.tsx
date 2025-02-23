import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import axios from "axios";

export default function App() {
  const api_key = process.env.EXPO_PUBLIC_API_KEY;
  const [region, setRegion] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const onButtonPress = async () => {
    const stringBuild = address.replace(/ /g, "+");
    const uri = `https://geocode.maps.co/search?q=${stringBuild}&api_key=${api_key}`;
    setLoading(true);
    try {
      const response = await axios.get(uri);
      setRegion({
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <MapView style={styles.map} region={region}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
        )}
      </>
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={(item) => setAddress(item)}
          placeholder="Insert address"
        />
        <Button onPress={onButtonPress} title="Show" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    padding: 10,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
  },
});
