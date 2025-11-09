import AppHeader from '@/app/components/appHeader';
import UserProfileCard from '@/app/components/userProfileCard';
import { styles } from '@/styles/homepage.style';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Fixed Header - won't move when scrolling */}
      <AppHeader />
      
      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <UserProfileCard />
        
        {/* Future scrollable content will go here */}
        <View style={styles.contentPlaceholder}>
          {/* Add your future content here */}
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          <Text >Hello,!</Text>
          
        </View>
      </ScrollView>
    </View>
  );
}