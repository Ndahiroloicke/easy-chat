import React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "../../Themes/ThemeProvider";
import { FONTS, COLORS, images } from "../../constants";
import Button from "../../components/Button";

const { width, height } = Dimensions.get("window");
const WelcomeScreen = () => {
  const { dark, colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Image source={images.Ellipse} style={styles.ellipse} />
      <View>
        <Image source={images.onboard4} style={styles.mainImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.header, { color: colors.text }]}>
          Let’s create your <Text style={styles.Binexo}>Binexopay</Text> account
        </Text>
        <Text style={[styles.desc, { color: colors.text }]}>
          Get ready towards your goals We're here to
          support you every step of the way. Let's dive in and make progress
          together.
        </Text>
        <View style={styles.buttons}>
          <Button title="Login" onpress={() => {}} outline={true} />
          <Button title="Sign Up" onpress={() => {}} outline={false} />
        </View>
      </View>
      <StatusBar style={`${dark ? "light" : "dark"}`} />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 5,
    // justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  ellipse: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 227,
    height: 209,
  },

  mainImage: {
    height: 360,
    width: 335,
  },
  textContainer: {
    paddingTop: 10,
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  header: {
    width: width * 0.8,
    textAlign: "center",
    ...FONTS.h4,
  },
  desc: {
    textAlign: "center",
    ...FONTS.body4,
    paddingHorizontal: 25,
    fontSize: 12,
  },
  Binexo: {
    color: COLORS.primary,
  },
  buttons: {
    overflow: "hidden",
    padding: 25,
    flexDirection: "row",
    gap: 10,
  },
});
