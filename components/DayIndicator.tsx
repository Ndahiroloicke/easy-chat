import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FONTS } from '../constants'

type Props = {
    name:string;
}
const DayIndicator:React.FC<Props> = ({name}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <View style={styles.line}></View>
    </View>
  )
}

export default DayIndicator

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        gap:10,
        paddingVertical:20

    },
    text:{
        ...FONTS.body4,
        fontSize:10,
        opacity:.5
    },
    line:{
        flex:1,
        borderWidth:.8,
        borderColor:"black",
        opacity:.1
    }
})