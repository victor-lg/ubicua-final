import React from "react";
import { RecomendadasM } from "./RecomendadasM";
import { FavoritasM } from './FavoritasM';
import { DescubreM } from './DescubreM';
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
            <input type="button" value="Descubre" className="screen_button" onClick={() => props.changeScreen("Home", "Descubre")} />
            <input type="button" value="Favoritas" className="screen_button" onClick={() => props.changeScreen("Home", "Favoritas")} />
            <input type="button" value="Recomendadas" className="screen_button" onClick={() => props.changeScreen("Home", "Recomendadas")} />
          </div>
          <div id="footer">
            <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Recomendadas", "Home")}><AiFillHome /></div>
            <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Recomendadas", props.lastScreen)}> <MdOutlineKeyboardReturn /></div>
          </div>
        </div>

      }

      {props.screen === "Recomendadas" &&
        <RecomendadasM changeScreen={props.changeScreen} userName={props.userName} disconnect={props.disconnect} />
      }

      {props.screen === "Favoritas" &&
        <FavoritasM changeScreen={props.changeScreen} mic={props.mic} userName={props.userName} voice={props.voice} disconnect={props.disconnect} />
      }

      {props.screen === "Descubre" &&
        <DescubreM changeScreen={props.changeScreen} userName={props.userName} disconnect={props.disconnect} />
      }

      {props.screen === "Video" &&
        <VideoM pararVideo={props.pararVideo} changeScreen={props.changeScreen} lastScreen={props.lastScreen} userName={props.userName} titleVideo={props.titleVideo} />
      }
    </div>
  );
}