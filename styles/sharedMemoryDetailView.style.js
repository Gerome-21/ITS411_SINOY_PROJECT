// styles/sharedMemoryDetailView.style.js
import { COLOR } from '@/constants/colorPalette';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.secondary,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  mediaGallery: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mediaItem: {
    marginRight: 12,
    position: 'relative',
  },
  galleryImage: {
    width: width - 32,
    height: 250,
    borderRadius: 12,
  },
  videoPlaceholder: {
    width: width - 32,
    height: 250,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: 8,
    fontSize: 14,
    color: COLOR.inactive,
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR.secondary,
    flex: 1,
    marginRight: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.primary,
  },
  deleteHeaderButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  authorSection: {
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorText: {
    fontSize: 14,
    color: COLOR.inactive,
    fontStyle: 'italic',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLOR.secondary,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: COLOR.inactive,
  },
  feelingSection: {
    marginBottom: 16,
  },
  feelingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  feelingEmoji: {
    fontSize: 16,
  },
  feelingText: {
    fontSize: 14,
    color: COLOR.secondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  albumSection: {
    marginBottom: 16,
  },
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  albumText: {
    fontSize: 14,
    color: COLOR.inactive,
  },
  createdDateContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  createdDateLabel: {
    fontSize: 12,
    color: COLOR.inactive,
    textAlign: 'center',
  },
});