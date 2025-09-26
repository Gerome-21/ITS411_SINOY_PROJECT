// styles/homepage.ts
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;
const CARD_WIDTH = (width - (CARD_GAP * 4)) / 3;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  albumsGrid: {
    paddingBottom: 20,
  },
  albumCardContainer: {
    width: CARD_WIDTH,
    marginBottom: CARD_GAP,
  },
  albumCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  albumImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  albumIcon: {
    fontSize: 20,
  },
  albumName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    width: '100%',
  },
  albumCount: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  createMemoryLink: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  createMemoryLinkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  homeLink: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  homeLinkText: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 16,
  },
});