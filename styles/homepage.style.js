import { COLOR } from "@/constants/colorPalette";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    padding:5
  },
  // scrollView: {
  //   flex: 1,
  // },
  // scrollContent: {
  //   padding: 20,
  //   paddingTop: 120, // Space for fixed header
  //   paddingBottom: 100,
  //   flexGrow: 1,
  //   gap: 30
  // },
  // contentPlaceholder: {
  //   marginTop: 20,
  //   padding: 20,
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 10,
  //   minHeight: 400,
  //   alignItems: 'center',
  // },
});