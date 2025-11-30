// app/components/CreateSharedMemory.tsx - UPDATED
import { COLOR } from '@/constants/colorPalette';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from '@react-native-firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, updateDoc } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/createSharedMemory.style';
import { FeelingType, SharedMemory } from '../../types/memory';
import AppHeader from './appHeader';

const FEELINGS: { value: FeelingType; label: string }[] = [
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

export default function CreateSharedMemory() {
  const { albumDocId, albumId, albumName } = useLocalSearchParams();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateOfMemory: new Date(),
    feeling: 'happy' as FeelingType,
  });
  
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' | 'audio'; fileName: string }[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickMedia = async (type: 'image' | 'video' | 'audio') => {
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
          fileName: asset.fileName || `shared_memory_${Date.now()}.${type}`,
        }));
        setMedia(prev => [...prev, ...newMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const saveMediaLocally = async (uri: string, fileName: string): Promise<string> => {
    try {
      const memoriesDir = `${FileSystem.documentDirectory}shared_memories/`;
      const dirInfo = await FileSystem.getInfoAsync(memoriesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(memoriesDir, { intermediates: true });
      }

      const localUri = `${memoriesDir}${Date.now()}_${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      });

      return localUri;
    } catch (error) {
      console.error('Error saving media locally:', error);
      return uri;
    }
  };

  const handleSubmit = async () => {
  if (!formData.title.trim()) {
    Alert.alert('Error', 'Please enter a title for your memory');
    return;
  }

  if (media.length === 0) {
    Alert.alert('Error', 'Please add at least one photo or video');
    return;
  }

  if (!auth.currentUser) {
    Alert.alert('Error', 'User not authenticated');
    return;
  }

  if (!albumDocId) {
    Alert.alert('Error', 'Album reference missing');
    return;
  }

  setLoading(true);

  try {
    // NEW: Get user's actual name from Firestore
    const userName = await getUserName(auth.currentUser.uid);

    // Save media files locally
    const savedMedia = await Promise.all(
      media.map(async (item) => {
        const localUri = await saveMediaLocally(item.uri, item.fileName);
        return {
          type: item.type,
          uri: localUri,
          fileName: item.fileName,
        };
      })
    );

    // Create shared memory document with albumDocId
    const memoryData: Omit<SharedMemory, 'id'> = {
      albumDocId: albumDocId as string,
      albumId: albumId as string,
      albumName: albumName as string,
      createdAt: new Date(),
      dateOfMemory: formData.dateOfMemory,
      description: formData.description.trim(),
      feeling: formData.feeling,
      media: savedMedia,
      title: formData.title.trim(),
      userId: auth.currentUser.uid,
      username: userName // Use actual name from Firestore
    };

    // SECURE: Firestore rules will validate access to parent album
    await addDoc(collection(db, 'sharedMemories'), memoryData);

    // Update memory count in shared album
    const albumRef = doc(db, 'sharedAlbums', albumDocId as string);
    const albumDoc = await getDoc(albumRef);
    if (albumDoc.exists()) {
      const currentCount = albumDoc.data().memoryCount || 0;
      await updateDoc(albumRef, {
        memoryCount: currentCount + 1
      });
    }

    Alert.alert('Success', 'Memory added to shared folder!');
    router.back();
    
  } catch (error: any) {
    console.error('Error creating shared memory:', error);
    if (error.code === 'permission-denied') {
      Alert.alert('Access Denied', 'You do not have permission to add memories to this album.');
    } else {
      Alert.alert('Error', error.message || 'Failed to create shared memory');
    }
  } finally {
    setLoading(false);
  }
};

const getUserName = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.name || auth.currentUser?.displayName || 'User';
    }
    return auth.currentUser?.displayName || 'User';
  } catch (error) {
    console.error('Error fetching user name:', error);
    return auth.currentUser?.displayName || 'User';
  }
};

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      
      <ScrollView 
        style={styles.scrollArea} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLOR.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Shared Folder Memory</Text>
            <Text style={styles.infoText}>
              • Only you can edit or delete this memory{'\n'}
              • Other members can view but not modify{'\n'}
              • All members will see this memory in the shared folder
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
          placeholder="Give your memory a title"
          placeholderTextColor={COLOR.inactive}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Describe this memory..."
          multiline
          numberOfLines={3}
          placeholderTextColor={COLOR.inactive}
        />

        <Text style={styles.label}>Date of Memory</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{formData.dateOfMemory.toLocaleDateString()}</Text>
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

        <Text style={styles.label}>Feeling</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FEELINGS.map((feeling) => (
            <TouchableOpacity
              key={feeling.value}
              style={[
                styles.feelingButton,
                formData.feeling === feeling.value && styles.feelingButtonSelected
              ]}
              onPress={() => setFormData(prev => ({ ...prev, feeling: feeling.value }))}
            >
              <Text style={styles.feelingButtonText}>{feeling.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Upload Media *</Text>
        <View style={styles.mediaButtons}>
          <TouchableOpacity 
            style={styles.mediaButton}
            onPress={() => pickMedia('image')}
          >
            <Ionicons name='image' size={20} color={COLOR.primary} /> 
            <Text style={styles.mediaButtonText}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mediaButton}
            onPress={() => pickMedia('video')}
          >
            <Ionicons name='videocam' size={20} color={COLOR.primary} />
            <Text style={styles.mediaButtonText}>Videos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mediaPreview}>
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              {item.type === 'image' ? (
                <Image source={{ uri: item.uri }} style={styles.mediaImage} />
              ) : (
                <View style={styles.mediaPlaceholder}>
                  <Ionicons name='play-circle-outline' size={30} color="#fff" />
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeMedia}
                onPress={() => removeMedia(index)}
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Done</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}