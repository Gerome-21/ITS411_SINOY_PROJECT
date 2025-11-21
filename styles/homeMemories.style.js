// styles/homeMemories.style.ts
import { COLOR } from '@/constants/colorPalette';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingTop: 100,
    paddingBottom: 50,
    flexGrow: 1,
    gap: 30
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
  header: {
    backgroundColor: COLOR.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
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
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.inactive,
    marginBottom: 25,
    paddingLeft: 10,
  },
  anniversarySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  memoryCard: {
    backgroundColor: COLOR.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLOR.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  anniversaryCard: {
    backgroundColor: COLOR.background,
    borderWidth: 2,
    borderColor: COLOR.primary,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  anniversaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: 'center',
  },
  anniversaryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.primary,
    marginHorizontal: 6,
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
  anniversaryTitle: {
    color: COLOR.secondary,
    fontSize: 20,
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
  anniversaryFeeling: {
    backgroundColor: '#fff',
    color: COLOR.primary,
  },
  memoryDescription: {
    fontSize: 12,
    color: COLOR.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  anniversaryDescription: {
    color: COLOR.secondary,
    fontSize: 14,
    lineHeight: 20
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
    borderTopColor: '#fff',
    paddingTop: 10,
  },
  albumBadge: {
    fontSize: 10,
    color: COLOR.primary,
    backgroundColor: '#fff',
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
  anniversaryFooterText: {
    backgroundColor: '#FFF',
    color: COLOR.primary,
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
    backgroundColor: COLOR.secondary,
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
  emptyStateContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  marginTop: 50,
},

});