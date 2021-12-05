import './App.css';
import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { Home } from "./components/Home";
import { Login } from './components/Login';
import { NoPartner } from './components/NoPartner';
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

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState("");


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
      console.log(data);

      if (data) {
      } else {
        await set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email
        });
      }
      setLoggedIn(true);
      setUserName(user.displayName);
      setEmail(user.email);
      console.log("LO HACE en el desktop");
      socket.emit("registerDesktop", user.email);

    } catch (err) {
      console.error(err);
    }
  };


  ////////////////
  //  USE EFFECT
  ////////////////
  useEffect(() => {

    ////////////////
    //  REGISTER
    ////////////////
    socket.on("newUser", function () {
      console.log("Se ha añadido el dispositivo movil");
      setPartner(true);
    });

    ////////////////
    //  GET PARTNER
    ////////////////
    socket.on("oldUser", function () {
      console.log("ya existe el dispositivo movil");
      setPartner(true);
    });
    socket.on("mensaje2", function (data) {
      alert(data);
      setPartner(true);
    });

    ///////////////////////////////
    //  GET DISCONNECTED PARTNER
    //////////////////////////////
    socket.on("disconnectPartner", function () {
      console.log("se ha desconectado el movil");
      setPartner(false);
    });


  }, []);



  /////////////////
  //  SEND MESSAGE
  /////////////////
  function sendMessage() {
    socket.emit("mensaje", "hola");
  }

  /////////////////
  //  SIGN OUT
  /////////////////
  function disconnect() {
    auth.signOut().then(() =>{
      console.log("desconectado correctamente");
      setLoggedIn(false);
      socket.disconnect();
      window.location.reload();
    })
    .catch((error) => {
      console.log("[ERROR] "+error);
    })
  }


  return (
    <div className="App">

      {!isLoggedIn &&
        <Login signIn={signInWithGoogle} />
      }

      {isLoggedIn && !isPartner &&
        <NoPartner userName={userName} />
      }

      {isLoggedIn && isPartner &&
        <Home sendMessage={sendMessage} userName={userName} disconnect={disconnect} />
      }

    </div>
  );
}

export default App;