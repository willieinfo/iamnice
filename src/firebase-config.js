
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCN_7KrhVqg94RkBt9LzSPCzYkOE0829Js",
    authDomain: "remax-72f31.firebaseapp.com",
    projectId: "remax-72f31",
    storageBucket: "remax-72f31.appspot.com",
    messagingSenderId: "361610775158",
    appId: "1:361610775158:web:4b6d9e03cca9ce1146ed57",
    measurementId: "G-HYNH446DTS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  export { app, analytics };
