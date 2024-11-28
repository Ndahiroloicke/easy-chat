import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { useTheme } from "../Themes/ThemeProvider";
import { COLORS, images, FONTS } from "../constants";

const { width, height } = Dimensions.get("window");
type Props = {
  item: {
    id: number;
    title: string;
    description: string;
    image: any;
  };
};
const OnboardSlide: React.FC<Props> = ({ item }) => {
  const { colors, dark } = useTheme();
  return (
    <View>
      <View>
        <Image
          source={item.image}
          width={width}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View
        style={[
          styles.container,
          { backgroundColor: dark ? COLORS.black : COLORS.white },
        ]}
      >
        {dark ? (
          <Image
            source={images.imgBlack}
            style={styles.imageback}
            width={width}
          />
        ) : (
          <Image
            source={images.imgBack}
            style={styles.imageback}
            width={width}
          />
        )}
        <View style={styles.contentContainer}>
          <Text style={[styles.header, { color: colors.text }]}>
            {item.title}
          </Text>
          <View style={styles.descContainer}>
            <View style={[styles.ellipse,{left:-60}]}></View>
          <Text style={styles.desc}>{item.description}</Text>
          <View style={[styles.ellipse,{right:-60}]}></View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height,
    position: "relative",
    top: 0,
  },
  container: {
    position: "absolute",
    height: height * 0.45,
    bottom: 0,
    width: width,
  },
  content: {},
  imageback: {
    position: "absolute",
    top: -85,
    width: width,
  },
  header: {
    width:width * .9,
    textAlign: "center",
    ...FONTS.h3,
  },
  contentContainer: {
    paddingVertical: 20,
    alignItems:"center"
  },
  desc: {
    textAlign: "center",
    ...FONTS.body4,
    width:width * .9,
    paddingHorizontal:20,
    opacity: .60,
    zIndex: 1,
    paddingTop:10
  },
  descContainer:{
    position:"relative",
    justifyContent: "center",
  },
  ellipse:{
    width: 90,
    height: 90,
    backgroundColor:COLORS.primary,
    borderRadius:50,
    position: "absolute",
    top: 0,
  }

});

export default OnboardSlide;
