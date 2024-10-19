import React, { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
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

const HomeScreen = () => {
  
  const [loading, setLoading] = useState(true);
  const [hasChats, setHasChats] = useState(false);
  const [chatId, setChatId] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [advertisementId, setAdvertisementId] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [activeTab, setActiveTab] = useState<
    | "communication"
    | "chats"
    | "achat"
    | "advertisements"
    | "add-publication"
    | "anadvertisement"
  >("communication");

  const user = auth.currentUser;
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUserData();
      if (user) {
        setCurrentUser(user);
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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // if (!hasChats) {
  //   return (
  //     <View style={styles.setupContainer}>
  //       <View style={styles.titleContainer}>
  //         <Image source={images.logo} style={styles.logo} />
  //         <Text style={[styles.title, styles.titleYellow]}>Esy</Text>
  //         <Text style={[styles.title, styles.titleBlue]}>Chat</Text>
  //       </View>
  //       <View style={styles.buttonGrid}>
  //         <TouchableOpacity
  //           style={styles.button}
  //           onPress={() => {
  //             setHasChats(true);
  //             setActiveTab("advertisements");
  //           }}
  //         >
  //           <Image
  //             source={images.advertisements}
  //             style={styles.setupButtonLogo}
  //           />
  //           <Text style={styles.buttonText}>Publications</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.button}
  //           onPress={() => {
  //             setHasChats(true);
  //             setActiveTab("communication");
  //           }}
  //         >
  //           <Image
  //             source={images.communication}
  //             style={styles.setupButtonLogo}
  //           />
  //           <Text style={styles.buttonText}>Communication</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           style={styles.button}
  //           onPress={() => {
  //             setHasChats(true);
  //             setActiveTab("chats");
  //           }}
  //         >
  //           <Image source={images.chats} style={styles.setupButtonLogo} />
  //           <Text style={styles.buttonText}>Chats</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <View style={styles.configButtonContainer}>
  //         <TouchableOpacity style={styles.configButton}>
  //           <Image source={images.config} style={styles.configIcon} />
  //           <Text style={styles.configText}>Configurations</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

  const renderContent = () => {
    switch (activeTab) {
      case "communication":
        return (
          <Communications
            openChat={(userId: string) => {
              setUserId(userId);
              setActiveTab("achat");
            }}
          />
        );
      case "chats":
        return (
          <Chats
            openChat={(chatId) => {
              setChatId(chatId);
              setActiveTab("achat");
            }}
          />
        );
      case "achat":
        return (
          <ChatConversation
            userId={userId}
            chatId={chatId}
            onBack={() => setActiveTab("chats")}
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
          <CreatePublication onClose={() => setActiveTab("advertisements")} />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={images.back} style={styles.backButton} />
        <View style={[styles.titleContainer, { flex: 1 }]}>
          <Image source={images.logo} style={styles.logo} />
          <Text style={[styles.title, styles.titleYellow]}>Esy</Text>
          <Text style={[styles.title, { color: COLORS.white }]}>Chat</Text>
        </View>
        <TouchableOpacity onPress={toggleMenu}>
        <Entypo name="dots-three-vertical" size={24} color="#fff" />
        </TouchableOpacity>
        <MenuModal visible={menuVisible} onClose={toggleMenu} />
      
      </View>
      {activeTab !== "achat" && activeTab !== "add-publication" && (
        <View style={styles.tabContainer}>
          <TouchableOpacity style={{marginTop:19, marginRight:9,}} onPress={() => setActiveTab("communication")}>
            <View
              style={{
                padding: 5,
                backgroundColor: COLORS.gray,
                borderRadius: 100,
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
            <Image source={images.profile} />
            </View>
            <Text style={{marginLeft:15,}}>{currentUser?.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              activeTab === "communication" && styles.activeTab,
              { backgroundColor: COLORS.secondaryBlue },
              styles.button,
            ]}
            onPress={() => setActiveTab("communication")}
          >
            <Image source={images.communication} style={styles.tabIcon} />
            {/* <Text style={styles.buttonText}>Communication</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              activeTab === "chats" && { backgroundColor: COLORS.yellow },
              { backgroundColor: COLORS.secondaryBlue },
              styles.button,
            ]}
            onPress={() => setActiveTab("chats")}
          >
            <Image source={images.chats} style={styles.tabIcon} />
            {/* <Text style={styles.buttonText}>Chats</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { backgroundColor: COLORS.secondaryBlue },
              activeTab === "advertisements" && {
                backgroundColor: COLORS.yellow,
              },
              styles.button,
            ]}
            onPress={() => setActiveTab("advertisements")}
          >
            <Image source={images.advertisements} style={styles.tabIcon} />
            {/* <Text style={styles.buttonText}>Advertisement</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop:19,}} onPress={() => setActiveTab("add-publication")}>
            <View
              style={{
                padding: 5,
                marginLeft:9,
                backgroundColor: COLORS.gray,
                borderRadius: 100,
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={images.edit} style={styles.tabIcon} />
            </View>
            <Text>Publications</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "Bold",
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
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabcontainehome:{
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    alignItems: "flex-end",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
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
    fontSize: 8,
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: "#0056b3",
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
});

export default HomeScreen;
