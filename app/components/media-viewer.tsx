// app/components/media-viewer.tsx
import { ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../styles/media-viewer.style';

const { width, height } = Dimensions.get('window');

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  fileName: string;
}

interface MediaViewerParams {
  media: MediaItem[];
  initialIndex: number;
  memoryTitle: string;
}

export default function MediaViewer() {
  const { media, initialIndex, memoryTitle } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(Number(initialIndex) || 0);
  const [showControls, setShowControls] = useState(true);
  const [videoStatus, setVideoStatus] = useState({ 
    isPlaying: false, 
    didJustFinish: false,
    positionMillis: 0,
    durationMillis: 0 
  });
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<Video>(null);
  
  // Parse media data from URL params
  const mediaItems: MediaItem[] = typeof media === 'string' ? JSON.parse(media) : [];
  const currentMedia = mediaItems[currentIndex];

  // Check if file exists and get proper URI
  const getMediaUri = async (uri: string): Promise<string> => {
    try {
      // Check if it's a local file URI
      if (uri.startsWith('file://')) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          return uri;
        }
      }
      // If it's a content URI or other format, return as is
      return uri;
    } catch (error) {
      console.error('Error checking file:', error);
      return uri;
    }
  };

  const [currentMediaUri, setCurrentMediaUri] = useState<string>('');

  useEffect(() => {
    const loadMediaUri = async () => {
      if (currentMedia) {
        const uri = await getMediaUri(currentMedia.uri);
        setCurrentMediaUri(uri);
      }
    };
    loadMediaUri();
  }, [currentMedia]);

  // Handle video playback
  useEffect(() => {
    const setupVideo = async () => {
      if (currentMedia?.type === 'video' && videoRef.current) {
        try {
          await videoRef.current.unloadAsync();
          setIsVideoReady(false);
          
          // Load the video
          await videoRef.current.loadAsync(
            { uri: currentMediaUri },
            {},
            false
          );
          
          setIsVideoReady(true);
        } catch (error) {
          console.error('Error setting up video:', error);
          Alert.alert('Error', 'Could not load video');
        }
      }
    };

    setupVideo();

    return () => {
      // Cleanup when component unmounts or media changes
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, [currentIndex, currentMediaUri]);

  const handleVideoPlaybackStatusUpdate = (status: any) => {
    setVideoStatus({
      isPlaying: status.isPlaying,
      didJustFinish: status.didJustFinish,
      positionMillis: status.positionMillis || 0,
      durationMillis: status.durationMillis || 0
    });

    // Auto-replay when video finishes
    if (status.didJustFinish) {
      setTimeout(() => {
        replayVideo();
      }, 1000);
    }
  };

  const togglePlayPause = async () => {
    if (currentMedia?.type === 'video' && videoRef.current && isVideoReady) {
      try {
        if (videoStatus.isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
      } catch (error) {
        console.error('Error toggling play/pause:', error);
      }
    }
  };

  const goToNext = async () => {
    if (currentIndex < mediaItems.length - 1) {
      // Stop current video if playing
      if (currentMedia?.type === 'video' && videoRef.current) {
        await videoRef.current.pauseAsync();
        await videoRef.current.setPositionAsync(0);
      }
      setCurrentIndex(currentIndex + 1);
      setShowControls(true);
    }
  };

  const goToPrevious = async () => {
    if (currentIndex > 0) {
      // Stop current video if playing
      if (currentMedia?.type === 'video' && videoRef.current) {
        await videoRef.current.pauseAsync();
        await videoRef.current.setPositionAsync(0);
      }
      setCurrentIndex(currentIndex - 1);
      setShowControls(true);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleBack = async () => {
    // Stop video playback when leaving
    if (currentMedia?.type === 'video' && videoRef.current) {
      await videoRef.current.pauseAsync();
      await videoRef.current.setPositionAsync(0);
    }
    router.back();
  };

  const replayVideo = async () => {
    if (currentMedia?.type === 'video' && videoRef.current && isVideoReady) {
      try {
        await videoRef.current.setPositionAsync(0);
        await videoRef.current.playAsync();
      } catch (error) {
        console.error('Error replaying video:', error);
      }
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!mediaItems.length || !currentMedia) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No media available</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Media Display */}
      <TouchableOpacity 
        style={styles.mediaContainer}
        activeOpacity={1}
        onPress={toggleControls}
      >
        {currentMedia.type === 'image' ? (
          <Image 
            source={{ uri: currentMediaUri }} 
            style={styles.media}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: currentMediaUri }}
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
              useNativeControls={false}
              shouldPlay={false}
            />
            
            {/* Video Loading Indicator */}
            {!isVideoReady && currentMedia.type === 'video' && (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>Loading video...</Text>
              </View>
            )}

            {/* Custom Video Controls */}
            {showControls && isVideoReady && (
              <View style={styles.videoControls}>
                <TouchableOpacity 
                  style={styles.playPauseButton}
                  onPress={togglePlayPause}
                >
                  <Text style={styles.playPauseButtonText}>
                    {videoStatus.isPlaying ? '❚❚' : '▶'}
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.videoTime}>
                  {formatTime(videoStatus.positionMillis)} / {formatTime(videoStatus.durationMillis)}
                </Text>
                
                <TouchableOpacity 
                  style={styles.replayButton}
                  onPress={replayVideo}
                >
                  <Text style={styles.replayButtonText}>↺</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Video Play Overlay */}
            {!videoStatus.isPlaying && currentMedia.type === 'video' && isVideoReady && (
              <TouchableOpacity 
                style={styles.videoPlaceholderOverlay}
                onPress={togglePlayPause}
                activeOpacity={0.8}
              >
                <Text style={styles.videoPlaceholderText}>🎥</Text>
                <Text style={styles.videoMessage}>
                  Tap to play video
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Controls Overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>
              {memoryTitle || `Media ${currentIndex + 1}/${mediaItems.length}`}
            </Text>
            <View style={styles.spacer} />
          </View>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <TouchableOpacity 
              style={[styles.navButton, styles.prevButton]}
              onPress={goToPrevious}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>
          )}

          {currentIndex < mediaItems.length - 1 && (
            <TouchableOpacity 
              style={[styles.navButton, styles.nextButton]}
              onPress={goToNext}
            >
              <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>
          )}

          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <Text style={styles.counter}>
              {currentIndex + 1} / {mediaItems.length}
            </Text>
            <Text style={styles.fileName} numberOfLines={1}>
              {currentMedia.fileName}
            </Text>
            {currentMedia.type === 'video' && (
              <Text style={styles.videoIndicator}>🎥 Video</Text>
            )}
          </View>
        </View>
      )}

      {/* Thumbnail Strip */}
      {mediaItems.length > 1 && showControls && (
        <View style={styles.thumbnailStrip}>
          <FlatList
            data={mediaItems}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.thumbnail,
                  index === currentIndex && styles.thumbnailActive
                ]}
                onPress={async () => {
                  if (currentMedia?.type === 'video' && videoRef.current) {
                    await videoRef.current.pauseAsync();
                    await videoRef.current.setPositionAsync(0);
                  }
                  setCurrentIndex(index);
                }}
              >
                {item.type === 'image' ? (
                  <Image 
                    source={{ uri: item.uri }} 
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailVideo}>
                    <Text style={styles.thumbnailVideoIcon}>🎥</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.thumbnailList}
          />
        </View>
      )}
    </View>
  );
}