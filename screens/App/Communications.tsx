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
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../utils/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { Feather } from "@expo/vector-icons";

interface User {
  uid: string;
  name: string;
  email: string;
  profile: string; // Assuming profile is a URL string
}

interface CommunicationsProps {
  openChat: (chatId?: string, userId?: string) => void;
}

const Communications: React.FC<CommunicationsProps> = ({ openChat }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [myProfile, setMyProfile] = useState<User | null>(null);
  const [currentAuthUser, setCurrentAuthUser] = useState(auth.currentUser);

  useEffect(() => {
    // Force a re-check of auth state
    const user = auth.currentUser;
    console.log("Direct auth check:", user?.email);
    
    // If not logged in, you might want to redirect to login
    if (!user) {
      console.log("User not authenticated!");
      // Handle unauthenticated state here
    }
  }, []);

  useEffect(() => {
    console.log("Initial auth state:", auth.currentUser?.uid);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.uid);
      setCurrentAuthUser(user);
    });

    console.log("Is Firebase initialized:", !!auth.app);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("currentAuthUser updated:", currentAuthUser?.uid);
  }, [currentAuthUser]);

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
        .filter((user) => user.uid !== currentAuthUser?.uid); // Exclude current user
      setUsers(fetchedUsers as User[]);
      console.log(fetchedUsers);
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
    if (text.trim()) {
      fetchUsers(text);
    } else {
      fetchUsers();
    }
  };

  const handleChatOpen = async (otherUserId: string) => {
    if (!currentAuthUser) {
      console.log("No current user found - please login first");
      return;
    }

    try {
      const chatId = [currentAuthUser.uid, otherUserId].sort().join('_');
      console.log("Generated chatId:", chatId);

      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        console.log("Creating new chat document");
        await setDoc(chatRef, {
          participants: [currentAuthUser.uid, otherUserId],
          createdAt: serverTimestamp(),
          lastMessage: null,
          lastMessageTime: null
        });
      }

      console.log("Calling openChat with:", chatId, otherUserId);
      openChat(chatId, otherUserId);
    } catch (error) {
      console.error("Error in handleChatOpen:", error);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => {
        console.log("User item pressed:", item.uid);
        handleChatOpen(item.uid);
      }}
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
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
           placeholder="Buscar usuarios..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#666"
          />
        </View>
      </View>
      
      <FlatList
        data={loading ? Array(5).fill({}) : users}
        renderItem={loading ? renderSkeletonItem : renderUserItem}
        keyExtractor={(item, index) =>
          loading ? index.toString() : item.uid
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:-30
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
    paddingHorizontal: 15,
  },
  searchContainer: {
    paddingHorizontal: 1,
    paddingVertical: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBlockColor:"#ccc",
    borderWidth:1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
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
