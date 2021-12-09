import React from "react";
import "../App.css";
import logo from './images/logo.png';

export function VideoM(props) {
    return (
        <div id="main">
            <div id="homeMain">
                <div id="homeHeader">
                    <div id="logoHeader">
                        <img src={logo} alt="logo" />
                    </div>
                    <div id="userHeader">
                        <h2>{props.userName}</h2>
                        <input type="button" id="signOut_button" onClick={props.disconnect} value="disconnect" />
                    </div>
                </div>
                <div id="VideoContainer">
                    <div id="titleVideo">
                        <h2 id="title">{props.titleVideo}</h2>
                    </div>
                    <div className="gestosVideo">
                        <div className="videoGesto" id="upVideo">
                            <p>ARRIBA</p>
                            <p>&#8593;</p>
                        </div>
                        <div className="videoGesto" id="leftVideo">
                            <p>IZQUIERDA</p>
                            <p>&#8592;</p>
                        </div>
                        <div className="videoGesto" id="centerVideo">
                            <p>videito</p>
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
                        <input type="button" value="&#8617;" className="menubutton" id="returnbutton" onClick={() => props.changeScreen("Recomendadas", props.lastScreen)} />
                        <input type="button" value="&#8962;" className="menubutton" id="homeButton" onClick={() => props.changeScreen("Recomendadas", "Home")} />
                    </div>
                </div>
            </div>
        </div>
    );
}