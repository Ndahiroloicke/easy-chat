import React, { useState } from "react";
import { Image, StyleSheet, Text, View, Modal } from "react-native";
import ScreenLayout from "./ScreenLayout";
import BackButton from "../../components/BackButton";
import { useTheme } from "../../Themes/ThemeProvider";
import { images, FONTS, COLORS } from "../../constants";
import { Formik } from "formik";
import * as Yup from "yup";
import AppTextInput from "../../components/Form/AppTextInput";
import Button from "../../components/Button";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import AppModal from "../../components/AppModal";
import AppActivityIndicator from "../../components/AppActivityIndicator";
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigatorProps } from "../../constants/types";
import routes from "../../Navigation/routes";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6)
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character")
    .required("Plese enter your password")
    .label("Password"),
  confirmPassword: Yup.string()
    .required("Confirm Password")
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

const NewPassword = () => {
  const { colors } = useTheme();
  const [open, setIsOpen] = useState(false);
  const handleVisibility = () => {
    setIsOpen(false);
  };

  const navigation = useNavigation<AuthScreenNavigatorProps>();
  return (
    <>
      <ScreenLayout>
        <BackButton onpress={() => {}} />
        <View style={styles.container}>
          <Text style={[styles.header, { color: colors.primary }]}>
            Create new password 🔒
          </Text>
          <View style={styles.ImageContainer}>
            <Image source={images.NewPass} style={styles.image} />
          </View>

          {/* form */}
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            onSubmit={(values) => console.log(values)}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, errors }) => (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>New Password:</Text>

                  <AppTextInput
                    icon="lock"
                    placeholder="Password"
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    onChangeText={handleChange("password")}
                    secureTextEntry={true}
                  />
                  {errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                  <Text style={styles.text}>confirm Password:</Text>

                  <AppTextInput
                    icon="lock"
                    placeholder="Confirm Password"
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    onChangeText={handleChange("confirmPassword")}
                    secureTextEntry={true}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    title="Continue"
                    onpress={() => {
                      handleSubmit();

                      setIsOpen(true);
                      setTimeout(()=>{navigation.navigate(routes.LOGIN)},2000)
                    }}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScreenLayout>
      {
        <AppModal visible={open} handleVisibility={handleVisibility}>
          <View style={[styles.Modal, { backgroundColor: colors.background }]}>
            <Image source={images.success} />
            <Text style={[styles.header, { color: colors.primary }]}>
              Successful!
            </Text>
            <View style={styles.textContainer}>
              <Text style={styles.text}>please wait...</Text>
              <Text style={styles.desc}>
                You will be directed to the homepage in a few seconds
              </Text>
            </View>
            <AppActivityIndicator />
          </View>
        </AppModal>
      }
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 15,
    paddingHorizontal: 5,
    alignItems: "center",
    position: "relative",
    gap: 30,
  },
  subContainer: {
    width: "100%",
  },
  header: {
    textAlign: "center",
    ...FONTS.h3,
  },
  ImageContainer: {
    alignItems: "center",
  },
  image: {
    marginRight: 30,
  },
  error: {
    color: "red",
    paddingLeft: 2,
  },
  button: {
    paddingTop: 20,
  },
  inputContainer: {
    width: "100%",
  },
  text: {
    ...FONTS.body8,
    paddingLeft: 5,
    fontSize: 12,
  },
  Modal: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    gap: 10,
  },
  desc: {
    textAlign: "center",
    ...FONTS.body4,
  },
  textContainer: {
    alignItems: "center",
    gap: 5,
  },
});

export default NewPassword;
