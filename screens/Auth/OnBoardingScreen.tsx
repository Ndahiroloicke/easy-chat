import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants";
import { AuthScreenNavigatorProps } from "../../constants/types";
import routes from "../../Navigation/routes";

const { width, height } = Dimensions.get("window");

const OnBoardingScreen = () => {
  const navigation = useNavigation<AuthScreenNavigatorProps>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <View style={styles.nameContainer}>
            <Text style={[styles.name, styles.nameYellow]}>Esy</Text>
            <Text style={[styles.name, styles.nameBlue]}>Chat</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.link}>Contact Us</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.link}>Call Us</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(routes.REGISTER)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginVertical: 10,
    fontSize: 50,
    fontWeight: "bold",
  },
  nameYellow: {
    color: COLORS.yellow,
    marginRight: 5,
  },
  nameBlue: {
    color: COLORS.blue,
  },
  link: {
    fontSize: 16,
    color: COLORS.primary,
    marginVertical: 5,
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
  },
});
