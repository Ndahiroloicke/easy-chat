import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase.config";
import * as Yup from "yup";
import { COLORS, FONTS, images } from "../../constants";
import { AuthScreenNavigatorProps } from "../../constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "./ScreenLayout";
import CheckBox from "../../components/Form/CheckBox";
import AuthAlt from "../../components/Form/AuthAlt";
import useUserStore from "../../Store/UserStore";
import routes from "../../Navigation/routes";
import Button from "../../components/Button";
import { getFirebaseErrorMessage } from "../../utils/getFirebaseError";
import { storeUserData } from "../../utils/AuthStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please enter your full name").label("Name"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter your email")
    .label("Email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character")
    .required("Please enter a password")
    .label("Password"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null as any], "Passwords must match")
    .required("Please repeat the password"),
  sex: Yup.string().required("Please select your gender"),
  age: Yup.string().required("Please select your age"),
});

type FormValues = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  sex: string;
  age: string;
};

const SignUpScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AuthScreenNavigatorProps>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword(!showRepeatPassword);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", values.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        ToastAndroid.show(
          "Email already in use, please choose another.",
          ToastAndroid.LONG
        );
      } else {
        const userData: UserData = {
          name: values.name,
          email: values.email,
          sex: values.sex,
          age: values.age,
          password: values.password,
        };
        await storeUserData(userData);
        const password = userData.password || "";
        await AsyncStorage.setItem("userPassword",password);
        const setPassword = await AsyncStorage.getItem("userPassword");
        console.log(setPassword);
        navigation.navigate(routes.PROFILESETUP);
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      ToastAndroid.show("An error occurred during sign-up.", ToastAndroid.LONG);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScreenLayout>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Image source={images.logo} style={styles.logo} />
              <Text style={[styles.title, styles.titleYellow]}>Esy</Text>
              <Text style={[styles.title, styles.titleBlue]}>Chat</Text>
            </View>

            <Text style={styles.subHeader}>Create Account</Text>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                repeatPassword: "",
                sex: "",
                age: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
              }}
              validationSchema={validationSchema}
            >
              {({ handleChange, handleSubmit, errors, touched, values }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Names"
                      onChangeText={handleChange("name")}
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={values.name}
                    />
                  </View>
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={values.email}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={values.password}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Repeat Password"
                      secureTextEntry={!showRepeatPassword}
                      onChangeText={handleChange("repeatPassword")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={values.repeatPassword}
                    />
                    <TouchableOpacity onPress={toggleRepeatPasswordVisibility}>
                      <MaterialCommunityIcons
                        name={showRepeatPassword ? "eye-off" : "eye"}
                        size={20}
                        color={COLORS.black}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.repeatPassword && errors.repeatPassword && (
                    <Text style={styles.errorText}>
                      {errors.repeatPassword}
                    </Text>
                  )}

                  <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Gender"
                          onChangeText={handleChange("sex")}
                          autoCapitalize="none"
                          autoCorrect={false}
                          value={values.sex}
                        />
                      </View>
                    </View>
                    <View style={styles.gridItem}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={[styles.input, styles.gridInput]}
                          placeholder="Age"
                          keyboardType="numeric"
                          onChangeText={handleChange("age")}
                          autoCapitalize="none"
                          autoCorrect={false}
                          value={values.age}
                        />
                      </View>
                    </View>
                  </View>
                  {((touched.age && errors.age) ||
                    (touched.sex && errors.sex)) && (
                    <Text style={styles.errorText}>
                      {errors.age || errors.sex}
                    </Text>     
                  )}
                  <CheckBox text="I agree with EsyChat Terms & Policy" />

                  <View style={styles.buttonContainer}>
                    <Button
                      title={"Create Account"}
                      onpress={handleSubmit}
                      loading={isLoading}
                    />
                  </View>
                </View>
              )}
            </Formik>

            <View style={styles.redirect}>
              <Text style={styles.redirectText}>Already a member? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(routes.LOGIN)}
              >
                <Text style={[styles.redirectLink, { color: COLORS.primary }]}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
            <AuthAlt />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "Bold",
  },
  titleYellow: {
    color: COLORS.yellow,
  },
  titleBlue: {
    color: COLORS.primary,
  },
  subHeader: {
    fontSize: 24,
    fontFamily: "Semibold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  gridContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
  gridInput: {
    marginRight: 10,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  redirect: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  redirectText: {
    fontSize: 16,
    color: COLORS.black,
  },
  redirectLink: {
    fontSize: 16,
    fontFamily: "Semibold",
  },
});

export default SignUpScreen;
