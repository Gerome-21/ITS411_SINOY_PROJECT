// styles/createSharedMemory.style.ts
import { COLOR } from '@/constants/colorPalette';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },

  scrollArea: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: COLOR.white,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  dateButton: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 12,
  },
  feelingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.primary,
    marginRight: 8,
  },

  feelingButtonSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.background,
  },

  // Media Upload
  mediaButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 10,
  },

  mediaButton: {
    padding: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },

  mediaButtonText: {
    color: COLOR.primary,
    fontWeight: '600',
  },

  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    gap: 12,
  },

  mediaItem: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLOR.inactive,
  },

  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.inactive,
  },

  removeMedia: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: -2,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feelingButtonText:{
    color: COLOR.secondary,
    fontSize: 12
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLOR.background,
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
});
