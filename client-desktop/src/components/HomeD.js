import React from "react";
import { RecomendadasD } from "./RecomendadasD";
import { FavoritasD } from './FavoritasD';
import { DescubreD } from './DescubreD';
import { VideoD } from "./VideoD";
import logo from './images/logo.png';
import {BsPersonCircle} from "react-icons/bs";
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
                    <h2>{props.userName}</h2>
                    <input type="button" id="signOut_button" onClick={props.disconnect} value="Disconnect" />
                </div>
            </div>

            {props.screen === "Recomendadas" &&
                <RecomendadasD screen={props.screen} />
            }

            {props.screen === "Favoritas" &&
                <FavoritasD screen={props.screen} />
            }

            {props.screen === "Descubre" &&
                <DescubreD screen={props.screen} dataVideo={props.dataVideo} dataVideoPrev={props.dataVideoPrev} dataVideoNext={props.dataVideoNext} />
            }

            {props.screen === "Video" &&
                <VideoD screen={props.screen} dataVideo={props.dataVideo} />
            }
        </div>
    );
}