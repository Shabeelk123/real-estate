// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-d7bad.firebaseapp.com",
  projectId: "real-estate-d7bad",
  storageBucket: "real-estate-d7bad.appspot.com",
  messagingSenderId: "539318935972",
  appId: "1:539318935972:web:8a3010503549eecef02131"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);