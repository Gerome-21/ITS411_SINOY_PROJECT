import { Link } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../../styles/homepage'

export default function Albums() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Albums</Text>

      <Link href={"/(tabs)"}>Go to Home page</Link>
      <TouchableOpacity onPress={() => {alert("Hello")}}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  )
}