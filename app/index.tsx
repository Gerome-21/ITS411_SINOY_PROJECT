import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './_layout';
import AuthScreen from './auth/AuthScreen';
import ProfileSetup from './profile/ProfileSetup';

export default function App() {
  const { user } = useAuth();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          setProfileCompleted(userDoc.data()?.profileCompleted || false);
        } else {
          setProfileCompleted(false);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setProfileCompleted(false);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user]);

  if (checkingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!profileCompleted) {
    return <ProfileSetup />;
  }

  return <Redirect href={'/(tabs)'} />;
}