import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../Themes/ThemeProvider'

const AppActivityIndicator = () => {
    const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={colors.primary}/>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        alignItems: "center",
    }
})

export default AppActivityIndicator
