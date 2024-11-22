import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Importing icons
import { COLORS } from "../../constants"; // Assuming COLORS is imported from your constants file

const AuthAlt = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Registrarte con</Text>
      <View style={styles.buttonContainer}>
        <View style={[styles.logoContainer, styles.facebook]}>
          <FontAwesome name="facebook" size={25} color="#ffffff" />
          <Text style={styles.logoText}>Facebook</Text>
        </View>
        <View style={[styles.logoContainer, styles.twitter]}>
          <FontAwesome name="twitter" size={25} color="#ffffff" />
          <Text style={styles.logoText}>Twitter</Text>
        </View>
        <View style={[styles.logoContainer, styles.google]}>
          <FontAwesome name="google" size={25} color="#ffffff" />
          <Text style={styles.logoText}>Google</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerText: {
    fontFamily: "Semibold",
    marginBottom: 15,
    color: COLORS.black,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "110%",
    paddingHorizontal: 10,
  },
  logoContainer: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  facebook: {
    backgroundColor: "#3b5998",
  },
  google: {
    backgroundColor: "#db4437",
  },
  twitter: {
    backgroundColor: "#1DA1F2", // Updated to the correct Twitter blue color
  },
  logoText: {
    marginLeft: 10, // Added margin for better spacing between icon and text
    color: "#ffffff", // White text color
    fontSize: 11, // Slightly larger font for better readability
    fontWeight: "bold",
  },
});

export default AuthAlt;
