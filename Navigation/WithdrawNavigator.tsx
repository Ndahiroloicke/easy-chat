import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { WithdrawNavigatorParamList } from "../constants/types";
import WithdrawAmountScreen from "../screens/Withdraw/WithdrawAmountScreen";
import WithdrawMethodScreen from "../screens/Withdraw/WithdrawMethodScreen";
import WithdrawPreviewScreen from "../screens/Withdraw/WithdrawPreviewScreen";
import WithdrawSuccessScreen from "../screens/Withdraw/WithdrawSuccessScreen";
import WithDrawalVerifyFingerPrintScreen from "../screens/Withdraw/VerifyFingerPrint";


const Stack = createNativeStackNavigator<WithdrawNavigatorParamList>();


const WithdrawNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="AmountWithdraw" component={WithdrawAmountScreen}/>
        <Stack.Screen name="WithdrawMethod" component={WithdrawMethodScreen}/>
        <Stack.Screen name="WithdrawPreview" component={WithdrawPreviewScreen}/>
        <Stack.Screen name="WithdrawSuccess" component={WithdrawSuccessScreen}/>
        <Stack.Screen name="WithdrawVerify" component={WithDrawalVerifyFingerPrintScreen}/>
    </Stack.Navigator>
  )
}

export default WithdrawNavigator;