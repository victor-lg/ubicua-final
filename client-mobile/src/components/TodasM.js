import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { BsSuitHeartFill, BsFillPlayBtnFill } from "react-icons/bs";

export function TodasM(props) {
    return (
        <div id="main">
            <div id="homeMain">
                <div id="TodasContainer">
                    <div id="categoria">
                        <h1>Todas las peliculas</h1>
                    </div>
                    <div className="todasgestos">
                        {/* <div className="todasGesto" id="upTodas">
                            <p>ARRIBA<br></br>&#8593;</p>
                        </div> */}
                        <div className="todasGesto" id="leftTodas">
                            <p>Película anterior<br></br>↺</p>
                        </div>
                        <div className="todasGesto" id="centerTodas" onClick={() => props.changeScreen("Todas", "Video")}>
                            <p>Reproducir<br></br><BsFillPlayBtnFill/></p>
                        </div>
                        <div className="todasGesto" id="rightTodas">
                            <p>Película siguiente<br></br>↻</p>
                        </div>
                        <div className="todasGesto" id="downTodas" onClick={() => props.favFilm()}>
                            <p>Añadir a favoritas<br></br><BsSuitHeartFill/></p>
                        </div>
                    </div>

                    <div id="footer">
                        <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Todas", "Home")}><AiFillHome /></div>
                        <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Todas", "Home")}> <MdOutlineKeyboardReturn /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}