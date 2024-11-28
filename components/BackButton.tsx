import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../Themes/ThemeProvider";
interface Props {
  onpress: () => void;
}
const BackButton = ({ onpress }: Props) => {
  const { dark } = useTheme();
  return (
    <TouchableOpacity style={styles.button} onPress={onpress}>
      <AntDesign name="arrowleft" size={24} color={dark ? "white" : "black"} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 50,
    alignItems:"center",
    justifyContent: "center",
  },
});
