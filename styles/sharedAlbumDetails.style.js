// styles/sharedAlbumDetails.style.ts - UPDATED
import { COLOR } from '@/constants/colorPalette';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
 loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: COLOR.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    padding: 4,
  },
  albumHeader: {
    backgroundColor: COLOR.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  albumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.secondary,
    marginBottom: 1,
    marginRight:50
  },
  memoryCount: {
    fontSize: 12,
    color: '#666',
  },
  memoriesList: {
    padding: 20,
  },
  memoryCard: {
    backgroundColor: COLOR.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  memoryInfo: {
    flex: 1,
    marginRight:50
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginRight:20
  },
  memoryAuthor: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  memoryMeta: {
    alignItems: 'flex-end',
  },
  feelingBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: '600',
    color: COLOR.primary,
  },
  memoryDescription: {
    fontSize: 12,
    color: COLOR.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  mediaScrollView: {
    marginBottom: 15,
  },
  mediaContainer: {
    marginRight: 10,
    position: 'relative',
  },
  mediaImage: {
    width: 90,
    height: 70,
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: 90,
    height: 70,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  videoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  videoBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  memoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerIcon: {
    marginRight: 3,
  },
  createdDate: {
    fontSize: 10,
    color: COLOR.primary,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  editButtonText: {
    fontSize: 10,
    color: COLOR.primary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#6c757d',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  createMemoryButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createMemoryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLOR.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  albumHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
  paddingVertical: 18,
  backgroundColor: "#fff",
  borderBottomWidth: 1,
  borderBottomColor: '#e3e3e3',
},

albumHeaderLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flex: 1,
},
albumHeaderText: {
  flexDirection: 'column',
},

albumHeaderRight: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

headerIconButton: {
  padding: 4,
},

});