import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../utils/firebase.config";

interface User {
  uid: string;
  name: string;
  email: string;
  profile: string; // Assuming profile is a URL string
}

interface CommunicationsProps {
  openChat: (uid: string) => void;
}

const Communications: React.FC<CommunicationsProps> = ({ openChat }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [myProfile, setMyProfile] = useState<User | null>(null);
  const currentUser = auth.currentUser;

  // Fetch all users excluding the current user
  const fetchUsers = async (search: string = "") => {
    try {
      const usersRef = collection(db, "users");
      const q = search
        ? query(
            usersRef,
            where("name", ">=", search),
            where("name", "<=", search + "\uf8ff")
          )
        : query(usersRef);
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.uid !== currentUser?.uid); // Exclude current user
      setUsers(fetchedUsers as User[]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchUsers(text);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => openChat(item.uid)}
    >
      <Image source={{ uri: item.profile }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSkeletonItem = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonText} />
        <View style={styles.skeletonTextShort} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <FlatList
        data={loading ? Array(5).fill({}) : users}
        renderItem={loading ? renderSkeletonItem : renderUserItem}
        keyExtractor={(item, index) =>
          loading ? index.toString() : item.uid
        }
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Users"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  myProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10, // Space below the profile
  },
  myProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  myProfileInfo: {
    flex: 1,
  },
  myProfileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  myProfileEmail: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginRight: 15,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    width: "80%",
    height: 20,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
  },
  skeletonTextShort: {
    width: "60%",
    height: 20,
    backgroundColor: "#e0e0e0",
  },
});

export default Communications;
