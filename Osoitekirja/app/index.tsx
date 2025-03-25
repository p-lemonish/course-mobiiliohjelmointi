import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListComponent from "./ListComponent";
import MapComponent from "./MapComponent";

type RootStackParamList = {
    Lista: undefined;
    Kartta: { addressItem: any; };
};

export default function App() {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    return (
        <Stack.Navigator initialRouteName="Lista">
            <Stack.Screen
                name="Lista"
                component={ListComponent}
                options={{ title: "Places" }}
            />
            <Stack.Screen
                name="Kartta"
                component={MapComponent}
                options={{ title: "Map" }}
            />
        </Stack.Navigator>
    );
}

