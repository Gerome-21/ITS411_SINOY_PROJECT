// app/components/ManageMembers.tsx - COMPLETELY FIXED
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where
} from '@react-native-firebase/firestore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/manageMember.style';
import { AlbumInvitation, SharedAlbum } from '../../types/memory';
import AppHeader from './appHeader';

export default function ManageMembers() {
  const { albumDocId, albumName } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  
  const [sharedAlbum, setSharedAlbum] = useState<SharedAlbum | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<AlbumInvitation[]>([]);
  const [acceptedMembersDetails, setAcceptedMembersDetails] = useState<any[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (albumDocId) {
      loadSharedAlbum();
    }
  }, [albumDocId]);

  const loadSharedAlbum = async () => {
    if (!albumDocId) return;

    try {
      const albumRef = doc(db, 'sharedAlbums', albumDocId as string);
      const albumDoc = await getDoc(albumRef);

      if (albumDoc.exists()) {
        const data = albumDoc.data();
        const loadedAlbum = {
          id: albumDoc.id,
          ...data
        } as SharedAlbum;

        setSharedAlbum(loadedAlbum);
        
        // Load additional data
        await Promise.all([
          loadPendingInvitations(loadedAlbum.id!),
          loadAcceptedMembersDetails(loadedAlbum.acceptedMembers || [])
        ]);
      } else {
        Alert.alert('Error', 'Album not found');
        router.back();
      }
    } catch (error: any) {
      console.log('Error loading album:', error);
      Alert.alert('Error', 'Failed to load album details');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingInvitations = async (albumDocId: string) => {
    try {
      const invitationsQuery = query(
        collection(db, 'albumInvitations'),
        where('albumDocId', '==', albumDocId),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(invitationsQuery);
      const invitations: AlbumInvitation[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        invitations.push({
          id: doc.id,
          ...data
        } as AlbumInvitation);
      });
      
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Error loading pending invitations:', error);
    }
  };

  const loadAcceptedMembersDetails = async (acceptedMemberIds: string[]) => {
    try {
      if (acceptedMemberIds.length === 0) {
        setAcceptedMembersDetails([]);
        return;
      }

      const membersDetails = await Promise.all(
        acceptedMemberIds.map(async (memberId) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', memberId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                id: memberId,
                email: userData.email,
                name: userData.name || 'User'
              };
            }
            return null;
          } catch (error) {
            console.error('Error loading user details:', error);
            return null;
          }
        })
      );

      // Filter out null values and the owner (if present)
      const validMembers = membersDetails.filter(
        member => member && member.id !== sharedAlbum?.ownerId
      ) as any[];
      
      setAcceptedMembersDetails(validMembers);
    } catch (error) {
      console.error('Error loading accepted members details:', error);
    }
  };

  const findUserByEmail = async (email: string) => {
    try {
      console.log('Looking for user with email:', email);
      
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email.toLowerCase().trim())
      );
      
      const snapshot = await getDocs(usersQuery);
      
      if (snapshot.empty) {
        console.log('No user found with email:', email);
        return null;
      }
      
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      
      console.log('Found user data:', userData);
      
      return { 
        id: userDoc.id, 
        email: userData.email,
        name: userData.name || userData.displayName || 'User'
      };
    } catch (error: any) {
      console.error('Error finding user by email:', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Permission Error', 'Cannot search users. Please check Firestore rules.');
      }
      return null;
    }
  };

  const inviteMember = async () => {
    if (!newMemberEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!sharedAlbum) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if email is already in invited emails
    if (sharedAlbum.invitedEmails?.includes(newMemberEmail)) {
      Alert.alert('Error', 'This email has already been invited');
      return;
    }

    setAddingMember(true);

    try {
      // Find user by email
      const user = await findUserByEmail(newMemberEmail);
      
      if (!user) {
        Alert.alert('User Not Found', 'No user found with this email address. They need to have an account in the app first.');
        return;
      }

      // Check if user is already an accepted member
      if (sharedAlbum.acceptedMembers?.includes(user.id)) {
        Alert.alert('Already Member', 'This user is already a member of this album.');
        return;
      }

      // Check if user has any pending invitation (more comprehensive check)
      const existingInvitationQuery = query(
        collection(db, 'albumInvitations'),
        where('albumDocId', '==', sharedAlbum.id),
        where('invitedUserId', '==', user.id),
        where('status', 'in', ['pending', 'accepted']) // Check both pending and accepted
      );
      
      const existingInvitationSnapshot = await getDocs(existingInvitationQuery);
      if (!existingInvitationSnapshot.empty) {
        const existingInvitation = existingInvitationSnapshot.docs[0].data() as AlbumInvitation;
        if (existingInvitation.status === 'pending') {
          Alert.alert('Error', 'This user already has a pending invitation');
          return;
        } else if (existingInvitation.status === 'accepted') {
          Alert.alert('Error', 'This user has already accepted an invitation to this album');
          return;
        }
      }

      // Get current user's actual name from Firestore
      const currentUserName = await getUserName(auth.currentUser!.uid);

      // Add to invited emails in shared album
      const albumRef = doc(db, 'sharedAlbums', sharedAlbum.id!);
      await updateDoc(albumRef, {
        invitedEmails: arrayUnion(newMemberEmail)
      });

      // Create invitation
      await addDoc(collection(db, 'albumInvitations'), {
        albumDocId: sharedAlbum.id,
        albumId: sharedAlbum.albumId,
        albumName: sharedAlbum.name,
        ownerId: auth.currentUser!.uid,
        ownerEmail: auth.currentUser!.email,
        ownerName: currentUserName,
        invitedUserId: user.id,
        invitedUserEmail: newMemberEmail,
        invitedUserName: user.name,
        status: 'pending',
        createdAt: new Date()
      });

      Alert.alert('Success', `${newMemberEmail} has been invited to the album!`);
      setNewMemberEmail('');
      
      // Reload all data
      await loadSharedAlbum();

    } catch (error: any) {
      console.error('Error inviting member:', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Permission Denied', 'You do not have permission to invite members to this album.');
      } else {
        Alert.alert('Error', 'Failed to invite member: ' + error.message);
      }
    } finally {
      setAddingMember(false);
    }
  };

  const getUserName = async (userId: string): Promise<string> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.name || 'User';
      }
      return 'User';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'User';
    }
  };

  const removePendingInvitation = async (invitation: AlbumInvitation) => {
    if (!sharedAlbum) return;

    Alert.alert(
      'Cancel Invitation',
      `Cancel invitation for ${invitation.invitedUserEmail}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove from invited emails in shared album
              const albumRef = doc(db, 'sharedAlbums', sharedAlbum.id!);
              await updateDoc(albumRef, {
                invitedEmails: arrayRemove(invitation.invitedUserEmail)
              });

              // Delete the invitation document
              await deleteDoc(doc(db, 'albumInvitations', invitation.id!));

              Alert.alert('Success', 'Invitation cancelled');
              await loadSharedAlbum();

            } catch (error: any) {
              console.log('Remove invitation error:', error);
              Alert.alert('Error', 'Failed to cancel invitation');
            }
          }
        }
      ]
    );
  };

  const removeAcceptedMember = async (member: any) => {
    if (!sharedAlbum) return;

    // Prevent owner from removing themselves
    if (member.id === auth.currentUser?.uid) {
      Alert.alert('Error', 'You cannot remove yourself as the owner.');
      return;
    }

    Alert.alert(
      'Remove Member',
      `Remove ${member.name} (${member.email}) from the folder? This will revoke their access immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const albumRef = doc(db, 'sharedAlbums', sharedAlbum.id!);

              // Remove from accepted members
              await updateDoc(albumRef, {
                acceptedMembers: arrayRemove(member.id),
                membersCount: Math.max(1, (sharedAlbum.membersCount || 1) - 1)
              });

              // Remove from invited emails if present
              if (sharedAlbum.invitedEmails?.includes(member.email)) {
                await updateDoc(albumRef, {
                  invitedEmails: arrayRemove(member.email)
                });
              }

              // Update any existing invitations for this user to declined
              const userInvitationsQuery = query(
                collection(db, 'albumInvitations'),
                where('albumDocId', '==', sharedAlbum.id),
                where('invitedUserId', '==', member.id),
                where('status', '==', 'accepted')
              );
              
              const userInvitationsSnapshot = await getDocs(userInvitationsQuery);
              const updatePromises = userInvitationsSnapshot.docs.map((invitationDoc: { id: string; }) => 
                updateDoc(doc(db, 'albumInvitations', invitationDoc.id), {
                  status: 'declined',
                  respondedAt: new Date()
                })
              );
              
              await Promise.all(updatePromises);

              Alert.alert('Success', `${member.name} has been removed from the folder.`);
              await loadSharedAlbum();

            } catch (error: any) {
              console.log('Remove member error:', error);
              Alert.alert('Error', 'Failed to remove member');
            }
          }
        }
      ]
    );
  };

  // Calculate pending invitations count correctly
  const getPendingInvitationsCount = () => {
    if (!sharedAlbum) return 0;
    
    // Pending invitations are those with status 'pending'
    return pendingInvitations.length;
  };

  // Calculate actual members count (owner + accepted members)
  const getActualMembersCount = () => {
    if (!sharedAlbum) return 1;
    
    const acceptedMembersCount = acceptedMembersDetails.length;
    return 1 + acceptedMembersCount; // Owner + accepted members
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Text style={styles.loadingText}>Loading members...</Text>
        </View>
      </View>
    );
  }

  if (!sharedAlbum) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Album not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: `Manage Members - ${albumName}` }} />

        {/* Album Info */}
        <View style={styles.albumInfo}>
          <Text style={styles.albumName}>{sharedAlbum.name}</Text>
        </View>

        {/* Invite Member */}
        <View style={styles.addMemberSection}>
          <Text style={styles.sectionTitle}>Invite New Member</Text>
          <Text style={styles.sectionSubtitle}>
            Add the email of someone you want to invite. They will receive an invitation to accept or decline.
          </Text>

          <View style={styles.addMemberForm}>
            <TextInput
              style={styles.emailInput}
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              placeholder="Enter email address"
              placeholderTextColor={COLOR.inactive}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.addButton, addingMember && styles.addButtonDisabled]}
              onPress={inviteMember}
              disabled={addingMember}
            >
              {addingMember ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="#fff" />
                  <Text style={styles.addButtonText}>Invite</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Accepted Members */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>
            Album Members ({getActualMembersCount()})
          </Text>

          {/* Owner */}
          <View style={styles.memberItem}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberEmail}>{sharedAlbum.ownerEmail}</Text>
              <Text style={styles.memberName}>{sharedAlbum.ownerName}</Text>
            </View>
            <Text style={styles.ownerLabel}>Owner</Text>
          </View>

          {/* Accepted Members */}
          {acceptedMembersDetails.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberEmail}>{member.email}</Text>
                <Text style={styles.memberName}>{member.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeMemberButton}
                onPress={() => removeAcceptedMember(member)}
              >
                <Ionicons name="close" size={12} color={COLOR.secondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Pending Invitations */}
        <View style={styles.pendingSection}>
          <Text style={styles.sectionTitle}>
            Pending Invitations ({getPendingInvitationsCount()})
          </Text>

          {pendingInvitations.length === 0 ? (
            <Text style={styles.noPendingText}>No pending invitations</Text>
          ) : (
            pendingInvitations.map((invitation) => (
              <View key={invitation.id} style={styles.pendingItem}>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingEmail}>{invitation.invitedUserEmail}</Text>
                  <Text style={styles.pendingName}>{invitation.invitedUserName}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removePendingButton}
                  onPress={() => removePendingInvitation(invitation)}
                >
                  <Ionicons name="close" size={16} color={COLOR.secondary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLOR.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Invitation System</Text>
            <Text style={styles.infoText}>
              • Invited users will receive notifications{"\n"}
              • They can accept or decline invitations{"\n"}
              • Only accepted members can view and add memories{"\n"}
              • You can cancel pending invitations anytime
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}