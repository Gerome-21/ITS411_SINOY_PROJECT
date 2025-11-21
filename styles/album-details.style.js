// styles/album-details.style.ts
import { COLOR } from '@/constants/colorPalette';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  albumHeader: {
    backgroundColor: COLOR.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR.secondary,
    marginBottom: 5,
  },
  memoryCount: {
    fontSize: 16,
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
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  memoryDate: {
    fontSize: 14,
    color: '#666',
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
    color: COLOR.secondary,
  },
  memoryDescription: {
    fontSize: 14,
    color: COLOR.secondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  mediaScrollView: {
    marginBottom: 15,
  },
  mediaContainer: {
    marginRight: 10,
  },
  mediaImage: {
    width: 70,
    height: 70,
    borderRadius: 0,
  },
  videoPlaceholder: {
    width: 90,
    height: 70,
    backgroundColor: '#e9ecef',
    borderRadius: 0,
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
  memoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  albumBadge: {
    fontSize: 12,
    color: COLOR.primary,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  createdDate: {
    fontSize: 10,
    color: COLOR.primary,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerIcon: {
    marginRight: 3,
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
});