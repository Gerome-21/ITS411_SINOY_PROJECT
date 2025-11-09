// app/(tabs)/albums.tsx
import { getAuth } from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/albums.style';
import { Album } from '../../types/memory';

const { width } = Dimensions.get('window');
const CARD_GAP = 10;
const CARD_WIDTH = (width - (CARD_GAP * 4)) / 3;

export default function Albums() {
  const auth = getAuth();
  const db = getFirestore();
  
  const [albums, setAlbums] = useState<(Album & { actualMemoryCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [uncategorizedCount, setUncategorizedCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      await Promise.all([loadUserAlbumsWithCounts(), loadUncategorizedCount()]);
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const loadUserAlbumsWithCounts = async () => {
    if (!auth.currentUser) return;

    try {
      // First, load user's albums
      const albumsQuery = query(
        collection(db, 'albums'),
        where('userId', '==', auth.currentUser.uid)
      );
      const albumsSnapshot = await getDocs(albumsQuery);
      const userAlbums = albumsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Album[];

      // Then, get the actual memory count for each album
      const albumsWithCounts = await Promise.all(
        userAlbums.map(async (album) => {
          const memoriesQuery = query(
            collection(db, 'memories'),
            where('userId', '==', auth.currentUser!.uid),
            where('albumId', '==', album.id)
          );
          const memoriesSnapshot = await getDocs(memoriesQuery);
          return {
            ...album,
            actualMemoryCount: memoriesSnapshot.size
          };
        })
      );

      setAlbums(albumsWithCounts);
    } catch (error) {
      console.error('Error loading albums with counts:', error);
      throw error;
    }
  };

  const loadUncategorizedCount = async () => {
    if (!auth.currentUser) return;

    try {
      const memoriesQuery = query(
        collection(db, 'memories'),
        where('userId', '==', auth.currentUser.uid),
        where('albumId', '==', 'uncategorized')
      );
      const snapshot = await getDocs(memoriesQuery);
      setUncategorizedCount(snapshot.size);
    } catch (error) {
      console.error('Error loading uncategorized count:', error);
      throw error;
    }
  };

  const refreshAlbumCounts = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadUserAlbumsWithCounts(), loadUncategorizedCount()]);
    } catch (error) {
      console.error('Error refreshing albums:', error);
      Alert.alert('Error', 'Failed to refresh albums');
    } finally {
      setRefreshing(false);
    }
  };

    const handleAlbumPress = (album: (Album & { actualMemoryCount: number }) | 'uncategorized') => {
      if (album === 'uncategorized') {
        router.push({
          pathname: '/components/album-details',  // Correct path
          params: { albumId: 'uncategorized', albumName: 'Uncategorized' }
        });
      } else {
        router.push({
          pathname: '/components/album-details',  // Correct path
          params: { albumId: album.id!, albumName: album.name }
        });
      }
    };

  const renderAlbumItem = ({ item, index }: { item: (Album & { actualMemoryCount: number }) | 'uncategorized'; index: number }) => {
    const isUncategorized = item === 'uncategorized';
    const albumName = isUncategorized ? 'Uncategorized' : item.name;
    const memoryCount = isUncategorized ? uncategorizedCount : item.actualMemoryCount;

    return (
      <View style={[
        styles.albumCardContainer,
        { 
          marginLeft: index % 3 === 0 ? 0 : CARD_GAP,
        }
      ]}>
        <TouchableOpacity 
          style={styles.albumCard}
          onPress={() => handleAlbumPress(item)}
        >
          <View style={styles.albumImageContainer}>
            <Text style={styles.albumIcon}>
              {isUncategorized ? '📁' : '📔'}
            </Text>
          </View>
          <Text style={styles.albumName} numberOfLines={1}>
            {albumName}
          </Text>
          <Text style={styles.albumCount}>
            {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Always include uncategorized album
  const allAlbums: ((Album & { actualMemoryCount: number }) | 'uncategorized')[] = [
    'uncategorized',
    ...albums
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading albums...</Text>
      </View>
    );
  }

  const hasMemories = uncategorizedCount > 0 || albums.some(album => album.actualMemoryCount > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Albums</Text>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={refreshAlbumCounts}
        disabled={refreshing}
      >
        {refreshing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        )}
      </TouchableOpacity>

      {!hasMemories && allAlbums.length === 1 ? (
        // Empty state - no albums with memories
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📔</Text>
          <Text style={styles.emptyStateText}>No albums yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first album when adding a new memory!
          </Text>
          <Link href="/(tabs)/createMemory" style={styles.createMemoryLink}>
            <Text style={styles.createMemoryLinkText}>Create Memory</Text>
          </Link>
        </View>
      ) : (
        // Grid view with consistent 3 columns
        <FlatList
          data={allAlbums}
          renderItem={renderAlbumItem}
          keyExtractor={(item) => 
            item === 'uncategorized' ? 'uncategorized' : item.id!
          }
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.albumsGrid}
        />
      )}

      <Link href="/(tabs)" style={styles.homeLink}>
        <Text style={styles.homeLinkText}>← Back to Home</Text>
      </Link>
    </View>
  );
}