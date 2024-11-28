import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import ScreenLayout from "./ScreenLayout";
import { useTheme } from "../../Themes/ThemeProvider";
import { images, FONTS, COLORS } from "../../constants";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { AuthScreenNavigatorProps } from "../../constants/types";
import ImageUploadModal from "../../components/ImageUploadModal";
import routes from "../../Navigation/routes";

const { width, height } = Dimensions.get("window");

const FaceRecoScreen = () => {
  const { dark, colors } = useTheme();
  const navigation = useNavigation<AuthScreenNavigatorProps>();

  const [imageUri, setImageUrl] = useState<string>("");
  const [isVisible, setIsvisible] = useState(false);
  const handleVisibity = () => {
    setIsvisible(false);
  };

  // uploading image

  const uploadImage = async (mode?: string) => {
    try {
      let results: ImagePicker.ImagePickerResult;

      await ImagePicker.requestCameraPermissionsAsync();
      results = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

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
      navigation.navigate(routes.FaceScanner);
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
      </View>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          Face Verification
        </Text>
        <Text style={styles.subHeader}>
          Let's verify your face
        </Text>
        <View style={styles.imageContainer}>
          <Image source={images.facerec} resizeMode="contain" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Continue" onpress={() => setIsvisible(true)} />
        </View>
      </View>
      <ImageUploadModal
        visible={isVisible}
        handleVisibility={handleVisibity}
        uploadImage={uploadImage}
        removeImage={removeImage}
      />
    </ScreenLayout>
  );
};

export default FaceRecoScreen;

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
