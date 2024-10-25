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
  Button as NativeButton,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { COLORS, FONTS, data, images } from "../../constants";
import { AuthScreenNavigatorProps, responseType } from "../../constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "./ScreenLayout";
import { auth, db } from "../../utils/firebase.config";
import CheckBox from "../../components/Form/CheckBox";
import ContinueWith from "../../components/Form/ContinueWIth";
import AuthAlt from "../../components/Form/AuthAlt";
import useUserStore from "../../Store/UserStore";
import routes from "../../Navigation/routes";
import Button from "../../components/Button";
import { getFirebaseErrorMessage } from "../../utils/getFirebaseError";
import { storeUserData } from "../../utils/AuthStorage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get("window");

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required("Please enter a valid email")
    .label("Email"),
  password: Yup.string()
    .min(6)
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character")
    .required("Please enter a password")
    .label("Password"),
});

type FormValues = {
  email: string;
  password: string;
};

const LogInScreen: React.FC = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AuthScreenNavigatorProps>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        const user = userCredential.user;
        const authToken = await user.getIdToken();
        const refreshToken = await user.getIdToken(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error("User document does not exist");
        }
        const userDataFromFirestore = userDoc.data();
        console.log(userDataFromFirestore);
        
        const userData: UserData = {
            authToken,
            refreshToken,
            email: values.email,
            name: userDataFromFirestore?.name,
            id: user.uid,
            sex: userDataFromFirestore?.sex,
            age: userDataFromFirestore?.age,
        };

        await storeUserData(userData);
        console.log(userData.email);
        // Store the password in local storage (only if necessary)
        await AsyncStorage.setItem('userPassword', values.password);
        console.log("Stored password:", values.password); // Log the password for debugging

        navigation.navigate(routes.HOME);
    } catch (error: any) {
        ToastAndroid.show(getFirebaseErrorMessage(error.code), ToastAndroid.LONG);
        console.error("Error logging in:", error.message);
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

            <Text style={[styles.subHeader]}>Log In</Text>
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

                  <CheckBox text="Remember Me" />

                  <View style={styles.buttonContainer}>
                    <Button
                      title="Log In"
                      onpress={() => handleSubmit()}
                      loading={isLoading}
                    />
                  </View>
                </View>
              )}
            </Formik>

            <View style={styles.redirect}>
              <Text style={styles.redirectText}>Not a member? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(routes.REGISTER)}
              >
                <Text style={[styles.redirectLink, { color: COLORS.primary }]}>
                  Register
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
    marginBottom: 10,
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

export default LogInScreen;
