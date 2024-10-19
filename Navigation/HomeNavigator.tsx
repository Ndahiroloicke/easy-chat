import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";

import { HomeStackNavigatorParamList } from "../constants/types";

import FaceRecoScreen from "../screens/Auth/FaceRecoScreen";
import FaceScannerComplete from "../screens/Auth/FaceScannerComplete";

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />

      <Stack.Screen name="FaceScanning" component={FaceRecoScreen} />
      <Stack.Screen name="FaceScanner" component={FaceScannerComplete} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
