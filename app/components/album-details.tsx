// app/(tabs)/album-details.tsx
//card display uiux on albums tab
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/album-details.style';
import { Memory } from '../../types/memory';
import EditMemory from '../components/EditMemory';
import MemoryDetailView from '../components/MemoryDetailView';

export default function AlbumDetails() {
  const { albumId, albumName } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({}); // ADD: Track image errors
  
  // Add state for memory detail view
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  
  // ADD THESE STATES FOR EDIT FUNCTIONALITY
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    loadAlbumMemories();
  }, [albumId]);

  // ADD: Handle image loading errors
  const handleImageError = (mediaUri: string) => {
    setImageErrors(prev => ({
      ...prev,
      [mediaUri]: true
    }));
  };

  // ADD: Reset image errors when refreshing
  const resetImageErrors = () => {
    setImageErrors({});
  };

  const loadAlbumMemories = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Use the same pattern as your working albumDetails.tsx
      let memoriesQuery;
      
      if (albumId === 'uncategorized') {
        memoriesQuery = query(
          collection(db, 'memories'),
          where('userId', '==', auth.currentUser.uid),
          where('albumId', '==', 'uncategorized')
        );
      } else {
        memoriesQuery = query(
          collection(db, 'memories'),
          where('userId', '==', auth.currentUser.uid),
          where('albumId', '==', albumId)
        );
      }

      const snapshot = await getDocs(memoriesQuery);
      
      const albumMemories = snapshot.docs.map((doc: { data: () => any; id: any; }) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure dates are properly handled
          dateOfMemory: data.dateOfMemory,
          createdAt: data.createdAt
        } as Memory;
      });
      
      // Sort by dateOfMemory descending (newest first)
      albumMemories.sort((a, b) => {
        const dateA = a.dateOfMemory?.toDate ? a.dateOfMemory.toDate() : new Date(a.dateOfMemory);
        const dateB = b.dateOfMemory?.toDate ? b.dateOfMemory.toDate() : new Date(b.dateOfMemory);
        return dateB.getTime() - dateA.getTime();
      });
      
      setMemories(albumMemories);
    } catch (error) {
      Alert.alert('Error', `Failed to load memories: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Add memory update handler
  const handleMemoryUpdate = (updatedMemory: Memory) => {
    const updatedList = memories.map(mem => 
      mem.id === updatedMemory.id ? updatedMemory : mem
    );
    setMemories(updatedList);
    resetImageErrors(); // ADD: Reset errors when memory is updated
  };

  // Add memory delete handler
  const handleMemoryDelete = (memoryId: string) => {
    const updatedList = memories.filter(mem => mem.id !== memoryId);
    setMemories(updatedList);
  };

  // ADD THIS FUNCTION: Handle edit memory requests
  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setEditModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    resetImageErrors(); // ADD: Reset errors on refresh
    await loadAlbumMemories();
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
      } else if (date) {
        // Handle case where date is already a Date object or timestamp
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return 'Unknown date';
    } catch (error) {
      return 'Invalid date';
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

  // UPDATED: Modified renderMemoryItem to include fallback image
  const renderMemoryItem = ({ item }: { item: Memory }) => (
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
          <Text style={styles.memoryTitle}>{item.title}</Text>
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
                e.stopPropagation(); // Prevent triggering the parent onPress
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
        <Text style={styles.memoryDescription}>{item.description}</Text>
      ) : null}

      {/* Memory Footer */}
      <View style={styles.memoryFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="file-tray-full-outline" size={16} color={COLOR.inactive} style={styles.footerIcon} />
          <Text style={styles.albumBadge}>{item.albumName}</Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={16} color={COLOR.inactive} style={styles.footerIcon} />
          <Text style={styles.createdDate}>{formatDate(item.dateOfMemory)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color={COLOR.primary} />
        <Text style={styles.loadingText}>Loading memories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: albumName as string || 'Album',
        headerBackTitle: 'Back'
      }} />

      {/* Album Header */}
      <View style={styles.albumHeader}>
        <Text style={styles.albumTitle}>{albumName || 'Uncategorized'}</Text>
        <Text style={styles.memoryCount}>
          {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
        </Text>
      </View>

      {memories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No memories yet</Text>
          <Text style={styles.emptyStateSubtext}>
            {albumId === 'uncategorized' 
              ? 'Memories without an album will appear here'
              : 'Start adding memories to this album'
            }
          </Text>
          <TouchableOpacity 
            style={styles.createMemoryButton}
            onPress={() => router.push('/(tabs)/createMemory')}
          >
            <Text style={styles.createMemoryButtonText}>Create Memory</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={memories}
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
        <MemoryDetailView
          memory={selectedMemory}
          visible={detailVisible}
          onClose={() => {
            setDetailVisible(false);
            setSelectedMemory(null);
          }}
          onMemoryDelete={handleMemoryDelete}
          onEditMemory={handleEditMemory} // ADD THIS PROP
        />
      )}

      {/* ADD THIS: Edit Memory Modal */}
      {editingMemory && (
        <EditMemory
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