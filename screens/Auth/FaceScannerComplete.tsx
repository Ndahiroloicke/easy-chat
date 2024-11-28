import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../Themes/ThemeProvider";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import { FONTS, images } from "../../constants";
import ScreenLayout from "./ScreenLayout";

import routes from "../../Navigation/routes";
import {
  AuthScreenNavigatorProps,
  HomeScreenNavigatorProps,
} from "../../constants/types";
import useUserStore from "../../Store/UserStore";

const { width, height } = Dimensions.get("window");

const FaceScannerComplete = () => {
  const { dark, colors } = useTheme();
  const navigation = useNavigation<HomeScreenNavigatorProps>();
  const { setUser, user } = useUserStore.getState();

  useEffect(() => {
    setTimeout(() => {
      setUser({
        ...user,
        emailVerified: true,
        phoneVerified: true,
      } as any);
      navigation.navigate(routes.HOME);
    }, 2000);
  }, []);
  return (
    <ScreenLayout>
      <View style={styles.backbutton}>
        <BackButton onpress={() => navigation.goBack()} />
      </View>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          Face Verification Processing ...
        </Text>
        <Text style={styles.subHeader}>Verifying...</Text>
        <View style={styles.imageContainer}>
          <Image source={images.facerec} resizeMode="contain" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Continue" onpress={() => {}} />
        </View>
      </View>
    </ScreenLayout>
  );
};

export default FaceScannerComplete;

const styles = StyleSheet.create({
  backbutton: {
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  container: {
    paddingTop: 30,
    alignItems: "center",
    gap: 20,
    flex: 1,
    paddingHorizontal: 20,
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
  imageContainer: {
    overflow: "hidden",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingBottom: 50,
  },
});
