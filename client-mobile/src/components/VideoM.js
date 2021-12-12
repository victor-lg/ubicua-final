import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { useEffect, useRef } from "react";

export function VideoM(props) {


    return (
        <div id="main">
            <div id="homeMain">
                <div id="VideoContainer">
                    <div id="titleVideo">
                        <h2 id="title">{props.titleVideo}</h2>
                    </div>
                    <div className="gestosVideo">
                        <div className="videoGesto" id="upVideo">
                            <p id="volIcon" onClick={() => props.changeVolume("change")}>{props.vol}</p>
                            <input type="range" id="volume" onInput={() => props.changeVolume("data")} min="0" max="100" step="1"></input>
                        </div>
                        <div className="videoGesto" id="leftVideo">
                            <p>IZQUIERDA</p>
                            <p>&#8592;</p>
                        </div>
                        <div className="videoGesto" id="centerVideo">
                            <p onClick={props.pararVideo}>videito</p>
                        </div>
                        <div className="videoGesto" id="rightVideo">
                            <p>DERECHA</p>
                            <p>&#8594;</p>
                        </div>
                        <div className="videoGesto" id="downVideo">
                            <p>ABAJO</p>
                            <p>&#8595;</p>
                        </div>
                    </div>
                    <div id="footer">
                        <div className="menubutton" id="homeButton" onClick={() => props.changeScreen("Video", "Home")}><AiFillHome /></div>
                        <div className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Video", props.lastScreen)}> <MdOutlineKeyboardReturn /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}