import { StyleSheet } from "react-native";
import { COLOR } from "../constants/colorPalette";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },

  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },

  button: {
    backgroundColor: COLOR.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});