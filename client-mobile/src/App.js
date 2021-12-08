import './App.css';
import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { Home } from "./components/HomeM";
import { Login } from './components/LoginM';
import { NoPartner } from './components/NoPartnerM';
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
const options = { frequency: 60, ReferenceFrame: 'screen' };

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState("");
  const [screen, setScreen] = useState("Home");
  const [titleVideo, setTitleVideo] = useState("titulo de la peli");

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

      } else {
        await set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email
        });
      }
      setLoggedIn(true);
      setUserName(user.displayName.replace(/ .*/, ''));
      setEmail(user.email);
      socket.emit("registerMobile", user.email);

    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    if ('RelativeOrientationSensor' in window) {
      try {
        const sensor = new window.RelativeOrientationSensor(options);

        sensor.addEventListener('reading', () => {
          // model is a Three.js object instantiated elsewhere.
          //console.log(sensor.quaternion);
          if (sensor.quaternion[1] > 0.45) {
            console.log("giro a la derecha");
          } else if (sensor.quaternion[1] < 0.15) {
            console.log("giro a la izquierda");
          }
        });

        sensor.start();
      } catch (err) {
        console.log(err);
      }
    }


    ////////////////
    //  REGISTER
    ////////////////
    socket.on("newUser", function () {

      setPartner(true);
    });

    ////////////////
    //  GET PARTNER
    ////////////////
    socket.on("oldUser", function () {

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

      setPartner(false);
    });

  }, []);

  //////////////////
  //  SEND ACTION
  //////////////////
  function sendAction(data) {
    socket.emit("action", data);
  }

  ///////////////////
  //  CHANGE SCREEN
  ///////////////////
  function changeScreen(data) {
    if (data !== "Home") {
      var act = {
        gesture: "touch",
        action: data
      }
      sendAction(act);
    }
    setScreen(data);
  }

  ///////////////////
  //  SPEECH API
  ///////////////////
  let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
  let recognition = new SpeechRecognition();
  let recognitionList = new SpeechGrammarList();

  let moods = ["uno", "dos", "tres"];
  let grammar = '#JSGF V1.0; grammar moods; public <moods> = ' + Object.keys(moods).join(' | ') + ';';

  recognitionList.addFromString(grammar, 1);
  recognition.grammars = recognitionList;
  recognition.continuous = false;
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;


  function voice() {
    recognition.start();
    console.log("habla");
  }

  recognition.onresult = function (event) {
    var act = {
      gesture: "voice",
      action: event.results[0][0].transcript
    }
    sendAction(act);
    console.log('number: ' + event.results[0][0].transcript);
    recognition.stop();
  }


  recognition.onnomatch = function (event) {
    console.log("Estado de ánimo no reconocido.");
    recognition.stop();
  }


  /////////////////
  //  SIGN OUT
  /////////////////
  function disconnect() {
    auth.signOut().then(() => {
      setLoggedIn(false);
      socket.disconnect();
      window.location.reload();
    })
      .catch((error) => {
        console.log("[ERROR] " + error);
      })
  }


  return (
    <div className="App">

      <p onClick={voice}>HABLAR</p>
      {!isLoggedIn &&
        <Login signIn={signInWithGoogle} />
      }

      {isLoggedIn && !isPartner &&
        <NoPartner userName={userName} disconnect={disconnect} />
      }

      {isLoggedIn && isPartner &&
        <Home changeScreen={changeScreen} screen={screen} userName={userName} titleVideo={titleVideo} voice={voice} disconnect={disconnect} />
      }

    </div>
  );
}

export default App;