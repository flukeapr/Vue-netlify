import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore';

// ... other firebase imports

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyA8bEVN253oMiW1IKIb2A2YRmpIQ8QAEI0",
    authDomain: "basic-firebase-3ed1d.firebaseapp.com",
    projectId: "basic-firebase-3ed1d",
    storageBucket: "basic-firebase-3ed1d.appspot.com",
    messagingSenderId: "123812945914",
    appId: "1:123812945914:web:a6eaa40cfd8046c4a94e43",
    measurementId: "G-1YBHY0T9YX"
})

// used for the firestore refs

export const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const todosRef = collection(db, 'todos')