import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { COLORS, images } from "../../constants";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ScreenLayout from "./ScreenLayout";
import Button from "../../components/Button";
import { db, storage } from "../../utils/firebase.config";
import routes from "../../Navigation/routes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthScreenNavigatorProps } from "../../constants/types";
import { getUserData, storeUserData } from "../../utils/AuthStorage";
import { auth } from "../../utils/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FormValues = {
  username: string;
  profile: string;
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").label("Username"),
  profile: Yup.string().required("Profile image is required"),
});

const ProfileScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues>({
    username: "",
    profile: "",
  });

  const navigation = useNavigation<AuthScreenNavigatorProps>();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setInitialValues({
          username: userData.username || "",
          profile: userData.profile || "",
        });
      }
    };
    fetchUserData();
  }, []);

  const handleImagePicker = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("profile", result.assets[0].uri);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const userData = await getUserData();
      if (!userData) {
        console.log("No user data");
        navigation.navigate(routes.REGISTER);
        return;
      }
      const profileImageUri = values.profile;
      const profileImageName = `profile_${userData.id}`;
      const storageRef = ref(storage, `profile_images/${profileImageName}`);
      const response = await fetch(profileImageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save the profile image URL in AsyncStorage
      await AsyncStorage.setItem('profileImage', downloadURL);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password as any
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        email: userData.email,
        sex: userData.sex,
        age: userData.age,
        username: values.username,
        profile: downloadURL,
      });
      const authToken = await user.getIdToken();
      const refreshToken = await user.getIdToken(true);
      await storeUserData({
        authToken,
        refreshToken,
        name: userData.name,
        email: userData.email,
        sex: userData.sex,
        age: userData.age,
        username: values.username,
        profile: downloadURL,
      } as any);
      ToastAndroid.show("Profile updated successfully", ToastAndroid.LONG);
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.error("Error updating profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to retrieve the stored profile image URL
  const retrieveProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        console.log("Stored Profile Image URL:", storedImage);
        // You can set this URL in your state or use it as needed
      }
    } catch (error) {
      console.error("Error retrieving profile image:", error);
    }
  };

  useEffect(() => {
    retrieveProfileImage(); // Retrieve the stored profile image on component mount
  }, []);

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

            <Text style={[styles.subHeader]}>My Profile</Text>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
              }}
            >
              {({
                handleChange,
                handleSubmit,
                setFieldValue,
                errors,
                touched,
                values,
              }) => (
                <View>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={() => handleImagePicker(setFieldValue)}
                  >
                    {values.profile ? (
                      <Image
                        source={{ uri: values.profile }}
                        style={styles.profile}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="camera"
                        size={30}
                        color={COLORS.gray}
                      />
                    )}
                  </TouchableOpacity>
                  {touched.profile && errors.profile && (
                    <Text style={styles.errorText}>{errors.profile}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      onChangeText={handleChange("username")}
                      value={values.username}
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}

                  <View style={styles.buttonContainer}>
                    <Button
                      title="Set Profile"
                      onpress={() => handleSubmit()}
                      loading={isLoading}
                    />
                  </View>
                </View>
              )}
            </Formik>
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
  imagePickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: COLORS.gray,
    paddingVertical: 40,
    paddingHorizontal: 10,
    borderRadius: 100,
    width: 150,
    height: 150,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default ProfileScreen;
