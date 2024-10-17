import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import { COLORS } from "../../constants";

interface Chat {
  id: string;
  participants: string[];
  latestMessage?: string;
  createdAt: any; // Handle Firestore Timestamp
}

interface User {
  id: string;
  name: string;
  profile: string;
}

interface ChatsProps {
  openChat: (chatId: string) => void;
}

const Chats: React.FC<ChatsProps> = ({ openChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchChats = async () => {
      if (currentUser) {
        const chatsRef = collection(db, "chats");
        const q = query(
          chatsRef,
          where("participants", "array-contains", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const fetchedChats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Chat[];

          // Fetch all the users
          const userPromises = fetchedChats.flatMap((chat) =>
            chat.participants
              .filter((uid) => uid !== currentUser.uid)
              .map((userId) => fetchUser(userId))
          );

          const userResults = await Promise.all(userPromises);
          const userMap = userResults.reduce((acc, user) => {
            if (user) {
              acc[user.id] = user;
            }
            return acc;
          }, {} as { [key: string]: User });

          setUsers(userMap);
          setChats(fetchedChats);
          setFilteredChats(fetchedChats);
          setLoading(false);
        });

        return () => unsubscribe();
      }
    };

    fetchChats();
  }, [currentUser]);

  const fetchUser = async (userId: string): Promise<User | null> => {
    if (users[userId]) {
      return users[userId];
    }

    try {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = { id: userId, ...userSnapshot.data() } as User;
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData }));
        return userData;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }

    return null;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter((chat) => {
      const otherUserId = chat.participants.find(
        (participant) => participant !== currentUser?.uid
      );

      if (!otherUserId) return false;

      const otherUser = users[otherUserId];

      return (
        otherUser?.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.latestMessage?.toLowerCase().includes(query.toLowerCase())
      );
    });

    setFilteredChats(filtered);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUserId = item.participants.find(
      (participant) => participant !== currentUser?.uid
    );
    const otherUser = otherUserId ? users[otherUserId] : null;

    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() => openChat(item.id)}
      >
        {otherUser ? (
          <>
            <Image source={{ uri: otherUser.profile }} style={styles.avatar} />
            <View style={styles.chatDetails}>
              <Text style={styles.userName}>{otherUser.name}</Text>
              <Text style={styles.latestMessage}>
                {item.latestMessage
                  ? item.latestMessage.length > 30
                    ? `${item.latestMessage.slice(0, 30)}...`
                    : item.latestMessage
                  : "No message available"}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonTextContainer}>
              <View style={styles.skeletonText} />
              <View style={styles.skeletonTextShort} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollViewContainer}>
        {loading ? (
          <FlatList
            data={Array(5).fill({})}
            renderItem={() => (
              <View style={styles.skeletonContainer}>
                <View style={styles.skeletonAvatar} />
                <View style={styles.skeletonTextContainer}>
                  <View style={styles.skeletonText} />
                  <View style={styles.skeletonTextShort} />
                </View>
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <View style={{ backgroundColor: COLORS.gray }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats or messages"
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
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    margin: 5,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  latestMessage: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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

export default Chats;