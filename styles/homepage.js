import { StyleSheet } from "react-native"
import { COLOR } from "../constants/colorPalette"

export const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR.background
  },
  title:{
    fontSize: 50,
    color: COLOR.primary,
    fontWeight:"bold"
  }
})