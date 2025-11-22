// app/(tabs)/albums.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../../styles/albums.style';
import AlbumsGrid from '../components/albumsGrid';
import AppHeader from '../components/appHeader';

export default function Albums() {
  return (
    <View style={styles.container}>
      {/* Fixed Header - remains on top */}
      <AppHeader />

      {/* Scrollable Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Albums Grid - grows with content, not scrollable */}
        <AlbumsGrid />
        
        {/* Future components will go here and be scrollable */}
        <View style={styles.futureContent}>
          <Text style={styles.futureContentText}>
            Shared albums will be appear here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}