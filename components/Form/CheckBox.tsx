import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { images, FONTS, COLORS } from "../../constants";

interface Props {
  text: string;
}
const TermsAndServices: React.FC<Props> = ({ text }) => {
  return (
    <View style={styles.check}>
      <BouncyCheckbox
        fillColor={COLORS.primary}
        textStyle={[FONTS.body8, { textDecorationLine: "none",fontSize:12 }]}
        text={text}
        onPress={(isChecked) => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  check: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    ...FONTS.body8,
  },
});

export default TermsAndServices;
