import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// =================================================================
//   IMPORTANT: ACTION REQUIRED
// =================================================================
//
// To connect your application to Firebase, you need to replace
// the placeholder values below with your actual Firebase project
// configuration.
//
// 1. Go to the Firebase Console: https://console.firebase.google.com/
// 2. Select your project (or create a new one).
// 3. Go to Project Settings (click the gear icon).
// 4. In the "Your apps" card, select the "Web" platform (</>).
// 5. If you haven't set up a web app yet, do so now.
// 6. Find and copy the `firebaseConfig` object.
// 7. Paste its values here.
//
// =================================================================

const firebaseConfig = {
  apiKey: "AIzaSyArFMSmsPnsh-0CG2Eq4QXDxDeIfo4cLs4",
  authDomain: "kader-91ca2.firebaseapp.com",
  projectId: "kader-91ca2",
  storageBucket: "kader-91ca2.firebasestorage.app",
  messagingSenderId: "505734848439",
  appId: "1:505734848439:web:487c876a41ca2f12c8d232",
  measurementId: "G-NHVX1ZVWCV"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase;
