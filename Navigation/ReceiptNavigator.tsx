
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReceiptsScreen from '../screens/Receipts/ReceiptsScreen';
import ReceiptDetails from '../screens/Receipts/ReceiptDetails';
import { ReceiptStackNavigatorParamList } from '../constants/types';

const Stack = createNativeStackNavigator<ReceiptStackNavigatorParamList>();

const ReceiptNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Receipts'>
        <Stack.Screen name='Receipts' component={ReceiptsScreen}/>
        <Stack.Screen name='ReceiptsDetails' component={ReceiptDetails}/>
    </Stack.Navigator>
  )
}

export default ReceiptNavigator
