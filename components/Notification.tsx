import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { images, FONTS, COLORS } from "../constants";

type Props = {
  name: string;
  desc: string;
  time: Date;
  image?: any;
  type: string;
};
// Function to format time in AM/PM format
const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};
const isNotificationRecent = (notificationDate: Date) => {
  const currentDate = new Date(); // Current time
  const notificationTime = new Date(notificationDate); // Convert notification date to Date object

  // Calculate the difference in milliseconds between the current time and the notification time
  const differenceInMilliseconds =
    currentDate.getTime() - notificationTime.getTime();

  // Convert milliseconds to minutes
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );

  // Return true if the difference is less than 10 minutes, otherwise return false
  return differenceInMinutes < 10;
};

const Notification: React.FC<Props> = ({ name, desc, time, image, type }) => {
  return (
    <TouchableOpacity style={styles.notification}>
      <View style={styles.notProp}>
        <View style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            {type === "update" ? (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="alert-box" size={24} />
              </View>
            ) : (
              <Image source={image} style={styles.image} />
            )}
          </View>
          <View style={styles.notInfo}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.subtext}>{desc.substring(0, 20)}</Text>
            <Text style={styles.time}>{formatAMPM(time)}</Text>
          </View>
        </View>

        <View style={styles.chevron}>
          {isNotificationRecent(time) && (
            <View style={styles.new}>
              <Text style={styles.newText}>New</Text>
            </View>
          )}
          <MaterialCommunityIcons name="chevron-right" size={24} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notification: {
    marginVertical: 10,
  },
  notProp: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    paddingHorizontal: 5,
  },
  imageContainer: {
    width: 55,
    height: 55,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  notInfo: {
    justifyContent: "space-between",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 15,
  },
  name: {
    ...FONTS.body8,
  },
  subtext: {
    ...FONTS.body4,
    fontSize: 12,
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
  chevron: {
    justifyContent: "center",
    gap: 5,
  },
  new: {
    padding: 5,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  newText: {
    ...FONTS.body4,
    fontSize: 9,
  },
});
