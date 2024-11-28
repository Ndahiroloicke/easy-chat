import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONTS, COLORS } from "../constants";

interface Props {
  title: string;
  onpress: () => void;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({
  title,
  onpress,
  outline,
  loading = false,
  disabled = false,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => !loading && !disabled && onpress()}
        style={[
          styles.button,
          outline ? { backgroundColor: COLORS.white } : null,
          disabled ? styles.disabledButton : null,
        ]}
        disabled={disabled}
      >
        <Text style={[styles.text, outline ? { color: COLORS.primary } : null]}>
          {loading ? "Loading..." : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray,
  },
  text: {
    ...FONTS.body8,
    color: COLORS.white,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
});
