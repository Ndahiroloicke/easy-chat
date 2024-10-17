import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ContactStackNavigatorParamList } from '../constants/types';
import ContactScreen from '../screens/Contact/ContactScreen';
import ContactPreview from '../screens/Contact/ContactPreview';
import AddContactScreen from '../screens/Contact/AddContactScreen';

const Stack = createNativeStackNavigator<ContactStackNavigatorParamList>();

const ContactNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Contacts'>
        <Stack.Screen name='Contacts' component={ContactScreen}/>
        <Stack.Screen name='ContactPreview' component={ContactPreview}/>
        <Stack.Screen name='AddContact' component={AddContactScreen}/>
    </Stack.Navigator>
  )
}

export default ContactNavigator

const styles = StyleSheet.create({})