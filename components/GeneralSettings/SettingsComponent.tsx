import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {FONTS } from "../../constants";

type Props = {
    onpress:()=>void;
    name:string;
    icon:any
}
const SettingsComponent:React.FC<Props> = ({onpress,name,icon}) => {
  return (
    <TouchableOpacity style={styles.mainContainer} onPress={onpress}>
        <View style={styles.container}>
        <MaterialCommunityIcons name={icon} size={24} color={"black"}/>
        <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.icon}>
            <MaterialCommunityIcons name='chevron-right' size={24} color={"black"}/>
        </View>

    </TouchableOpacity>
  )
}

export default SettingsComponent

const styles = StyleSheet.create({
    mainContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:5,
        // marginVertical:5
    },
    container:{
        flexDirection:"row",
        alignItems:"center",
        gap:15,
    },
    icon:{
        justifyContent:"center",
        alignItems:"center",
    },
    name:{
        ...FONTS.h4,
        fontSize:14
    }
})