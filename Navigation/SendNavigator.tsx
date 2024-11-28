import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SendToScreen from "../screens/Send/SendToScreen";
import AmountToScreen from "../screens/Send/AmountToScreen";
import DisplaySendInfoScreen from "../screens/Send/DisplaySendInfoScreen";
import SuccessSendScreen from "../screens/Send/SuccessSendScreen";
import { SendStackNavigatorParamList } from "../constants/types";

const Stack = createNativeStackNavigator<SendStackNavigatorParamList>();
const SendNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SendTo" component={SendToScreen} />
      <Stack.Screen name="AmountToSend" component={AmountToScreen} />
      <Stack.Screen name="DisplaySendInfo" component={DisplaySendInfoScreen} />
      <Stack.Screen name="SuccessSend" component={SuccessSendScreen} />
    </Stack.Navigator>
  );
};

export default SendNavigator;
