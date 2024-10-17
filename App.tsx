import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  onAuthStateChanged,
  User,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";

import AppNavigator from "./Navigation/AppNavigator";
import { ThemeProvider } from "./Themes/ThemeProvider";
import { FONTS } from "./constants/fonts";
import AuthNavigator from "./Navigation/AuthNavigator";
import { auth } from "./utils/firebase.config";
import Toast from "react-native-toast-message";
import { getUserData } from "./utils/AuthStorage";

export default function App() {
  const [fontsLoaded] = useFonts(FONTS);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const checkAuthState = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          setUser(authUser);
          setLoading(false);
        } else {
          const storedUser = await getUserData();
          if (storedUser && storedUser.authToken) {
            try {
              console.log(storedUser);
              await signInWithEmailAndPassword(
                auth,
                storedUser.email,
                storedUser.password as any
              );
              setUser(auth.currentUser);
            } catch (error: any) {
              console.error("Error during re-authentication:", error.message);
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      });
      return () => unsubscribe();
    };
    checkAuthState();
  }, []);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <NavigationContainer>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
