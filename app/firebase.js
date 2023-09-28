import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCehqgLp3oSMbRJPjf8uuBVhp8Ro9iKp0c",
  authDomain: "gebleh-61232.firebaseapp.com",
  projectId: "gebleh-61232",
  storageBucket: "gebleh-61232.appspot.com",
  messagingSenderId: "659212898076",
  appId: "1:659212898076:web:0b0aad6fd8f3e31c1fb4d9",
  measurementId: "G-9KBEWQYYFW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
