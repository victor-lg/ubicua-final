import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { BsArrowReturnLeft, BsSuitHeartFill } from "react-icons/bs";

export function TodasM(props) {
    return (
        <div id="main">
            <div id="homeMain">
                <div id="TodasContainer">
                    <div id="categoria">
                        <h1>Todas las peliculas</h1>
                    </div>
                    <div id="gestos">
                        <div className="TodasGesto">
                            <p>Película anterior</p>
                            <p>↺</p>
                        </div>
                        <div className="TodasPlay">
                            <p onClick={() => props.changeScreen("Todas", "Video")}>Reproducir</p>
                        </div>
                        <div className="TodasGesto">
                            <p>Película siguiente</p>
                            <p>↻</p>
                        </div>

                        <div className="TodasGesto" onClick={() => props.favFilm()}><BsSuitHeartFill/></div>
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