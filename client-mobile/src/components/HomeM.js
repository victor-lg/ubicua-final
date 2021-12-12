import React from "react";
import { PersonalizarM } from "./PersonalizarM";
import { FavoritasM } from './FavoritasM';
import { TodasM } from './TodasM';
import { VideoM } from './VideoM';
import logo from './images/logo.png';
import { BsPersonCircle } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";

export function Home(props) {
  return (
    <div id="main">

      <div id="homeHeader">
        <div id="logoHeader">
          <img src={logo} alt="logo" />
        </div>
        <div id="userHeader">
          <h2><BsPersonCircle /> {props.userName}</h2>
          <input type="button" id="signOut_button" onClick={props.disconnect} value="Disconnect" />
        </div>
      </div>

      {props.screen === "Home" &&
        <div id="homeMain">
          <div id="homeContainer">
            <input type="button" value="Todas las peliculas" className="screen_button" onClick={() => props.changeScreen("Home", "Todas")} />
            <input type="button" value="Peliculas favoritas" className="screen_button" onClick={() => props.changeScreen("Home", "Favoritas")} />
            <input type="button" value="Personalizar tus gustos" className="screen_button" onClick={() => props.changeScreen("Home", "Personalizar")} />
          </div>
          <div id="footer">
            <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Personalizar", "Home")}><AiFillHome /></div>
            <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Personalizar", props.lastScreen)}> <MdOutlineKeyboardReturn /></div>
          </div>
        </div>

      }

      {props.screen === "Personalizar" &&
        <PersonalizarM changeScreen={props.changeScreen} userName={props.userName} disconnect={props.disconnect} />
      }

      {props.screen === "Favoritas" &&
        <FavoritasM changeScreen={props.changeScreen} mic={props.mic} userName={props.userName} voice={props.voice} disconnect={props.disconnect} />
      }

      {props.screen === "Todas" &&
        <TodasM favFilm={props.favFilm} changeScreen={props.changeScreen} userName={props.userName} disconnect={props.disconnect} />
      }

      {props.screen === "Video" &&
        <VideoM pararVideo={props.pararVideo} socket={props.socket} swipeFunction={props.swipeFunction} volIcon={props.volIcon} vol={props.vol} changeVolume={props.changeVolume} changeScreen={props.changeScreen} lastScreen={props.lastScreen} userName={props.userName} titleVideo={props.titleVideo} />
      }
    </div>
  );
}