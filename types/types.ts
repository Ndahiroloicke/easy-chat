import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
  Home: undefined;
  OnBoarding: undefined;
};

export type AuthScreenNavigatorProps = NativeStackNavigationProp<RootStackParamList>;