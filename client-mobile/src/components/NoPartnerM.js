import React from "react";
import logo from './images/logo.png';

export function NoPartner(props) {
  return (
    <div id="main">
      <div id="homeMain">
        <div id="homeHeader">
          <div id="logoHeader">
            <img src={logo} alt="logo"></img>
          </div>
          <div id="userHeader">
            <h2>{props.userName}</h2>
            <input type="button" id="signOut_button" onClick={props.disconnect} value="disconnect" />
          </div>
        </div>
        <div id="noPartner">
          <div id="categoria">
            <h1>NO HAY DESKTOP</h1>
          </div>
        </div>
      </div>
    </div>
  );
}