
import './App.css';

// Import the functions you need from the SDKs you need
import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import io from "socket.io-client";
const socketurl = "http://localhost:3500";
const socket = io(socketurl);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3RtSiM4PVtkWaj3B8R5uFz_SIHm5SO8w",
  authDomain: "ubicua-final-bd.firebaseapp.com",
  projectId: "ubicua-final-bd",
  storageBucket: "ubicua-final-bd.appspot.com",
  messagingSenderId: "867399764463",
  appId: "1:867399764463:web:0f9a2c3987e397857d4e1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

function App() {

  ////////////////
  //  USE EFFECT
  ////////////////
  useEffect(() => {

    //////////////////
    //  REGISTER USER
    //////////////////
    socket.emit("register", "Mobile");

    //////////////////
    //  NEW USER
    //////////////////
    socket.on("newUser", function () {
      console.log("Se ha añadido el dispositivo web");
    });


    socket.on("mensaje2", function (data) {
      alert(data);
    });
    
  }, []);

  return (
    <div >
      <h1>El movil</h1>
    </div>
  );
}

export default App;