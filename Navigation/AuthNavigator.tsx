import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import { StyleSheet } from 'react-native';
import { AuthStackNavigatorParamList } from '../constants/types';
import CompleteSetupScreen from '../screens/Auth/CompleteSetupScreen';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import IDPreviewScreen from '../screens/Auth/IDPreviewScreen';
import LogInScreen from '../screens/Auth/LogInScreen';
import NewPassword from '../screens/Auth/NewPassword';
import OTPScreen from '../screens/Auth/OTPScreen';
import OnBoardingScreen from '../screens/Auth/OnBoardingScreen';
import ProfileSetupPage from '../screens/Auth/ProfileSetupPage';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import VerifyIntroScreen from '../screens/Auth/VerifyIntroScreen';
import FaceScanningScreen from "../screens/Auth/FaceScanningScreen";
import FaceRecoScreen from "../screens/Auth/FaceRecoScreen";
import FaceScannerComplete from "../screens/Auth/FaceScannerComplete";


const Stack = createNativeStackNavigator<AuthStackNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Welcome'>
        <Stack.Screen name='Welcome' component={OnBoardingScreen}/>
        <Stack.Screen name='Register' component={SignUpScreen}/>
        <Stack.Screen name='Login' component={LogInScreen}/>
        <Stack.Screen name='ForgotPassword' component={ForgotPassword}/>
        <Stack.Screen name='OTPVerify' component={OTPScreen}/>
        <Stack.Screen name='NewPassword' component={NewPassword}/>
        <Stack.Screen name='IdVerification' component={VerifyIntroScreen}/>
        <Stack.Screen name='IDPreview' component={IDPreviewScreen}/>
        <Stack.Screen name="FaceScanning" component={FaceRecoScreen}/>
        <Stack.Screen name="FaceScanner" component={FaceScannerComplete}/>
        <Stack.Screen name='ProfileSetup' component={ProfileSetupPage}/>
        <Stack.Screen name="CompleteAuth" component={CompleteSetupScreen}/>
    </Stack.Navigator>
  )
}

export default AuthNavigator

const styles = StyleSheet.create({})