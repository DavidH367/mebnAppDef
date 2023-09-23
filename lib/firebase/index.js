// firebaseConfig.js
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCHG6Xxi1t0UVpzwtB5giClHgqQJCiuxrI",
  authDomain: "g-cafe-comayagua.firebaseapp.com",
  projectId: "g-cafe-comayagua",
  storageBucket: "g-cafe-comayagua.appspot.com",
  messagingSenderId: "729496266416",
  appId: "1:729496266416:web:32c324501ab164d580bd75",
  measurementId: "G-X18H5TYQEM"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth()
export const storage = getStorage(app)

//export { db };