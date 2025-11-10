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

  if (quoteCache.current && quoteCache.current.date === todayKey) {
    setDailyQuote(quoteCache.current.quote);
    return;
  }

  setQuoteLoading(true);

  // List of reliable APIs
  const apis = [
    { url: 'https://zenquotes.io/api/random', parse: (data: any) => ({ content: data[0].q, author: data[0].a }) },
    { url: 'https://type.fit/api/quotes', parse: (data: any) => {
        const random = data[Math.floor(Math.random() * data.length)];
        return { content: random.text, author: random.author || "Unknown" };
      }
    },
    { url: 'https://api.quotable.io/random', parse: (data: any) => ({ content: data.content, author: data.author }) },
  ];

  let newQuote = null;

  for (const api of apis) {
    try {
      const response = await fetch(api.url);
      if (!response.ok) continue;
      const data = await response.json();
      newQuote = api.parse(data);
      break;
    } catch (err) {
      console.warn(`Failed to fetch from ${api.url}`);
    }
  }

  if (!newQuote) {
    // fallback quotes
    const fallbackQuotes: Quote[] = [
      { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { content: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
      { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    ];
    newQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  setDailyQuote(newQuote);
  quoteCache.current = { date: todayKey, quote: newQuote };
  setQuoteLoading(false);
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