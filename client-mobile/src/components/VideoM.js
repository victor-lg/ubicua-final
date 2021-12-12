import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { useEffect, useRef } from "react";

export function VideoM(props) {
    /*Variables para el control táctil*/
    let start_x = 0;
    let end_x = 0;
    let start_time = 0;
    const SPACE_THRESHOLD = 100;
    const TIME_THRESHOLD = 200;
    const SPAECNOTMOVE = 50;
    var gesture;




    useEffect(() => {
            gesture = document.getElementsByClassName('gestosVideo')[0];

            gesture.addEventListener("touchstart", function (e) {
                e.preventDefault();
                start_x = e.targetTouches[0].screenX;
                start_time = e.timeStamp;
                console.log(start_x);
            }, { passive: false });

            gesture.addEventListener("touchmove", function (e) {
                e.preventDefault();
                // console.log("changedTouches[0].identifier = " + e.changedTouches[0].identifier);
                end_x = e.changedTouches[0].screenX;
            }, { passive: false });

            gesture.addEventListener("touchend", function (e) {
              e.preventDefault();
              end_x = e.timeStamp;
            
              if (((end_x - start_time) < TIME_THRESHOLD) && ((end_x - start_x) > SPACE_THRESHOLD)) {
                var touchobj = e.changedTouches[0];
                console.log("derecha");
              }
              if (((end_x - start_time) > TIME_THRESHOLD && ((end_x - start_x) < SPAECNOTMOVE))) {
                var touchobj = e.changedTouches[0];
                if (touchobj.target.className === 'gestosVideo') {
                  console.log("mantener");
                }
              }
            });

        
    }, [])

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