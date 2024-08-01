// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import {getFirestore,doc,setDoc} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjQXOp_31688scfe9zhtU-muk87bL0dYg",
  authDomain: "financely-2.firebaseapp.com",
  projectId: "financely-2",
  storageBucket: "financely-2.appspot.com",
  messagingSenderId: "1090122063148",
  appId: "1:1090122063148:web:e94289c877dd545a1da089",
  measurementId: "G-LEQHDX88ND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};
