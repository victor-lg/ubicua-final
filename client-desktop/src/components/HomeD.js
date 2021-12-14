import React from "react";
import { PersonalizarD } from "./PersonalizarD";
import { FavoritasD } from './FavoritasD';
import { TodasD } from './TodasD';
import { VideoD } from "./VideoD";
import logo from './images/logo.png';
import { BsPersonCircle } from "react-icons/bs";
// import {MdOutlinePersonOutline} from "react-icons/md";

export function Home(props) {
    return (
        <div>
            <div id="homeHeader">
                <div id="logoHeader">
                    <img src={logo} alt="logo" />
                </div>
                <div id="userHeader">
                    <div id="iconUser"><BsPersonCircle /></div>
                    <h2>{props.userheader}</h2>
                    <input type="button" id="signOut_button" onClick={props.disconnect} value="Disconnect" />
                </div>
            </div>

            {props.screen === "Personalizar" &&
                <PersonalizarD screen={props.screen} dataRateVideo={props.dataRateVideo} topGenre={props.topGenre}/>
            }

            {props.screen === "Favoritas" &&
                <FavoritasD screen={props.screen} dataFavVideo={props.dataFavVideo} />
            }

            {props.screen === "Todas" &&
                <TodasD screen={props.screen} dataVideo={props.dataVideo} dataVideoPrev={props.dataVideoPrev} dataVideoNext={props.dataVideoNext} />
            }

            {props.screen === "Video" &&
                <VideoD screen={props.screen} volIcon={props.volIcon} dataVideo={props.dataVideo} socket={props.socket} />}
        </div>
    );
}