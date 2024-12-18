import React, { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { ScrollView } from "react-native";

import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import { COLORS, images } from "../../constants";
import Communications from "./Communications";
import ChatConversation from "./ChatConversation";
import Feather from "@expo/vector-icons/Feather";
import Chats from "./Chats";
import { getUserData } from "../../utils/AuthStorage";
import CreatePublication from "./CreatePublication";
import Publications from "./Publications";
import MenuModal from "./MenuModal";
import AdvertisementDetails from "./AdvertisementDetails";
import { useFonts } from 'expo-font';

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const [loading, setLoading] = useState(true);
  const [hasChats, setHasChats] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [advertisementId, setAdvertisementId] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [activeTab, setActiveTab] = useState("communication");

  const user = auth.currentUser;
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUserData();
      if (user) {
        setCurrentUser(user);
        console.log(user)
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const checkChats = async () => {
      if (user) {
        try {
          const chatsRef = collection(db, "chats");
          const q = query(
            chatsRef,
            where("participants", "array-contains", user.uid)
          );
          const querySnapshot = await getDocs(q);
          setHasChats(!querySnapshot.empty);
        } catch (error) {
          console.error("Error checking chats:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkChats();
  }, [user]);

  const [fontsLoaded] = useFonts({
    'Lobster': require('../../assets/fonts/Lobster-Regular.ttf'),
    'Robert' : require('../../assets/fonts/Birthstone-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleOpenChat = (newChatId?: string, newUserId?: string) => {
    console.log("Opening chat with ID:", newChatId, "and userId:", newUserId);
    setChatId(newChatId || null);
    setUserId(newUserId || null);
    setActiveTab("achat");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "communication":
        return (
          <Communications
            openChat={handleOpenChat}
          />
        );
      case "chats":
        return (
          <Chats
            openChat={(chatId?: string, userId?: string) => {
              setChatId(chatId || null);
              setUserId(userId || null);
              setActiveTab("achat");
            }}
          />
        );
      case "achat":
        return (
          <ChatConversation
            chatId={chatId || undefined}
            userId={userId || undefined}
            onBack={() => {
              setUserId(null);
              setChatId(null);
              setActiveTab(chatId ? "chats" : "communication");
            }}
          />
        );
      case "advertisements":
        return (
          <Publications
            openAdvertisement={(id: string) => {
              setAdvertisementId(id);
              setActiveTab("anadvertisement");
            }}
          />
        );
      case "anadvertisement":
        return (
          <AdvertisementDetails
            advertisementId={advertisementId as any}
            onBack={() => {
              setAdvertisementId(undefined);
              setActiveTab("advertisements");
            }}
          />
        );
      case "add-publication":
        return (
          <CreatePublication profileImage={user?.photoURL} onClose={() => setActiveTab("advertisements")} />
        );
      default:
        return null;
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <View style={styles.iconContainer}>
            <Feather name="menu" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
       
        <View style={styles.titleContainer}>
          <Image source={images.logo} style={styles.logo} />
          <Text style={[styles.title, {fontFamily:'Lobster'} , {color:"orange", fontWeight:100}]}>Esy</Text>
          <Text style={[styles.title, { fontFamily: 'Lobster' }, { color: "#007bff"} ]}>chat</Text>
        </View>
        <TouchableOpacity onPress={toggleMenu}>
          <Entypo name="dots-three-vertical" size={24} color="#fff" />
        </TouchableOpacity>
        <MenuModal visible={menuVisible} onClose={toggleMenu}></MenuModal>
      </View>
      {activeTab !== "achat" && activeTab !== "add-publication" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 130 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:-30 }}>
            <TouchableOpacity style={{ marginTop: 19, marginRight: 9, justifyContent: "flex-start" }} onPress={() => setActiveTab("communication")}>
              <View style={{flex:1, flexDirection:"column",alignItems:"center"}}>
                <View
                  style={{
                    padding: 5,
                    backgroundColor: COLORS.gray,
                    borderRadius: 100,
                    width: 60,
                    height: 60,
                    alignItems:"center",
                    marginTop:15,
                    justifyContent:"center"
                  }}
                >
                  <Image source={images.profile} />
                </View>
                <Text style={{marginTop:17}}>{currentUser?.name}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === "communication" && styles.activeTab]}
                onPress={() => setActiveTab("communication")}
              >
                <Image source={images.communication} style={styles.tabIcon} />
                <Text style={styles.tabText}>Comunicación</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === "chats" && styles.activeTab]}
                onPress={() => setActiveTab("chats")}
              >
                <Image source={images.chats} style={styles.tabIcon} />
                <Text style={styles.tabText}>Chats</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === "advertisements" && styles.activeTab]}
                onPress={() => setActiveTab("advertisements")}
              >
                <Image source={images.advertisements} style={styles.tabIcon} />
                <Text style={styles.tabText}>Anuncios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === "add-publication" && styles.activeTab]}
                onPress={() => setActiveTab("add-publication")}
              >
                <Image source={images.edit} style={styles.tabIcon} />
                <Text style={styles.tabText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 5,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    width:"auto",
    justifyContent:"space-between"
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 5,
  },
  title: {
    fontSize: 34,
    fontFamily: "Poppins",
    color: "#000",
  },
  titleYellow: {
    color: COLORS.yellow,
  },
  titleBlue: {
    color: COLORS.primary,
  },
  titleWhite: {
    color: COLORS.white,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tabButton: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    color:"white",
    borderRadius: 10,
    backgroundColor: "#58A9FF",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "orange",
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
  tabText: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
  },
  contentContainer: {
    flex: 1,
  },
  setupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    justifyContent: 'center',

  },
  setupButtonLogo: {
    width: 50,
    height: 50,
  },
  buttonText: {
    color: "#fff",
    // fontSize: 16,
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: "orange",
    alignItems:"center",
    paddingHorizontal:9,
    marginTop:12,
    marginHorizontal:6,
    borderRadius:11,
    paddingVertical:10
  },
  configButtonContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  configButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.yellow,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  configIcon: {
    width: 24,
    height: 24,
  },
  configText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
});

export default HomeScreen;