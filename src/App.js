import React from 'react';
import { FirebaseAuthProvider, useFirebaseAuth } from './FirebaseAuthContext';
import { FaGoogle, FaGithub, FaYahoo } from 'react-icons/fa';
import styles from './SignInButton.module.css';

function SignInButton() {
  const { user, signInWithGoogle, signInWithGithub, signInWithYahoo } = useFirebaseAuth();

  if (user) {
    return (
      <div className={styles.container}>
        <div className={styles.welcome}>Welcome, 
          <ul>
            <li>{user.displayName}</li>
            <li>{user.email}</li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <button className={styles.button} onClick={signInWithGoogle}>
          <FaGoogle className={styles.buttonIcon} /> Sign in with Google
        </button>
        <button className={styles.button} onClick={signInWithGithub}>
          <FaGithub className={styles.buttonIcon} /> Sign in with GitHub
        </button>
        <button className={styles.button} onClick={signInWithYahoo}>
          <FaYahoo className={styles.buttonIcon} /> Sign in with Yahoo
        </button>
      </div>
    );
  }
}

function App() {
  return (
    <FirebaseAuthProvider>
      <SignInButton />
    </FirebaseAuthProvider>
  );
}

export default App;
