import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, FONTS, COLORS } from "../../constants";
import DayIndicator from "../../components/DayIndicator";
import { useTheme } from "../../Themes/ThemeProvider";
import SettingsComponent from "../../components/GeneralSettings/SettingsComponent";
import { useNavigation } from "@react-navigation/native";
import { AccountScreenNavigatorProps } from "../../constants/types";
import routes from "../../Navigation/routes";
import useUserStore from "../../Store/UserStore";

const AccountScreen = () => {
  const { colors } = useTheme();
  const clearUser = useUserStore((state) => state.clearUser);

  const navigation = useNavigation<AccountScreenNavigatorProps>();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image
            source={images.logo}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.header}>Account</Text>
        <View></View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* profile Container */}
        <TouchableOpacity
          style={styles.ProfileContainer}
          onPress={() => navigation.navigate(routes.PERSONALINFO)}
        >
          <View style={styles.profile}>
            <View style={styles.imageContainer}>
              <Image
                source={images.user}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>Philip Martin</Text>
              <Text style={styles.email}>philipmartin@gmail.com</Text>
            </View>
          </View>

          <View style={styles.edit}>
            <MaterialCommunityIcons
              name="pen"
              size={24}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>

        <DayIndicator name="General" />

        <View style={styles.generalSettings}>
          <SettingsComponent
            name="Payment Methods"
            icon={""}
            onpress={() => {}}
          />
          <SettingsComponent
            name="Personal Info"
            icon={""}
            onpress={() => {}}
          />
          <SettingsComponent name="Notification" icon={""} onpress={() => {}} />
          <SettingsComponent name="Security" icon={""} onpress={() => {}} />
          <SettingsComponent name="Language" icon={""} onpress={() => {}} />
          <SettingsComponent name="Dark Mode" icon={""} onpress={() => {}} />
        </View>

        <DayIndicator name="About" />
        <SettingsComponent name="Help Center" icon={""} onpress={() => {}} />
        <SettingsComponent name="Privacy policy" icon={""} onpress={() => {}} />
        <SettingsComponent
          name="About Binexopay"
          icon={""}
          onpress={() => {}}
        />
        <SettingsComponent name="invite Friends" icon={""} onpress={() => {}} />
        <TouchableOpacity
          style={styles.logout}
          onPress={() => {
            clearUser();
            navigation.navigate(routes.LOGIN);
          }}
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    width: 25,
    height: 30,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  header: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginRight: 10,
  },
  ProfileContainer: {
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    flexDirection: "row",
    gap: 15,
  },
  imageContainer: {
    width: 55,
    height: 55,
  },
  userInfo: {
    justifyContent: "space-around",
  },
  username: {
    ...FONTS.h4,
  },
  email: {
    ...FONTS.body4,
    fontSize: 12,
  },
  edit: {
    justifyContent: "center",
    alignItems: "center",
  },
  generalSettings: {},
  logout: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
    paddingTop: 30,
  },
  logoutText: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.primary,
  },
});
