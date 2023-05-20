// FirebaseAuthContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    GithubAuthProvider, 
    OAuthProvider,
    signInWithPopup, 
    fetchSignInMethodsForEmail, 
    linkWithCredential } from 'firebase/auth';
import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };
  

/*const firebaseApp = */initializeApp(firebaseConfig);

const FirebaseAuthContext = createContext();

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    await signInWithPopup(auth, provider);
  };

  const signInWithYahoo = async () => {
    const provider = new OAuthProvider('yahoo.com');
    const auth = getAuth();
    await signInWithPopup(auth, provider);
  };  

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
  
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Get the pending Github credential from the error.
        //const pendingCred = error.credential;
        const pendingCred = GithubAuthProvider.credentialFromError(error);
        // Get the email of the existing account.
        const email = error.customData.email;
        // Get sign-in methods for the existing account.
        const methods = await fetchSignInMethodsForEmail(auth, email);
        // If the user has several sign-in methods, the first method in the list will be the "recommended" method to sign in. 
        // In this case, Google.
        if (methods[0] === 'google.com') {
          const googleProvider = new GoogleAuthProvider();
          // Sign in the user with Google to which the Github account is linked and then link the pending credential.
          const googleResult = await signInWithPopup(auth, googleProvider);
          await linkWithCredential(googleResult.user, pendingCred);
        }
        // Handle other providers.
      }
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithGithub, signInWithYahoo }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}
