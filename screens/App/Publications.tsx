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
import { Ionicons } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/FontAwesome';

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
  uploaderImage: string;
  creator: string;
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
  const [selectedType, setSelectedType] = useState<string>("");
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);
  const [showSubcategoryOptions, setShowSubcategoryOptions] = useState<boolean>(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");

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
      const typeCheck = publication.type ? publication.type.toLowerCase().includes(type.toLowerCase()) : false;
      const categoryCheck = publication.category ? publication.category.toLowerCase().includes(category.toLowerCase()) : false;
      const subcategoryCheck = publication.subcategory ? publication.subcategory.toLowerCase().includes(subcategory.toLowerCase()) : false;
      const cityCheck = publication.city ? publication.city.toLowerCase().includes(city.toLowerCase()) : false;
      const provinceCheck = publication.province ? publication.province.toLowerCase().includes(province.toLowerCase()) : false;
      const distanceCheck = publication.distance ? publication.distance.toLowerCase().includes(distance.toLowerCase()) : false;

      // Log the checks for debugging
      console.log({
        typeCheck,
        categoryCheck,
        subcategoryCheck,
        cityCheck,
        provinceCheck,
        distanceCheck,
      });

      return typeCheck && categoryCheck && subcategoryCheck && cityCheck && provinceCheck && distanceCheck;
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
    setShowSubcategoryOptions(false); // Collapse the dropdown
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setShowSubcategoryOptions(false); // Hide options after selection

    // Filter publications based on selected subcategory
    const filtered = publications.filter((publication) =>
      publication.subcategory.toLowerCase() === subcategory.toLowerCase()
    );
    setFilteredPublications(filtered);
  };

  const clearFilter = () => {
    setSelectedSubcategory(""); // Reset selected subcategory
    setFilteredPublications(publications); // Show all publications
    setShowSubcategoryOptions(false); // Collapse the dropdown
  };

  const renderPublicationItem = ({ item }: { item: Publication }) => (
    <View style={styles.publicationContainer}>
      {item.uploaderImage && (
        <Image
          source={{ uri: item.uploaderImage }}
          style={styles.profileImage}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.creatorText}>{item.creator}</Text>
        <Text numberOfLines={4} style={styles.descriptionText}>
          {item.description}
        </Text>
      </View>
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
          {/* Filter Button for Subcategory */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowSubcategoryOptions(!showSubcategoryOptions)} // Toggle options
          >
            <View style={styles.filterButtonContent}>
              <Text style={styles.filterButtonText}>
                {selectedSubcategory || "Búsqueda Según Categoría"}
              </Text>
              <Ionicons name={showSubcategoryOptions ? "chevron-up" : "chevron-down"} size={20} color="#fff" style={styles.icon} />
            </View>
          </TouchableOpacity>

          {/* Subcategory Options */}
          {showSubcategoryOptions && (
            <View style={styles.subcategoryOptions}>
              <TouchableOpacity onPress={() => handleSubcategorySelect("subcategory1")}>
                <Text style={styles.subcategoryText}>Subcategory 1</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSubcategorySelect("subcategory2")}>
                <Text style={styles.subcategoryText}>Subcategory 2</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setSelectedSubcategory(""); // Clear selection
                setFilteredPublications(publications); // Show all publications
                setShowSubcategoryOptions(false); // Collapse the dropdown
              }}>
                <Text style={styles.subcategoryText}>Clear Filter</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 10,
    marginTop:-12,
  },
  filterButton: {
    backgroundColor: "#58A9FF",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 10,
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
    fontSize: 14,
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
    fontSize: 12,
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
  creatorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  typeSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeBox: {
    // flex: 1,
    width:'46%',
    backgroundColor: "#58A9FF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  selectedTypeBox: {
    backgroundColor: "#800080",
  },
  typeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    marginLeft: 8,
  },
  subcategoryOptions: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  subcategoryText: {
    fontSize: 16,
    color: "#333",
    padding: 5,
  },
});

export default Publications;

// This is the end of development