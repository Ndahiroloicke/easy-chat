import { StyleSheet, Text, View } from "react-native";
import React from "react";

import ScreenLayout from "./ScreenLayout";
import { useTheme } from "../../Themes/ThemeProvider";
import { images, FONTS, COLORS } from "../../constants";
import BackButton from "../../components/BackButton";

const CompleteFingerScreen = () => {
  const { dark, colors } = useTheme();
  return (
    <ScreenLayout>
      <View style={styles.backbutton}>
        <BackButton onpress={() => {}} />
      </View>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          Set Your Fingerprint
        </Text>
        <Text style={styles.subHeader}>
          Add a fingerprint to make your account more secure.
        </Text>
      </View>
    </ScreenLayout>
  );
};
const styles = StyleSheet.create({
  backbutton: {
    paddingHorizontal: 10,
  },
  container: {
    paddingTop: 30,
    alignItems: "center",
    gap: 20,
    flex: 1,
  },
  header: {
    textAlign: "center",
    ...FONTS.h2,
  },
  subHeader: {
    textAlign: "center",
    ...FONTS.body3,
    paddingHorizontal: 40,
  },
});

export default CompleteFingerScreen;
