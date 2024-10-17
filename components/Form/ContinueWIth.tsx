import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS,FONTS } from "../../constants";

const ContinueWith = () => {
  return (
    <View style={styles.continueWith}>
      <View style={styles.line}></View>
      <Text style={styles.text}>or continue with</Text>
      <View style={styles.line}></View>
    </View>
  );
};

const styles = StyleSheet.create({
    continueWith:{
        flexDirection:"row",
        alignItems: "center",
        gap:10,
        paddingHorizontal:20
    },
    line:{
        flex:1,
        height:1,
        backgroundColor:COLORS.secondaryGray,
        marginTop:1,
    },
    text:{
        ...FONTS.body8,
        opacity:0.5,
        fontSize:10
    }
});
export default ContinueWith;
