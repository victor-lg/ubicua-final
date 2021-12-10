import './App.css';
import { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
  const [titleVideo, setTitleVideo] = useState("titulo de la peli");
  const [timeRunning, setTimeRunning] = useState(false);
  const timerRef = useRef();

  /*Variables para el control táctil*/
  let start_x = useRef(0);
  let end_x = useRef(0);
  let start_time = useRef(0);
  const SPACE_THRESHOLD = useRef(100);
  const TIME_THRESHOLD = useRef(200);



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
    }

    if (next === "Descubre") {
      absolute.stop();
      tilt();
    } else if (next === "Video") {
      sensor.stop();
      faceDown();
      startup();
    }
    else {
      absolute.stop();
      sensor.stop();

    }
    setLastScreen(last);
    setScreen(next);
  }

  /////////////////////
  //    TILT
  /////////////////////
  function tilt() {
    if ('RelativeOrientationSensor' in window) {
      // console.log(sensor.quaternion);
      sensor.addEventListener('reading', (coordX) => {
        if (sensor.quaternion !== null) {
          coordX = sensor.quaternion[0];
        }

        if (coordX < -0.08) {
          var act = {
            gesture: "tilt",
            action: "right"
          }
          socket.emit("action", act);
          startTiltTimer();
        }
        if (coordX > 0.38) {
          var act = {
            gesture: "tilt",
            action: "left"
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
    console.log("SENSOR TILT PARADO");
    sensor.stop();
    setTimeRunning(true);
    timerRef.current = setTimeout(() => {
      setTimeRunning(false);
      timerRef.current = null;
      sensor.start();
      console.log("SENSOR TILT ACTIVADO");
    }, 3000);
  }

  // function stoptTiltTimer() {
  //   clearTimeout(timerRef.current);
  //   setTimeRunning(false);
  //   timerRef.current = null;
  //   sensor.stop();
  // }

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
          if (coordZ > 0) {

            var act = {
              gesture: "turn",
              action: "down"
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
    console.log("SENSOR FACEDOWN PARADO");
    absolute.stop();
    setTimeRunning(true);
    timerRef.current = setTimeout(() => {
      setTimeRunning(false);
      timerRef.current = null;
      absolute.start();
      console.log("SENSOR FACEDOWN ACTIVADO");
    }, 4000);
  }

  // function stopFaceDownTimer() {
  //   clearTimeout(timerRef.current);
  //   setTimeRunning(false);
  //   timerRef.current = null;
  //   absolute.stop();
  // }

  /////////////////////
  //    SWIPE
  /////////////////////

  //Gestos
  let startx = 0;
  let endx = 0;
  let starttime = 0;
  const TIMETHRESHOLD = 200;
  const SPAECTHRESHOLD = 100;
  const SPAECNOTMOVE = 50;

  function startup() {
    var gesture = document.getElementsByClassName('gestosVideo')[0];


    if (gesture) {
      gesture.addEventListener("touchstart", function (e) {
        e.preventDefault();
        startx = e.targetTouches[0].screenX;
        starttime = e.timeStamp;
        console.log("TOCA CON EL DEDO");
      }, { passive: false });

      gesture.addEventListener("touchmove", function (e) {
        e.preventDefault();
        endx = e.changedTouches[0].screenX;
      }, { passive: false });

      gesture.addEventListener("touchend", function (e) {
        e.preventDefault();
        endx = e.timeStamp;

        if (((endx - starttime) < TIME_THRESHOLD) && ((endx - startx) > SPAECTHRESHOLD)) {
          var touchobj = e.changedTouches[0];
          if (touchobj.target.className === 'gestosVideo') {
            console.log("derecha");
          }
        }
        if (((endx - starttime) > TIME_THRESHOLD && ((endx - startx) < SPAECNOTMOVE))) {
          var touchobj = e.changedTouches[0];
          if (touchobj.target.className === 'gestosVideo') {
            console.log("mantener");
          }
        }
      });
    }





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
    socket.emit("action", act);
    console.log('Has dicho: ' + event.results[0][0].transcript);
    recognition.stop();
  }

  recognition.onnomatch = function (event) {
    console.log("Palabra no reconocida");
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

  function pararVideo(){
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
        <Home pararVideo={pararVideo} changeScreen={changeScreen} screen={screen} lastScreen={lastScreen} userName={userName} voice={voice} titleVideo={titleVideo} disconnect={disconnect} />
      }

    </div>
  );
}



export default App;