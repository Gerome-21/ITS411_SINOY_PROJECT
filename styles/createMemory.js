// styles/createMemory.ts
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
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'left',
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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
  dropdown: {
    borderWidth: 1,
    borderColor: COLOR.primary,
    borderRadius: 8,
    padding: 12,
  },
  modal: {
    position: 'absolute',
    top: 380,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    maxHeight: 250, // a little taller for better view
  },
  albumOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  mediaButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  mediaButton: {
    padding: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mediaItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  mediaPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity:0.5
  },
  removeMedia: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
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
  createAlbumButton: {
  borderWidth: 1,
  borderColor: COLOR.primary,
  borderRadius: 8,
  padding: 12,
  marginTop: 8,
  backgroundColor: 'transparent',
},
createAlbumButtonText: {
  color: COLOR.primary,
  textAlign: 'center',
  fontWeight: '600',
},
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  backgroundColor: 'white',
  borderRadius: 10,
  width: '85%',
  maxHeight: 400,
  borderWidth: 1,
  borderColor: '#ddd',
  overflow: 'hidden',
},
albumScroll: {
  maxHeight: 400,
},

});