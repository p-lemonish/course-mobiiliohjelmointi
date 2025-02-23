import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import axios from "axios";

export default function App() {
  const geocode_api_key = process.env.EXPO_PUBLIC_GEOCODE_API_KEY;
  const google_maps_api_key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [region, setRegion] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([{}]);
  const [markers, setMarkers] = useState([]);

  const searchNearby = async (latitude: number, longitude: number) => {
    const data = {
      includedTypes: ["restaurant"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          radius: 500.0,
        },
      },
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": google_maps_api_key,
        "X-Goog-FieldMask": "places.displayName,places.location",
      },
    };

    try {
      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchNearby",
        data,
        config
      );
      const places = response.data.places;
      const result = places.map((place: any) => ({
        name: place.displayName.text,
        lat: parseFloat(place.location.latitude),
        lon: parseFloat(place.location.longitude),
      }));
      setMarkers(result);
    } catch (error) {
      console.error(error);
    }
  };

  const onButtonPress = async () => {
    const stringBuild = address.replace(/ /g, "+");
    const geocodeUri = `https://geocode.maps.co/search?q=${stringBuild}&api_key=${geocode_api_key}`;
    setLoading(true);
    try {
      const response = await axios.get(geocodeUri);
      const latitude = response.data[0].lat;
      const longitude = response.data[0].lon;
      setRegion({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      searchNearby(latitude, longitude);
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
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: marker.lat, longitude: marker.lon }}
              />
            ))}
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
