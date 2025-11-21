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
import EditMemory from './EditMemory'; // ADD THIS IMPORT
import MemoryDetailView from './MemoryDetailView';
import UserProfileCard from './userProfileCard';

interface GroupedMemories {
  title: string;
  data: Memory[];
  type: 'anniversary' | 'regular';
  yearsAgo?: number;
}

export default function HomeMemories() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null); // ADD THIS STATE
  const [editModalVisible, setEditModalVisible] = useState(false); // ADD THIS STATE
  
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

  const getAnniversaryMemories = (memoriesList: Memory[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    
    return memoriesList.filter(memory => {
      const memoryDate = memory.dateOfMemory?.toDate ? memory.dateOfMemory.toDate() : new Date(memory.dateOfMemory);
      const memoryMonth = memoryDate.getMonth();
      const memoryDay = memoryDate.getDate();
      
      // Check if it's the same month and day (anniversary)
      if (memoryMonth === currentMonth && memoryDay === currentDate) {
        const yearsDiff = now.getFullYear() - memoryDate.getFullYear();
        return yearsDiff >= 1; // Only return memories that are at least 1 year old
      }
      return false;
    });
  };

  const getYearsAgo = (memoryDate: Date) => {
    const now = new Date();
    const yearsDiff = now.getFullYear() - memoryDate.getFullYear();
    
    // Adjust if the anniversary hasn't occurred yet this year
    const memoryThisYear = new Date(now.getFullYear(), memoryDate.getMonth(), memoryDate.getDate());
    if (memoryThisYear > now) {
      return yearsDiff - 1;
    }
    return yearsDiff;
  };

  const groupMemoriesByDate = (memoriesList: Memory[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const groups: GroupedMemories[] = [];
    
    // First, get anniversary memories and put them at the top
    const anniversaryMemories = getAnniversaryMemories(memoriesList);
    if (anniversaryMemories.length > 0) {
      // Group anniversary memories by years ago
      const anniversaryGroups: { [key: number]: Memory[] } = {};
      
      anniversaryMemories.forEach(memory => {
        const memoryDate = memory.dateOfMemory?.toDate ? memory.dateOfMemory.toDate() : new Date(memory.dateOfMemory);
        const yearsAgo = getYearsAgo(memoryDate);
        
        if (!anniversaryGroups[yearsAgo]) {
          anniversaryGroups[yearsAgo] = [];
        }
        anniversaryGroups[yearsAgo].push(memory);
      });

      // Add anniversary groups in order (oldest first for more impact)
      Object.keys(anniversaryGroups)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach(yearsAgo => {
          const years = parseInt(yearsAgo);
          groups.push({
            title: `On this day ${years} ${years === 1 ? 'year' : 'years'} ago`,
            data: anniversaryGroups[years],
            type: 'anniversary',
            yearsAgo: years
          });
        });
    }

    // Then add regular time-based groups
    const todayMemories: Memory[] = [];
    const thisWeekMemories: Memory[] = [];
    const thisMonthMemories: Memory[] = [];
    const olderMemories: { [key: string]: Memory[] } = {};

    // Filter out anniversary memories from regular grouping
    const regularMemories = memoriesList.filter(memory => 
      !anniversaryMemories.some(anniversary => anniversary.id === memory.id)
    );

    regularMemories.forEach(memory => {
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

    // Add regular groups in order
    if (todayMemories.length > 0) {
      groups.push({ title: 'Today', data: todayMemories, type: 'regular' });
    }
    if (thisWeekMemories.length > 0) {
      groups.push({ title: 'This Week', data: thisWeekMemories, type: 'regular' });
    }
    if (thisMonthMemories.length > 0) {
      groups.push({ title: 'This Month', data: thisMonthMemories, type: 'regular' });
    }

    // Add older months in chronological order (newest first)
    Object.keys(olderMemories)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .forEach(monthYear => {
        groups.push({ title: monthYear, data: olderMemories[monthYear], type: 'regular' });
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

  // FIXED: Properly handle memory update
  const handleMemoryUpdate = (updatedMemory: Memory) => {
    const updatedList = memories.map(mem => 
      mem.id === updatedMemory.id ? updatedMemory : mem
    );
    setMemories(updatedList);
    // Re-group memories to reflect changes
    groupMemoriesByDate(updatedList);
  };

  // FIXED: Properly handle memory delete
  const handleMemoryDelete = (memoryId: string) => {
    const updatedList = memories.filter(mem => mem.id !== memoryId);
    setMemories(updatedList);
    // Re-group memories to reflect changes
    groupMemoriesByDate(updatedList);
  };

  // ADD THIS FUNCTION: Handle edit memory requests
  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setEditModalVisible(true);
  };

  // FIXED: Removed nested TouchableOpacity and View
  const renderMemoryItem = ({ item, isAnniversary = false, yearsAgo = 0 }: { item: Memory; isAnniversary?: boolean; yearsAgo?: number }) => (
    <TouchableOpacity 
      style={[styles.memoryCard, isAnniversary && styles.anniversaryCard]}
      onPress={() => {
        setSelectedMemory(item);
        setDetailVisible(true);
      }}
    >
      {/* Anniversary Badge */}
      {isAnniversary && (
        <View style={styles.anniversaryBadge}>
          <Ionicons name="sparkles" size={16} color="#FFD700" />
          <Text style={styles.anniversaryBadgeText}>
            {yearsAgo} {yearsAgo === 1 ? 'Year' : 'Years'} Ago
          </Text>
          <Ionicons name="sparkles" size={16} color="#FFD700" />
        </View>
      )}

      {/* Memory Header */}
      <View style={styles.memoryHeader}>
        <View style={styles.memoryInfo}>
          <Text style={[styles.memoryTitle, isAnniversary && styles.anniversaryTitle]}>{item.title}</Text>
        </View>
        <View style={styles.memoryMeta}>
          <Text style={[styles.feelingBadge, isAnniversary && styles.anniversaryFeeling]}>
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
        <Text style={[styles.memoryDescription, isAnniversary && styles.anniversaryDescription]}>
          {item.description}
        </Text>
      ) : null}

      {/* Memory Footer */}
      <View style={styles.memoryFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="file-tray-full-outline" size={16} color={COLOR.inactive} style={styles.footerIcon} />
          <Text style={[styles.albumBadge, isAnniversary && styles.anniversaryFooterText]}>{item.albumName}</Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={16} color={COLOR.inactive} style={styles.footerIcon} />
          <Text style={[styles.createdDate, isAnniversary && styles.anniversaryFooterText]}>{formatDate(item.dateOfMemory)}</Text>
        </View>
      </View>
    </TouchableOpacity> 
  );

  const renderSection = ({ item }: { item: GroupedMemories }) => (
    <View style={styles.section}>
      <Text style={[
        styles.sectionTitle, 
        item.type === 'anniversary' && styles.anniversarySectionTitle
      ]}>
        {item.title}
      </Text>
      {item.data.map((memory) => (
        <View key={memory.id}>
          {renderMemoryItem({ 
            item: memory, 
            isAnniversary: item.type === 'anniversary',
            yearsAgo: item.yearsAgo 
          })}
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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Always on top */}
          <UserProfileCard />

          {memories.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No memories yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start capturing your precious moments by creating your first memory
              </Text>

              <TouchableOpacity
                style={styles.createMemoryButton}
                onPress={() => router.push('/(tabs)/createMemory')}
              >
                <Text style={styles.createMemoryButtonText}>
                  Create Your First Memory
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={groupedMemories}
              renderItem={renderSection}
              keyExtractor={(item) => `${item.type}-${item.title}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.memoriesList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListHeaderComponent={<UserProfileCard />}
            />
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={groupedMemories}
          renderItem={renderSection}
          keyExtractor={(item) => `${item.type}-${item.title}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memoriesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0000ff']}
            />
          }
          ListHeaderComponent={<UserProfileCard />}
        />
      )}

      {/* FIXED: Only render MemoryDetailView when selectedMemory exists */}
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