// app/components/HomeMemories.tsx
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore, orderBy, query, where } from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/homeMemories.style';
import { Memory } from '../../types/memory';
import UserProfileCard from './userProfileCard';


interface GroupedMemories {
  title: string;
  data: Memory[];
}

export default function HomeMemories() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [groupedMemories, setGroupedMemories] = useState<GroupedMemories[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAllMemories();
  }, []);

  const loadAllMemories = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      const memoriesQuery = query(
        collection(db, 'memories'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('dateOfMemory', 'desc')
      );

      const snapshot = await getDocs(memoriesQuery);
      
      const allMemories = snapshot.docs.map((doc: { data: () => any; id: any; }) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateOfMemory: data.dateOfMemory,
          createdAt: data.createdAt
        } as Memory;
      });
      
      setMemories(allMemories);
      groupMemoriesByDate(allMemories);
    } catch (error) {
      console.error('Error loading memories:', error);
      Alert.alert('Error', 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  const groupMemoriesByDate = (memoriesList: Memory[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const groups: GroupedMemories[] = [];
    const todayMemories: Memory[] = [];
    const thisWeekMemories: Memory[] = [];
    const thisMonthMemories: Memory[] = [];
    const olderMemories: { [key: string]: Memory[] } = {};

    memoriesList.forEach(memory => {
      const memoryDate = memory.dateOfMemory?.toDate ? memory.dateOfMemory.toDate() : new Date(memory.dateOfMemory);
      
      if (memoryDate >= today) {
        todayMemories.push(memory);
      } else if (memoryDate >= oneWeekAgo) {
        thisWeekMemories.push(memory);
      } else if (memoryDate >= oneMonthAgo) {
        thisMonthMemories.push(memory);
      } else {
        const monthYear = memoryDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
        if (!olderMemories[monthYear]) {
          olderMemories[monthYear] = [];
        }
        olderMemories[monthYear].push(memory);
      }
    });

    // Add groups in order
    if (todayMemories.length > 0) {
      groups.push({ title: 'Today', data: todayMemories });
    }
    if (thisWeekMemories.length > 0) {
      groups.push({ title: 'This Week', data: thisWeekMemories });
    }
    if (thisMonthMemories.length > 0) {
      groups.push({ title: 'This Month', data: thisMonthMemories });
    }

    // Add older months in chronological order (newest first)
    Object.keys(olderMemories)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .forEach(monthYear => {
        groups.push({ title: monthYear, data: olderMemories[monthYear] });
      });

    setGroupedMemories(groups);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllMemories();
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

  const renderMemoryItem = ({ item }: { item: Memory }) => (
    <View style={styles.memoryCard}>
      {/* Memory Header */}
      <View style={styles.memoryHeader}>
        <View style={styles.memoryInfo}>
          <Text style={styles.memoryTitle}>{item.title}</Text>
          {/* <Text style={styles.memoryDate}>{formatDate(item.dateOfMemory)}</Text> */}
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
              onPress={() => {
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
          <Text style={styles.createdDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>

    </View>
  );

  const renderSection = ({ item }: { item: GroupedMemories }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{item.title}</Text>
      {item.data.map((memory) => (
        <View key={memory.id}>
          {renderMemoryItem({ item: memory })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR.primary} />
        <Text style={styles.loadingText}>Loading your memories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {memories.length === 0 ? (
        <View style={styles.emptyState}>
          <UserProfileCard/>
          <Text style={styles.emptyStateIcon}>📔</Text>
          <Text style={styles.emptyStateText}>No memories yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start capturing your precious moments by creating your first memory
          </Text>
          <TouchableOpacity 
            style={styles.createMemoryButton}
            onPress={() => router.push('/(tabs)/createMemory')}
          >
            <Text style={styles.createMemoryButtonText}>Create Your First Memory</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groupedMemories}
          renderItem={renderSection}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memoriesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0000ff']}
            />
          }
          ListHeaderComponent={<UserProfileCard/>}
        />
      )}
    </View>
  );
}