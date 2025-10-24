import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyXE9Iw5cIiXkNYTpkajBmo3uiscxShaQ",
    authDomain: "test1-4ec3e.firebaseapp.com",
    projectId: "test1-4ec3e",
    storageBucket: "test1-4ec3e.firebasestorage.app",
    messagingSenderId: "768070353054",
    appId: "1:768070353054:web:0c8d69ca84796dc7f4fb8f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
