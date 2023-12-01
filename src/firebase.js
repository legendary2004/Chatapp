// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage }from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCA20X7yBK3n3gJ3VfEYfXtzHqO0q_cgFs",
  authDomain: "chat-54b49.firebaseapp.com",
  projectId: "chat-54b49",
  storageBucket: "chat-54b49.appspot.com",
  messagingSenderId: "143530997686",
  appId: "1:143530997686:web:ab572738c8d8dbb577f317",
  measurementId: "G-91T6SNMWYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage();