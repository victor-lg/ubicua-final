import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";

export function FavoritasM(props) {
    return (
        <div id="main">
            <div id="homeMain">

                <div id="TodasContainer">
                    <div id="categoria">
                        <h1>Películas Favoritas</h1>
                    </div>
                    <div id="gestosFav">
                        <div className="voiceIcon" onClick={props.voice}>{props.mic}</div>
                        <div className="voiceInfo">Pulsa el microfono y prueba a decir palabras como:<br></br> <b> reproducir, siguiente, <br></br>anterior, eliminar,...</b></div>
                    </div>
                    <div id="footer">
                        <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Favoritas", "Home")}><AiFillHome /></div>
                        <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Favoritas", "Home")}> <MdOutlineKeyboardReturn /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}