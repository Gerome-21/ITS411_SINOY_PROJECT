// styles/albumsGrid.style.js
import { COLOR } from '@/constants/colorPalette';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_WIDTH = (width - (CARD_GAP * 5)) / 4; // 4 columns

export const styles = StyleSheet.create({
  gridContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: COLOR.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: COLOR.link,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  albumCardContainer: {
    width: CARD_WIDTH,
    marginBottom: CARD_GAP,
  },
  albumCard: {
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'space-between',
    padding: 0,
  },
  albumImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLOR.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLOR.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  albumIcon: {
    fontSize: 24,
    color: COLOR.secondary
  },
  albumName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    width: '100%',
    color: COLOR.secondary,
  },
  albumCount: {
    fontSize: 10,
    color: COLOR.inactive,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    minHeight: 200,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLOR.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLOR.inactive,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  createMemoryLink: {
    backgroundColor: COLOR.primary,
    justifyContent:'center',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createMemoryLinkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});