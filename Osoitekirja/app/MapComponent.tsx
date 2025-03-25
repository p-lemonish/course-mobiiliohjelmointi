import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PaperProvider, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

const geocode_api_key = process.env.EXPO_PUBLIC_GEOCODE_API_KEY;

type KarttaParamList = {
    Kartta: { address: string; };
};

export default function MapComponent() {
    const route = useRoute<RouteProp<KarttaParamList, "Kartta">>();
    const navigation = useNavigation();
    const { address } = route.params;
    const [region, setRegion] = useState({
        latitude: 60.1699,
        longitude: 24.9384,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [marker, setMarker] = useState<{ lat: number; lon: number; } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const geocodeAddress = async () => {
            if (!address.trim()) return;
            setLoading(true);
            const queryAddress = address.replace(/ /g, '+');
            const geocodeUrl = `https://geocode.maps.co/search?q=${queryAddress}&api_key=${geocode_api_key}`;
            try {
                const response = await axios.get(geocodeUrl);
                const data = response.data[0];
                const lat = parseFloat(data.lat);
                const lon = parseFloat(data.lon);
                setRegion({
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                setMarker({ lat, lon });
            } catch (error) {
                console.error("Geocoding error:", error);
            } finally {
                setLoading(false);
            }
        };
        geocodeAddress();
    }, [address]);


    return (
        <PaperProvider>
            <View style={styles.container}>
                <MapView style={styles.map} region={region}>
                    {marker && (
                        <Marker coordinate={{ latitude: marker.lat, longitude: marker.lon }} />
                    )}
                </MapView>
                <View style={styles.infoContainer}>
                    <Text variant="titleLarge">{address}</Text>
                    <Button mode="contained" onPress={() => navigation.goBack()}>
                        Back to List
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        padding: 16,
        backgroundColor: "#fff",
    },
});
