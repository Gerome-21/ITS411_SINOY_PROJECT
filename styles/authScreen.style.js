import { StyleSheet } from "react-native";
import { COLOR } from "../constants/colorPalette";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLOR.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300, 
    height: 102, 
  },
  titleImageContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleImage: {
    width: '80%', 
    height: 136, 
    maxWidth: 270, 
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: 'black',
    fontSize: 16,
    elevation: 4,
    shadowColor: COLOR.primary
  },
  button: {
    backgroundColor: COLOR.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchContainer: {
    alignItems: 'center',
    padding: 10,
  },
  switchText: { 
    textAlign: 'center', 
    color: COLOR.inactive,
    fontSize: 14,
  },
});