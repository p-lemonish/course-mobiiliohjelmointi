import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import euroImage from "../assets/euro.png";

const myHeaders = {
  apikey: "hvedlN9443rTWAoss0xNkKBsxkAFTwab",
};

export default function App() {
  const [from, setFrom] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [symbols, setSymbols] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSymbols = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.apilayer.com/exchangerates_data/symbols`,
          {
            headers: myHeaders,
          }
        );
        setSymbols(response.data.symbols);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSymbols();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${from}&amount=${amount}`,
        {
          headers: myHeaders,
        }
      );
      setConvertedAmount(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/euro.png")} style={styles.image} />
      {convertedAmount !== "" ? (
        <Text style={styles.convertedText}>{convertedAmount} €</Text>
      ) : (
        <Text style={styles.convertedText}></Text>
      )}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={amount}
              placeholder="Enter amount"
              keyboardType="numeric"
              onChangeText={(item) => setAmount(item)}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={from}
                onValueChange={(key) => setFrom(key)}
              >
                {Object.keys(symbols).map((key) => (
                  <Picker.Item key={key} label={key} value={key} />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}
      <Button title="Convert" onPress={handleSearch} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  convertedText: {
    fontSize: 24,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    width: "60%",
  },
  input: {
    flex: 1,
    height: 55,
    borderWidth: 1,
    marginRight: 5,
  },
  pickerContainer: {
    overflow: "hidden",
    height: 55,
    width: 120,
    borderWidth: 1,
  },
});
