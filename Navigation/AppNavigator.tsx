import React from "react";
import HomeScreen from "../screens/App/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import routes from "./routes";

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  console.log("Rendering AppNavigator");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={routes.HOME}
    >
      <Stack.Screen
        name={routes.HOME}
        component={HomeScreen}
        options={{ title: "Home" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
