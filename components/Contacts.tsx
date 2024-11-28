import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FONTS } from "../constants";

type Props = {
  username: string;
  email: string;
  image: any;
  onpress: () => void;
};
const Contacts: React.FC<Props> = ({ onpress, username, email, image }) => {
  return (
    <TouchableOpacity onPress={onpress} style={styles.contact}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.chevron} onPress={()=>{}}>
        <MaterialCommunityIcons name="chevron-right" size={24}/>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  contact: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingVertical:10,
  },
  mainContainer:{
    flexDirection:"row",
    gap:15,
    alignItems:"center"
  },
  imageContainer: {
    width:60,
    height:60,
    borderRadius:30,
    overflow:"hidden"
  },
  image: {
    width:"100%",
    height:"100%",
  },
  userInfo: {},
  username: {
    ...FONTS.body8,
  },
  email: {
    ...FONTS.body4,
    fontSize:12
  },
  chevron:{
    width:30,
    height:30,
    justifyContent: "center",
    alignItems:"center",
    borderWidth:1,
    borderColor:"#E0E1E6",
    borderRadius:30
  }
});
