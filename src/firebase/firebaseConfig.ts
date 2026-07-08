import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2oPhIR31vjy79yFm8yd0N0Q61_6cVbe8",
  authDomain: "hera-superadmin.firebaseapp.com",
  projectId: "hera-superadmin",
  storageBucket: "hera-superadmin.firebasestorage.app",
  messagingSenderId: "749191887275",
  appId: "1:749191887275:web:a45e1ed21206e6ba803aee",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);