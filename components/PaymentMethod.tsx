import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FONTS } from "../constants";

type Props = {
  image: any;
  name: string;
  number: string;
  activeMethod: string;
  onpress: () => void;
};
const PaymentMethod: React.FC<Props> = ({
  image,
  name,
  number,
  onpress,
  activeMethod,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.MethodContainer,
        {
          backgroundColor: activeMethod === name ? "#E9DFB8" : "#F8F9FF",
          borderColor: activeMethod === name ? "#E3C138" : "#F8F9FF",
        },
      ]}
      onPress={onpress}
    >
      <View style={styles.subContainer}>
        <View style={styles.methodImage}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.methodInfoContainer}>
          <Text style={styles.methodName}>{name}</Text>
          <Text style={styles.number}>{number}</Text>
        </View>
      </View>

      {activeMethod === name && <View style={styles.checked}>
        <MaterialCommunityIcons name="check" size={24} color={"#E3C138"} />
      </View>}
    </TouchableOpacity>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  MethodContainer: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 2,
  },
  subContainer:{
    flexDirection:"row",
    alignItems:"center",
    gap:30
  },
  methodImage: {
    width: 70,
    height: 70,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  methodInfoContainer: {
    justifyContent: "space-around",
  },
  methodName: {
    ...FONTS.h4,
  },
  number: {
    ...FONTS.body4,
    fontSize: 12,
  },
  checked: {
    justifyContent: "center",
    alignItems: "center",
  },
});
