import React, { useState, useEffect, useRef } from "react";
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
  addDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import { COLORS } from "../../constants";

interface Chat {
  id: string;
  participants: string[];
  latestMessage?: string;
  createdAt: any;
  unreadCount?: number;
  lastReadBy?: { [key: string]: Timestamp };
}

interface User {
  id: string;
  name: string;
  profile: string;
}

interface ChatsProps {
  openChat: (chatId?: string, userId?: string) => void;
}

const ChatItem: React.FC<{ 
  chat: any; 
  user: any; 
  handleChatOpen: (chatId?: string, userId?: string) => void 
}> = ({ chat, user, handleChatOpen }) => {
  const currentUserUnreadCount = chat.unreadCount?.[auth.currentUser?.uid] || 0;

  return (
    <TouchableOpacity 
      style={styles.chatContainer} 
      onPress={() => user && handleChatOpen(chat.id, user.id)}
    >
      {user ? (
        <>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.profile }} style={styles.avatar} />
            {currentUserUnreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{currentUserUnreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.chatDetails}>
            <Text style={[
              styles.userName,
              currentUserUnreadCount > 0 && styles.unreadUserName
            ]}>
              {user.name}
            </Text>
            <Text style={[
              styles.latestMessage,
              currentUserUnreadCount > 0 && styles.unreadMessage
            ]}>
              {chat.latestMessage ? (
                chat.latestMessage.length > 30 ? 
                `${chat.latestMessage.slice(0, 30)}...` : 
                chat.latestMessage
              ) : "No message available"}
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

const Chats: React.FC<ChatsProps> = ({ openChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<{ [key: string]: User | null }>({});
  const currentUser = auth.currentUser;
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser) {
        console.log("No current user found");
        setLoading(false);
        return;
      }

      console.log("Fetching chats for user:", currentUser.uid);
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef, 
        where("participants", "array-contains", currentUser.uid), 
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        console.log("Received chat snapshot with", snapshot.docs.length, "chats");
        const fetchedChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Chat[];

        // Set chats immediately to show something
        setChats(fetchedChats);
        setFilteredChats(fetchedChats);

        // Then fetch users
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
        setLoading(false);
      }, (error) => {
        console.error("Error fetching chats:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    setLoading(true); // Ensure loading is true when starting fetch
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

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (query.trim() === "") {
        setFilteredChats(chats);
        return;
      }

      const filtered = chats.filter((chat) => {
        const otherUserId = chat.participants.find((participant) => participant !== currentUser?.uid);
        if (!otherUserId) return false;

        const otherUser = users[otherUserId];
        return (
          otherUser?.name.toLowerCase().includes(query.toLowerCase()) ||
          chat.latestMessage?.toLowerCase().includes(query.toLowerCase())
        );
      });

      setFilteredChats(filtered);
    }, 300); // Adjust debounce time as necessary
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleChatOpen = (chatId?: string, userId?: string) => {
    openChat(chatId, userId);
  };

  const renderChatItem = ({ item }: { item: any }) => {
    const otherUserId = item.participants.find(
      (participant: string) => participant !== currentUser?.uid
    );
    const otherUser = otherUserId ? users[otherUserId] : null;

    return (
      <ChatItem 
        chat={item} 
        user={otherUser} 
        handleChatOpen={handleChatOpen}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search chats or messages"
        value={searchQuery}
        onChangeText={handleSearch}
      />
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
        ) : filteredChats.length === 0 ? (
          <View style={styles.noChatsContainer}>
            <Text style={styles.noChatsText}>
              You have no chats. Start a conversation with someone!
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
          />
        )}
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
  noChatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noChatsText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  avatarContainer: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    right: 10,
    top: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadUserName: {
    fontWeight: '800',
  },
  unreadMessage: {
    color: COLORS.black,
    fontWeight: '600',
  },
});

export default Chats;
