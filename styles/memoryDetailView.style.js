// styles/memoryDetailView.style.ts
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
  headerSpacer: {
    width: 24, // Same as close button for balance
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff'
  },
  mediaGallery: {
    maxHeight: 300,
  },
  mediaItem: {
    width: 300,
    height: 300,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLOR.primary,
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
    backgroundColor: COLOR.primary,
  },
  videoText: {
    marginTop: 8,
    color: COLOR.inactive,
    fontSize: 14,
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.text,
    flex: 1,
    marginRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: COLOR.primary + '20',
    borderRadius: 8,
  },
  deleteHeaderButton: {
    padding: 8,
    backgroundColor: '#dc2626' + '20',
    borderRadius: 8,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: COLOR.inactive,
  },
  dateSection: {
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dateText: {
    color: COLOR.inactive,
    fontSize: 12,
    marginLeft: 12,
    fontWeight: '500',
  },
  feelingSection: {
    marginBottom: 5,
  },
  feelingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  feelingEmoji: {
    fontSize: 12,
    marginRight: 8,
  },
  feelingText: {
    color: COLOR.inactive,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  albumSection: {
    marginBottom: 24,
  },
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  albumText: {
    color: COLOR.inactive,
    fontSize: 12,
    marginLeft: 12,
    fontWeight: '500',
  },
  createdDateContainer: {
    borderTopWidth: 1,
    borderTopColor: COLOR.primary,
    paddingTop: 16,
    marginBottom: 24,
  },
  createdDateLabel: {
    color: COLOR.inactive,
    fontSize: 12,
    textAlign: 'center',
  },
});