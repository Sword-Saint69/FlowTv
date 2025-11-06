'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';
import { Channel } from '@/utils/parseM3U';

interface UserPreferences {
  favorites: string[];
  lastWatched: string | null;
  theme: string;
  profileImage?: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  userPreferences: UserPreferences | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  updateFavorites: (favorites: string[]) => Promise<void>;
  updateLastWatched: (channelId: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch user preferences from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserPreferences(userDoc.data() as UserPreferences);
        } else {
          // Create default user document
          const defaultPreferences: UserPreferences = {
            favorites: [],
            lastWatched: null,
            theme: 'dark'
          };
          await setDoc(doc(db, 'users', user.uid), defaultPreferences);
          setUserPreferences(defaultPreferences);
        }
      } else {
        setUserPreferences(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create default user document
    const defaultPreferences: UserPreferences = {
      favorites: [],
      lastWatched: null,
      theme: 'dark'
    };
    await setDoc(doc(db, 'users', userCredential.user.uid), defaultPreferences);
    setUserPreferences(defaultPreferences);
  };

  const updateFavorites = async (favorites: string[]) => {
    if (!user) return;
    
    await setDoc(doc(db, 'users', user.uid), { favorites }, { merge: true });
    setUserPreferences(prev => prev ? { ...prev, favorites } : null);
  };

  const updateLastWatched = async (channelId: string) => {
    if (!user) return;
    
    await setDoc(doc(db, 'users', user.uid), { lastWatched: channelId }, { merge: true });
    setUserPreferences(prev => prev ? { ...prev, lastWatched: channelId } : null);
  };

  const updateProfile = async (profileData: Partial<UserPreferences>) => {
    if (!user) return;
    
    await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
    setUserPreferences(prev => prev ? { ...prev, ...profileData } : null);
  };

  const value = {
    user,
    userPreferences,
    loading,
    login,
    logout,
    signup,
    updateFavorites,
    updateLastWatched,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};