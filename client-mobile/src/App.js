import './App.css';
import { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { Home } from "./components/HomeM";
import { Login } from './components/LoginM';
import { NoPartner } from './components/NoPartnerM';
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { IoMdVolumeOff, IoMdVolumeHigh } from "react-icons/io";

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
//rotation
const options = { frequency: 60, ReferenceFrame: 'screen' };
const sensor = new window.RelativeOrientationSensor(options);
const absolute = new window.AbsoluteOrientationSensor(options);

/////////////////////
//    MAIN FUNCTION
/////////////////////
function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const [userName, setUserName] = useState(null);
  const [screen, setScreen] = useState("Home");
  const [lastScreen, setLastScreen] = useState("Home");
  const [titleVideo, setTitleVideo] = useState("Iron Man");
  const [mic, setMic] = useState(<BsFillMicMuteFill />);
  const [vol, setVol] = useState(null);
  const micState = useRef(0);
  const volState = useRef(0);
  const [timeRunning, setTimeRunning] = useState(false);
  const timerRef = useRef();
  const nowScreen = useRef("Todas");

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
      if (!data) {
        await set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email,
          favFilms: [""],
          favGenres: { "action": 0, "romantic": 0, "animation": 0, "terror": 0, "musical": 0 }
        });
      }
      setLoggedIn(true);
      setUserName(user.displayName.replace(/ .*/, ''));
      //Register
      socket.emit("registerMobile", user.email);

    } catch (err) {
      console.error(err);
    }
  };



  /////////////////////
  //    USE EFFECT
  /////////////////////
  useEffect(() => {

    ////////////////
    //  GET PARTNER
    ////////////////
    socket.on("newUser", function () {
      setPartner(true);
      setScreen("Home");
    });
    socket.on("oldUser", function () {
      setPartner(true);
    });

    ///////////////////////////////
    //  GET DISCONNECTED PARTNER
    //////////////////////////////
    socket.on("disconnectPartner", function () {
      setPartner(false);
    });

    ///////////////////////////////
    // DO ACTION
    //////////////////////////////
    socket.on("doAction", function (data) {
      if (data.gesture === "titlefilm") {
        setTitleVideo(data.action);
      }
    });

  }, []);

  ///////////////////
  //  CHANGE SCREEN
  ///////////////////
  function changeScreen(last, next) {
    if (next !== "Home") {
      var act = {
        gesture: "touch",
        action: next
      }
      socket.emit("action", act);
      absolute.stop();
      sensor.stop();
    }
    if (next === "Todas") {
      nowScreen.current = "Todas";
      setScreen("Todas");
      tilt();
      absolute.stop();
    } else if (next === "Video") {
      setVol(<IoMdVolumeOff />);
      faceDown();
      sensor.stop();
    } else if (next === "Personalizar") {
      nowScreen.current = "Personalizar";
      sensor.stop();
      tilt();
      absolute.stop();
    } else {
      absolute.stop();
      sensor.stop();
    }
    setLastScreen(last);
    setScreen(next);
  }

  ///////////////////
  //  FAV FILM
  ///////////////////

  function favFilm() {
    var act = {
      gesture: "fav",
      action: "fav"
    }
    socket.emit("action", act);
  }


  /////////////////////
  //    TILT
  /////////////////////
  function tilt() {
    if ('RelativeOrientationSensor' in window) {
      sensor.addEventListener('reading', (coordX) => {
        if (sensor.quaternion !== null) {
          coordX = sensor.quaternion[0];
        }

        if (coordX < -0.08) {
          console.log("inclinacion a derecha");
          if (nowScreen.current === "Personalizar") {
            var act = {
              gesture: "rate",
              action: "right"
            }
          } else {
            var act = {
              gesture: "tilt",
              action: "right"
            }
          }

          socket.emit("action", act);
          startTiltTimer();
        }
        if (coordX > 0.38) {
          console.log("inclinacion a izquierda");
          if (nowScreen.current === "Personalizar") {

            var act = {
              gesture: "rate",
              action: "left"
            }
          } else {
            var act = {
              gesture: "tilt",
              action: "left"
            }
          }
          socket.emit("action", act);
          startTiltTimer();
        }
      });

      sensor.addEventListener("error", () => {
      })
      sensor.start();
    }
  }
  function startTiltTimer() {
    sensor.stop();
    setTimeRunning(true);
    timerRef.current = setTimeout(() => {
      setTimeRunning(false);
      timerRef.current = null;
      sensor.start();
    }, 3000);
  }

  /////////////////////
  //    FACEDOWN
  /////////////////////

  function faceDown() {
    if ('RelativeOrientationSensor' in window) {
      try {
        absolute.addEventListener('reading', (coordZ) => {
          if (absolute.quaternion !== null) {
            coordZ = absolute.quaternion[2];
          }
          if (coordZ < -0.2 && coordZ > -0.3) {

            var act = {
              gesture: "turn",
              action: "down"
            }

            socket.emit("action", act);
            startfaceDownTimer();
          } else if (coordZ < -0.3) {
            var act = {
              gesture: "turn",
              action: "up"
            }

            socket.emit("action", act);
            startfaceDownTimer();
          }
        });
        absolute.start();
      } catch (err) {
        console.log(err);
      }
    }
  }

  function startfaceDownTimer() {
    absolute.stop();
    setTimeRunning(true);
    timerRef.current = setTimeout(() => {
      setTimeRunning(false);
      timerRef.current = null;
      absolute.start();
    }, 4000);
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
    if (micState.current === 0) {
      recognition.start();
      setMic(<BsFillMicFill />);
      console.log("[Microfono activado]");
      micState.current = 1;

    } else if (micState.current === 1) {
      recognition.stop();
      setMic(<BsFillMicMuteFill />);
      console.log("[Microfono desactivado]");
      micState.current = 0;
    }
  }

  recognition.onresult = function (event) {
    var act = {
      gesture: "voice",
      action: event.results[0][0].transcript
    }
    socket.emit("action", act);
    console.log('Has dicho: ' + event.results[0][0].transcript);
    recognition.stop();
    setMic(<BsFillMicMuteFill />);
    console.log("[Microfono desactivado]");
  }

  recognition.onnomatch = function (event) {
    console.log("Palabra no reconocida");
    recognition.stop();
  }


  ///////////////////
  //  CHANGE VOLUME
  ///////////////////
  function changeVolume(data) {
    if (data === "change") {
      if (volState.current === 0) {
        setVol(<IoMdVolumeHigh />);
        var act = {
          gesture: "volume",
          action: "unmute"
        }
        volState.current = 1;
      } else {
        setVol(<IoMdVolumeOff />);
        var act = {
          gesture: "volume",
          action: "mute"
        }
        volState.current = 0;
      }
    } else {
      var volume = document.getElementById("volume").value;
      var act = {
        gesture: "volume",
        action: volume
      }
    }
    socket.emit("action", act);
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

  function pararVideo() {
    var act = {
      gesture: "swipe",
      action: "pausa"
    }
    socket.emit("action", act);
  }



  /////////////////////
  //    RETURN
  /////////////////////
  return (
    <div className="App">

      {!isLoggedIn &&
        <Login signIn={signInWithGoogle} />
      }

      {isLoggedIn && !isPartner &&
        <NoPartner userName={userName} disconnect={disconnect} />
      }

      {isLoggedIn && isPartner &&
        <Home favFilm={favFilm} socket={socket} pararVideo={pararVideo} changeVolume={changeVolume} mic={mic} vol={vol} changeScreen={changeScreen} screen={screen} lastScreen={lastScreen} userName={userName} voice={voice} titleVideo={titleVideo} disconnect={disconnect} />
      }

    </div>
  );
}



export default App;