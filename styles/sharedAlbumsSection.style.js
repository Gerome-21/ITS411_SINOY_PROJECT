// styles/sharedAlbumsSection.style.ts
import { COLOR } from '@/constants/colorPalette';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_WIDTH = (width - (CARD_GAP * 5)) / 4;

export const styles = StyleSheet.create({
  sectionContainer: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLOR.primary,
  },
  refreshButton: {
    backgroundColor: COLOR.background,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR.primary,
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
    position: 'relative',
  },
  albumIcon: {
    fontSize: 22,
    color: COLOR.secondary
  },
  ownerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    color: COLOR.secondary,
  },
  membersCount: {
    fontSize: 8,
    color: COLOR.link,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: COLOR.inactive,
    textAlign: 'center',
  },
  emptyState: {
    paddingVertical: 30,
    alignItems: 'center',
    minHeight: 150,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLOR.secondary,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 12,
    color: COLOR.inactive,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  emptyStateButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  secondaryButton: {
    backgroundColor: COLOR.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.primary,
  },
  secondaryButtonText: {
    color: COLOR.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  ownerText:{
    color: COLOR.primary,
    fontSize: 14
  }
});