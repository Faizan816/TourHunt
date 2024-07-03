// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC66rkkq_Tbepo_h_g69HLB0uBzvZ_mjnM",
  authDomain: "tourhunt-fb9af.firebaseapp.com",
  projectId: "tourhunt-fb9af",
  storageBucket: "tourhunt-fb9af.appspot.com",
  messagingSenderId: "25093162177",
  appId: "1:25093162177:web:312678c9a7ba6396698040",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
