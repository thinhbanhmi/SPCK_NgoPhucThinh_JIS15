// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB07tYy7QK_iPX0U1yha_4cINi0HNq8wt0",
  authDomain: "jsi-cp2-365cf.firebaseapp.com",
  projectId: "jsi-cp2-365cf",
  storageBucket: "jsi-cp2-365cf.firebasestorage.app",
  messagingSenderId: "243430112289",
  appId: "1:243430112289:web:f9d12ac5b054f39afcb760",
  measurementId: "G-9D5TN7SZVZ"
};

var db; // Declare db variable to hold Firestore instance

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully.");
  db = firebase.firestore();
}