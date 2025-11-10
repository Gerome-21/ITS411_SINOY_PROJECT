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
    zIndex: 1000, // Ensure header stays on top
  },
  logo: {
    width: 200, // Slightly smaller for header
    height: 102, // Maintain aspect ratio
  },
});