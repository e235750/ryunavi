// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARxrItr2pnzA6amajaFjfSjjmR-rJ9V0s",
  authDomain: "ryunavi-3ca47.firebaseapp.com",
  projectId: "ryunavi-3ca47",
  storageBucket: "ryunavi-3ca47.appspot.com",
  messagingSenderId: "14846085273",
  appId: "1:14846085273:web:1363e0836b616591a9d008"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;