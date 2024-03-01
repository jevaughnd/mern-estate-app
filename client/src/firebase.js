// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkxeq-Ma-5y3PawlH4litw1RRacgR26tQ",
  //apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // for security reasons
  authDomain: "mern-estate-49bd9.firebaseapp.com",
  projectId: "mern-estate-49bd9",
  storageBucket: "mern-estate-49bd9.appspot.com",
  messagingSenderId: "243670018808",
  appId: "1:243670018808:web:7f2cd655ecb2aa0365690d",
  measurementId: "G-YQZ6W7FT3G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);