import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc_MUswfZZhodNR-0rR-0F4_B-QhcTV04",
  authDomain: "ecommerce-app-756a2.firebaseapp.com",
  projectId: "ecommerce-app-756a2",
  storageBucket: "ecommerce-app-756a2.firebasestorage.app",
  messagingSenderId: "306357383449",
  appId: "1:306357383449:web:4fd0ef0e176c9cb3df5588"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);