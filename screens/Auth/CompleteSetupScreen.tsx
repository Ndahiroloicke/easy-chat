import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import routes from "../../Navigation/routes";
import { useTheme } from "../../Themes/ThemeProvider";
import Button from "../../components/Button";
import { FONTS, images } from "../../constants";
import { AuthScreenNavigatorProps } from "../../constants/types";
import ScreenLayout from "./ScreenLayout";

const { height, width } = Dimensions.get("window");
const CompleteSetupScreen = () => {
  const { dark, colors } = useTheme();

  const navigation = useNavigation<AuthScreenNavigatorProps>();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={images.success1} resizeMode="contain" />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.textcontainer}>
            <Text style={styles.header}>You are All Set!</Text>
            <Text style={styles.subHeader}>
              Your account is ready. Let’s start for your better financial
              experience
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Go to My Account"
              onpress={() => navigation.navigate(routes.LOGIN)}
            />
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

export default CompleteSetupScreen;

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
  imageContainer: {
    height: height * 0.5,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    ...FONTS.h2,
  },
  subHeader: {
    textAlign: "center",
    ...FONTS.body4,
    paddingHorizontal: 40,
  },
  contentContainer: {
    flex: 1,
  },
  textcontainer: {
    gap: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingVertical: 40,
  },
});
