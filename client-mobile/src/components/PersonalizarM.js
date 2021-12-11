import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { BsSuitHeartFill, BsFillPlayBtnFill } from "react-icons/bs";
import {AiFillDislike, AiFillLike} from "react-icons/ai";

export function PersonalizarM(props) {
    return (
        <div id="main">
            <div id="homeMain">
                <div id="TodasContainer">
                    <div id="categoria">
                        <h1>Personalizar tus gustos</h1>
                    </div>
                    <div className="todasgestos">
                        <div className="todasGesto" id="upTodas">
                            <p>ARRIBA<br></br>&#8593;</p>
                        </div>
                        <div className="todasGesto" id="leftTodas">
                            <p>No me gusta<br></br><AiFillDislike/></p>
                        </div>
                        <div className="todasGesto" id="centerTodas" onClick={() => props.changeScreen("Personalizar", "Video")}>
                            <p>Reproducir<br></br><BsFillPlayBtnFill /></p>
                        </div>
                        <div className="todasGesto" id="rightTodas">
                            <p>Me gusta<br></br><AiFillLike/></p>
                        </div>
                        <div className="todasGesto" id="downTodas" onClick={() => props.favFilm()}>
                            <p>Añadir a favoritas<br></br><BsSuitHeartFill /></p>
                        </div>
                    </div>
                    <div id="footer">
                        <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Personalizar", "Home")}><AiFillHome /></div>
                        <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Personalizar", "Home")}> <MdOutlineKeyboardReturn /></div>
                    </div>
                </div>
            </div>
        </div>
    );
} 