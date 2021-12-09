import React from "react";
import { RecomendadasM } from "./RecomendadasM";
import { FavoritasM } from './FavoritasM';
import { DescubreM } from './DescubreM';
import { VideoM } from './VideoM';
import logo from './images/logo.png';

export function Home(props) {
  return (
    <div id="main">
      {props.screen === "Home" &&
        <div id="homeMain">
          <div id="homeHeader">
            <div id="logoHeader">
              <img src={logo} alt="logo"/>
            </div>
            <div id="userHeader">
              <h2>{props.userName}</h2>
              <input type="button" id="signOut_button" onClick={props.disconnect} value="disconnect" />
            </div>
          </div>
          <div id="homeContainer">
            <input type="button" value="Descubre" className="screen_button" onClick={() => props.changeScreen("Home","Descubre")}/>
            <input type="button" value="Favoritas" className="screen_button" onClick={() => props.changeScreen("Home","Favoritas")}/>
            <input type="button" value="Recomendadas" className="screen_button" onClick={() => props.changeScreen("Home","Recomendadas")}/>
          </div>
        </div>
      }

      {props.screen === "Recomendadas" &&
        <RecomendadasM changeScreen={props.changeScreen} lastScreen={props.lastScreen} userName={props.userName} disconnect={props.disconnect}/>
      }

      {props.screen === "Favoritas" &&
        <FavoritasM changeScreen={props.changeScreen} lastScreen={props.lastScreen} userName={props.userName} voice={props.voice} disconnect={props.disconnect}/>
      }

      {props.screen === "Descubre" &&
        <DescubreM changeScreen={props.changeScreen} lastScreen={props.lastScreen} userName={props.userName} disconnect={props.disconnect}/>
      }

      {props.screen === "Video" &&
        <VideoM changeScreen={props.changeScreen} lastScreen={props.lastScreen} userName={props.userName} titleVideo={props.titleVideo}  />
      }
    </div>
  );
}