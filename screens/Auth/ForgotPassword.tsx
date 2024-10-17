import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from "react-native";
import ScreenLayout from "./ScreenLayout";
import BackButton from "../../components/BackButton";
import { useTheme } from "../../Themes/ThemeProvider";
import { images, FONTS, COLORS } from "../../constants";
import { Formik } from "formik";
import * as Yup from "yup";
import AppTextInput from "../../components/Form/AppTextInput";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigatorProps } from "../../constants/types";
import routes from "../../Navigation/routes";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
});

const ForgotPassword = () => {
  const { colors } = useTheme();

  const navigation = useNavigation<AuthScreenNavigatorProps>();
  return (
    <ScreenLayout>
      <BackButton onpress={() => {}} />
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          Forgot Your Password 🔑
        </Text>
        <View>
          <Image source={images.forgotP} style={styles.image} />
        </View>
        <View>
          <Text style={styles.text}>
            Please enter your email and we will send you an OTP code in the next
            step to reset your password.
          </Text>
        </View>

        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => navigation.navigate(routes.OTPVERIFY)}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, handleChange, errors }) => (
            <View style={styles.inputContainer}>
              <AppTextInput
                icon="email"
                placeholder="Email"
                keyboardType="email-address"
                autoCorrect={false}
                onChangeText={handleChange("email")}
                autoCapitalize={"none"}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <View style={styles.button}>
                <Button title="Continue" onpress={handleSubmit} />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScreenLayout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    position: "relative",
    gap: 30,
  },
  header: {
    paddingVertical: 30,
    textAlign: "center",
    ...FONTS.h3,
  },
  image: {
    width: 245,
    height: 180,
  },
  text: {
    ...FONTS.body3,
    textAlign: "center",
  },
  error: {
    color: "red",
    paddingLeft: 2,
  },
  button: {
    flexDirection: "row",
    paddingTop: 20,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
  },
});

export default ForgotPassword;
