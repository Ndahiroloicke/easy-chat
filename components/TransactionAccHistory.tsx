import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FONTS } from "../constants";

type transHistory = {
  image: any;
  name: string;
  action: string;
  amount: number;
  time: Date;
};

// Function to format time in AM/PM format
 export const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};
const TransactionAccHistory: React.FC<transHistory> = ({
  image,
  name,
  action,
  amount,
  time,
}) => {
  return (
    <View style={styles.historyContainer}>
      <View style={styles.userInfo}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name.substring(0, 15)}</Text>
          <Text style={styles.time}>{formatAMPM(time)}</Text>
        </View>
      </View>
      <View style={styles.actionContainer}>
        {action === "sent" || action === "withdraw" ? (
          <Text style={styles.amount}>-{amount}Frw</Text>
        ) : (
          <Text style={styles.amount}>+{amount}Frw</Text>
        )}
        <Text
          style={[
            styles.action,
            {
              color:
                action === "sent"
                  ? "#C8102E"
                  : action === "withdraw"
                  ? "#FC3105"
                  : "#53CF00",
            },
          ]}
        >
          {action}
        </Text>
      </View>
    </View>
  );
};

export default TransactionAccHistory;

const styles = StyleSheet.create({
  historyContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    borderRadius: 50,
    overflow: "hidden",
  },
  userInfo: {
    flexDirection: "row",
    gap: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
  nameContainer: {
    justifyContent: "space-around",
  },
  actionContainer: {
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  name: {
    ...FONTS.body8,
  },
  time: {
    ...FONTS.body4,
    fontSize: 12,
  },
  amount: {
    ...FONTS.body8,
  },
  action: {
    ...FONTS.body8,
    fontSize: 12,
  },
});
