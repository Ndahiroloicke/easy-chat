import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase.config";
import { COLORS } from "../../constants";

interface Publication {
  id: string;
  type: string;
  category: string;
  subcategory: string;
  city: string;
  province: string;
  distance: string;
  description: string;
  createdAt: number;
  profilePicture: string;
}

interface PublicationsProps {
  openAdvertisement: (id: string) => void;
}

const Publications: React.FC<PublicationsProps> = ({ openAdvertisement }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<
    Publication[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [modalvisible, setmodelvisible] = useState<boolean>(true);

  // Filter state variables
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [province, setProvince] = useState("");
  const [distance, setDistance] = useState("");

  useEffect(() => {
    const fetchPublications = async () => {
      const publicationsRef = collection(db, "advertisements");
      const q = query(publicationsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPublications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Publication[];
        setPublications(fetchedPublications);
        setFilteredPublications(fetchedPublications);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPublications();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredPublications(publications);
      return;
    }

    const filtered = publications.filter((publication) =>
      publication.type.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPublications(filtered);
  };

  const applyFilters = () => {
    const filtered = publications.filter((publication) => {
      return (
        (publication.type.toLowerCase().match(type.toLowerCase())) &&
        (publication.category.toLowerCase().match(category.toLowerCase())) &&
        (publication.subcategory.toLowerCase().match(subcategory.toLowerCase())) &&
        (publication.city.toLowerCase().match(city.toLowerCase())) &&
        (publication.province.toLowerCase().match(province.toLowerCase())) &&
        (publication.distance.toLowerCase().match(distance.toLowerCase())) 


        // (!type || publication.type === type) &&
        // (!category || publication.category === category) &&
        // (!subcategory || publication.subcategory === subcategory) &&
        // (!city || publication.city === city) &&
        // (!province || publication.province === province) &&
        // (!distance || publication.distance === distance)
      );
    });

    setFilteredPublications(filtered);
    setShowFilters(false); // Hide the filter form after applying filters
  };

  const clearFilters = () => {
    setCategory("");
    setSubcategory("");
    setCity("");
    setType("");
    setProvince("");
    setDistance("");
    setFilteredPublications(publications);// Reset to all publications
};

  const renderPublicationItem = ({ item }: { item: Publication }) => (
    <View style={styles.publicationContainer}>
      {/* Profile Image */}
      <Image
        source={{ uri: item.profilePicture }}
        style={styles.profileImage}
      />
      {/* Right Content */}
      <View style={styles.textContainer}>
        <Text numberOfLines={4} style={styles.descriptionText}>
          {item.description}
        </Text>
      </View>

      {/* Icon Button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => openAdvertisement(item.id)}
      >
        <Text style={styles.iconText}>➡️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading publications...</Text>
      ) : (
        <>
          {/* Filter Button */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setmodelvisible(true);
              setShowFilters(!showFilters);
            }}
          >
            <Text style={styles.filterButtonText}>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Text>
          </TouchableOpacity>

          {/* Collapsible Filter Form */}
          {showFilters && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalvisible}
              onRequestClose={() => setmodelvisible(false)}
            >
              <View style={styles.filterContainer}>
                <Picker
                  selectedValue={type}
                  onValueChange={(value) => setType(value)}
                  style={[styles.picker, styles.halfPicker]}
                >
                  <Picker.Item label="Select Type" value="" />
                  <Picker.Item label="Offer" value="offer" />
                  <Picker.Item label="Demand" value="demand" />
                  {/* Add more categories as needed */}
                </Picker>

                <Picker
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value)}
                  style={[styles.picker, styles.halfPicker]}
                >
                  <Picker.Item label="Select Category" value="" />
                  <Picker.Item label="Category 1" value="Category1" />
                  <Picker.Item label="Category 2" value="Category2" />
                  {/* Add more subcategories as needed */}
                </Picker>
                <Picker
                  selectedValue={subcategory}
                  onValueChange={(value) => setSubcategory(value)}
                  style={styles.dropdown}
                >
                  <Picker.Item label="Select Subcategory" value="" />
                  <Picker.Item label="Subcategory 1" value="Subcategory1" />
                  <Picker.Item label="Subcategory 2" value="Subcategory2" />
                  {/* Add more subcategories as needed */}
                </Picker>
                <View style={styles.row}>
                <Picker
                  selectedValue={city}
                  onValueChange={(value) => setCity(value)}
                  style={[styles.picker, styles.halfPicker]}
                >
                  <Picker.Item label="Select City" value="" />
                  <Picker.Item label="City 1" value="City1" />
                  <Picker.Item label="City 2" value="City2" />
                  {/* Add more subcategories as needed */}
                </Picker>
                <Picker
                  selectedValue={province}
                  onValueChange={(value) => setProvince(value)}
                  style={[styles.picker, styles.halfPicker]}
                >
                  <Picker.Item label="Select Province" value="" />
                  <Picker.Item label="Province 1" value="Province1" />
                  <Picker.Item label="Province 2" value="Province2" />
                  {/* Add more subcategories as needed */}
                </Picker>
                </View>
                <Picker
                  selectedValue={distance}
                  onValueChange={(value) => setDistance(value)}
                  style={styles.dropdown}
                >
                  <Picker.Item label="Select Distance (km)" value="" />
                  <Picker.Item label="0-5 km" value="5" />
                  <Picker.Item label="6-10 km" value="10" />
                  <Picker.Item label="11-20 km" value="20" />
                  <Picker.Item label="21-50 km" value="50" />
                  <Picker.Item label="50+ km" value="50+" />
                  {/* Add more subcategories as needed */}
                </Picker>

                {/* Apply Filter Button */}
                <View style={styles.row}>
                <TouchableOpacity
                  style={styles.halfButton}
                  onPress={clearFilters}
                >
                  <Text style={styles.searchButtonText}>Clear filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.halfButton}
                  onPress={() => {
                    setmodelvisible(false);
                    setShowFilters(false);
                  }}
                >
                  <Text style={styles.searchButtonText}>Close</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.searchButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}

          {/* Publications List or No Results Message */}
          {filteredPublications.length === 0 ? (
            <Text style={{ paddingLeft: "auto" }}>No publications found.</Text>
          ) : (
            <FlatList
              data={filteredPublications}
              renderItem={renderPublicationItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}

          <TextInput
            style={styles.searchInput}
            placeholder="Search by type (e.g., offer, demand)"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  filterButton: {
    backgroundColor: "#58A9FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent:"space-between"
  },
  filterContainer: {
    backgroundColor: "#EBF1FD",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop:319,
    marginHorizontal:10
  },
  picker: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  halfPicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginTop: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  listContent: {
    paddingBottom: 10,
  },
  publicationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0f0ff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  iconText: {
    fontSize: 16,
    color: "#007aff",
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
  searchButton: {
    backgroundColor: "#58A9FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  halfButton: {
    width:"49%",
    alignItems:"center",
    padding: 10,
    backgroundColor:"#58A9FF",
    borderRadius: 8,
    marginBottom: 10,
  }
  ,
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Publications;
