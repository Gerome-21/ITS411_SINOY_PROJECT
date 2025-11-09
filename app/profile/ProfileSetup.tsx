import { getAuth } from '@react-native-firebase/auth';
import { doc, getFirestore, setDoc } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../../styles/profileSetup.style';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const handleProfileSetup = async () => {
    if (!name || !age) {
      Alert.alert('Error', 'Please fill in name and age');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        age: parseInt(age),
        gender: gender || 'Not specified',
        email: user.email,
        profileCompleted: true,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Profile setup completed!');
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/memoireLOGO.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.description}>Tell us a bit about yourself</Text>

      {/* Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          placeholderTextColor="#999"
          onChangeText={setName}
        />
      </View>

      {/* Age */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      {/* Gender */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          placeholderTextColor="#999"
          onChangeText={setGender}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleProfileSetup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Complete Setup'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


