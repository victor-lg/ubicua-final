import './App.css';
import { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, get, onValue, update, push, child, remove } from "firebase/database";
import { Home } from "./components/HomeD";
import { Login } from './components/LoginD';
import { NoPartner } from './components/NoPartnerD';
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
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
  // databaseURL: "https://fir-100405352-default-rtdb.europe-west1.firebasedatabase.app/"
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
  const [screen, setScreen] = useState("Todas");
  const [dataVideoPrev, setDataVideoPrev] = useState("");
  const [dataVideo, setDataVideo] = useState("");
  const [dataVideoNext, setDataVideoNext] = useState("");
  const [volIcon, setVolIcon] = useState(<IoMdVolumeOff />);

  const [dataFavVideoPrev, setDataFavVideoPrev] = useState("");
  const [dataFavVideo, setDataFavVideo] = useState("");
  const [dataFavVideoNext, setDataFavVideoNext] = useState("");

  const [dataRateVideo, setDataRateVideo] = useState("");

  const username = useRef("");
  const userheader = useRef("");
  const email = useRef("");
  const genre = useRef("");
  const userUid = useRef("");
  const userData = useRef("");

  const counterPrev = useRef(0);
  const counter = useRef(1);
  const counterNext = useRef(2);

  const totalfavs = useRef(0);
  const counterFavPrev = useRef(-1);
  const counterFav = useRef(-1);
  const counterFavNext = useRef(-1);



  /////////////////////
  //    LOG IN
  /////////////////////
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      userUid.current = user.uid;

      const userRef = ref(db, "/users/" + user.uid);
      const snapshot = await get(userRef);

      const data = snapshot.val();
      console.log(data);

      if (!data) {
        await set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email,
          favFilms: [""],
          favGenres: {"action": 0, "romantic": 0, "animation": 0, "terror": 0, "musical": 0}
        });
      } else {
        totalfavs.current = data.favFilms.length;
        console.log("hay un total de favs: " + totalfavs.current);
      }

      userData.current = data;
      setLoggedIn(true);

      username.current = user.displayName;
      userheader.current = user.displayName.replace(/ .*/, '');
      email.current = user.email;

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
        genre.current = data.genre;
      });


      var randomFilm = Math.floor(Math.random() * 42);
      const filmsRef = ref(db, "/films/" + randomFilm);
      onValue(filmsRef, (snapshot) => {
        let data = snapshot.val();
        setDataRateVideo(data);
      });

    } catch (err) {
      console.log("[ERROR] " + err);
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
      setPartner(true);
      setScreen("Todas");
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
        if (data.action === "Favoritas") {
          obtainFavFilm("new");
        }
        setScreen(data.action);
        if (data.action === "Video") {
          setVolIcon(<IoMdVolumeOff />);
        }
      } else if (data.gesture === "tilt") {
        console.log("Inclinacion hacia la", data.action);
        if (screen === "Todas") {
          obtainFilm(data.action);
        } else {
          obtainFavFilm();
        }
      } else if (data.gesture === "voice") {
        console.log("Has dicho", data.action);
        if (data.action == "siguiente") {
          console.log("siguiente");
          obtainFavFilm("right");
        } else if (data.action === "anterior") {
          console.log("anterior");
          obtainFavFilm("left");
        } else if (data.action === "reproducir") {
          setScreen("Video");
        } else if (data.action === "eliminar") {
          deletefavFilm();
        }

      } else if (data.gesture === "fav") {
        setfavFilm();
      } else if (data.gesture === "volume") {

        if (data.action === "mute") {
          setVolIcon(<IoMdVolumeOff />);
        } else if (data.action === "unmute") {
          setVolIcon(<IoMdVolumeHigh />);
        }
      } else if (data.gesture === "rate") {
        obtainRateFilm(data.action);
      }
    });

  }, []);

  ///////////////////////
  //    SET FAV FILM
  ///////////////////////
  function setfavFilm() {
    var updateFavFilms = [];
    if (totalfavs.current > 0) {

      var userRefCurrentUsers = ref(db, "/users/" + userUid.current);
      onValue(userRefCurrentUsers, (snapshot) => {
        const data = snapshot.val();
        updateFavFilms = data.favFilms;
        if (!updateFavFilms.includes(counter.current)) {
          updateFavFilms.push(counter.current);
          totalfavs.current += 1;
        } else {
          console.log("Esta película ya está en tu lista de favoritas");
        }
        const postData = {
          username: username.current,
          email: email.current,
          favFilms: updateFavFilms
          // favGenres: userData.current.favGenres
        };

        const updates = {};
        updates['/users/' + userUid.current] = postData;
        update(ref(db), updates);

      });


    } else {

      var userRefCurrentUsers = ref(db, "/users/" + userUid.current);
      updateFavFilms.push(counter.current);
      totalfavs.current = 1;
      const postData = {
        username: username.current,
        email: email.current,
        favFilms: updateFavFilms
        // favGenres: userData.current.favGenres
      };

      const updates = {};
      updates['/users/' + userUid.current] = postData;
      update(ref(db), updates);
    }
  }

  ///////////////////////
  //    DELETE FAV FILM
  ///////////////////////
  function deletefavFilm() {

    // var dataFavVideos = [];
    // const updates = {};
    // const filmsRef = ref(db, "/users/" + userUid.current);
    // onValue(filmsRef, (snapshot) => {
    //   let data = snapshot.val();
    //   dataFavVideos = data.favFilms;
    //   dataFavVideos.splice(counterFav.current, 1);
    // });

    if (totalfavs.current === 1) {
      set(ref(db, "users/" + userUid.current), {
        username: username.current,
        email: email.current,
        favFilms: [""]
      })
      totalfavs.current -= 1;

    } else {
      const deleteRef = ref(db, "/users/" + userUid.current + "/favFilms/" + counterFav.current);
      remove(deleteRef);
      totalfavs.current -= 1;
    }

    // console.log("DATOS A BORRAR"+ dataFavVideos);
    // var postData;
    // if (totalfavs.current === 0) {

      // const postData = {
      //   username: username.current,
      //   email: email.current,
      //   favFilms: [""]
      //   //favGenres: userData.current.favGenres
      // }; 


      // } else {
      //   //delete(db, "/users/" + userUid.current + "/" + counterFav.current)
      //   postData = {
      //     username: username.current,
      //     email: email.current,
      //     favFilms: dataFavVideos
      //     //favGenres: userData.current.favGenres
      //   };
      // }

      // updates['/users/' + userUid.current] = postData;
      // update(ref(db), updates);
    // }

    obtainFavFilm("new");
  }

  ///////////////////////
  //    OBTAIN FAV FILMS
  ///////////////////////
  function obtainFavFilm(data) {
    console.log("total de pelis: " + totalfavs.current);

    if (totalfavs.current > 0) {
      var dataFavVideos = [];
      var index;
      var favFilmsRef;

      if (data === "new") {
        counterFav.current = 0;
      } else if (data === "left") {
        if (counterFav.current > 0) {
          counterFav.current -= 1;
          if (counterFav.current === 0) {
            counterFav.current = totalfavs.current - 1;
          }
        }

      } else {
        if (counterFav.current < totalfavs.current - 1) {
          counterFav.current += 1;
          if (counterFav.current === totalfavs.current) {
            counterFav.current = 0;
          }
        }
      }

      const filmsRef = ref(db, "/users/" + userUid.current);
      onValue(filmsRef, (snapshot) => {
        let data = snapshot.val();
        for (var i = 0; i < data.favFilms.length; i++) {
          if (data.favFilms[i] === parseInt(data.favFilms[i], 10)) {
            dataFavVideos.push(data.favFilms[i]);
          }
        }

        // console.log(dataFavVideos);
        index = dataFavVideos[counterFav.current];
        favFilmsRef = ref(db, "/films/" + index);
        onValue(favFilmsRef, (snapshot) => {
          var dataVideo = snapshot.val();

          setDataFavVideo(dataVideo);

          //se lo envio al movil
          var act = {
            gesture: "titlefilm",
            action: dataVideo.title
          }
          socket.emit("action", act);
        });
      });

    } else {
      var noFilm = {
        title: "No hay ninguna pelicula en favoritos",
        poster: ""
      }
      setDataFavVideo(noFilm);
    }

  }

  ///////////////////////
  //    OBTAIN RATE FILMS
  ///////////////////////
  function obtainRateFilm(gesture) {

    //añadir a la db el genre.current

    // const userRef = ref(db, "/users/" + userUid.current);
    // const snapshot = get(userRef);

    // const data = snapshot.val();
    // console.log(data);

    // set(ref(db, "users/" + userUid.current), {
    //   username: "pepe"
    // });

    let genreSelected = genre.current;
    let newGenreValue = 0;
    if (gesture === "right") {
      console.log("me gusta:", genre.current);
      //console.log("generoBD:", userData.current.favGenres[genreSelected]);
      newGenreValue = userData.current.favGenres[genreSelected] += 1;
      
      
    } else {
      console.log("no me gusta:", genre.current);
      //console.log("generoBD:", userData.current.favGenres[genreSelected]);
      newGenreValue = userData.current.favGenres[genreSelected] -= 1;
    }

    let genreRef = ref(db, "users/" + userUid.current + "/favGenres/");
    update(genreRef, {[genre.current]:newGenreValue});

    var randomFilm = Math.floor(Math.random() * 42);
    const filmsRef = ref(db, "/films/" + randomFilm);
    onValue(filmsRef, (snapshot) => {
      let data = snapshot.val();
      setDataRateVideo(data);
      genre.current = data.genre;
      //se lo envio al movil
      var act = {
        gesture: "titlefilm",
        action: data.title
      }
      socket.emit("action", act);
    });

  }


  ///////////////////////
  //    OBTAIN ALL FILMS
  ///////////////////////
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
        counterPrev.current = 41;
        counter.current = 0;
        counterNext.current = 1;
      }
      const filmsRef = ref(db, "/films/" + counter.current);
      onValue(filmsRef, (snapshot) => {
        let data = snapshot.val();
        setDataVideo(data);

        //se lo envio al movil
        var act = {
          gesture: "titlefilm",
          action: data.title
        }
        socket.emit("action", act);
      });

      const filmsRefLeft = ref(db, "/films/" + counterPrev.current);
      onValue(filmsRefLeft, (snapshot) => {
        let data = snapshot.val();
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

        //se lo envio al movil
        var act = {
          gesture: "titlefilm",
          action: data.title
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
    }
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

      {!isLoggedIn &&
        <Login signIn={signInWithGoogle} />
      }

      {isLoggedIn && !isPartner &&
        <NoPartner userheader={userheader.current} disconnect={disconnect} />
      }

      {isLoggedIn && isPartner &&
        <Home dataVideo={dataVideo} dataFavVideo={dataFavVideo} dataFavVideoPrev={dataFavVideoPrev} dataFavVideoNext={dataFavVideoNext}
          socket={socket} dataRateVideo={dataRateVideo} volIcon={volIcon} dataVideoPrev={dataVideoPrev} dataVideoNext={dataVideoNext} userheader={userheader.current} screen={screen} disconnect={disconnect} />
      }
    </div>
  );
}

export default App;