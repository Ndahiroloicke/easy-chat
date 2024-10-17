import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppModal from "./AppModal";
import { useTheme } from "../Themes/ThemeProvider";
import { COLORS, FONTS } from "../constants";

type Props = {
  visible: boolean;
  handleVisibility: () => void;
  uploadImage: (mode?: string) => Promise<void>;
  removeImage: () => Promise<void>;
};
const ImageUploadModal: React.FC<Props> = ({
  visible,
  handleVisibility,
  uploadImage,
  removeImage
}) => {
  const { dark } = useTheme();
  return (
    <AppModal visible={visible} handleVisibility={handleVisibility}>
      <View
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.black : COLORS.white },
        ]}
      >
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => uploadImage()}
        >
          <MaterialCommunityIcons
            name="camera"
            size={24}
            color={COLORS.primary}
          />
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => uploadImage("gallery")}
        >
          <MaterialCommunityIcons
            name="camera-burst"
            size={24}
            color={COLORS.primary}
          />
          <Text>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={()=>removeImage()}>
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={COLORS.primary}
          />
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </AppModal>
  );
};

export default ImageUploadModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  text: {
    ...FONTS.body8,
  },
});
