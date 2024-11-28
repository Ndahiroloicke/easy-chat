import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS, FONTS } from "../../constants";

type Props = {
  image: any;
  amount: number;
  username: string;
  userEmail: string;
  onpress: () => void;
};
const ReceiptCard = ({
  image,
  amount,
  username,
  userEmail,
  onpress,
}: Props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <View style={styles.image}>
          <Image source={image} style={styles.mainImage} />
        </View>
        <View style={styles.transInfo}>
          <Text style={styles.sent}>Sent:{" "}Frw{amount}</Text>
          <Text style={styles.sent}>To: {" "}{username}</Text>
          <Text style={styles.sent}>Email: {" "}{userEmail}</Text>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={onpress}>
          <Text style={styles.view}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReceiptCard;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 65,
    overflow: "hidden",
  },
  mainImage: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  transInfo: {
    alignItems: "flex-start",
  },
  sent: {
    ...FONTS.body4,
    fontSize: 12,
    fontWeight:"500"
  },
  view: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.primary,
  },
  subContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
