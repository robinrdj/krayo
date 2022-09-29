import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/storage';                                                                                             



const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// DB and Authentication
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();



// Firebase Storage
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { auth, db, storage };
























