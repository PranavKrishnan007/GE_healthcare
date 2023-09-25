import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8dimnHS6bj_90SF-Gut8trnRyAlGzu8s",
  authDomain: "gehealthcare-04.firebaseapp.com",
  projectId: "gehealthcare-04",
  storageBucket: "gehealthcare-04.appspot.com",
  messagingSenderId: "143543922321",
  appId: "1:143543922321:web:4f5f02c3eceb9c2d419930",
  measurementId: "G-T6ZJJ8HG1T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
