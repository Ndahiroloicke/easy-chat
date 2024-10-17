import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
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
      <View style={styles.headerContainer}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            {item.city}, {item.province} - {item.distance} km
          </Text>
        </View>
      </View>
      <Text style={styles.categoryText}>
        {item.category} / {item.subcategory}
      </Text>
      <Text numberOfLines={2} style={styles.descriptionText}>
        {item.description}
      </Text>
      <TouchableOpacity
        style={styles.viewMoreButton}
        onPress={() => openAdvertisement(item.id)}
      >
        <Text style={styles.viewMoreText}>View more details</Text>
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeContainer: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  typeText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  locationContainer: {
    justifyContent: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#555",
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  viewMoreButton: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export default Publications;
