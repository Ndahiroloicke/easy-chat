import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import routes from "../../Navigation/routes";
import { useTheme } from "../../Themes/ThemeProvider";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import ImageUploadModal from "../../components/ImageUploadModal";
import { COLORS, FONTS } from "../../constants";
import { AuthScreenNavigatorProps } from "../../constants/types";
import ScreenLayout from "./ScreenLayout";

const { width, height } = Dimensions.get("window");
const IDPreviewScreen = () => {
  const { colors } = useTheme();

  const navigation = useNavigation<AuthScreenNavigatorProps>();

  const [imageUri, setImageUrl] = useState<string>("");
  const [isVisible, setIsvisible] = useState(false);

  const handleVisibity = () => {
    setIsvisible(false);
  };

  // uploading the images
  const uploadIdImage = async (mode?: string) => {
    try {
      let results: ImagePicker.ImagePickerResult;

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        results = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        results = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [4, 3],
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
      </View>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>
          Photo ID card 🪪
        </Text>
        <Text style={styles.subHeader}>
          Retake the photo or ‘Continue’ if you are sure.
        </Text>
        <View style={styles.IDcontainer}>
          <View style={styles.title}>
            <Text style={styles.idtitle}>IDENTIFICATION CARD</Text>
          </View>
          <View style={styles.idImageContainer}>
            {imageUri ? (
              <>
                <Image
                  source={{ uri: imageUri }}
                  resizeMode="contain"
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => removeImage()}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.upload}
                onPress={() => setIsvisible(true)}
              >
                <MaterialCommunityIcons
                  name="arrow-up-bold-circle"
                  size={30}
                  color={COLORS.primary}
                />
                <Text style={styles.subHeader}>Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={styles.separator}></View>
        <View style={styles.buttonContainer}>
          <Button title="Continue" onpress={() => navigation.navigate(routes.FaceScanning)} />
        </View>
      </View>
      <ImageUploadModal
        visible={isVisible}
        handleVisibility={handleVisibity}
        uploadImage={uploadIdImage}
        removeImage={removeImage}
      />
    </ScreenLayout>
  );
};
const styles = StyleSheet.create({
  backbutton: {
    paddingHorizontal: 10,
  },
  container: {
    paddingTop: 5,
    alignItems: "center",
    gap: 30,
    flex: 1,
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
  IDcontainer: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: width * 0.85,
  },
  title: {
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  idtitle: {
    textAlign: "center",
    ...FONTS.body4,
    opacity: 0.8,
  },
  idImageContainer: {
    padding: 5,
    height: height * 0.3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  upload: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.black,
    opacity: 0.1,
  },
  delete: {
    position: "absolute",
    padding: 15,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
});

export default IDPreviewScreen;
