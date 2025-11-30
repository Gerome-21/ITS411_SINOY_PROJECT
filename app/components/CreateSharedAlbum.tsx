// app/(tabs)/createSharedAlbum.tsx
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
} from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/createSharedAlbum.style';
import AppHeader from '../components/appHeader';

export default function CreateSharedAlbum() {
  const auth = getAuth();
  const db = getFirestore();

  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  // 🔵 Fetch user's name from Firestore (based on your users collection)
  const getUserName = async (userId: string): Promise<string> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData?.name || 'User';
      }
      return 'User';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'User';
    }
  };

  // 🔵 Create the shared album document
  const createSharedAlbum = async (albumData: {
    name: string;
    userId: string;
    userEmail: string;
    userName: string;
  }) => {
    const albumId = `SA_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const sharedAlbumRef = await addDoc(collection(db, 'sharedAlbums'), {
      albumId,
      name: albumData.name,
      createdAt: new Date(),
      memoryCount: 0,

      // owner info
      ownerId: albumData.userId,
      ownerEmail: albumData.userEmail,
      ownerName: albumData.userName,

      // NEW: Invitation-based structure
      invitedEmails: [],               // owner is NOT invited
      acceptedMembers: [albumData.userId], // owner is the only accepted member
      membersCount: 1,
    });

    return { albumId, docId: sharedAlbumRef.id };
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an album name');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const userName = await getUserName(currentUser.uid);

      const { albumId, docId } = await createSharedAlbum({
        name: formData.name.trim(),
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        userName,
      });

      Alert.alert(
        'Success!',
        `Shared folder "${formData.name.trim()}" created.\n\nYou can now invite members.`,
        [
          { text: 'OK', onPress: () => router.back() },
          {
            text: 'Invite Members',
            onPress: () =>
              router.push({
                pathname: '/components/ManageMembers',
                params: {
                  albumDocId: docId,
                  albumId: albumId,
                  albumName: formData.name.trim(),
                },
              }),
          },
        ]
      );

      setFormData({ name: '' });
    } catch (error: any) {
      console.error('Error creating shared folder:', error);
      Alert.alert('Error', 'Failed to create shared folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Shared Folder</Text>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLOR.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Invitation-Based Sharing</Text>
            <Text style={styles.infoText}>
              • Invite users by email{'\n'}
              • They can accept or decline invitations{'\n'}
              • No album ID or passkey needed{'\n'}
              • You control who can access the album
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Album Name *</Text>

        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          placeholder="Enter album name"
          placeholderTextColor={COLOR.inactive}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Shared Folder</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
