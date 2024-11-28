import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

export const COLORS = {
  primary: "#6347FE",
  yellow: "#FCA01F",
  blue: "#3D5CA6",
  secondaryBlue: "#59E0F1",
  white: "#FFFFFF",
  black: "#93999B",
  secondaryBlack: "#000000cc",
  tertiaryBlack: "#00000080",
  gray: "#E7E3F8",
  danger: "#ff0000",
  secondaryGray: "#788995",
};

export const SIZES = {
  // Global SIZES
  base: 8,
  font: 14,
  radius: 10,
  padding: 8,
  padding2: 12,
  padding3: 16,

  // FONTS Sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // App Dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: "black",
    fontSize: SIZES.largeTitle,
    lineHeight: 50,
  },
  h1: { fontFamily: "Bold", fontSize: SIZES.h1 },
  h2: { fontFamily: "Bold", fontSize: SIZES.h2 },
  h3: { fontFamily: "Bold", fontSize: SIZES.h3 },
  h4: { fontFamily: "Bold", fontSize: SIZES.h4 },
  body1: { fontFamily: "Regular", fontSize: SIZES.body1 },
  body2: { fontFamily: "Regular", fontSize: SIZES.body2 },
  body3: { fontFamily: "Regular", fontSize: SIZES.body3 },
  body4: { fontFamily: "Regular", fontSize: SIZES.body4 },
  body5: { fontFamily: "Semibold", fontSize: SIZES.body1 },
  body6: { fontFamily: "Semibold", fontSize: SIZES.body2 },
  body7: { fontFamily: "Semibold", fontSize: SIZES.body3 },
  body8: { fontFamily: "Semibold", fontSize: SIZES.body4 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
