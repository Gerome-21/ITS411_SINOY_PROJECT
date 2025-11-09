import { styles } from '@/styles/appHeader.style';
import React from 'react';
import { Image, View } from 'react-native';

const AppHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('@/assets/images/memoireLOGO.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default AppHeader;