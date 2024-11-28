import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/Account/AccountScreen";
import { AccoutStackNavigatorParamList } from "../constants/types";
import PersonalInfo from "../screens/Account/PersonalInfo";

const Stack = createNativeStackNavigator<AccoutStackNavigatorParamList>();

const AccountNavigator = ()=>{
    return(
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Account">
            <Stack.Screen name="Account" component={AccountScreen}/>
            <Stack.Screen name="PersonalInfo" component={PersonalInfo}/>
        </Stack.Navigator>
    );
}

export default AccountNavigator;
