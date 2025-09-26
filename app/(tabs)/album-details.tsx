// app/(tabs)/album-details.tsx
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

export default function AlbumDetails() {
  const { albumId, albumName } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlbumMemories();
  }, [albumId]);

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
      
      const albumMemories = snapshot.docs.map(doc => {
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlbumMemories();
    setRefreshing(false);
  };

  const formatDate = (date: any) => {
    try {
      if (date?.toDate) {
        return date.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
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
      'happy': '😊',
      'sad': '😢',
      'loved': '❤️',
      'fear': '😨',
      'surprised': '😲',
      'inspired': '💡',
      'bored': '😴'
    };
    return feelingMap[feeling] || '😊';
  };

  const renderMemoryItem = ({ item }: { item: Memory }) => (
    <View style={styles.memoryCard}>
      {/* Memory Header */}
      <View style={styles.memoryHeader}>
        <View style={styles.memoryInfo}>
          <Text style={styles.memoryTitle}>{item.title}</Text>
          <Text style={styles.memoryDate}>{formatDate(item.dateOfMemory)}</Text>
        </View>
        <View style={styles.memoryMeta}>
          <Text style={styles.feelingBadge}>
            {getFeelingEmoji(item.feeling)} {item.feeling}
          </Text>
        </View>
      </View>

      {/* Memory Description */}
      {item.description ? (
        <Text style={styles.memoryDescription}>{item.description}</Text>
      ) : null}

      {/* Memory Media */}
      {item.media && item.media.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mediaScrollView}
        >
          {item.media.map((mediaItem, index) => (
            <View key={index} style={styles.mediaContainer}>
              {mediaItem.type === 'image' ? (
                <Image 
                  source={{ uri: mediaItem.uri }} 
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.videoIcon}>🎥</Text>
                  <Text style={styles.videoText}>Video</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Memory Footer */}
      <View style={styles.memoryFooter}>
        <Text style={styles.albumBadge}>From: {item.albumName}</Text>
        <Text style={styles.createdDate}>
          Created: {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <ActivityIndicator size="large" color="#0000ff" />
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
          <Text style={styles.emptyStateIcon}>📔</Text>
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
    </View>
  );
}