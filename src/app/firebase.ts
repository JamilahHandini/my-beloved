import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCM8wvy3ukhNJsfAn84L0IOrNrykB1rrto",
    authDomain: "beloved-4139b.firebaseapp.com",
    projectId: "beloved-4139b",
    storageBucket: "beloved-4139b.firebasestorage.app",
    messagingSenderId: "176975577895",
    appId: "1:176975577895:web:8bb9419bd5a6707b811f02",
    measurementId: "G-2ZH6LSE81H"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);