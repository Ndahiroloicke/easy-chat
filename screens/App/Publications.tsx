import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
} from "react-native";
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
  profilePicture: string; // Add profileImage to represent the user's profile picture
}

interface PublicationsProps {
  openAdvertisement: (id: string) => void;
}

const Publications: React.FC<PublicationsProps> = ({ openAdvertisement }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        console.log(fetchPublications)
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

  const renderPublicationItem = ({ item }: { item: Publication }) => (
    <View style={styles.publicationContainer}>
      {/* Profile Image */}
      <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
      {/* Right Content */}
      <View style={styles.textContainer}>
        <Text style={styles.typeText}>{item.type}</Text>
        <Text numberOfLines={2} style={styles.descriptionText}>
          {item.description}
        </Text>
      </View>
  
      {/* Icon Button */}
      <TouchableOpacity style={styles.iconButton} onPress={() => openAdvertisement(item.id)}>
        <Text style={styles.iconText}>🔍</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading publications...</Text>
      ) : (
        <>
          <FlatList
            data={filteredPublications}
            renderItem={renderPublicationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 3,
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
});

export default Publications;
