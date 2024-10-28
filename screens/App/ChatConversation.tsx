import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  doc,
  onSnapshot,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import { MaterialIcons } from "@expo/vector-icons";
import { getUserData } from "../../utils/AuthStorage";

interface User {
  id: string;
  name: string;
  profile: string; // Assuming you have a profile picture URL
}

interface ChatConversationProps {
  userId?: string;
  chatId?: string;
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
}

const ChatConversation: React.FC<ChatConversationProps> = ({
  userId,
  chatId: existingChatId,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [chatId, setChatId] = useState<string | null>(existingChatId || null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setCurrentUser(userData as User);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    const fetchUser = async () => {
      if (userId) {
        try {
          const userRef = doc(db, "users", userId);
          const userSnapshot = await getDoc(userRef); 
          if (userSnapshot.exists()) {
            setUser(userSnapshot.data() as User);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    const fetchMessages = () => {
      if (chatId) {
        try {
          const chatRef = collection(db, "chats", chatId, "messages");
          const q = query(chatRef, orderBy("timestamp", "asc"));
          onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Message[];
            setMessages(fetchedMessages);
          });
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    const createChatIfNotExists = async () => {
      if (!chatId && userId) {
        try {
          const chatsRef = collection(db, "chats");
          const q = query(
            chatsRef,
            where("participants", "array-contains", currentUserId)
          );
          const chatSnapshot = await getDocs(q);

          let chat = chatSnapshot.docs.find((doc) =>
            doc.data().participants.includes(userId)
          );

          if (!chat) {
            const newChatRef = await addDoc(chatsRef, {
              participants: [currentUserId, userId],
              createdAt: Timestamp.now(),
            });
            setChatId(newChatRef.id);
          } else {
            setChatId(chat.id);
          }
        } catch (error) {
          console.error("Failed to create or find chat:", error);
        }
      }
    };

    fetchCurrentUser();
    fetchUser();
    createChatIfNotExists();
    fetchMessages();
  }, [userId, chatId, currentUserId]);
  

  const sendMessage = async () => {
    if (messageText.trim() && chatId) {
      try {
        const chatRef = collection(db, "chats", chatId, "messages");
        await addDoc(chatRef, {
          senderId: currentUserId,
          content: messageText,
          timestamp: Timestamp.now(),
        });
        setMessageText("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUserSender = item.senderId === currentUserId;
    const profileImage = isCurrentUserSender ? currentUser?.profile : user?.profile;
  
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUserSender ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {/* Show the profile image of the sender of each message */}
        {!isCurrentUserSender && (
          <Image source={{ uri: user?.profile }} style={styles.senderImage} />
        )}
  
        <View
          style={[
            styles.messageContent,
            isCurrentUserSender ? styles.myMessageContent : styles.otherMessageContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isCurrentUserSender ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>
  
        {isCurrentUserSender && (
          <Image source={{ uri: currentUser?.profile }} style={styles.senderImage} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        {user && <Text style={styles.headerTitle}>{user?.name}</Text>}
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  messagesList: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  myMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  senderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 10,
  },
  myMessageContent: {
    backgroundColor: "#F6F8FC", // White background for messages sent by the user
  },
  otherMessageContent: {
    backgroundColor: "#007bff", // Blue background for messages received
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "#000", // Black text for messages sent by the user
  },
  otherMessageText: {
    color: "#fff", // White text for messages received
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
  },
});

export default ChatConversation;
