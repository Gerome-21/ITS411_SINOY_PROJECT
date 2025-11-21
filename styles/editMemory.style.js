// styles/editMemory.style.ts
import { COLOR } from '@/constants/colorPalette';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLOR.background
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.text,
  },
  closeButton: {
    padding: 4,
  },
  saveButton: {
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLOR.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.border,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
    color: COLOR.text,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
    color: COLOR.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mediaButtons: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    flex: 1,
  },
  mediaButtonText: {
    color: COLOR.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  mediaGallery: {
    maxHeight: 200,
  },
  mediaItem: {
    width: 150,
    height: 150,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLOR.cardBackground,
  },
  mediaItemContent: {
    width: '100%',
    height: '100%',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.cardBackground,
  },
  videoText: {
    marginTop: 8,
    color: COLOR.inactive,
    fontSize: 14,
  },
  videoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  noMediaText: {
    color: COLOR.inactive,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  dateButtonText: {
    color: COLOR.text,
    fontSize: 16,
  },
  feelingSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  feelingSelectorText: {
    color: COLOR.text,
    fontSize: 16,
  },
  feelingPicker: {
    backgroundColor: COLOR.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
    marginTop: 8,
    maxHeight: 200,
  },
  feelingScrollView: {
    padding: 8,
  },
  feelingOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
  },
  feelingOptionSelected: {
    backgroundColor: COLOR.primary + '20',
  },
  feelingOptionText: {
    fontSize: 16,
    color: COLOR.text,
  },
  albumSelector: {
    marginBottom: 12,
  },
  albumInput: {
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
    color: COLOR.text,
    fontSize: 16,
  },
  albumChips: {
    flexGrow: 0,
  },
  albumChip: {
    backgroundColor: COLOR.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLOR.border,
  },
  albumChipSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  albumChipText: {
    color: COLOR.text,
    fontSize: 14,
  },
  albumChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});