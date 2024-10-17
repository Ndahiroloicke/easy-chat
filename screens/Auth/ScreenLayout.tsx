import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { useTheme } from "../../Themes/ThemeProvider";
import { StatusBar } from "expo-status-bar";
interface Props {
  children: React.ReactNode;
}
const ScreenLayout = ({ children }: Props) => {
  const { dark, colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Image source={images.Ellipse} style={styles.ellipse} />
      {children}
      <StatusBar style={`${dark ? "light" : "dark"}`} />
    </SafeAreaView>
  );
};

export default ScreenLayout;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 10,
    position: "relative",
  },
  ellipse: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 227,
    height: 209,
  },
});
