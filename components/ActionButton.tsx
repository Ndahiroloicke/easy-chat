import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS, images } from "../constants";

type Props = {
  onPress: () => void;
  name?: any;
};

const ActionButton: React.FC<Props> = ({ onPress, name }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {name === "send" ? (
        <Image source={images.send}  style={styles.image}/>
      ) : name === "deposit" ? (
        <Image source={images.deposit} style={styles.image} />
      ) : name === "withdraw" ? (
        <Image source={images.withdraw} style={styles.image} />
      ) : (
        <Image source={images.share} style={styles.image}/>
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
    borderRadius:50,
    alignItems:"center",
    justifyContent: "center",
  },
  image:{
    width:30,
    height:30
  }
});
