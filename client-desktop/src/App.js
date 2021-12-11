import './App.css';
import { useState, useEffect, useRef } from 'react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { Home } from "./components/HomeD";
import { Login } from './components/LoginD';
import { NoPartner } from './components/NoPartnerD';
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
// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isPartner, setPartner] = useState(false);
  const [userName, setUserName] = useState(null);
  const [screen, setScreen] = useState("Descubre");
  const [dataVideoPrev, setDataVideoPrev] = useState("");
  const [dataVideo, setDataVideo] = useState("");
  const [dataVideoNext, setDataVideoNext] = useState("");
  const counterPrev = useRef(0);
  const counter = useRef(1);
  const counterNext = useRef(2);

  /////////////////////
  //    LOG IN
  /////////////////////
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const userRef = ref(db, "/users/" + user.uid);
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
      setUserName(user.displayName.replace(/ .*/, ''));
      socket.emit("registerDesktop", user.email);

      var filmsReff = ref(db, "/films/0");
      onValue(filmsReff, (snapshot) => {
        let data = snapshot.val();
        setDataVideoPrev(data);
      });

      filmsReff = ref(db, "/films/1");
      onValue(filmsReff, (snapshot) => {
        let data = snapshot.val();
        setDataVideo(data);
        //se lo envio al movil
        var act = {
          gesture: "titlefilm",
          action: data.title
        }
        socket.emit("action", act);
      });

      filmsReff = ref(db, "/films/2");
      onValue(filmsReff, (snapshot) => {
        let data = snapshot.val();
        setDataVideoNext(data);

      });

    } catch (err) {
      console.error(err);
    }
  };

  /////////////////////
  //    OBTAIN FILM
  /////////////////////
  function obtainFilm(data) {
    if (data === "right") {
      if (counter.current < 41) {
        counter.current += 1;
        counterPrev.current = counter.current - 1;
        if (counter.current === 41) {
          counterNext.current = 0;
        } else {
          counterNext.current = counter.current + 1;
        }
      } else {
        counter.current = 0;
        counterPrev.current = 41;
        counterNext.current = 1;
      }
      const filmsRef = ref(db, "/films/" + counter.current);
      onValue(filmsRef, (snapshot) => {
        let data = snapshot.val();
        console.log(counter.current, data.title);
        setDataVideo(data);

        //se lo envio al movil
        var act = {
          gesture: "titlefilm",
          action: dataVideo.title
        }
        socket.emit("action", act);
      });

      const filmsRefLeft = ref(db, "/films/" + counterPrev.current);
      onValue(filmsRefLeft, (snapshot) => {
        let data = snapshot.val();
        console.log("prev ", counterPrev.current, data.title);
        setDataVideoPrev(data);
      });
      const filmsRefRight = ref(db, "/films/" + counterNext.current);
      onValue(filmsRefRight, (snapshot) => {
        let data = snapshot.val();
        setDataVideoNext(data);
      });


    } else {
      if (counter.current > 0) {
        counter.current -= 1;
        counterNext.current = counter.current + 1;

        if (counter.current === 0) {
          counterPrev.current = 41;
        } else {
          counterPrev.current = counter.current - 1;
        }
      } else {
        counter.current = 41;
        counterNext.current = 0;
        counterPrev.current = 40;
      }
      const filmsRef = ref(db, "/films/" + counter.current);
      onValue(filmsRef, (snapshot) => {
        let data = snapshot.val();
        console.log("current ", counter.current, data.title);
        setDataVideo(data);
      });
      const filmsRefLeft = ref(db, "/films/" + counterPrev.current);
      onValue(filmsRefLeft, (snapshot) => {
        let data = snapshot.val();
        console.log("prev ", counterPrev.current, data.title);
        setDataVideoPrev(data);
      });
      const filmsRefRight = ref(db, "/films/" + counterNext.current);
      onValue(filmsRefRight, (snapshot) => {
        let data = snapshot.val();
        setDataVideoNext(data);
      });

    }
  }

  // function prueba(){
  //   const userRef = ref(db, "/users/rhxaBY3acdfGAoj486fJ3GVmczL2");
  //   const data = get(userRef);
  //   console.log(data);
  // }


  ////////////////
  //  USE EFFECT
  ////////////////
  useEffect(() => {

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


    ///////////////////////////////
    // DO ACTION
    //////////////////////////////
    socket.on("doAction", function (data) {

      if (data.gesture === "touch") {
        console.log(data.action);
        setScreen(data.action);
      } else if (data.gesture === "tilt") {
        console.log("Inclinacion hacia la", data.action);
        obtainFilm(data.action);
      } else if (data.gesture === "voice") {
        console.log("Has dicho", data.action);
        if (data.action == "siguiente") {
          obtainFilm("right");
        } else if (data.action === "anterior") {
          obtainFilm("left");
        } else if (data.action === "reproducir"){
          setScreen("Video");
        } else if (data.action === "eliminar"){
          //eliminar de favoritos
        }

      } else if (data.gesture === "swipe") {
        console.log("Swipe:", data.action);


      } else if (data.gesture === "turn") {
        console.log("mobile " + data.action);
        if (data.action === "down") {
          //pausar video

        } else if (data.action === "up") {
          //reaunudar video
        }
      }
    });


  }, []);


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

      {!isLoggedIn &&
        <Login signIn={signInWithGoogle} />
      }

      {isLoggedIn && !isPartner &&
        <NoPartner userName={userName} disconnect={disconnect} />
      }

      {isLoggedIn && isPartner &&
        <Home dataVideo={dataVideo} dataVideoPrev={dataVideoPrev} dataVideoNext={dataVideoNext} userName={userName} screen={screen} disconnect={disconnect} />
      }
    </div>
  );
}

export default App;