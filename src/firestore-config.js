
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB4w8TdBt5J680FCoS8RnuuwwEv7BJpeTU",
    authDomain: "ejae-15d6b.firebaseapp.com",
    projectId: "ejae-15d6b",
    storageBucket: "ejae-15d6b.appspot.com",
    messagingSenderId: "519790181229",
    appId: "1:519790181229:web:8a87b51b7f59c2891f3864",
    measurementId: "G-G6G6F8WF7L"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  export { app, analytics, db };
