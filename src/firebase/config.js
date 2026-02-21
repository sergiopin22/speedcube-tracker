import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBvCn29aysIovdCMsdeFjckO1X5P18LgpQ",
  authDomain: "speedcube-tracker.firebaseapp.com",
  projectId: "speedcube-tracker",
  storageBucket: "speedcube-tracker.firebasestorage.app",
  messagingSenderId: "690973306710",
  appId: "1:690973306710:web:38b88888e40ed30992b0f7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);