import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { BsArrowReturnLeft } from "react-icons/bs";

export function DescubreM(props) {
    return (
        <div id="main">
            <div id="homeMain">
                <div id="descubreContainer">
                    <div id="categoria">
                        <h1>Películas descubre</h1>
                    </div>
                    <div id="gestos">
                        <div className="descubreGesto">
                            <p>Película anterior</p>
                            <p>↺</p>
                        </div>
                        <div className="descubrePlay">
                            <p onClick={() => props.changeScreen("Descubre", "Video")}>Reproducir</p>
                        </div>
                        <div className="descubreGesto">
                            <p>Película siguiente</p>
                            <p>↻</p>
                        </div>
                    </div>
                    <div id="footer">
                        <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Descubre", "Home")}><AiFillHome /></div>
                        <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Descubre", "Home")}> <MdOutlineKeyboardReturn /></div>
                    </div>
                </div>
            </div>
        </div>


    );
}