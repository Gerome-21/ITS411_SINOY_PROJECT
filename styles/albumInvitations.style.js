// styles/albumInvitations.style.ts
import { COLOR } from '@/constants/colorPalette';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.inactive,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLOR.inactive,
  },
  listContainer: {
    padding: 16,
  },
  invitationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  invitationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invitationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  albumName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.text,
    marginBottom: 4,
  },
  invitedBy: {
    fontSize: 14,
    color: COLOR.inactive,
    marginBottom: 2,
  },
  invitedDate: {
    fontSize: 12,
    color: COLOR.inactive,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLOR.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  declineButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLOR.inactive,
    textAlign: 'center',
    lineHeight: 22,
  },
});