// styles/album-details.style.ts
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  albumHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  memoryCount: {
    fontSize: 16,
    color: '#666',
  },
  memoriesList: {
    padding: 10,
  },
  memoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: '600',
    color: '#007bff',
  },
  memoryDescription: {
    fontSize: 14,
    color: '#555',
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
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: 200,
    height: 150,
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
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  createdDate: {
    fontSize: 11,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
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
    backgroundColor: '#28a745',
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