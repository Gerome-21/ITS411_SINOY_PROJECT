// app/components/MemoryDetailView.tsx
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { deleteDoc, doc, getFirestore } from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/memoryDetailView.style';
import { Memory } from '../../types/memory';

interface MemoryDetailViewProps {
  memory: Memory;
  visible: boolean;
  onClose: () => void;
  onMemoryDelete: (memoryId: string) => void;
  onEditMemory: (memory: Memory) => void;
}

export default function MemoryDetailView({
  memory,
  visible,
  onClose,
  onMemoryDelete,
  onEditMemory,
}: MemoryDetailViewProps) {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  
  const [loading, setLoading] = useState(false);

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

  const formatDate = (date: any) => {
    try {
      if (date?.toDate) {
        return date.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
      } else if (date) {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
      }
      return 'Unknown date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDelete
        }
      ]
    );
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const memoryRef = doc(db, 'memories', memory.id);
      await deleteDoc(memoryRef);
      onMemoryDelete(memory.id);
      onClose();
      Alert.alert('Success', 'Memory deleted successfully');
    } catch (error) {
      console.error('Error deleting memory:', error);
      Alert.alert('Error', 'Failed to delete memory');
    } finally {
      setLoading(false);
    }
  };

  const openMediaViewer = (initialIndex: number) => {
    onClose();
    setTimeout(() => {
      router.push({
        pathname: '/components/media-viewer',
        params: {
          media: JSON.stringify(memory.media || []),
          initialIndex: initialIndex,
          memoryTitle: memory.title
        }
      });
    }, 300);
  };

  const handleEdit = () => {
    onClose();
    setTimeout(() => {
      onEditMemory(memory);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header - Simplified without edit button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={COLOR.primary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Memory Details</Text>
          
          {/* Empty view to maintain space */}
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Media Gallery */}
          {memory.media && memory.media.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.mediaGallery}
            >
              {memory.media.map((mediaItem, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.mediaItem}
                  onPress={() => openMediaViewer(index)}
                >
                  {mediaItem.type === 'image' ? (
                    <Image 
                      source={{ uri: mediaItem.uri }} 
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="play-circle" size={50} color={COLOR.primary} />
                      <Text style={styles.videoText}>Tap to play video</Text>
                    </View>
                  )}
                  
                  {mediaItem.type === 'video' && (
                    <View style={styles.videoBadge}>
                      <Text style={styles.videoBadgeText}>VIDEO</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Memory Details */}
          <View style={styles.detailsContainer}>
            {/* Title Row with Action Buttons */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{memory.title}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Ionicons name="create-outline" size={16} color={COLOR.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteHeaderButton}
                  onPress={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#dc2626" />
                  ) : (
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                {memory.description || 'No description provided'}
              </Text>
            </View>

            {/* Date */}
            <View style={styles.dateSection}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={18} color={COLOR.inactive} />
                <Text style={styles.dateText}>
                  {formatDate(memory.dateOfMemory)}
                </Text>
              </View>
            </View>

            {/* Feeling */}
            <View style={styles.feelingSection}>
              <View style={styles.feelingBadge}>
                <Text style={styles.feelingEmoji}>
                  {getFeelingEmoji(memory.feeling)}
                </Text>
                <Text style={styles.feelingText}>
                  {memory.feeling.charAt(0).toUpperCase() + memory.feeling.slice(1)}
                </Text>
              </View>
            </View>

            {/* Album */}
            <View style={styles.albumSection}>
              <View style={styles.albumContainer}>
                <Ionicons name="file-tray-full-outline" size={18} color={COLOR.inactive} />
                <Text style={styles.albumText}>{memory.albumName}</Text>
              </View>
            </View>

            {/* Created Date */}
            <View style={styles.createdDateContainer}>
              <Text style={styles.createdDateLabel}>
                Created on {memory.createdAt?.toDate ? 
                  memory.createdAt.toDate().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 
                  'Unknown date'
                }
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}