// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIp0476AQhWPDV1D-YjhRmWxlwAGijfVU",
    authDomain: "prepwise-abdca.firebaseapp.com",
    projectId: "prepwise-abdca",
    storageBucket: "prepwise-abdca.firebasestorage.app",
    messagingSenderId: "873711584881",
    appId: "1:873711584881:web:1c7e3718e7c035a2f3fdd0",
    measurementId: "G-BDTFDTHG4S"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
