// app/components/SharedAlbumsSection.tsx - FIXED
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/sharedAlbumsSection.style';
import { SharedAlbum } from '../../types/memory';

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const CARD_WIDTH = (width - (CARD_GAP * 5)) / 4;

export default function SharedAlbumsSection() {
  const auth = getAuth();
  const db = getFirestore();
  
  const [sharedAlbums, setSharedAlbums] = useState<SharedAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSharedAlbums();
  }, []);

  const loadSharedAlbums = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      // FIXED: Query albums where user is either owner OR in acceptedMembers
      // This is more efficient and respects Firestore rules
      const albumsQuery = query(
        collection(db, 'sharedAlbums'),
        where('acceptedMembers', 'array-contains', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(albumsQuery);
      const albums: SharedAlbum[] = [];
      
      querySnapshot.forEach((doc: { data: () => any; id: any; }) => {
        const data = doc.data();
        albums.push({
          id: doc.id,
          ...data
        } as SharedAlbum);
      });
      
      setSharedAlbums(albums);
    } catch (error: any) {
      console.error('Error loading shared folders:', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Access Denied', 'You do not have permission to access these albums.');
      } else {
        Alert.alert('Error', 'Failed to load shared folders. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshSharedAlbums = async () => {
    setRefreshing(true);
    try {
      await loadSharedAlbums();
    } catch (error) {
      console.error('Error refreshing shared folders:', error);
      Alert.alert('Error', 'Failed to refresh shared folders');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSharedAlbumPress = (album: SharedAlbum) => {
    const isOwner = album.ownerId === auth.currentUser?.uid;
    
    router.push({
      pathname: '/components/SharedAlbumDetails',
      params: { 
        albumDocId: album.id!,
        albumId: album.albumId,
        albumName: album.name,
        isOwner: isOwner.toString()
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Shared Folders</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLOR.primary} />
          <Text style={styles.loadingText}>Loading shared folders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shared Folders</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/components/CreateSharedAlbum')}
          >
            <Ionicons name="add-circle" size={15} color={COLOR.primary} />
            <Text style={styles.actionButtonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/components/AlbumInvitations')}
          >
            <Ionicons name="mail" size={15} color={COLOR.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={refreshSharedAlbums}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={COLOR.primary} />
            ) : (
              <Ionicons name="refresh" size={15} color={COLOR.secondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {sharedAlbums.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={COLOR.inactive} />
          <Text style={styles.emptyStateTitle}>No Shared Folder Yet</Text>
          <Text style={styles.emptyStateText}>
            Create a new shared folder or check your invitations
          </Text>
          <View style={styles.emptyStateButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/components/CreateSharedAlbum')}
            >
              <Text style={styles.primaryButtonText}>Create Shared Folder</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/components/AlbumInvitations')}
            >
              <Text style={styles.secondaryButtonText}>View Invitations</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.albumsGrid}>
          {sharedAlbums.map((album, index) => {
            const isOwner = album.ownerId === auth.currentUser?.uid;
            
            return (
              <View 
                key={album.id}
                style={[
                  styles.albumCardContainer,
                  { 
                    marginLeft: index % 4 === 0 ? 0 : CARD_GAP,
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.albumCard}
                  onPress={() => handleSharedAlbumPress(album)}
                >
                  <View style={styles.albumImageContainer}>
                    <Ionicons 
                      style={styles.albumIcon} 
                      name='people'
                    />
                    {isOwner && (
                      <View style={styles.ownerBadge}>
                        <Ionicons name="star" size={10} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.albumName} numberOfLines={1}>
                    {album.name}
                  </Text>
                  <Text style={styles.membersCount}>
                    {album.membersCount} {album.membersCount === 1 ? 'member' : 'members'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}