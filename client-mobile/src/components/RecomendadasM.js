import React from "react";
import "../App.css";
import logo from './images/logo.png';

export function RecomendadasM(props) {
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
            <div id="descubreContainer">
                <div id="categoria">
                    <h1>Películas Recomendadas</h1>
                </div>
                <div id="gestos">
                    <div className="descubreGesto">
                        <p>Película anterior</p>
                        <p>↺</p>
                    </div>
                    <div className="descubrePlay">
                        <p onClick={() => props.changeScreen("Video")}>Reproducir</p>
                    </div>
                    <div className="descubreGesto">
                        <p>Película siguiente</p>
                        <p>↻</p>
                    </div>
                </div>
                <div id="toHome">
                    <input type="button" value="Home" id="HomeButton" onClick={() => props.changeScreen("Home")} />
                </div>
            </div>
        </div>
    </div>
    );
}