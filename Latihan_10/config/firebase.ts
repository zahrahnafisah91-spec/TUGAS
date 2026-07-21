// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATpm5aN3-f_gF377c3mBMTZpJOI_MPt70",
  authDomain: "ujikom-50570.firebaseapp.com",
  projectId: "ujikom-50570",
  storageBucket: "ujikom-50570.firebasestorage.app",
  messagingSenderId: "387859279101",
  appId: "1:387859279101:web:f511eb7126a4e3c2f36294",
  measurementId: "G-MW2B6WQWDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);