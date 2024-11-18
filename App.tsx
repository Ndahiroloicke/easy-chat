import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootNavigator from "./Navigation/RootNavigator";

async function handleStoredUserAuth() {
  const storedUser = await getUserData();
  if (storedUser && storedUser.authToken) {
    try {
      const password = await AsyncStorage.getItem("userPassword");
      await signInWithEmailAndPassword(auth, storedUser.email, password as string);
      return auth.currentUser;
    } catch (error: any) {
      console.error("Error during re-authentication:", error.message);
      return null;
    }
  }
  return null;
}

export default function App() {
  const [fontsLoaded] = useFonts(FONTS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Try to restore the session if user is null
        const restoredUser = await handleStoredUserAuth();
        if (!restoredUser) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
      }
      
      try {
        const userData = await getUserData();
        setIsAuthenticated(!!userData);
      } catch (error) {
        console.error("Error getting user data:", error);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <NavigationContainer>
          {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
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
