import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

const SearchForm = () => {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [location, setLocation] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [userType, setUserType] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleSearch = () => {
    // Handle search logic here
    console.log("Search initiated with selected filters");
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <TouchableOpacity style={styles.header}>
        <Text style={styles.headerText}>Búsqueda Según Categoría</Text>
      </TouchableOpacity>

      {/* Dropdown Fields */}
      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
        style={styles.dropdown}
      >
        <Picker.Item label="Inmobiliaria" value="inmobiliaria" />
        {/* Other categories can be added here */}
      </Picker>

      <View style={styles.row}>
        <Picker
          selectedValue={subcategory}
          onValueChange={(value) => setSubcategory(value)}
          style={styles.dropdownHalf}
        >
          <Picker.Item label="Subcategoría" value="subcategory" />
          {/* Add subcategories here */}
        </Picker>

        <TextInput
          style={styles.dropdownHalf}
          placeholder="Toda España"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.row}>
        <Picker
          selectedValue={priceFrom}
          onValueChange={(value) => setPriceFrom(value)}
          style={styles.dropdownHalf}
        >
          <Picker.Item label="Desde €" value="price_from" />
          {/* Add price options here */}
        </Picker>

        <Picker
          selectedValue={priceTo}
          onValueChange={(value) => setPriceTo(value)}
          style={styles.dropdownHalf}
        >
          <Picker.Item label="Hasta €" value="price_to" />
          {/* Add price options here */}
        </Picker>
      </View>

      <Picker
        selectedValue={userType}
        onValueChange={(value) => setUserType(value)}
        style={styles.dropdown}
      >
        <Picker.Item label="Particular-Profesional" value="user_type" />
        {/* Add user types here */}
      </Picker>

      <TextInput
        style={styles.dropdown}
        placeholder="Ordenar por relevancia"
        value={sortOrder}
        onChangeText={setSortOrder}
      />

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Iniciar Búsqueda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0F0FF",
    padding: 16,
    borderRadius: 8,
  },
  header: {
    backgroundColor: "#58A9FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    marginVertical: 6,
    paddingHorizontal: 10,
  },
  dropdownHalf: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    width: "48%",
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchButton: {
    backgroundColor: "#58A9FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SearchForm;
