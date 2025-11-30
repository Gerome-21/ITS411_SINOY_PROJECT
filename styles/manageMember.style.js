// styles/manageMembers.style.ts
import { COLOR } from '@/constants/colorPalette';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },

  scrollArea: {
    padding: 20,
  },

  albumInfo: {
    backgroundColor: COLOR.primary,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.inactive,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 25,
  },

  albumName: {
    fontSize: 25,
    fontWeight: '700',
    color: COLOR.background,
  },

  albumId: {
    marginTop: 6,
    fontSize: 14,
    color: COLOR.inactive,
  },

  // Add Member
  addMemberSection: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: COLOR.inactive,
    marginBottom: 14,
    lineHeight: 20,
  },

  addMemberForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  emailInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLOR.primary,
    fontSize: 15,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLOR.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  addButtonDisabled: {
    opacity: 0.6,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: '600',
    fontSize: 15,
  },

  membersSection: {
    marginTop: 10,
  },

  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.inactive,
    marginBottom:8,
  },

  memberInfo: {
    flex: 1,
  },

  memberEmail: {
    fontSize: 12,
    fontWeight: '600',
    color: COLOR.secondary,
  },

  memberName: {
    fontSize: 10,
    color: COLOR.inactive,
    marginTop: 2,
  },

  removeButton: {
    padding: 6,
  },

  ownerBadge: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },

  ownerBadgeText: {
    color: COLOR.primary,
    fontWeight: '600',
    fontSize: 12,
  },

  emptyMembers: {
    alignItems: 'center',
    paddingVertical: 35,
  },

  emptyMembersText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    color: COLOR.inactive,
  },

  emptyMembersSubtext: {
    fontSize: 13,
    color: COLOR.inactive,
    marginTop: 4,
  },

  // Information box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.primary,
    marginTop: 30,
    marginBottom:60
  },

  infoContent: {
    marginLeft: 10,
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLOR.primary,
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    color: COLOR.inactive,
    lineHeight: 19,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: COLOR.inactive,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },

  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLOR.primary,
    borderRadius: 12,
  },

  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  albumDetails: {
    marginTop: 12,
  },

  albumDetail: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR.secondary,
    marginBottom: 4,
  },

  albumDetailValue: {
    fontWeight: '500',
    color: COLOR.primary,
  },

  ownerLabel: {
    marginTop: 4,
    backgroundColor: COLOR.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    color: COLOR.background,
    fontWeight: '600',
    fontSize: 12,
  },

  // Pending Invitations
  pendingSection: {
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLOR.inactive,
  },

  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor:COLOR.background,
    borderRadius: 5,
    marginBottom:4
  },

  pendingEmail: {
    fontSize: 12,
    color: COLOR.inactive,
    fontWeight: '500',
  },

  removePendingButton: {
    padding: 6,
    borderRadius: 8,
  },

  noPendingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLOR.inactive,
    textAlign: 'center',
  },
  emptyStateSubtext:{
    color: COLOR.primary,
    fontSize: 14
  },
  currentUserLabel:{
    fontSize: 14,
    color: COLOR.primary
  },
  noPendingText: {
    fontSize: 14,
    color: COLOR.inactive,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingName: {
    fontSize: 10,
    color: COLOR.inactive,
    marginTop: 2,
  },
  removeMemberButton: {
    padding: 4,
  },
  });
