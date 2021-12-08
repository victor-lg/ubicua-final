import React from "react";
import { RecomendadasD } from "./RecomendadasD";
import { FavoritasD } from './FavoritasD';
import { DescubreD } from './DescubreD';
import { VideoD } from "./VideoD";

export function Home(props) {
    return (
        <div>
            <h1>Welcome, {props.userName}</h1>
            <input type="button" value="&#129094;" id="msg_button" onClick={props.sendMessage} />
            <input type="button" id="signOut_button" onClick={props.disconnect} value="disconnect" />
            {/* <input type="button" id="signOut_button" onClick={props.data} value="prueba" /> */}


            {props.screen === "Recomendadas" &&
                <RecomendadasD screen={props.screen} />
            }

            {props.screen === "Favoritas" &&
                <FavoritasD screen={props.screen} />
            }

            {props.screen === "Descubre" &&
                <DescubreD screen={props.screen} />
            }

            {props.screen === "Video" &&
                <VideoD screen={props.screen} />
            }
        </div>
    );
}