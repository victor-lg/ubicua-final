import React from "react";
import logo from './images/logo.png';

export function NoPartner(props) {
  return (
    <div id="main">
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
        <div id="containerNoPartner">
            <h1 id="noPartner">NO SE HA ENCONTRADO  <br></br> EL DISPOSITIVO WEB <br></br> <br></br> <br></br> Para poder seguir navegando en ShortFlix, vincule su web con el mismo correo usado en este dispositivo movil</h1>
            </div>
      </div>
    </div>
  );
} 