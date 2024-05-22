// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC8_FXyy0z855tWOwfyiLY7hNcbq6lKh1w",
  authDomain: "mebnapp3.firebaseapp.com",
  databaseURL: "https://mebnapp3-default-rtdb.firebaseio.com",
  projectId: "mebnapp3",
  storageBucket: "mebnapp3.appspot.com",
  messagingSenderId: "776894250115",
  appId: "1:776894250115:web:ddcfc554d95282ad18efb6",
  measurementId: "G-TPQ9NSCP1G"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth()
export const storage = getStorage(app)

//export { db };