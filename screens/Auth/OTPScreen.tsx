import React from "react";
import { Image, StyleSheet, Text, View, Modal } from "react-native";
import ScreenLayout from "./ScreenLayout";
import BackButton from "../../components/BackButton";
import { useTheme } from "../../Themes/ThemeProvider";
import { images, FONTS, COLORS } from "../../constants";
import OTPTextView from "react-native-otp-textinput";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigatorProps } from "../../constants/types";
import routes from "../../Navigation/routes";

const OTPScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<AuthScreenNavigatorProps>();
  return (
    <ScreenLayout>
      <BackButton onpress={() => {}} />
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          OTP code verification 🔐
        </Text>
        <Text style={styles.text}>
          We have sent an OTP code to your email bella***b@gmail.com. Enter the
          OTP below to verify.
        </Text>
        <View>
          <OTPTextView
            autoFocus
            tintColor={COLORS.primary}
            textInputStyle={styles.textInput}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text2}>Didn't receive the code?</Text>
          <Text style={[styles.text2, { color: COLORS.primary }]}>
            Resend the code!
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Confirm" onpress={() => navigation.navigate(routes.NEWPASSWORD)} />
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    position: "relative",
    gap: 10,
  },
  header: {
    textAlign: "center",
    ...FONTS.h3,
  },
  text: {
    ...FONTS.body4,
    paddingLeft: 5,
    textAlign: "center",
  },
  textInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#b594101f",
  },
  textContainer: {
    flexDirection: "row",
    gap: 5,
  },
  text2: {
    ...FONTS.body4,
    fontSize: 12,
  },
  buttonContainer: {
    paddingTop: 10,
    flexDirection: "row",
  },
});
export default OTPScreen;
