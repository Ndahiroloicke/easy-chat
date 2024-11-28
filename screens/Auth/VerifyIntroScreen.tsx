import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import routes from "../../Navigation/routes";
import { useTheme } from "../../Themes/ThemeProvider";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import { FONTS, images } from "../../constants";
import { AuthScreenNavigatorProps } from "../../constants/types";
import ScreenLayout from "./ScreenLayout";

const VerifyIntroScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation<AuthScreenNavigatorProps>()
  return (
    <ScreenLayout>
      <BackButton onpress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          Let’s verify your idenity
        </Text>
        <Text style={styles.subHeader}>
          We want to confirm your identity before you can use our service
        </Text>
        <View style={styles.imageContainer}>
          <Image source={images.VerifyIntro} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Verify Identity" onpress={() => navigation.navigate(routes.IDPREVIEW)} />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default VerifyIntroScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: "center",
    gap: 30,
    paddingHorizontal: 10,
    flex: 1,
  },

  header: {
    textAlign: "center",
    ...FONTS.h2,
  },
  subHeader: {
    textAlign: "center",
    ...FONTS.body4,
    paddingHorizontal: 20,
  },
  imageContainer: {
    paddingTop: 30,
    flex: 1,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingVertical: 50,
  },
});
