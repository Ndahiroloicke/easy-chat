import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import ScreenLayout from "./ScreenLayout";
import BackButton from "../../components/BackButton";
import { COLORS, FONTS, data, images } from "../../constants";
import Button from "../../components/Button";

const FaceScanningScreen = () => {
  return (
    <ScreenLayout>
      <View style={styles.backButton}>
        <BackButton onpress={() => {}} />
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Face Verification</Text>
        <Text style={styles.subHeader}>
          Let's Verify your face...
        </Text>
        <View style={styles.imageContainer}>
            <Image source={images.facerec} style={styles.image} resizeMode="contain"/>
        </View>
      </View>
      <View style={styles.button}>
        <Button title="Continue" onpress={()=>{}}/>
      </View>
    </ScreenLayout>
  );
};

export default FaceScanningScreen;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
  },
  button:{flexDirection:"row",marginBottom:10000},
  mainContainer: {
    flex:1,
  },
  header: {
    ...FONTS.h4,
    color: COLORS.primary,
    textAlign: "center",
  },
  subHeader: {
    ...FONTS.body4,
    fontSize: 12,
    textAlign: "center",
  },
  imageContainer:{
    width:300,
    height:300,
    overflow:"hidden",
  },
  image:{
    width:"100%",
    height:"100%",
  }
});
