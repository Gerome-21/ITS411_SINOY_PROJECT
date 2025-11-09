import { styles } from '@/styles/userProfileCard.style';
import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  email: string;
}

interface Quote {
  content: string;
  author: string;
}

const UserProfileCard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  // Simple in-memory cache for quotes
  const quoteCache = React.useRef<{date: string, quote: Quote} | null>(null);

  // Function to get today's date key
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  // Fetch daily quote
  const fetchDailyQuote = async () => {
    const todayKey = getTodayKey();
    
    // Check if we have a cached quote for today
    if (quoteCache.current && quoteCache.current.date === todayKey) {
      setDailyQuote(quoteCache.current.quote);
      return;
    }

    setQuoteLoading(true);
    
    try {
      // Using Quotable API - free and no API key required
      const response = await fetch('https://zenquotes.io/api/random');
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      
      const data = await response.json();
      
      const newQuote = {
        content: data[0].q,
        author: data[0].a,
      };
      
      setDailyQuote(newQuote);
      // Cache the quote in memory for today
      quoteCache.current = {
        date: todayKey,
        quote: newQuote
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback quotes
      const fallbackQuotes: Quote[] = [
        {
          content: "The only way to do great work is to love what you do.",
          author: "Steve Jobs"
        },
        {
          content: "Life is what happens when you're busy making other plans.",
          author: "John Lennon"
        },
        {
          content: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt"
        },
        {
          content: "Be the change you wish to see in the world.",
          author: "Mahatma Gandhi"
        },
        {
          content: "The journey of a thousand miles begins with one step.",
          author: "Lao Tzu"
        }
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setDailyQuote(randomQuote);
      
      // Cache fallback quote too
      quoteCache.current = {
        date: todayKey,
        quote: randomQuote
      };
    } finally {
      setQuoteLoading(false);
    }
  };

  // Fetch user profile
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log('No user found');
        setProfileLoading(false);
        return;
      }

      try {
        // console.log('Fetching profile for user:', user.uid);
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          // console.log('User profile found:', userData);
          setUserProfile(userData);
        } else {
          console.log('No user document found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchData();
    fetchDailyQuote();
  }, [user]);

  // Show loading only for profile, not for quote
  if (profileLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.card}>
        <Text style={styles.name}>Welcome to Memoire!</Text>
        <Text style={styles.details}>Complete your profile to get started</Text>
        
        {/* Show quote, no profile */}
        <View style={styles.quoteSection}>
          {quoteLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : dailyQuote ? (
            <>
              {/* <Text style={styles.quoteLabel}>Daily Inspiration</Text> */}
              <Text style={styles.quoteText}>"{dailyQuote.content}"</Text>
              <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
            </>
          ) : (
            <Text style={styles.details}>Loading inspiration...</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Text style={styles.name}>Hello, {userProfile.name}!</Text>
        <Text style={styles.details}>{userProfile.email}</Text>
      </View>

      {/* Daily Quote Section */}
      <View style={styles.quoteSection}>
        {/* <Text style={styles.quoteLabel}>Daily Inspiration</Text> */}
        {quoteLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : dailyQuote ? (
          <>
            <Text style={styles.quoteText}>"{dailyQuote.content}"</Text>
            <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
          </>
        ) : (
          <Text style={styles.details}>No quote available</Text>
        )}
      </View>
    </View>
  );
};

export default UserProfileCard;