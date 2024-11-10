// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mern-estate-001.firebaseapp.com",
  projectId: "mern-estate-001",
  storageBucket: "mern-estate-001.firebasestorage.app",
  messagingSenderId: "679207048747",
  appId: "1:679207048747:web:618eddceeed58fd036bc6e",
  measurementId: "G-PDVX49FY2L",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
