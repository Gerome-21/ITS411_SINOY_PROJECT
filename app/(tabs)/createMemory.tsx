// app/(tabs)/createMemory.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from '@react-native-firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
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
import { styles } from '../../styles/createMemory';
import { Album, FeelingType, Memory } from '../../types/memory';

const FEELINGS: { value: FeelingType; label: string }[] = [
  { value: 'happy', label: '😊 Happy' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'loved', label: '❤️ Loved' },
  { value: 'fear', label: '😨 Fear' },
  { value: 'surprised', label: '😲 Surprised' },
  { value: 'inspired', label: '💡 Inspired' },
  { value: 'bored', label: '😴 Bored' },
];

export default function CreateMemory() {
  const auth = getAuth();
  const db = getFirestore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateOfMemory: new Date(),
    albumId: 'uncategorized',
    albumName: 'Uncategorized',
    newAlbumName: '',
    feeling: 'happy' as FeelingType,
  });
  
  const [media, setMedia] = useState<{ uri: string; type: 'image' | 'video' | 'audio'; fileName: string }[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserAlbums();
  }, []);

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
          fileName: asset.fileName || `memory_${Date.now()}.${type}`,
        }));
        setMedia(prev => [...prev, ...newMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  // Copy file to app's local directory (Documents on device)
  const saveMediaLocally = async (uri: string, fileName: string): Promise<string> => {
    try {
      // Create a local directory for memories if it doesn't exist
      const memoriesDir = `${FileSystem.documentDirectory}memories/`;
      const dirInfo = await FileSystem.getInfoAsync(memoriesDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(memoriesDir, { intermediates: true });
      }

      // Copy the file to local storage
      const localUri = `${memoriesDir}${Date.now()}_${fileName}`;
      await FileSystem.copyAsync({
        from: uri,
        to: localUri,
      });

      return localUri; // Return local path reference
    } catch (error) {
      console.error('Error saving media locally:', error);
      // If local saving fails, fall back to the original URI
      return uri;
    }
  };

  const createAlbum = async (albumName: string): Promise<string> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const albumData: Omit<Album, 'id'> = {
      userId: auth.currentUser.uid,
      name: albumName,
      memoryCount: 0,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'albums'), albumData);
    return docRef.id;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your memory');
      return;
    }

    if (media.length === 0) {
      Alert.alert('Error', 'Please add at least one photo, video, or audio');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);

    try {
      let albumId = formData.albumId;
      let albumName = formData.albumName;

      // Create new album if specified
      if (formData.newAlbumName.trim() && formData.albumId === 'new') {
        albumId = await createAlbum(formData.newAlbumName);
        albumName = formData.newAlbumName;
        await loadUserAlbums(); // Refresh albums list
      }

      // Save media files locally and get their paths
      const savedMedia = await Promise.all(
        media.map(async (item, index) => {
          const localUri = await saveMediaLocally(item.uri, item.fileName);
          return {
            type: item.type,
            uri: localUri, // This is now a local file path
            fileName: item.fileName,
          };
        })
      );

      // Create memory document with local file references
      const memoryData: Omit<Memory, 'id'> = {
        userId: auth.currentUser.uid,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateOfMemory: formData.dateOfMemory,
        media: savedMedia,
        albumId,
        albumName,
        feeling: formData.feeling,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'memories'), memoryData);

      Alert.alert('Success', 'Memory created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dateOfMemory: new Date(),
        albumId: 'uncategorized',
        albumName: 'Uncategorized',
        newAlbumName: '',
        feeling: 'happy',
      });
      setMedia([]);
      
    } catch (error) {
      console.error('Error creating memory:', error);
      Alert.alert('Error', 'Failed to create memory');
    } finally {
      setLoading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  // Rest of your component JSX remains the same...
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Memory</Text>

      {/* Title */}
      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
        placeholder="Give your memory a title"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.description}
        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
        placeholder="Describe this memory..."
        multiline
        numberOfLines={3}
      />

      {/* Date of Memory */}
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

      {/* Album Selection */}
      <Text style={styles.label}>Album</Text>
      <TouchableOpacity 
        style={styles.dropdown}
        onPress={() => setShowAlbumModal(true)}
      >
        <Text>{formData.albumName}</Text>
      </TouchableOpacity>

      {showAlbumModal && (
        <View style={styles.modal}>
          <ScrollView>
            <TouchableOpacity 
              style={styles.albumOption}
              onPress={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  albumId: 'uncategorized', 
                  albumName: 'Uncategorized',
                  newAlbumName: '' 
                }));
                setShowAlbumModal(false);
              }}
            >
              <Text>Uncategorized</Text>
            </TouchableOpacity>

            {albums.map(album => (
              <TouchableOpacity 
                key={album.id}
                style={styles.albumOption}
                onPress={() => {
                  setFormData(prev => ({ 
                    ...prev, 
                    albumId: album.id!, 
                    albumName: album.name,
                    newAlbumName: '' 
                  }));
                  setShowAlbumModal(false);
                }}
              >
                <Text>{album.name}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.albumOption}
              onPress={() => {
                setFormData(prev => ({ 
                  ...prev, 
                  albumId: 'new', 
                  albumName: 'Create New Album' 
                }));
                setShowAlbumModal(false);
              }}
            >
              <Text>+ Create New Album</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* New Album Input */}
      {formData.albumId === 'new' && (
        <>
          <Text style={styles.label}>New Album Name</Text>
          <TextInput
            style={styles.input}
            value={formData.newAlbumName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, newAlbumName: text }))}
            placeholder="Enter album name"
          />
        </>
      )}

      {/* Feeling Selection */}
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
            <Text>{feeling.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Media Upload */}
      <Text style={styles.label}>Upload Media *</Text>
      <View style={styles.mediaButtons}>
        <TouchableOpacity 
          style={styles.mediaButton}
          onPress={() => pickMedia('image')}
        >
          <Text>📷 Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.mediaButton}
          onPress={() => pickMedia('video')}
        >
          <Text>🎥 Videos</Text>
        </TouchableOpacity>
      </View>

      {/* Media Preview */}
      <View style={styles.mediaPreview}>
        {media.map((item, index) => (
          <View key={index} style={styles.mediaItem}>
            {item.type === 'image' ? (
              <Image source={{ uri: item.uri }} style={styles.mediaImage} />
            ) : (
              <View style={styles.mediaPlaceholder}>
                <Text>🎥 Video</Text>
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

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Save Memory</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}