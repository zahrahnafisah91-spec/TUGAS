// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3aIs2Tcbwu0dcpj4wNnD2xEoBXOy7Ib4",
  authDomain: "crudbioskop-84b7c.firebaseapp.com",
  projectId: "crudbioskop-84b7c",
  storageBucket: "crudbioskop-84b7c.firebasestorage.app",
  messagingSenderId: "622030685406",
  appId: "1:622030685406:web:98ab0c3b95dc4f0fe1ae4f",
  measurementId: "G-H0NJHKC1W3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
