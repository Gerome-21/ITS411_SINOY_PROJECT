// app/components/EditMemory.tsx
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from '@react-native-firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/editMemory.style';
import { Album, Memory } from '../../types/memory';

interface EditMemoryProps {
  memory: Memory;
  visible: boolean;
  onClose: () => void;
  onMemoryUpdate: (updatedMemory: Memory) => void;
}

const FEELINGS = [
  { value: 'happy', label: '😊 Happy' },
  { value: 'excited', label: '🤩 Excited' },
  { value: 'grateful', label: '🙏 Grateful' },
  { value: 'loved', label: '❤️ Loved' },
  { value: 'motivated', label: '🔥 Motivated' },
  { value: 'relaxed', label: '😌 Relaxed' },
  { value: 'hopeful', label: '🌈 Hopeful' },
  { value: 'inspired', label: '💡 Inspired' },
  { value: 'proud', label: '🏆 Proud' },
  { value: 'bored', label: '😴 Bored' },
  { value: 'curious', label: '🧐 Curious' },
  { value: 'thoughtful', label: '🤔 Thoughtful' },
  { value: 'nostalgic', label: '📸 Nostalgic' },
  { value: 'calm', label: '🌿 Calm' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'angry', label: '😠 Angry' },
  { value: 'anxious', label: '😰 Anxious' },
  { value: 'fear', label: '😨 Fear' },
  { value: 'lonely', label: '😔 Lonely' },
  { value: 'confused', label: '😕 Confused' },
  { value: 'tired', label: '🥱 Tired' },
  { value: 'disappointed', label: '😞 Disappointed' },
];

