import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBydzDcp1Qst5mZd9j7AjwiodwTq1oBbq0",
    authDomain: "beawareg13-bdd89.firebaseapp.com",
    databaseURL: "https://beawareg13-bdd89-default-rtdb.firebaseio.com",
    projectId: "beawareg13-bdd89",
    storageBucket: "beawareg13-bdd89.appspot.com",
    messagingSenderId: "634689069450",
    appId: "1:634689069450:web:777dd650f473151ddb6873",
    measurementId: "G-ZBHNPLZDNC"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);

  export {app, auth, database}


  