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
  const [progress, setProgress] = useState({
    oll: {},
    pll: {},
    ollLearning: {},
    pllLearning: {}
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await loadProgress(firebaseUser.uid);
      } else {
        setProgress({ oll: {}, pll: {}, ollLearning: {}, pllLearning: {} });
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
          pll: data.pll || {},
          ollLearning: data.ollLearning || {},
          pllLearning: data.pllLearning || {}
        });
      } else {
        await setDoc(docRef, { oll: {}, pll: {}, ollLearning: {}, pllLearning: {} });
        setProgress({ oll: {}, pll: {}, ollLearning: {}, pllLearning: {} });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      try {
        const saved = localStorage.getItem('speedcube-progress');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProgress({
            oll: parsed.oll || {},
            pll: parsed.pll || {},
            ollLearning: parsed.ollLearning || {},
            pllLearning: parsed.pllLearning || {}
          });
        }
      } catch {}
    }
  }

  async function saveProgress(newProgress) {
    setProgress(newProgress);
    localStorage.setItem('speedcube-progress', JSON.stringify(newProgress));

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, {
          oll: newProgress.oll,
          pll: newProgress.pll,
          ollLearning: newProgress.ollLearning || {},
          pllLearning: newProgress.pllLearning || {}
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }

  async function toggleLearned(type, id) {
    const learningKey = type === 'oll' ? 'ollLearning' : 'pllLearning';
    const newProgress = {
      ...progress,
      [type]: { ...progress[type] },
      [learningKey]: { ...progress[learningKey] }
    };
    if (newProgress[type][id]) {
      delete newProgress[type][id];
    } else {
      newProgress[type][id] = true;
      delete newProgress[learningKey][id];
    }
    await saveProgress(newProgress);
  }

  async function toggleLearning(type, id) {
    const learningKey = type === 'oll' ? 'ollLearning' : 'pllLearning';
    const newProgress = {
      ...progress,
      [learningKey]: { ...progress[learningKey] }
    };
    if (newProgress[learningKey][id]) {
      delete newProgress[learningKey][id];
    } else {
      newProgress[learningKey][id] = true;
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
    toggleLearned,
    toggleLearning
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
