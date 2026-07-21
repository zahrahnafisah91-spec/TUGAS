// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmw6zDzKyVnOZ8aHoDRWd_NjQbN7mdF-Q",
  authDomain: "dbobat-82f12.firebaseapp.com",
  projectId: "dbobat-82f12",
  storageBucket: "dbobat-82f12.firebasestorage.app",
  messagingSenderId: "828947524515",
  appId: "1:828947524515:web:396a81eca6e65b5dbf0816",
  measurementId: "G-0Q74Y46FCH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
