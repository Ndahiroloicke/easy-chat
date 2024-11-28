import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View
} from "react-native";
import { useTheme } from "../../Themes/ThemeProvider";
import { COLORS } from "../../constants";

interface Props extends TextInputProps {
  icon: any;
}
const AppTextInput: React.FC<Props> = ({ icon, ...textInputProps }) => {
  const { colors } = useTheme();

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View style={[styles.inputContainer, isFocused && styles.onfocus]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={COLORS.primary}
        />
      )}
      <TextInput
        placeholderTextColor={COLORS.secondaryGray}
        autoCapitalize="none"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={styles.text}
        {...textInputProps}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    width:"100%",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 13,
    marginVertical: 10,
    fontFamily: "Regular",
    borderWidth: 2,
    borderColor: "#FAFAFA",
  },
  text: {
    fontSize: 18,
    flex:1
  },
  onfocus: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

export default AppTextInput;
