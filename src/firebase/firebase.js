import firebase from 'firebase'


// DEV
// var firebaseConfig = {
//   apiKey: "AIzaSyDhf77MARLLZfNv90SsmDLGAuF7Ru7QraQ",
//   authDomain: "rozaje-trash-points.firebaseapp.com",
//   databaseURL: "https://rozaje-trash-points-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "rozaje-trash-points",
//   storageBucket: "rozaje-trash-points.appspot.com",
//   messagingSenderId: "228048810122",
//   appId: "1:228048810122:web:0871fc0c4445c3bda3fd73",
//   measurementId: "G-M6SP15V8F5"
// };


// PROD
var firebaseConfig = {
  apiKey: "AIzaSyCxR49ADcElI1SMPnRWyhHBQM14iXuorjY",
  authDomain: "prod-rozaje-trash-points.firebaseapp.com",
  databaseURL: "https://prod-rozaje-trash-points-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "prod-rozaje-trash-points",
  storageBucket: "prod-rozaje-trash-points.appspot.com",
  messagingSenderId: "434166427086",
  appId: "1:434166427086:web:076cc4c41e1dfa18dccf9f",
  measurementId: "G-X6CHVEDZX6"
};

const app = firebase.initializeApp(firebaseConfig);
export default firebase;
export const db = app.database();
export const landfillPointsRef = db.ref("landfillPoints");