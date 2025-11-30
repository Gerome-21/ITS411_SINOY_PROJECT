// styles/createSharedAlbum.style.js
import { COLOR } from '@/constants/colorPalette';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'left',
    color: COLOR.secondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: COLOR.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: COLOR.secondary,
  },
  infoText: {
    fontSize: 12,
    color: COLOR.inactive,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: COLOR.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});