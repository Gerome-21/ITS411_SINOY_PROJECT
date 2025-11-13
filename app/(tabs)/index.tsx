// app/(tabs)/index.tsx
import AppHeader from '@/app/components/appHeader';
import HomeMemories from '@/app/components/HomeMemories';
import { styles } from '@/styles/homepage.style';
import React from 'react';
import { View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Fixed Header - won't move when scrolling */}
      <AppHeader />
      
      {/* Home Memories Component (now includes UserProfileCard) */}
      <HomeMemories />
    </View>
  );
}