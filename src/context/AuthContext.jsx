import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ oll: {}, pll: {} });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadProgress(firebaseUser.uid);
      } else {
        setProgress({ oll: {}, pll: {} });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function loadProgress(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgress({
          oll: data.oll || {},
          pll: data.pll || {}
        });
      } else {
        await setDoc(docRef, { oll: {}, pll: {} });
        setProgress({ oll: {}, pll: {} });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback a localStorage
      try {
        const saved = localStorage.getItem('speedcube-progress');
        if (saved) setProgress(JSON.parse(saved));
      } catch {}
    }
  }

  async function saveProgress(newProgress) {
    setProgress(newProgress);
    // Guardar en localStorage como backup
    localStorage.setItem('speedcube-progress', JSON.stringify(newProgress));
    
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          oll: newProgress.oll,
          pll: newProgress.pll
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }

  async function toggleLearned(type, id) {
    const newProgress = {
      ...progress,
      [type]: { ...progress[type] }
    };
    if (newProgress[type][id]) {
      delete newProgress[type][id];
    } else {
      newProgress[type][id] = true;
    }
    await saveProgress(newProgress);
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    loading,
    progress,
    login,
    logout,
    toggleLearned
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
