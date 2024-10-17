import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import routes from "../../Navigation/routes";
import { useTheme } from "../../Themes/ThemeProvider";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import AppDatePicker from "../../components/Form/AppDatePicker";
import AppTextInput from "../../components/Form/AppTextInput";
import PhoneInput from "../../components/Form/PhoneInput";
import ImageUploadModal from "../../components/ImageUploadModal";
import { COLORS, FONTS, data } from "../../constants";
import { AuthScreenNavigatorProps, responseType } from "../../constants/types";
import ScreenLayout from "../Auth/ScreenLayout";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("please enter your Full name").label("name"),
  phone: Yup.number()
    .min(6)
    .required("please enter your phone number")
    .label("phone"),
  dob: Yup.string().label("Date"),
  email:Yup.string().email().required("please enter your email")
});

const PersonalInfo = () => {
  const { colors } = useTheme();

  const navigation = useNavigation<AuthScreenNavigatorProps>();

  const [imageUri, setImageUrl] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<responseType>(
    data.Rwanda
  );
  const [selectedDate, setSelectedDate] = useState("2007/03/09");

  const [isVisible, setIsvisible] = useState(false);

  const handleVisibity = () => {
    setIsvisible(false);
  };

  const handleSelectedCountry = (country: responseType) => {
    setSelectedCountry(country);
  };

  const handleDateselection = (date: string) => {
    setSelectedDate(date);
  };
  // form submission
  const handleSubmit = (values: { name: string; phone: string }) => {
    if (selectedCountry && imageUri) {
      console.log({
        image: {
          uri: imageUri,
          type: "image/png",
          name: "profile-image",
        },
        name: values.name,
        phone: `+${selectedCountry.callingCodes[0] + values.phone}`,
        dob: selectedDate,
      });

      navigation.navigate(routes.COMPLETEAUTH)
    }
  };

  // image upload functions

  const uploadImage = async (mode?: string) => {
    try {
      let results: ImagePicker.ImagePickerResult;

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        results = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        results = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!results.canceled) {
        await saveImage(results.assets[0].uri);
      }
    } catch (error) {
      alert("Error uploading image");
    }
  };

  // save the image
  const saveImage = async (image: string) => {
    try {
      setImageUrl(image);
      handleVisibity();
    } catch (error) {}
  };

  // remove Image

  const removeImage = async () => {
    try {
      saveImage("");
      handleVisibity();
    } catch (error) {
      alert("Error removing image");
    }
  };
  return (
    <ScreenLayout>
      <View style={styles.backbutton}>
        <BackButton onpress={() => navigation.goBack()} />
        <Text style={[styles.header, { color: colors.primary }]}>
          Fill Your Profile
        </Text>
        <View></View>
      </View>
      <ScrollView style={styles.container}>
        {/* form */}
        <Formik
          initialValues={{ name: "",email:"", phone: "" }}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, errors }) => (
            <View style={styles.formContainer}>
              <View style={{ alignItems: "center", marginVertical: 30 }}>
                <View style={styles.ImageWraper}>
                  <View style={styles.ImageContainer}>
                    {!imageUri && (
                      <MaterialCommunityIcons
                        color={"#D9D9D9"}
                        name="camera"
                        size={40}
                      />
                    )}
                    {imageUri && (
                      <Image source={{ uri: imageUri }} style={styles.image} />
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.edit}
                    onPress={() => setIsvisible(true)}
                  >
                    <MaterialCommunityIcons
                      color={"#000"}
                      name="pen"
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.name}>Full Names</Text>
              <AppTextInput
                icon=""
                placeholder="Full Names"
                autoCorrect={false}
                onChangeText={handleChange("name")}
                autoCapitalize={"none"}
              />
              {errors.name && (
                <Text style={{ color: "red" }}>{errors.name}</Text>
              )}
              <Text style={styles.name}>Phone Number</Text>
              <PhoneInput
                placeholder="Phone number"
                onChangeText={handleChange("phone")}
                autoCorrect={false}
                handleSelectedCountry={handleSelectedCountry}
              />
              {errors.phone && (
                <Text style={{ color: "red" }}>{errors.phone}</Text>
              )}
              <Text style={styles.name}>email</Text>
              <AppTextInput
                icon="email"
                placeholder="email"
                autoCorrect={false}
                onChangeText={handleChange("name")}
                autoCapitalize={"none"}
              />
              {errors.email && (
                <Text style={{ color: "red" }}>{errors.email}</Text>
              )}
              <Text style={styles.name}>Date of Birth</Text>
              <AppDatePicker handleDateselection={handleDateselection} />
              <View style={styles.button}>
                <Button title="save" onpress={handleSubmit} />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
      <ImageUploadModal
        visible={isVisible}
        handleVisibility={handleVisibity}
        uploadImage={uploadImage}
        removeImage={removeImage}
      />
    </ScreenLayout>
  );
};
const styles = StyleSheet.create({
  backbutton: {
    paddingHorizontal: 10,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  container: {
    paddingTop: 5,
    // alignItems: "center",
    gap: 20,
    flex: 1,
  },
  header: {
    textAlign: "center",
    ...FONTS.h3,
  },
  subHeader: {
    textAlign: "center",
    ...FONTS.body4,
    paddingHorizontal: 40,
  },
  button: {
    flexDirection: "row",
    paddingVertical: 20,
  },
  name: {
    paddingHorizontal: 2,
    ...FONTS.body8,
    fontSize: 12,
    fontWeight: "300",
  },
  formContainer: {
    paddingHorizontal: 5,
  },
  ImageWraper: {
    position: "relative",
    width: 125,
    height: 125,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D9D9D9",
    borderRadius: 100,
  },
  ImageContainer: {
    position: "relative",
    width: 125,
    height: 125,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D9D9D9",
    borderRadius: 100,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  edit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
});

export default PersonalInfo;
