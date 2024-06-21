// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABZW6RhFNpT3iOIIWjf_GhNbNXcD_zfgE",
  authDomain: "blood-donation-57a50.firebaseapp.com",
  projectId: "blood-donation-57a50",
  storageBucket: "blood-donation-57a50.appspot.com",
  messagingSenderId: "209965498441",
  appId: "1:209965498441:web:edc5a6d0e95a24c61ebf98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;