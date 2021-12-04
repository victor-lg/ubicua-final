import './App.css';
import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { Home } from "./components/Home";
import { Login } from './components/Login';
import io from "socket.io-client";
const socketurl = "http://localhost:3500";
const socket = io(socketurl);

/////////////////////
//    FIREBASE
/////////////////////
const firebaseConfig = {
  apiKey: "AIzaSyC3RtSiM4PVtkWaj3B8R5uFz_SIHm5SO8w",
  authDomain: "ubicua-final-bd.firebaseapp.com",
  projectId: "ubicua-final-bd",
  storageBucket: "ubicua-final-bd.appspot.com",
  messagingSenderId: "867399764463",
  appId: "1:867399764463:web:0f9a2c3987e397857d4e1a",
  databaseURL: "https://ubicua-final-bd-default-rtdb.europe-west1.firebasedatabase.app/"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getDatabase(app);
console.log(app);




function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);


  /////////////////////
  //    LOG IN
  /////////////////////
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const userRef = ref(db, `/users/${user.uid}`);
      const snapshot = await get(userRef);

      const data = snapshot.val();

      if (data) {
        console.log(data);
      } else {
        await set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email
        });
      }
      setLoggedIn(true);
      setUserName(user.displayName);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  ////////////////
  //  USE EFFECT
  ////////////////
  useEffect(() => {
    console.log(isLoggedIn);
    if (isLoggedIn) {

      //////////////////
      //  REGISTER USER
      //////////////////
      socket.emit("register", "Desktop");

      //////////////////
      //  NEW USER
      //////////////////
      socket.on("newUser", function () {
        console.log("Se ha añadido el dispositivo movil");
      });

    } else {

    }


  }, [isLoggedIn]);


  
  /////////////////
  //  SEND MESSAGE
  /////////////////
  function sendMessage() {
    socket.emit("mensaje", "hola");
  }


  return (
    <div className="App">

      {!isLoggedIn && (
        <Login signIn={signInWithGoogle} />
      )}

      {isLoggedIn &&
        <Home sendMessage={sendMessage} userName={userName}/>
      }

    </div>
  );
}

export default App;