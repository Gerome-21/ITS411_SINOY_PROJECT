// app/(tabs)/albums.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import { styles } from '../../styles/albums.style';
import AlbumsGrid from '../components/albumsGrid';
import AppHeader from '../components/appHeader';
import SharedAlbumsSection from '../components/SharedAlbumsSection'; // NEW

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
        
        {/* Personal Albums Grid */}
        <AlbumsGrid />
        
        {/* NEW: Shared Folder Section */}
        <SharedAlbumsSection />
        
      </ScrollView>
    </View>
  );
}