export default function EditMemory({
  memory,
  visible,
  onClose,
  onMemoryUpdate,
}: EditMemoryProps) {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({}); // ADD: Track image errors
  
  const [formData, setFormData] = useState({
    title: memory.title,
    description: memory.description || '',
    dateOfMemory: memory.dateOfMemory?.toDate ? memory.dateOfMemory.toDate() : new Date(memory.dateOfMemory),
    feeling: memory.feeling,
    albumId: memory.albumId,
    albumName: memory.albumName,
    media: memory.media || [],
  });

  useEffect(() => {
    loadUserAlbums();
  }, []);

  // ADD: Reset image errors when modal opens
  useEffect(() => {
    if (visible) {
      resetImageErrors();
    }
  }, [visible]);

  // ADD: Handle image loading errors
  const handleImageError = (mediaUri: string) => {
    setImageErrors(prev => ({
      ...prev,
      [mediaUri]: true
    }));
  };

  // ADD: Reset image errors
  const resetImageErrors = () => {
    setImageErrors({});
  };

  const loadUserAlbums = async () => {
    if (!auth.currentUser) return;
    
    try {
      const albumsQuery = query(
        collection(db, 'albums'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(albumsQuery);
      const userAlbums = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({
        id: doc.id,
        ...doc.data()
      })) as Album[];
      
      setAlbums(userAlbums);
    } catch (error) {
      console.error('Error loading albums:', error);
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

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setLoading(true);
    try {
      const memoryRef = doc(db, 'memories', memory.id);
      await updateDoc(memoryRef, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateOfMemory: formData.dateOfMemory,
        feeling: formData.feeling,
        albumId: formData.albumId,
        albumName: formData.albumName,
        media: formData.media,
        updatedAt: new Date(),
      });

      const updatedMemory = {
        ...memory,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateOfMemory: formData.dateOfMemory,
        feeling: formData.feeling,
        albumId: formData.albumId,
        albumName: formData.albumName,
        media: formData.media,
      };

      onMemoryUpdate(updatedMemory);
      onClose();
      Alert.alert('Success', 'Memory updated successfully');
    } catch (error) {
      console.error('Error updating memory:', error);
      Alert.alert('Error', 'Failed to update memory');
    } finally {
      setLoading(false);
    }
  };

  const pickMedia = async (type: 'image' | 'video') => {
    try {
      let result;
      if (type === 'image') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.8,
        });
      } else if (type === 'video') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsMultipleSelection: true,
        });
      }

      if (!result.canceled && result.assets) {
        const newMedia = result.assets.map(asset => ({
          uri: asset.uri,
          type,
          fileName: asset.fileName || `memory_${Date.now()}.${type}`,
        }));
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, ...newMedia]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
    // ADD: Also remove the error state for the removed image
    const removedMediaUri = formData.media[index]?.uri;
    if (removedMediaUri) {
      setImageErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[removedMediaUri];
        return newErrors;
      });
    }
  };

  const openMediaViewer = (initialIndex: number) => {
    onClose();
    setTimeout(() => {
      router.push({
        pathname: '/components/media-viewer',
        params: {
          media: JSON.stringify(formData.media),
          initialIndex: initialIndex,
          memoryTitle: formData.title
        }
      });
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={COLOR.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Memory</Text>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLOR.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Media Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Media</Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={() => pickMedia('image')}
              >
                <Ionicons name='image' size={20} color={COLOR.primary}/> 
                <Text style={styles.mediaButtonText}>Add Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={() => pickMedia('video')}
              >
                <Ionicons name='videocam' size={20} color={COLOR.primary}/>
                <Text style={styles.mediaButtonText}>Add Videos</Text>
              </TouchableOpacity>
            </View>
            
            {formData.media.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.mediaGallery}
              >
                {formData.media.map((mediaItem, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <TouchableOpacity 
                      style={styles.mediaItemContent}
                      onPress={() => openMediaViewer(index)}
                    >
                      {mediaItem.type === 'image' ? (
                        <Image 
                          source={imageErrors[mediaItem.uri] 
                            ? require('@/assets/images/fallbackImage.png') 
                            : { uri: mediaItem.uri }
                          } 
                          style={styles.galleryImage}
                          resizeMode="cover"
                          onError={() => handleImageError(mediaItem.uri)}
                        />
                      ) : (
                        <View style={styles.videoPlaceholder}>
                          <Ionicons name="play-circle" size={30} color={COLOR.primary} />
                          <Text style={styles.videoText}>Video</Text>
                        </View>
                      )}
                      
                      {mediaItem.type === 'video' && (
                        <View style={styles.videoBadge}>
                          <Text style={styles.videoBadgeText}>VIDEO</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.removeMediaButton}
                      onPress={() => removeMedia(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noMediaText}>No media added</Text>
            )}
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Memory title"
              placeholderTextColor={COLOR.inactive}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe your memory..."
              placeholderTextColor={COLOR.inactive}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Date of Memory</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData.dateOfMemory.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar" size={20} color={COLOR.primary} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfMemory}
                mode="date"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setFormData(prev => ({ ...prev, dateOfMemory: date }));
                  }
                }}
              />
            )}
          </View>

          {/* Feeling - UPDATED: Horizontal scroll view */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Feeling</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.feelingChips}
            >
              {FEELINGS.map((feeling) => (
                <TouchableOpacity
                  key={feeling.value}
                  style={[
                    styles.feelingChip,
                    formData.feeling === feeling.value && styles.feelingChipSelected
                  ]}
                  onPress={() => setFormData(prev => ({ 
                    ...prev, 
                    feeling: feeling.value 
                  }))}
                >
                  <Text style={[
                    styles.feelingChipText,
                    formData.feeling === feeling.value && styles.feelingChipTextSelected
                  ]}>
                    {feeling.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Album */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Album</Text>
            <View style={styles.albumSelector}>
              <TextInput
                style={styles.albumInput}
                value={formData.albumName}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  albumName: text,
                  albumId: 'uncategorized' // Default to uncategorized when custom name
                }))}
                placeholder="Enter album name"
                placeholderTextColor={COLOR.inactive}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumChips}>
              {albums.map((album) => (
                <TouchableOpacity
                  key={album.id}
                  style={[
                    styles.albumChip,
                    formData.albumId === album.id && styles.albumChipSelected
                  ]}
                  onPress={() => setFormData(prev => ({ 
                    ...prev, 
                    albumId: album.id,
                    albumName: album.name 
                  }))}
                >
                  <Text style={[
                    styles.albumChipText,
                    formData.albumId === album.id && styles.albumChipTextSelected
                  ]}>
                    {album.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}