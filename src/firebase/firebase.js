import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDhf77MARLLZfNv90SsmDLGAuF7Ru7QraQ",
  authDomain: "rozaje-trash-points.firebaseapp.com",
  databaseURL: "https://rozaje-trash-points-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rozaje-trash-points",
  storageBucket: "rozaje-trash-points.appspot.com",
  messagingSenderId: "228048810122",
  appId: "1:228048810122:web:0871fc0c4445c3bda3fd73",
  measurementId: "G-M6SP15V8F5"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
