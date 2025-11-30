// app/components/SharedAlbumDetails.tsx - FIXED SORTING
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where
} from '@react-native-firebase/firestore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/sharedAlbumDetails.style';
import { SharedAlbum, SharedMemory } from '../../types/memory';
import EditSharedMemory from './EditSharedMemory';
import SharedMemoryDetailView from './SharedMemoryDetailView';

export default function SharedAlbumDetails() {
  const { albumDocId, albumId, albumName } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const [sharedAlbum, setSharedAlbum] = useState<SharedAlbum | null>(null);
  const [sharedMemories, setSharedMemories] = useState<SharedMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  // States for memory detail and edit
  const [selectedMemory, setSelectedMemory] = useState<SharedMemory | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingMemory, setEditingMemory] = useState<SharedMemory | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    loadSharedAlbumData();
  }, [albumDocId]);

  const loadSharedAlbumData = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const albumRef = doc(db, 'sharedAlbums', albumDocId as string);
      const albumSnap = await getDoc(albumRef);

      if (!albumSnap.exists()) {
        setError('Album not found or you do not have access.');
        setLoading(false);
        return;
      }

      const albumData = albumSnap.data();
      const loadedAlbum = {
        id: albumSnap.id,
        ...albumData
      } as SharedAlbum;

      setSharedAlbum(loadedAlbum);
      await loadSharedMemories(albumSnap.id);

    } catch (err: any) {
      console.error('Error loading shared folder:', err);
      
      if (err.code === 'permission-denied') {
        setError('You do not have permission to access this album.');
      } else {
        setError(err.message || 'Failed to load album.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSharedMemories = async (targetAlbumDocId: string) => {
    try {
      const q = query(
        collection(db, 'sharedMemories'),
        where('albumDocId', '==', targetAlbumDocId),
        orderBy('createdAt', 'desc') // FIXED: Sort by createdAt
      );

      const memoriesSnap = await getDocs(q);
      const loadedMemories: SharedMemory[] = [];

      memoriesSnap.forEach((docSnap: { id: any; data: () => SharedMemory; }) => {
        loadedMemories.push({
          id: docSnap.id,
          ...docSnap.data()
        } as SharedMemory);
      });

      // REMOVED: Manual sorting by dateOfMemory - the query already sorts by createdAt
      setSharedMemories(loadedMemories);
    } catch (err: any) {
      console.error('Error loading shared memories:', err);
    }
  };

  const handleImageError = (mediaUri: string) => {
    setImageErrors(prev => ({
      ...prev,
      [mediaUri]: true
    }));
  };

  const resetImageErrors = () => {
    setImageErrors({});
  };

  const handleMemoryUpdate = (updatedMemory: SharedMemory) => {
    const updatedList = sharedMemories.map(mem => 
      mem.id === updatedMemory.id ? updatedMemory : mem
    );
    setSharedMemories(updatedList);
    resetImageErrors();
  };

  const handleMemoryDelete = (memoryId: string) => {
    const updatedList = sharedMemories.filter(mem => mem.id !== memoryId);
    setSharedMemories(updatedList);
  };

  const handleEditMemory = (memory: SharedMemory) => {
    setEditingMemory(memory);
    setEditModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    resetImageErrors();
    await loadSharedAlbumData();
    setRefreshing(false);
  };

  const formatDate = (date: any) => {
    try {
      if (date?.toDate) {
        return date.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getFeelingEmoji = (feeling: string) => {
    const feelingMap: { [key: string]: string } = {
      happy: '😊',
      excited: '🤩',
      grateful: '🙏',
      loved: '❤️',
      motivated: '🔥',
      relaxed: '😌',
      hopeful: '🌈',
      inspired: '💡',
      proud: '🏆',
      bored: '😴',
      curious: '🧐',
      thoughtful: '🤔',
      nostalgic: '📸',
      calm: '🌿',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      fear: '😨',
      lonely: '😔',
      confused: '😕',
      tired: '🥱',
      disappointed: '😞',
    };
    return feelingMap[feeling] || '😊';
  };

  const renderMemoryItem = ({ item }: { item: SharedMemory }) => {
    const isOwn = item.userId === auth.currentUser?.uid;

    return (
      <TouchableOpacity 
        style={styles.memoryCard}
        onPress={() => {
          setSelectedMemory(item);
          setDetailVisible(true);
        }}
      >
        {/* Memory Header */}
        <View style={styles.memoryHeader}>
          <View style={styles.memoryInfo}>
            <Text style={styles.memoryTitle} numberOfLines={1}>{item.title}</Text>
          </View>
          <View style={styles.memoryMeta}>
            <Text style={styles.feelingBadge}>
              {getFeelingEmoji(item.feeling)}
            </Text>
          </View>
        </View>

        {/* Memory Media */}
        {item.media && item.media.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.mediaScrollView}
          >
            {item.media.map((mediaItem, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.mediaContainer}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push({
                    pathname: '/components/media-viewer',
                    params: {
                      media: JSON.stringify(item.media),
                      initialIndex: index,
                      memoryTitle: item.title
                    }
                  });
                }}
              >
                {mediaItem.type === 'image' ? (
                  <Image 
                    source={imageErrors[mediaItem.uri] 
                      ? require('@/assets/images/fallbackImage.png') 
                      : { uri: mediaItem.uri }
                    } 
                    style={styles.mediaImage}
                    resizeMode="cover"
                    onError={() => handleImageError(mediaItem.uri)}
                  />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoIcon}>🎥</Text>
                    <Text style={styles.videoText}>Video</Text>
                  </View>
                )}
                {/* Video indicator badge */}
                {mediaItem.type === 'video' && (
                  <View style={styles.videoBadge}>
                    <Text style={styles.videoBadgeText}>VIDEO</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        {/* Memory Description */}
        {item.description ? (
          <Text style={styles.memoryDescription} numberOfLines={2}>{item.description}</Text>
        ) : null}

        {/* Memory Footer */}
        <View style={styles.memoryFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={16} color={COLOR.inactive} style={styles.footerIcon} />
            <Text style={styles.createdDate}>{formatDate(item.dateOfMemory)}</Text>
          </View>

          <View style={styles.footerItem}>
            <Ionicons name="person-circle" size={16} color={COLOR.inactive} style={styles.footerIcon} />
            <Text style={styles.createdDate}>{item.username} {isOwn && '(You)'}</Text>
          </View>

          {isOwn && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                handleEditMemory(item);
              }}
            >
              <Ionicons name="create-outline" size={14} color={COLOR.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.primary} />
        <Text style={styles.loadingText}>Loading memories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="warning-outline" size={60} color={COLOR.inactive} />
        <Text style={styles.emptyStateText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!sharedAlbum) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateText}>Album not found.</Text>
      </View>
    );
  }

  const isOwner = sharedAlbum.ownerId === auth.currentUser?.uid;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: sharedAlbum.name || albumName || 'Shared Folder',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.push({
                  pathname: '/components/CreateSharedMemory',
                  params: {
                    albumDocId: sharedAlbum.id,
                    albumId: sharedAlbum.albumId,
                    albumName: sharedAlbum.name
                  }
                })}
              >
                <Ionicons name="add" size={24} color={COLOR.primary} />
              </TouchableOpacity>
              
              {isOwner && (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => router.push({
                    pathname: '/components/ManageMembers',
                    params: {
                      albumDocId: sharedAlbum.id,
                      albumId: sharedAlbum.albumId,
                      albumName: sharedAlbum.name
                    }
                  })}
                >
                  <Ionicons name="people" size={24} color={COLOR.primary} />
                </TouchableOpacity>
              )}
            </View>
          )
        }} 
      />

      <View style={styles.albumHeader}>
        <View style={styles.albumHeaderLeft}>
          {/* BACK BUTTON */}
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name="chevron-back-outline" size={25} color={COLOR.secondary} />
          </TouchableOpacity>

          {/* TITLE + DETAILS */}
          <View style={styles.albumHeaderText}>
            <Text style={styles.albumTitle} numberOfLines={1}>{sharedAlbum.name}</Text>
            <Text style={styles.memoryCount}>
              {sharedMemories.length} {sharedMemories.length === 1 ? 'memory' : 'memories'} {sharedAlbum.membersCount} members
            </Text>
          </View>
        </View>

        {/* RIGHT ACTION BUTTONS */}
        <View style={styles.albumHeaderRight}>
          {/* Add Memory */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() =>
              router.push({
                pathname: '/components/CreateSharedMemory',
                params: {
                  albumDocId: sharedAlbum.id,
                  albumId: sharedAlbum.albumId,
                  albumName: sharedAlbum.name
                }
              })
            }
          >
            <Ionicons name="add" size={26} color={COLOR.primary} />
          </TouchableOpacity>

          {/* Manage Members - Only if owner */}
          {isOwner && (
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() =>
                router.push({
                  pathname: '/components/ManageMembers',
                  params: {
                    albumDocId: sharedAlbum.id,
                    albumId: sharedAlbum.albumId,
                    albumName: sharedAlbum.name
                  }
                })
              }
            >
              <Ionicons name="people" size={26} color={COLOR.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {sharedMemories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No memories yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start adding memories to this shared folder
          </Text>
          <TouchableOpacity 
            style={styles.createMemoryButton}
            onPress={() => router.push({
              pathname: '/components/CreateSharedMemory',
              params: {
                albumDocId: sharedAlbum.id,
                albumId: sharedAlbum.albumId,
                albumName: sharedAlbum.name
              }
            })}
          >
            <Text style={styles.createMemoryButtonText}>Add First Memory</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sharedMemories}
          renderItem={renderMemoryItem}
          keyExtractor={(item) => item.id!}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memoriesList}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Memory Detail View Modal */}
      {selectedMemory && (
        <SharedMemoryDetailView
          memory={selectedMemory}
          visible={detailVisible}
          onClose={() => {
            setDetailVisible(false);
            setSelectedMemory(null);
          }}
          onMemoryDelete={handleMemoryDelete}
          onEditMemory={handleEditMemory}
        />
      )}

      {/* Edit Memory Modal */}
      {editingMemory && (
        <EditSharedMemory
          memory={editingMemory}
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setEditingMemory(null);
          }}
          onMemoryUpdate={handleMemoryUpdate}
        />
      )}
    </View>
  );
}