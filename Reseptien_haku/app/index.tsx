import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Image,
} from "react-native";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function App() {
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${keyword}`
      );
      setData(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={(item) => setKeyword(item)}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading ? (
        <Text>Loading..</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.idMeal.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.strMeal}</Text>
              <Image style={styles.image} source={{ uri: item.strMealThumb }} />
            </View>
          )}
          ListEmptyComponent={<Text>No results found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "30%",
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  input: {
    width: "60%",
    height: 40,
    borderWidth: 1,
  },
});
