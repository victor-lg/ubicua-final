import React from "react";
import logo from './images/logo.png';
import {BsPersonCircle} from "react-icons/bs";

export function NoPartner(props) {
    return (
        <div>
              <div id="homeHeader">
                <div id="logoHeader">
                    <img src={logo} alt="logo" />
                </div>
                <div id="userHeader">
                    <div id="iconUser"><BsPersonCircle/></div>
                    <h2>{props.userheader}</h2>
                    <input type="button" id="signOut_button" onClick={props.disconnect} value="Disconnect" />
                </div>
            </div>
            <div id="containerNoPartner">
            <h1 id="noPartner">NO SE HA ENCONTRADO EL DISPOSITIVO MOVIL <br></br> Para poder seguir navegando en ShortFlix, vincule su movil con el mismo correo usado en este sitio web</h1>
            </div>
        </div>
    );
}