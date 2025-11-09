import { COLOR } from "@/constants/colorPalette";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR.background,
    paddingHorizontal: 20,
    paddingTop: 10, // Account for status bar
    // paddingBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E8E8E8',
    zIndex: 1000, // Ensure header stays on top
    // elevation: 5, // Android shadow
    // shadowColor: '#000', // iOS shadow
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },
  logo: {
    width: 200, // Slightly smaller for header
    height: 102, // Maintain aspect ratio
  },
});