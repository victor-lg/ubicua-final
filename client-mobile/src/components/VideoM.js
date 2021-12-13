import React from "react";
import "../App.css";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { useEffect, useRef } from "react";

export function VideoM(props) {
    /*Variables para el control táctil*/
    let start_x = 0;
    let end_x = 0;
    let start_y = 0;
    let end_y = 0;
    let start_time = 0;
    let end_time = 0;
    const SPACE_THRESHOLD = 50;
    const TIME_THRESHOLD = 500;
    var gesture;




    useEffect(() => {
        gesture = document.getElementsByClassName('gestosVideo')[0];

        gesture.addEventListener("touchstart", function (e) {
            e.preventDefault();
            start_x = e.targetTouches[0].screenX;
            start_y = e.targetTouches[0].screenY;
            start_time = e.timeStamp;
        }, { passive: false });

        gesture.addEventListener("touchmove", function (e) {
            e.preventDefault();
            // end_x = e.changedTouches[0].screenX;
            // end_y = e.targetTouches[0].screenY;
        }, { passive: false });

        gesture.addEventListener("touchend", function (e) {
            e.preventDefault();
            end_time = e.timeStamp;
            end_x = e.changedTouches[0].screenX;
            end_y = e.changedTouches[0].screenY;

            if (((end_time - start_time) < TIME_THRESHOLD) && ((end_x - start_x) > SPACE_THRESHOLD)) {
                var touchobj = e.changedTouches[0];
                console.log("derecha");

                var act = {
                    gesture: "swipe",
                    action: "right"
                }
                props.socket.emit("action", act);
            } else if (((end_time - start_time) < TIME_THRESHOLD) && ((start_x - end_x) > SPACE_THRESHOLD)) {
                var touchobj = e.changedTouches[0];
                console.log("izquierda");
                var act = {
                    gesture: "swipe",
                    action: "left"
                }
                props.socket.emit("action", act);

            } else if (((end_time - start_time) < TIME_THRESHOLD) && ((end_y - start_y) > SPACE_THRESHOLD)) {
                var touchobj = e.changedTouches[0];
                console.log("abajo");

                var act = {
                    gesture: "swipe",
                    action: "down"
                }
                props.socket.emit("action", act);
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
                    <div className="videoGesto" id="upVideo">
                        <p id="volIcon" onClick={() => props.changeVolume("change")}>{props.vol}</p>
                        <input type="range" id="volume" onInput={() => props.changeVolume("data")} min="0" max="100" step="1"></input>
                    </div>

                    <div className="gestosVideo">
                        <div className="videoGesto" id="leftVideo">
                            <p>RETROCEDER</p>
                            <p>&#8592; 10 seg</p>
                        </div>
                        <div className="videoGesto" id="centerVideo">
                            <p>Desliza para realizar una accion</p>
                            <p>Dale la vuelta para parar el video</p>
                        </div>
                        <div className="videoGesto" id="rightVideo">
                            <p>AVANZAR</p>
                            <p>30 seg &#8594;</p>
                        </div>
                        <div className="videoGesto" id="downVideo">
                            <p>REINICIAR</p>
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