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

interface UserData {
  id?: string;
  name: string;
  email: string;
  sex: string;
  age: string;
  password?: string;
  username?: string;
  profile?: string;
  authToken?: string;
  refreshToken?: string;
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        ToastAndroid.show("Permission to access gallery was denied", ToastAndroid.LONG);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Changed to 1:1 for profile picture
        quality: 0.8,    // Slightly reduced quality for better performance
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        console.log("Selected image:", selectedImage.uri); // Debug log
        setFieldValue("profile", selectedImage.uri);
        ToastAndroid.show("Image selected successfully", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      ToastAndroid.show("Error selecting image", ToastAndroid.LONG);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // 1. Get stored user data
      const userData = await getUserData();
      if (!userData || !userData.id) {
        ToastAndroid.show("Missing user data. Please sign up again.", ToastAndroid.LONG);
        navigation.navigate("SignUp");
        return;
      }

      // 2. Upload profile image
      let downloadURL = '';
      if (values.profile) {
        const profileImageName = `profile_${userData.id}`;
        const storageRef = ref(storage, `profile_images/${profileImageName}`);
        const response = await fetch(values.profile);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);
      }

      // 3. Update user document in Firestore
      await updateDoc(doc(db, "users", userData.id), {
        username: values.username,
        profile: downloadURL,
        isProfileComplete: true,
        updatedAt: new Date().toISOString()
      });

      // 4. Update stored user data
      const updatedUserData = {
        ...userData,
        username: values.username,
        profile: downloadURL,
        isProfileComplete: true
      };
      await storeUserData(updatedUserData);
      await AsyncStorage.setItem('profileImage', downloadURL);

      // 5. Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'App' }],
      });

      ToastAndroid.show("Profile setup complete!", ToastAndroid.SHORT);
    } catch (error: any) {
      console.error("Error in profile setup:", error);
      ToastAndroid.show(
        error.message || "Error setting up profile",
        ToastAndroid.LONG
      );
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
                console.log("Form values on submit:", values); // Debug log
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
                        onError={(e) => console.log("Image loading error:", e.nativeEvent.error)} // Debug log
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
    width: "100%",
    height: "190%",
    borderRadius: 75, // Half of the container width/height
    resizeMode: 'cover',
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
