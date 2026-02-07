import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDLnMXiy1uUAX7bTkpvdVfgu5hd8Oew8z8",
    authDomain: "pseudomemories.firebaseapp.com",
    projectId: "pseudomemories",
    storageBucket: "pseudomemories.firebasestorage.app",
    messagingSenderId: "286946769473",
    appId: "1:286946769473:web:ec51006e75b50f09b9e4c0",
    measurementId: "G-WDSQ57Z9G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };
