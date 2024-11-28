import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AmountDepositScreen from "../screens/Deposit/AmountDepositScreen";
import DepositMethodScreen from "../screens/Deposit/DepositMethodScreen";
import DepositSuccessScreen from "../screens/Deposit/DepositSuccessScreen";
import { DepositStackNavigatorParamList } from "../constants/types";
import DepositPreviewScreen from "../screens/Deposit/DepositPreviewScreen";

const Stack = createNativeStackNavigator<DepositStackNavigatorParamList>();

const DepositNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="AmountDeposit">
        <Stack.Screen name="AmountDeposit" component={AmountDepositScreen}/>
        <Stack.Screen name="DepositMethod" component={DepositMethodScreen}/>
        <Stack.Screen name="DepositPreview" component={DepositPreviewScreen}/>
        <Stack.Screen name="DepositSuccess" component={DepositSuccessScreen}/>
    </Stack.Navigator>
  )
}

export default DepositNavigator;
