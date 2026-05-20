// src/firebase.js
// This file connects your app to Firebase.
// Firebase is used to SAVE and LOAD portfolios across sessions.

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// These values come from your .env file (and Vercel environment variables)
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// db is the Firestore database — we use it to save/load portfolios
export const db = getFirestore(app);
