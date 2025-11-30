// app/components/AlbumInvitations.tsx - FIXED
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where
} from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/albumInvitations.style';
import { AlbumInvitation } from '../../types/memory';
import AppHeader from './appHeader';

export default function AlbumInvitations() {
  const auth = getAuth();
  const db = getFirestore();
  const [invitations, setInvitations] = useState<AlbumInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const invitationsQuery = query(
      collection(db, 'albumInvitations'),
      where('invitedUserId', '==', auth.currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(invitationsQuery, 
      (snapshot) => {
        const invites: AlbumInvitation[] = [];
        snapshot.forEach((doc: { data: () => any; id: any; }) => {
          const data = doc.data();
          invites.push({
            id: doc.id,
            ...data
          } as AlbumInvitation);
        });
        setInvitations(invites);
        setLoading(false);
      },
      (error: any) => {
        console.error('Error loading invitations:', error);
        if (error.code === 'permission-denied') {
          Alert.alert('Permission Error', 'Cannot load invitations. Please check Firestore rules.');
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [auth.currentUser]);

  const acceptInvitation = async (invitation: AlbumInvitation) => {
    try {
      // Update invitation status
      const invitationRef = doc(db, 'albumInvitations', invitation.id!);
      await updateDoc(invitationRef, {
        status: 'accepted',
        respondedAt: new Date()
      });

      // Add user to shared album's accepted members
      const albumRef = doc(db, 'sharedAlbums', invitation.albumDocId);
      const albumDoc = await getDoc(albumRef);
      
      if (albumDoc.exists()) {
        const albumData = albumDoc.data();
        const currentCount = albumData?.membersCount || 1;
        
        await updateDoc(albumRef, {
          acceptedMembers: arrayUnion(auth.currentUser!.uid),
          membersCount: currentCount + 1
        });
      }

      Alert.alert(
        'Invitation Accepted!',
        `You have joined "${invitation.albumName}"`,
        [
          {
            text: 'View Album',
            onPress: () => router.push({
              pathname: '/components/SharedAlbumDetails',
              params: {
                albumDocId: invitation.albumDocId,
                albumId: invitation.albumId,
                albumName: invitation.albumName
              }
            })
          },
          { text: 'OK' }
        ]
      );
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      Alert.alert('Error', 'Failed to accept invitation: ' + error.message);
    }
  };

  const declineInvitation = async (invitation: AlbumInvitation) => {
    try {
      const invitationRef = doc(db, 'albumInvitations', invitation.id!);
      await updateDoc(invitationRef, {
        status: 'declined',
        respondedAt: new Date()
      });

      Alert.alert('Invitation Declined', `You declined to join "${invitation.albumName}"`);
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      Alert.alert('Error', 'Failed to decline invitation');
    }
  };

  const renderInvitationItem = ({ item }: { item: AlbumInvitation }) => (
    <View style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <Ionicons name="people" size={24} color={COLOR.primary} />
        <View style={styles.invitationInfo}>
          <Text style={styles.albumName}>{item.albumName}</Text>
          <Text style={styles.invitedBy}>
            Invited by {item.ownerName} ({item.ownerEmail})
          </Text>
          <Text style={styles.invitedDate}>
            Invited on {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => acceptInvitation(item)}
        >
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.declineButton}
          onPress={() => declineInvitation(item)}
        >
          <Ionicons name="close" size={18} color="#ff6b6b" />
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Text style={styles.loadingText}>Loading invitations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <View style={styles.header}>
        <Text style={styles.title}>Album Invitations</Text>
        <Text style={styles.subtitle}>
          Accept or decline shared folder invitations
        </Text>
      </View>

      {invitations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Pending Invitations</Text>
          <Text style={styles.emptyStateText}>
            You don't have any pending album invitations at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={invitations}
          renderItem={renderInvitationItem}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}